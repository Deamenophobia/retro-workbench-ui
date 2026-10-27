import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AppShell, AppearanceSelect, EmptyState, Menu, Notice } from "../shared/ui";
import { applyAppearance, createAppearanceStore } from "../integrations/appearance";
import { hashNavigation, setPageTitle } from "../integrations/navigation";
import { resolveTheme, themes, type Theme } from "../themes/themes";
import type { SettingsRead } from "../contracts/settings";
import { brand, pageLinks } from "./config";
import { pages, type PageContext } from "./pages";

type Props = Pick<PageContext, "records" | "settingsStore"> & {
  appearance: ReturnType<typeof createAppearanceStore>;
  initialTheme: Theme;
  initialSettings: SettingsRead;
};

export function App({ records, settingsStore, appearance, initialTheme, initialSettings }: Props) {
  const [theme, setTheme] = useState(initialTheme);
  const [appearanceSaved, setAppearanceSaved] = useState(true);
  const [settings, setSettings] = useState(initialSettings.value);
  const [settingsWarning, setSettingsWarning] = useState(initialSettings.warning);
  const initialPage = useRef(initialSettings.value.startPage);
  const hash = useSyncExternalStore(hashNavigation.subscribe, hashNavigation.read);
  const pageId = hash || initialPage.current;
  const page = pages.find((candidate) => candidate.id === pageId);
  const previousPage = useRef(pageId);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setPageTitle(`${page?.label ?? "Page not found"} · ${brand.name}`);
    if (previousPage.current !== pageId) {
      content.current?.closest("main")?.scrollTo(0, 0);
      content.current?.querySelector("h1")?.setAttribute("tabindex", "-1");
      content.current?.querySelector("h1")?.focus();
      previousPage.current = pageId;
    }
  }, [pageId, page]);
  function choose(value: string) {
    const next = resolveTheme(value);
    applyAppearance(next);
    setTheme(next);
    setAppearanceSaved(appearance.save(next));
  }
  return (
    <AppShell
      brand={brand}
      navigation={pages}
      activePage={pageId}
      workspaceName={settings.name}
      menus={
        <>
          <Menu
            label="Workspace"
            items={[
              { label: "Overview", href: pageLinks.overview },
              { label: "Browse records", href: pageLinks.records },
              { label: "Preferences", href: pageLinks.settings },
            ]}
          />
          <Menu
            label="Help"
            items={[
              { label: "Quick guide", href: pageLinks.guide },
              { label: "Workspace settings", href: pageLinks.settings },
            ]}
          />
        </>
      }
      appearance={
        <AppearanceSelect
          value={theme}
          options={Object.entries(themes).map(([value, info]) => ({ value, label: info.label }))}
          onChange={choose}
        />
      }
      sidebar={
        settings.showHints && (
          <>
            <h2>At your fingertips</h2>
            <p>One workspace. Separate views for each task.</p>
            <p>
              Use the menus above or explore the <a href={pageLinks.guide}>quick guide</a>.
            </p>
          </>
        )
      }
      footer={
        <>
          <span>✓ Ready</span>
          <span className="status-end">{themes[theme].label} · Local workspace</span>
        </>
      }
    >
      {!appearanceSaved && (
        <Notice tone="warning">
          Appearance applied for this session. Browser preferences could not be saved.
        </Notice>
      )}
      {settingsWarning && <Notice tone="warning">{settingsWarning}</Notice>}
      <div ref={content} key={pageId}>
        {page ? (
          page.render({
            records,
            settingsStore,
            settings,
            onSettingsSaved: (value) => {
              setSettings(value);
              setSettingsWarning(undefined);
            },
          })
        ) : (
          <>
            <h1 className="sr-only">Page not found</h1>
            <EmptyState
              title="Page not found"
              description="This view is not registered in this workspace."
              action={
                <a className="button" href={pageLinks.overview}>
                  Return to overview
                </a>
              }
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
