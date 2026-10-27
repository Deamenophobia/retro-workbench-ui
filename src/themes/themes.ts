export const themes = {
  classic: { label: "Classic · Retro", chromeColor: "#30353b" },
  studio: { label: "Studio · Original", chromeColor: "#101719" },
} as const;

export type Theme = keyof typeof themes;

export function resolveTheme(value: unknown): Theme {
  return typeof value === "string" && Object.hasOwn(themes, value) ? (value as Theme) : "classic";
}
