import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
// The executable checker is plain JS so it can run before TypeScript compilation.
// @ts-expect-error JS script intentionally has no declaration file.
import { boundaryError, checkBoundaries, findCycles } from "../../scripts/check-boundaries.mjs";

test("ownership rules reject reverse, sibling and internal imports", () => {
  for (const [from, to] of [
    ["shared/ui/Button.tsx", "features/records/index.ts"],
    ["features/settings/Page.tsx", "features/records/index.ts"],
    ["features/settings/Page.tsx", "integrations/settings.ts"],
    ["app/App.tsx", "features/records/RecordsPage.tsx"],
    ["app/App.tsx", "shared/ui/Button.tsx"],
    ["contracts/records.ts", "app/config.ts"],
  ])
    assert.ok(boundaryError(from, to));
  assert.equal(boundaryError("app/pages.tsx", "features/guide/index.tsx"), undefined);
  assert.equal(boundaryError("features/guide/index.tsx", "shared/ui/index.ts"), undefined);
});

test("cycles include type-only dependencies", () => {
  assert.equal(
    findCycles(
      new Map([
        ["a", ["b"]],
        ["b", ["a"]],
      ]),
    ).length,
    1,
  );
  assert.deepEqual(
    findCycles(
      new Map([
        ["a", ["b"]],
        ["b", []],
      ]),
    ),
    [],
  );
});

test("checker finds re-exports, dynamic imports, persistence and real cycles", () => {
  const root = mkdtempSync(path.join(tmpdir(), "retro-boundaries-"));
  function write(name: string, content: string) {
    const file = path.join(root, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  try {
    write(
      "shared/ui/index.ts",
      'export * from "../../features/records/index"; window["localStorage"];',
    );
    write(
      "features/records/index.ts",
      'import "../../shared/ui"; import("../../integrations/data");',
    );
    write("integrations/data.ts", "export const data = 1;");
    const errors: string[] = checkBoundaries(root);
    assert.ok(errors.some((error) => error.includes("cannot depend")));
    assert.ok(errors.some((error) => error.includes("Circular")));
    assert.ok(errors.some((error) => error.includes("persistence")));
  } finally {
    rmSync(root, { recursive: true });
  }
});
