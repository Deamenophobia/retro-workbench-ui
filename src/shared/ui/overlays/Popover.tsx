import { useId, useRef, useState, type ReactNode } from "react";
import { Button } from "../Button";
import { useFloatingPosition } from "./useFloatingPosition";

export function Popover({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useFloatingPosition(open, anchor, surface);
  return (
    <span ref={anchor} className="floating-anchor">
      <Button popoverTarget={id}>{label}</Button>
      <div
        id={id}
        ref={surface}
        popover="auto"
        className="floating-surface popover"
        role="region"
        aria-labelledby={`${id}-title`}
        onToggle={(event) => setOpen(event.newState === "open")}
      >
        <div className="popover-heading">
          <h3 id={`${id}-title`}>{title}</h3>
          <Button
            variant="text"
            popoverTarget={id}
            popoverTargetAction="hide"
            aria-label={`Close ${title}`}
          >
            Close
          </Button>
        </div>
        {children}
      </div>
    </span>
  );
}
