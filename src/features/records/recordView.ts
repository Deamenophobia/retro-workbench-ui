import type { WorkRecord } from "../../contracts/records";
import type { SortState } from "../../shared/ui";

export type RecordColumnId = keyof WorkRecord;
export const defaultSort: SortState<RecordColumnId> = { columnId: "id", direction: "ascending" };
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

export function sortRecords(rows: readonly WorkRecord[], sort: SortState<RecordColumnId>) {
  const direction = sort.direction === "ascending" ? 1 : -1;
  return [...rows].sort(
    (a, b) =>
      direction * collator.compare(a[sort.columnId], b[sort.columnId]) ||
      collator.compare(a.id, b.id),
  );
}

export function reconcileSelection(selected: ReadonlySet<string>, rows: readonly WorkRecord[]) {
  const existing = new Set(rows.map((row) => row.id));
  return new Set([...selected].filter((id) => existing.has(id)));
}
