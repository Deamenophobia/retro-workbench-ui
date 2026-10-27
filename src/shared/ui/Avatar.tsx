import { useState } from "react";

export function Avatar({ name, src }: { name: string; src?: string }) {
  const [failedSource, setFailedSource] = useState<string>();
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("");
  return (
    <span className="avatar" role="img" aria-label={name}>
      {src && src !== failedSource ? (
        <img src={src} alt="" onError={() => setFailedSource(src)} />
      ) : (
        <span aria-hidden="true">{initials.toLocaleUpperCase() || "?"}</span>
      )}
    </span>
  );
}
