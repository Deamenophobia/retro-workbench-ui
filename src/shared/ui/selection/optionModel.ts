import type { SelectOption } from "./types";

export function filterOptions(options: readonly SelectOption[], query: string) {
  const text = query.trim().toLocaleLowerCase();
  return options.filter((option) =>
    `${option.label} ${option.description ?? ""}`.toLocaleLowerCase().includes(text),
  );
}

export function moveOption(
  options: readonly SelectOption[],
  active: string | null,
  direction: "next" | "previous" | "first" | "last",
) {
  const enabled = options.filter((option) => !option.disabled);
  if (!enabled.length) return null;
  if (direction === "first") return enabled[0]!.value;
  if (direction === "last") return enabled[enabled.length - 1]!.value;
  const index = enabled.findIndex((option) => option.value === active);
  const next =
    index < 0
      ? direction === "next"
        ? 0
        : enabled.length - 1
      : (index + (direction === "next" ? 1 : -1) + enabled.length) % enabled.length;
  return enabled[next]!.value;
}
