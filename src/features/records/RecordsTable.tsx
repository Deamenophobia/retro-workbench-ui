import type { WorkRecord } from "../../contracts/records";
import { Badge, DataTable, type Column } from "../../shared/ui";

const columns: readonly Column<WorkRecord>[] = [
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

export function RecordsTable({ rows }: { rows: readonly WorkRecord[] }) {
  return (
    <DataTable caption="Workspace records" columns={columns} rows={rows} rowKey={(row) => row.id} />
  );
}
