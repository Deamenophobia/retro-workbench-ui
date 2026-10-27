import { useState } from "react";
import type { RecordsSource } from "../../contracts/records";
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  PageHeading,
  Toolbar,
} from "../../shared/ui";
import { RecordsTable } from "./RecordsTable";
import { useRecords } from "./useRecords";

export function RecordsPage({ source }: { source: RecordsSource }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [revision, setRevision] = useState(0);
  const state = useRecords(source, query, revision);
  const rows =
    state.kind === "ready"
      ? state.rows.filter((row) => status === "all" || row.status === status)
      : [];
  function clear() {
    setQuery("");
    setStatus("all");
  }
  function content() {
    if (state.kind === "loading") return <LoadingState label="Loading records…" />;
    if (state.kind === "error")
      return (
        <ErrorState
          title="Records could not be loaded"
          description="Check your connection and try again. Your filters have been kept."
          action={<Button onClick={() => setRevision((value) => value + 1)}>Try again</Button>}
        />
      );
    if (rows.length === 0)
      return (
        <EmptyState
          title="No records found"
          description="Try another name or owner, or clear the filters to see all records."
          action={<Button onClick={clear}>Clear filters</Button>}
        />
      );
    return <RecordsTable rows={rows} />;
  }
  return (
    <>
      <PageHeading
        eyebrow="Workspace / Records"
        title="Record directory"
        description="A small collection of documents, checklists, and references."
        actions={
          <Button
            onClick={() => setRevision((value) => value + 1)}
            disabled={state.kind === "loading"}
          >
            ↻ Refresh
          </Button>
        }
      />
      <div className="page-body">
        <Toolbar label="Record filters">
          <Field label="Search records">
            {(props) => (
              <input
                {...props}
                type="search"
                placeholder="Name, owner, or record ID…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            )}
          </Field>
          <Field label="Status">
            {(props) => (
              <select {...props} value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">All statuses</option>
                <option>Ready</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            )}
          </Field>
          <Button onClick={clear} disabled={!query && status === "all"}>
            Clear
          </Button>
        </Toolbar>
        <div aria-busy={state.kind === "loading"}>{content()}</div>
        <div className="records-footer">
          <span role="status">
            {state.kind === "ready" ? `${rows.length} records shown` : "Record directory"}
          </span>
          <span>Fictional sample records · Read only</span>
        </div>
      </div>
    </>
  );
}
