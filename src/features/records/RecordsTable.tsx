import type { WorkRecord } from "../../contracts/records";
import {
  Badge,
  DataTable,
  type Column,
  type SortState,
  type TableSelection,
} from "../../shared/ui";
import type { RecordColumnId } from "./recordView";

export const recordColumns: readonly Column<WorkRecord, RecordColumnId>[] = [
  { id: "id", heading: "Record", cell: (row) => <span className="mono">{row.id}</span> },
  { id: "name", heading: "Name", cell: (row) => <strong>{row.name}</strong> },
  { id: "category", heading: "Type", cell: (row) => row.category },
  { id: "owner", heading: "Owner", cell: (row) => row.owner },
  {
    id: "status",
    heading: "Status",
    cell: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge>,
  },
  {
    id: "updated",
    heading: "Updated",
    cell: (row) => <time dateTime={row.updated}>{row.updated}</time>,
  },
];

function statusTone(status: WorkRecord["status"]) {
  if (status === "Ready") return "success";
  if (status === "Draft") return "warning";
  return "neutral";
}

export function RecordsTable({
  rows,
  visibleColumns,
  sort,
  onSort,
  selection,
}: {
  rows: readonly WorkRecord[];
  visibleColumns: readonly RecordColumnId[];
  sort: SortState<RecordColumnId>;
  onSort: (value: SortState<RecordColumnId>) => void;
  selection: TableSelection<WorkRecord>;
}) {
  return (
    <DataTable
      caption="Workspace records"
      columns={recordColumns
        .filter((column) => visibleColumns.includes(column.id))
        .map((column) => ({ ...column, sortable: true }))}
      rows={rows}
      rowKey={(row) => row.id}
      sorting={{ value: sort, onChange: onSort }}
      selection={selection}
    />
  );
}
