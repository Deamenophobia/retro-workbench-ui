import { defaultSettings, type SettingsStore, type WorkspaceSettings } from "../contracts/settings";
import type { KeyValueStorage } from "./storage";

export const settingsKey = "retro-workbench.settings.v1";

function validSettings(value: unknown): value is WorkspaceSettings {
  if (typeof value !== "object" || value === null) return false;
  const settings = value as Partial<WorkspaceSettings>;
  return (
    typeof settings.name === "string" &&
    settings.name.trim().length > 0 &&
    settings.name.length <= 60 &&
    (settings.startPage === "overview" || settings.startPage === "records") &&
    typeof settings.showHints === "boolean"
  );
}

export function createSettingsStore(storage: KeyValueStorage | undefined): SettingsStore {
  return {
    read() {
      try {
        if (!storage) throw new Error("Unavailable storage");
        const raw = storage.getItem(settingsKey);
        if (raw === null) return { value: { ...defaultSettings } };
        const parsed: unknown = JSON.parse(raw);
        if (!validSettings(parsed)) throw new Error("Invalid saved settings");
        return {
          value: { name: parsed.name, startPage: parsed.startPage, showHints: parsed.showHints },
        };
      } catch {
        return {
          value: { ...defaultSettings },
          warning: "Saved settings could not be read. Defaults are in use.",
        };
      }
    },
    save(value) {
      if (!validSettings(value)) return false;
      try {
        if (!storage) return false;
        storage.setItem(settingsKey, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
  };
}
