import { Checkbox } from "./Choice";
import { Popover } from "./overlays/Popover";

export function ColumnVisibility<Id extends string>({
  columns,
  value,
  onChange,
}: {
  columns: readonly { id: Id; label: string; required?: boolean }[];
  value: readonly Id[];
  onChange: (ids: readonly Id[]) => void;
}) {
  return (
    <Popover label="Columns" title="Visible columns">
      <div className="column-options">
        {columns.map((column) => (
          <Checkbox
            key={column.id}
            label={column.label}
            checked={value.includes(column.id)}
            disabled={column.required || (value.length === 1 && value.includes(column.id))}
            onCheckedChange={(checked) => {
              const selected = new Set(value);
              if (checked) selected.add(column.id);
              else selected.delete(column.id);
              onChange(columns.filter((item) => selected.has(item.id)).map((item) => item.id));
            }}
          />
        ))}
      </div>
    </Popover>
  );
}
