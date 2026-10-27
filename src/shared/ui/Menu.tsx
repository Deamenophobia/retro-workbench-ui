import { useEffect, useRef } from "react";

export type MenuItem =
  | { label: string; href: string }
  | { label: string; onSelect: () => void; disabled?: boolean }
  | { label: string; disabled: true; onSelect?: never };

/** Native disclosure navigation: Tab/Shift+Tab, Enter/Space, Escape and outside dismissal. */
export function Menu({ label, items }: { label: string; items: readonly MenuItem[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const details = ref.current;
    if (!details) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !details.contains(event.target)) details.open = false;
    };
    details.ownerDocument.addEventListener("pointerdown", closeOutside);
    return () => details.ownerDocument.removeEventListener("pointerdown", closeOutside);
  }, []);
  function close() {
    if (ref.current) ref.current.open = false;
  }
  return (
    <details
      className="app-menu"
      ref={ref}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
          ref.current?.querySelector("summary")?.focus();
        }
      }}
    >
      <summary>{label}</summary>
      <div className="menu-items">
        {items.map((item) =>
          "href" in item ? (
            <a key={item.label} href={item.href} onClick={close}>
              {item.label}
            </a>
          ) : (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect?.();
                close();
                ref.current?.querySelector("summary")?.focus();
              }}
            >
              {item.label}
            </button>
          ),
        )}
      </div>
    </details>
  );
}
