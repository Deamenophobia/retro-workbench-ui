export type FileConstraints = { accept: readonly string[]; maxFiles: number; maxBytes: number };
export type FileRejection = { file: File; reason: string };

export function fileKey(file: Pick<File, "name" | "size" | "lastModified" | "type">) {
  return JSON.stringify([file.name, file.size, file.lastModified, file.type]);
}

function matchesType(file: File, accepted: readonly string[]) {
  return (
    accepted.length === 0 ||
    accepted.some((item) => {
      const type = item.trim().toLowerCase();
      if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
      if (type.endsWith("/*")) return file.type.toLowerCase().startsWith(type.slice(0, -1));
      return file.type.toLowerCase() === type;
    })
  );
}

/** Presentation validation only. A server must validate any eventual upload again. */
export function selectFiles(
  current: readonly File[],
  incoming: readonly File[],
  constraints: FileConstraints,
) {
  const files = [...current];
  const known = new Set(current.map(fileKey));
  const rejected: FileRejection[] = [];
  for (const file of incoming) {
    let reason: string | undefined;
    if (known.has(fileKey(file))) reason = "Already selected.";
    else if (!matchesType(file, constraints.accept)) reason = "File type is not accepted.";
    else if (file.size > constraints.maxBytes) reason = "File exceeds the size limit.";
    else if (files.length >= constraints.maxFiles) reason = "File count limit reached.";
    if (reason) rejected.push({ file, reason });
    else {
      files.push(file);
      known.add(fileKey(file));
    }
  }
  return { files, rejected };
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}
