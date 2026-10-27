import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { createAppearanceStore, applyAppearance } from "./integrations/appearance";
import { createSettingsStore } from "./integrations/settings";
import { browserStorage } from "./integrations/storage";
import { createRecordsSource } from "./integrations/demoRecords";
import "./themes/tokens.css";
import "./themes/classic.css";
import "./themes/studio.css";
import "./shared/ui/styles.css";

const storage = browserStorage();
const appearance = createAppearanceStore(storage);
const initialTheme = appearance.read();
applyAppearance(initialTheme);
const settingsStore = createSettingsStore(storage);
const demoRecords = createRecordsSource(`${import.meta.env.BASE_URL}demo-records.json`);
const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
createRoot(root).render(
  <StrictMode>
    <App
      records={demoRecords}
      appearance={appearance}
      initialTheme={initialTheme}
      settingsStore={settingsStore}
      initialSettings={settingsStore.read()}
    />
  </StrictMode>,
);
