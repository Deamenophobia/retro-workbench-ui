import type { ReactNode } from "react";
import { Checkbox } from "./Choice";

export type Column<T, Id extends string = string> = {
  id: Id;
  heading: string;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
};
export type SortState<Id extends string = string> = {
  columnId: Id;
  direction: "ascending" | "descending";
};
export type TableSelection<T> = {
  selectedKeys: ReadonlySet<string>;
  onChange: (keys: ReadonlySet<string>) => void;
  getLabel: (row: T) => string;
  isSelectable?: (row: T) => boolean;
};

export function DataTable<T, Id extends string = string>({
  caption,
  columns,
  rows,
  rowKey,
  sorting,
  selection,
}: {
  caption: string;
  columns: readonly Column<T, Id>[];
  rows: readonly T[];
  rowKey: (row: T) => string;
  sorting?: { value: SortState<Id> | null; onChange: (sort: SortState<Id>) => void };
  selection?: TableSelection<T>;
}) {
  const eligibleKeys = rows.filter((row) => selection?.isSelectable?.(row) !== false).map(rowKey);
  const selectedCount = eligibleKeys.filter((key) => selection?.selectedKeys.has(key)).length;
  function changeSelection(keys: readonly string[], checked: boolean) {
    if (!selection) return;
    const next = new Set(selection.selectedKeys);
    for (const key of keys) {
      if (checked) next.add(key);
      else next.delete(key);
    }
    selection.onChange(next);
  }
  return (
    <div className="table-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {selection && (
              <th scope="col" className="table-selection">
                <Checkbox
                  label="Select page"
                  checked={eligibleKeys.length > 0 && selectedCount === eligibleKeys.length}
                  indeterminate={selectedCount > 0 && selectedCount < eligibleKeys.length}
                  disabled={eligibleKeys.length === 0}
                  onCheckedChange={(checked) => changeSelection(eligibleKeys, checked)}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                aria-sort={
                  sorting?.value?.columnId === column.id ? sorting.value.direction : undefined
                }
              >
                {sorting && column.sortable ? (
                  <button
                    type="button"
                    className="table-sort"
                    onClick={() =>
                      sorting.onChange({
                        columnId: column.id,
                        direction:
                          sorting.value?.columnId === column.id &&
                          sorting.value.direction === "ascending"
                            ? "descending"
                            : "ascending",
                      })
                    }
                  >
                    {column.heading}
                    <span aria-hidden="true">
                      {sorting.value?.columnId === column.id
                        ? sorting.value.direction === "ascending"
                          ? " ↑"
                          : " ↓"
                        : " ↕"}
                    </span>
                  </button>
                ) : (
                  column.heading
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              data-selected={selection?.selectedKeys.has(rowKey(row)) || undefined}
            >
              {selection && (
                <td className="table-selection">
                  <Checkbox
                    label={`Select ${selection.getLabel(row)}`}
                    checked={selection.selectedKeys.has(rowKey(row))}
                    disabled={selection.isSelectable?.(row) === false}
                    onCheckedChange={(checked) => changeSelection([rowKey(row)], checked)}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.id}>{column.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
