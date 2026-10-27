import { useEffect, useRef, useState } from "react";

/** Match SVG coordinates to available CSS pixels, keeping labels readable on small screens. */
export function usePlotWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resize = () => setWidth(Math.max(200, Math.floor(element.clientWidth)));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}
