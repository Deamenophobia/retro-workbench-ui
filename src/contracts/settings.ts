export type WorkspaceSettings = {
  name: string;
  startPage: "overview" | "records";
  showHints: boolean;
};

export const defaultSettings: WorkspaceSettings = {
  name: "Sample workspace",
  startPage: "overview",
  showHints: true,
};

export type SettingsRead = { value: WorkspaceSettings; warning?: string };

export interface SettingsStore {
  read(): SettingsRead;
  save(value: WorkspaceSettings): boolean;
}
