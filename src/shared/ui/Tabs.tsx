import { useId, useRef, type ReactNode } from "react";

export type TabItem = { id: string; label: string; content: ReactNode };

export function Tabs({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: readonly TabItem[];
  value: string;
  onChange: (id: string) => void;
}) {
  const prefix = useId();
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  function move(index: number, key: string) {
    let next = index;
    if (key === "ArrowRight") next = (index + 1) % items.length;
    else if (key === "ArrowLeft") next = (index + items.length - 1) % items.length;
    else if (key === "Home") next = 0;
    else if (key === "End") next = items.length - 1;
    else return false;
    const item = items[next];
    if (item) {
      onChange(item.id);
      buttons.current.get(item.id)?.focus();
    }
    return true;
  }
  return (
    <div className="tabs">
      <div className="tab-list" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${prefix}-${item.id}-tab`}
            aria-controls={`${prefix}-${item.id}-panel`}
            aria-selected={value === item.id}
            tabIndex={value === item.id ? 0 : -1}
            ref={(node) => {
              if (node) buttons.current.set(item.id, node);
              else buttons.current.delete(item.id);
            }}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => {
              if (move(index, event.key)) event.preventDefault();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${prefix}-${item.id}-panel`}
          aria-labelledby={`${prefix}-${item.id}-tab`}
          tabIndex={0}
          hidden={value !== item.id}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
