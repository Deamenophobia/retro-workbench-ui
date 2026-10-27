import { useLayoutEffect, type RefObject } from "react";

/** Position a top-layer surface beside its anchor, constrained to the viewport. */
export function useFloatingPosition(
  open: boolean,
  anchor: RefObject<HTMLElement | null>,
  surface: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const target = anchor.current;
    const popup = surface.current;
    if (!open || !target || !popup) return;
    const view = target.ownerDocument.defaultView;
    if (!view) return;
    function position() {
      if (!view || !target || !popup) return;
      const gap = parseFloat(view.getComputedStyle(popup).getPropertyValue("--floating-gap"));
      const box = target.getBoundingClientRect();
      const left = Math.max(gap, Math.min(box.left, view.innerWidth - popup.offsetWidth - gap));
      const below = box.bottom + gap;
      const top =
        below + popup.offsetHeight <= view.innerHeight - gap
          ? below
          : Math.max(gap, box.top - popup.offsetHeight - gap);
      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
    }
    position();
    const observer = new ResizeObserver(position);
    observer.observe(target);
    observer.observe(popup);
    view.addEventListener("resize", position);
    target.ownerDocument.addEventListener("scroll", position, true);
    return () => {
      observer.disconnect();
      view.removeEventListener("resize", position);
      target.ownerDocument.removeEventListener("scroll", position, true);
    };
  }, [open, anchor, surface]);
}
