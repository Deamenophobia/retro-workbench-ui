import { useEffect, useState } from "react";
import type { RecordsSource } from "../../contracts/records";
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  PageHeading,
  Pagination,
  getPagination,
  Toolbar,
  ColumnVisibility,
} from "../../shared/ui";
import { RecordsTable, recordColumns } from "./RecordsTable";
import { useRecords } from "./useRecords";
import { defaultSort, sortRecords, reconcileSelection, type RecordColumnId } from "./recordView";

const pageSizes = [5, 10, 25] as const;

export function RecordsPage({ source }: { source: RecordsSource }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [revision, setRevision] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(pageSizes[0]);
  const [sort, setSort] = useState(defaultSort);
  const [visibleColumns, setVisibleColumns] = useState<readonly RecordColumnId[]>(
    recordColumns.map((column) => column.id),
  );
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const state = useRecords(source, query, revision);
  const rows =
    state.kind === "ready"
      ? sortRecords(
          state.rows.filter((row) => status === "all" || row.status === status),
          sort,
        )
      : [];
  const range = getPagination(rows.length, page, pageSize);
  useEffect(() => {
    if (state.kind === "ready" && page !== range.page) setPage(range.page);
  }, [state.kind, page, range.page]);
  useEffect(() => {
    if (state.kind === "ready")
      setSelected((previous) => {
        const next = reconcileSelection(previous, state.rows);
        return next.size === previous.size ? previous : next;
      });
  }, [state]);
  function clear() {
    setQuery("");
    setStatus("all");
    setPage(1);
    setSelected(new Set());
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
    return (
      <RecordsTable
        rows={rows.slice(range.startIndex, range.endIndex)}
        visibleColumns={visibleColumns}
        sort={sort}
        onSort={(value) => {
          setSort(value);
          setPage(1);
        }}
        selection={{ selectedKeys: selected, onChange: setSelected, getLabel: (row) => row.name }}
      />
    );
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
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                  setSelected(new Set());
                }}
              />
            )}
          </Field>
          <Field label="Status">
            {(props) => (
              <select
                {...props}
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                  setSelected(new Set());
                }}
              >
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
        <Toolbar label="Record view controls">
          <ColumnVisibility
            columns={recordColumns.map((column) => ({
              id: column.id,
              label: column.heading,
              required: column.id === "name",
            }))}
            value={visibleColumns}
            onChange={(value) => {
              setVisibleColumns(value);
              if (!value.includes(sort.columnId)) {
                setSort({ columnId: "name", direction: "ascending" });
                setPage(1);
              }
            }}
          />
          <span role="status">{selected.size} selected across pages</span>
          <Button disabled={selected.size === 0} onClick={() => setSelected(new Set())}>
            Clear selection
          </Button>
        </Toolbar>
        <div aria-busy={state.kind === "loading"}>{content()}</div>
        {state.kind === "ready" && (
          <Pagination
            label="Record pages"
            page={range.page}
            pageSize={pageSize}
            totalItems={rows.length}
            onPageChange={setPage}
            pageSizeControl={{
              options: pageSizes,
              onChange: (size) => {
                setPageSize(size);
                setPage(1);
              },
            }}
          />
        )}
        <div className="records-footer">
          <span role="status">
            {state.kind === "ready" ? `${rows.length} matching records` : "Record directory"}
          </span>
          <span>Fictional sample records · Read only</span>
        </div>
      </div>
    </>
  );
}
