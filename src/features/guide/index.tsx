import { PageHeading, Panel } from "../../shared/ui";

/** Extension example: this feature only needs a registration in app/pages.tsx. */
export function GuidePage() {
  return (
    <>
      <PageHeading
        eyebrow="Workspace / Guide"
        title="A quick guide"
        description="Small conveniences for a familiar workspace."
      />
      <div className="page-body">
        <Panel title="Find your way around">
          <div className="prose">
            <p>
              The sidebar keeps each view one click away. Browser Back and Forward work with the
              workspace links.
            </p>
            <p>
              Search records by name, owner, or ID, then narrow the list with a status filter. Clear
              the filters to start again.
            </p>
          </div>
        </Panel>
        <Panel title="Work with the keyboard">
          <div className="prose">
            <p>
              Press Tab to move between controls and Enter to follow links. Open a top menu with
              Enter or Space; press Escape to close it.
            </p>
            <p>
              In Settings, use the Left and Right arrow keys to switch tabs. Home and End move to
              the first and last tab.
            </p>
            <p>
              On a smaller screen, the sidebar stays visible and wide tables scroll within their own
              area.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}
