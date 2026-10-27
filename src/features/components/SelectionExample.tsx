import { useState } from "react";
import { Card, Combobox, MultiSelect, type SelectOption } from "../../shared/ui";

const people: readonly SelectOption[] = [
  { value: "alex", label: "Alex Morgan", description: "Documentation" },
  { value: "jamie", label: "Jamie Lee", description: "Design" },
  { value: "sam", label: "Sam Chen", description: "Operations" },
  { value: "riley", label: "Riley Park", description: "Unavailable", disabled: true },
];
const categories: readonly SelectOption[] = [
  { value: "guide", label: "Guide" },
  { value: "reference", label: "Reference" },
  { value: "checklist", label: "Checklist" },
  { value: "note", label: "Note" },
];
const catalog: readonly SelectOption[] = Array.from({ length: 250 }, (_, index) => ({
  value: `reference-${index + 1}`,
  label: `Reference ${String(index + 1).padStart(3, "0")}`,
}));

export function SelectionExample() {
  const [owner, setOwner] = useState<string | null>("alex");
  const [labels, setLabels] = useState<readonly string[]>(["guide"]);
  const [reference, setReference] = useState<string | null>(null);
  return (
    <Card
      title="Searchable choices"
      description="Type to filter; use the arrow keys and Enter to choose"
    >
      <div className="form-stack">
        <Combobox
          label="Resource owner"
          options={people}
          value={owner}
          onChange={setOwner}
          help="Choose one person. Escape keeps the current selection."
        />
        <MultiSelect
          label="Resource labels"
          options={categories}
          value={labels}
          onChange={setLabels}
          help="Choose several labels, then remove them individually."
        />
        <Combobox
          label="Catalog reference"
          options={catalog}
          value={reference}
          onChange={setReference}
          help="A larger example with 250 options. Search by number."
        />
        <Combobox
          label="Owner preview (disabled)"
          options={people}
          value={owner}
          onChange={setOwner}
          disabled
          help="The same selection, with editing disabled."
        />
        <p className="muted" role="status">
          Owner: {people.find((person) => person.value === owner)?.label ?? "Unassigned"} ·{" "}
          {labels.length} labels
        </p>
      </div>
    </Card>
  );
}
