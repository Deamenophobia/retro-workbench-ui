import { PageHeading, Panel } from "../../shared/ui";

export function OverviewPage({
  workspaceName,
  recordsHref,
  settingsHref,
  guideHref,
}: {
  workspaceName: string;
  recordsHref: string;
  settingsHref: string;
  guideHref: string;
}) {
  return (
    <>
      <PageHeading
        eyebrow="Workspace / Overview"
        title="A place for everyday work"
        description={`Welcome to ${workspaceName}. Everything you need, close at hand.`}
        actions={
          <a className="button button-primary" href={recordsHref}>
            Browse records →
          </a>
        }
      />
      <div className="page-body">
        <dl className="summary-grid">
          <div>
            <dt>Your workspace</dt>
            <dd>Personal</dd>
          </div>
          <div>
            <dt>Storage</dt>
            <dd>Local browser</dd>
          </div>
          <div>
            <dt>Workspace status</dt>
            <dd>Ready</dd>
          </div>
        </dl>
        <div className="split-grid">
          <Panel title="Start here">
            <div className="prose">
              <p>
                A familiar workbench for keeping small collections organized. Browse the sample
                directory, find a record, or make this workspace your own.
              </p>
              <ul className="link-list">
                <li>
                  <a href={recordsHref}>
                    <span>Open the record directory</span>
                    <span>Search & review →</span>
                  </a>
                </li>
                <li>
                  <a href={settingsHref}>
                    <span>Set up your workspace</span>
                    <span>Name & preferences →</span>
                  </a>
                </li>
                <li>
                  <a href={guideHref}>
                    <span>Read the quick guide</span>
                    <span>Find your way around →</span>
                  </a>
                </li>
              </ul>
            </div>
          </Panel>
          <Panel title="Make yourself at home">
            <div className="prose">
              <p>
                Use the sidebar to switch views. The menus and appearance control stay within reach
                as you work.
              </p>
              <p className="muted">
                Prefer a quieter screen? Choose Studio · Original in the header. Your appearance is
                remembered in this browser.
              </p>
              <a href={settingsHref}>Workspace preferences →</a>
            </div>
          </Panel>
        </div>
        <Panel title="About this workspace">
          <div className="prose">
            <p>
              This sample contains a small fictional record directory. You can search it freely;
              your workspace settings are saved only in this browser.
            </p>
            <p className="muted">
              A compact layout, clear labels, and separate views keep the focus on the task in front
              of you.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}
