import type { ReactNode } from "react";

export function List({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ul className="ui-list" aria-label={label}>
      {children}
    </ul>
  );
}

export function ListItem({
  leading,
  children,
  meta,
  actions,
}: {
  leading?: ReactNode;
  children: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <li className="ui-list-item">
      {leading && <div className="list-leading">{leading}</div>}
      <div className="list-content">{children}</div>
      {meta && <div className="list-meta">{meta}</div>}
      {actions && <div className="list-actions">{actions}</div>}
    </li>
  );
}
