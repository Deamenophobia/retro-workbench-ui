import { useState, type FormEvent } from "react";
import type { SettingsStore, WorkspaceSettings } from "../../contracts/settings";
import { Button, Field, Notice, PageHeading, Panel, Tabs } from "../../shared/ui";

export function SettingsPage({
  store,
  initial,
  onSaved,
}: {
  store: SettingsStore;
  initial: WorkspaceSettings;
  onSaved: (settings: WorkspaceSettings) => void;
}) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [tab, setTab] = useState("general");
  const [nameError, setNameError] = useState<string>();
  const [result, setResult] = useState<"saved" | "error">();
  const dirty =
    draft.name !== saved.name ||
    draft.startPage !== saved.startPage ||
    draft.showHints !== saved.showHints;
  function edit(next: WorkspaceSettings) {
    setDraft(next);
    setResult(undefined);
    setNameError(undefined);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = { ...draft, name: draft.name.trim() };
    if (!next.name) {
      setNameError("Enter a workspace name.");
      event.currentTarget.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }
    if (!store.save(next)) {
      setResult("error");
      return;
    }
    setSaved(next);
    setDraft(next);
    setResult("saved");
    onSaved(next);
  }
  const general = (
    <Panel title="Workspace preferences">
      <form className="form-stack" onSubmit={submit} noValidate>
        <Field
          label="Workspace name"
          help="Shown in the header and overview. Up to 60 characters."
          {...(nameError ? { error: nameError } : {})}
        >
          {(props) => (
            <input
              {...props}
              required
              maxLength={60}
              value={draft.name}
              onChange={(event) => edit({ ...draft, name: event.target.value })}
            />
          )}
        </Field>
        <Field label="Start page" help="Used when you next open the workspace without a page link.">
          {(props) => (
            <select
              {...props}
              value={draft.startPage}
              onChange={(event) =>
                edit({
                  ...draft,
                  startPage: event.target.value === "records" ? "records" : "overview",
                })
              }
            >
              <option value="overview">Overview</option>
              <option value="records">Records</option>
            </select>
          )}
        </Field>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={draft.showHints}
            onChange={(event) => edit({ ...draft, showHints: event.target.checked })}
          />
          Show helpful sidebar notes
        </label>
        {result === "saved" && (
          <Notice tone="success">Workspace settings saved in this browser.</Notice>
        )}
        {result === "error" && (
          <Notice tone="error">
            Settings could not be saved. Browser storage may be unavailable or full. Your changes
            are still here; try saving again.
          </Notice>
        )}
        <div className="form-actions">
          <Button type="submit" variant="primary" disabled={!dirty}>
            Save changes
          </Button>
          <Button
            disabled={!dirty}
            onClick={() => {
              setDraft(saved);
              setResult(undefined);
              setNameError(undefined);
            }}
          >
            Discard changes
          </Button>
          <span className="muted">{dirty ? "Unsaved changes" : "All changes saved"}</span>
        </div>
      </form>
    </Panel>
  );
  return (
    <>
      <PageHeading
        eyebrow="Workspace / Settings"
        title="Workspace settings"
        description="A few preferences to make this space yours."
      />
      <div className="page-body">
        <Tabs
          label="Settings sections"
          value={tab}
          onChange={setTab}
          items={[
            { id: "general", label: "General", content: general },
            {
              id: "about",
              label: "About & storage",
              content: (
                <Panel title="Your browser, your workspace">
                  <div className="prose">
                    <p>
                      Appearance and workspace preferences are saved on this device. They are not
                      synchronized with other browsers.
                    </p>
                    <p>
                      Clearing site data resets these preferences. The record directory is a
                      fictional, read-only example.
                    </p>
                    <p className="muted">
                      To change the appearance, use the selector in the header. Classic · Retro is
                      the default.
                    </p>
                  </div>
                </Panel>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
