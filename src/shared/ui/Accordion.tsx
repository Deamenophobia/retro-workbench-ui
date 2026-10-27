import type { ReactNode } from "react";

export function Accordion({
  items,
  label,
}: {
  label: string;
  items: readonly { id: string; title: string; content: ReactNode }[];
}) {
  return (
    <div className="accordion" role="group" aria-label={label}>
      {items.map((item) => (
        <details key={item.id}>
          <summary>{item.title}</summary>
          <div className="accordion-content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
