import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "@babel/parser";

const normalize = (file) => file.split(path.sep).join("/");
const codeFile = /\.[cm]?[jt]sx?$/;

function sourceFiles(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : codeFile.test(file) ? [file] : [];
  });
}

function layer(file) {
  if (file === "main.tsx") return "app";
  return file.split("/")[0];
}

export function boundaryError(from, to) {
  const allowed = {
    app: ["app", "shared", "features", "contracts", "integrations", "themes"],
    shared: ["shared"],
    features: ["shared", "contracts", "features"],
    integrations: ["integrations", "contracts", "themes"],
    contracts: ["contracts"],
    themes: ["themes"],
  };
  const source = layer(from);
  const target = layer(to);
  if (!allowed[source]?.includes(target)) return `${from} cannot depend on ${to}`;
  if (source === "features" && target === "features" && from.split("/")[1] !== to.split("/")[1])
    return `${from} cannot import another feature: ${to}`;
  if (source !== "features" && target === "features" && !/^features\/[^/]+\/index\.tsx?$/.test(to))
    return `${from} must use the public feature entry point: ${to}`;
  if (
    source !== "shared" &&
    target === "shared" &&
    !/^shared\/ui\/(index\.ts|styles\.css)$/.test(to)
  )
    return `${from} must use shared/ui/index.ts: ${to}`;
  return undefined;
}

export function findCycles(graph) {
  const done = new Set();
  const active = new Set();
  const errors = [];
  function visit(file, trail) {
    if (active.has(file)) {
      errors.push(`Circular dependency: ${[...trail, file].join(" -> ")}`);
      return;
    }
    if (done.has(file)) return;
    active.add(file);
    for (const next of graph.get(file) ?? []) visit(next, [...trail, file]);
    active.delete(file);
    done.add(file);
  }
  for (const file of graph.keys()) visit(file, []);
  return errors;
}

export function checkBoundaries(sourceRoot) {
  const errors = [];
  const graph = new Map();
  const files = sourceFiles(sourceRoot);
  const banned = new Set([
    "localStorage",
    "sessionStorage",
    "indexedDB",
    "fetch",
    "XMLHttpRequest",
    "WebSocket",
    "Worker",
    "SharedWorker",
  ]);
  for (const file of files) {
    const from = normalize(path.relative(sourceRoot, file));
    const dependencies = [];
    const source = parse(fs.readFileSync(file, "utf8"), {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
    const presentation = ["shared", "features"].includes(layer(from));
    function dependency(specifier) {
      if (!specifier.startsWith(".")) {
        const reactAllowed =
          ["app", "shared", "features"].includes(layer(from)) &&
          /^(react|react-dom)(\/|$)/.test(specifier);
        if (!reactAllowed) errors.push(`${from}: unapproved external dependency ${specifier}`);
        return;
      }
      const base = path.resolve(path.dirname(file), specifier);
      const target = [
        base,
        `${base}.ts`,
        `${base}.tsx`,
        path.join(base, "index.ts"),
        path.join(base, "index.tsx"),
      ].find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (!target) {
        errors.push(`${from}: unresolved import ${specifier}`);
        return;
      }
      const to = normalize(path.relative(sourceRoot, target));
      const error = boundaryError(from, to);
      if (error) errors.push(error);
      if (codeFile.test(target)) dependencies.push(to);
    }
    function walk(node) {
      if (
        ["ImportDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration"].includes(
          node.type,
        ) &&
        node.source
      )
        dependency(node.source.value);
      if (
        node.type === "ImportExpression" ||
        (node.type === "CallExpression" &&
          (node.callee.type === "Import" || node.callee.name === "require"))
      ) {
        const argument = node.source ?? node.arguments[0];
        if (argument?.type === "StringLiteral") dependency(argument.value);
        else errors.push(`${from}: dynamic module paths are not supported`);
      }
      if (
        presentation &&
        ((node.type === "Identifier" && banned.has(node.name)) ||
          (node.type === "MemberExpression" && node.computed && banned.has(node.property.value)))
      )
        errors.push(`${from}: browser persistence/data access belongs in integrations`);
      for (const value of Object.values(node)) {
        if (Array.isArray(value))
          value.forEach((child) => {
            if (child?.type) walk(child);
          });
        else if (value && typeof value === "object" && typeof value.type === "string") walk(value);
      }
    }
    walk(source);
    graph.set(from, dependencies);
  }
  return [...new Set([...errors, ...findCycles(graph)])];
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const errors = checkBoundaries(path.resolve("src"));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else console.log("Dependency boundaries and circular dependency checks passed.");
}
