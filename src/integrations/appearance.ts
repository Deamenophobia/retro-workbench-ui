import { resolveTheme, themes, type Theme } from "../themes/themes";
import type { KeyValueStorage } from "./storage";

export const appearanceKey = "retro-workbench.appearance.v1";

export function createAppearanceStore(storage: KeyValueStorage | undefined) {
  return {
    read(): Theme {
      try {
        return resolveTheme(storage?.getItem(appearanceKey));
      } catch {
        return "classic";
      }
    },
    save(theme: Theme): boolean {
      try {
        if (!storage) return false;
        storage.setItem(appearanceKey, theme);
        return true;
      } catch {
        return false;
      }
    },
  };
}

export function applyAppearance(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", themes[theme].chromeColor);
}
