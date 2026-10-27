import type { ReactNode } from "react";
import type { RecordsSource } from "../contracts/records";
import type { SettingsStore, WorkspaceSettings } from "../contracts/settings";
import { OverviewPage } from "../features/overview";
import { RecordsPage } from "../features/records";
import { SettingsPage } from "../features/settings";
import { GuidePage } from "../features/guide";
import { ChartsPage } from "../features/charts";
import { ComponentsPage } from "../features/components";
import { pageLinks } from "./config";

export type PageContext = {
  records: RecordsSource;
  settingsStore: SettingsStore;
  settings: WorkspaceSettings;
  onSettingsSaved: (value: WorkspaceSettings) => void;
};
export type PageDefinition = {
  id: string;
  label: string;
  icon: string;
  href: string;
  render: (context: PageContext) => ReactNode;
};

/** Build-time page registration is the only place the shell learns about features. */
export const pages: readonly PageDefinition[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "◇",
    href: pageLinks.overview,
    render: ({ settings }) => (
      <OverviewPage
        workspaceName={settings.name}
        recordsHref={pageLinks.records}
        settingsHref={pageLinks.settings}
        guideHref={pageLinks.guide}
      />
    ),
  },
  {
    id: "records",
    label: "Records",
    icon: "▤",
    href: pageLinks.records,
    render: ({ records }) => <RecordsPage source={records} />,
  },
  {
    id: "charts",
    label: "Charts",
    icon: "⌁",
    href: pageLinks.charts,
    render: () => <ChartsPage />,
  },
  {
    id: "components",
    label: "Components",
    icon: "▦",
    href: pageLinks.components,
    render: () => (
      <ComponentsPage overviewHref={pageLinks.overview} recordsHref={pageLinks.records} />
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: "⚙",
    href: pageLinks.settings,
    render: ({ settingsStore, settings, onSettingsSaved }) => (
      <SettingsPage store={settingsStore} initial={settings} onSaved={onSettingsSaved} />
    ),
  },
  { id: "guide", label: "Guide", icon: "?", href: pageLinks.guide, render: () => <GuidePage /> },
];
