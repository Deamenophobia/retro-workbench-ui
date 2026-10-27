import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useFloatingPosition } from "./useFloatingPosition";

// Allow the pointer to cross the small gap between the trigger and its tooltip.
const hoverExitDelay = 150;

/** Supplemental text for one focusable child. Put essential help in Field instead. */
export function Tooltip({
  text,
  children,
}: {
  text: string;
  children: (props: { "aria-describedby": string }) => ReactNode;
}) {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const surface = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function show() {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useLayoutEffect(() => {
    const popup = surface.current;
    if (!popup) return;
    if (open) popup.showPopover();
    else popup.hidePopover();
  }, [open]);
  useFloatingPosition(open, anchor, surface);
  useEffect(() => {
    if (!open) return;
    const document = anchor.current?.ownerDocument;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        event.stopPropagation();
      }
    };
    document?.addEventListener("keydown", dismiss, true);
    return () => document?.removeEventListener("keydown", dismiss, true);
  }, [open]);
  return (
    <span
      ref={anchor}
      className="floating-anchor"
      onPointerEnter={show}
      onPointerLeave={(event) => {
        if (!event.currentTarget.contains(event.currentTarget.ownerDocument.activeElement))
          closeTimer.current = setTimeout(() => setOpen(false), hoverExitDelay);
      }}
      onFocus={show}
      onBlur={() => setOpen(false)}
    >
      {children({ "aria-describedby": id })}
      <span
        ref={surface}
        id={id}
        role="tooltip"
        popover="manual"
        className="floating-surface tooltip"
      >
        {text}
      </span>
    </span>
  );
}
