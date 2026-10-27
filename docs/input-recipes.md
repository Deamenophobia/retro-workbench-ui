# Controlled inputs and table views

Import public components and types from `src/shared/ui`. Features own values,
validation, requests and persistence; UI components communicate through callbacks.
The Advanced inputs gallery demonstrates each interface without a backend.

## Sorting, selection and columns

`DataTable<T, Id>` receives typed `Column<T, Id>[]`, rows, a caption and a stable
`rowKey`. Mark sortable columns with `sortable: true`, then provide
`sorting={{ value: sort, onChange: setSort }}`. `SortState<Id>` uses `columnId` and
`direction: "ascending" | "descending"`. The feature applies the comparison before
paging; a remote adapter can instead receive those values as query parameters.
Only the active header has `aria-sort`. Omit sorting for a static table.

```tsx
const [selectedKeys, setSelectedKeys] = useState<ReadonlySet<string>>(new Set());
<DataTable
  caption="Documents"
  rows={pageRows}
  columns={columns}
  rowKey={(row) => row.id}
  selection={{
    selectedKeys,
    onChange: setSelectedKeys,
    getLabel: (row) => row.name,
    isSelectable: (row) => row.status !== "Archived",
  }}
/>;
```

The header checkbox selects eligible rows on the current page and indicates a
mixed selection. IDs on other pages remain selected. Records clears selection when
filters change and reconciles missing IDs after refresh. Choose and document your
application's policy before adding bulk actions; the starter has no mutation API.

`ColumnVisibility` receives `{ id, label, required? }[]`, visible IDs and `onChange`.
It keeps required columns and the final visible column enabled. Pass filtered
columns to DataTable. Records resets sorting to Name if its sorted column is hidden.
Page, size, sorting, columns and selection are local and reset when leaving the page.

## Searchable choices

```tsx
const [owner, setOwner] = useState<string | null>(null);
const [labels, setLabels] = useState<readonly string[]>([]);
<Combobox label="Owner" options={people} value={owner} onChange={setOwner} name="owner" />;
<MultiSelect
  label="Labels"
  options={categories}
  value={labels}
  onChange={setLabels}
  name="labels"
/>;
```

Options have unique stable `value`, `label`, optional `description` and `disabled`.
Both controls accept `help`, `error`, `placeholder` and `disabled`. Values must refer
to supplied options. Search matches label and description without changing the
committed value. Arrow keys skip disabled options; Home/End jump inside an open
list; Enter selects; Escape and blur discard uncommitted search. Tab follows normal
document order. IME composition does not commit an option. Focus remains in the
input via `aria-activedescendant`; a manual native popover avoids pointer light
dismissal racing with input focus. Blur and Escape close it.

MultiSelect toggles options and provides named removal buttons. Clear/removal
returns focus to the input. A `name` supplies hidden form fields: one scalar value
for Combobox, repeated fields for MultiSelect. These are selection-only controls,
not free-text tag creators. Filtering is local and rendering is not virtualized;
250 options are exercised. For remote search, own request cancellation and error
state in the feature and deliberately extend the public interface as needed.

## Dates

`DateInput` takes `label`, a `YYYY-MM-DD` value (or empty string), `onChange` and
native input props such as `min`, `max`, `required`, `name` and `disabled`.
`DateRange` takes `{ start, end }`, `onChange`, label, optional bounds, disabled
state, error and custom start/end labels. Bounds combine the supplied limits with
the opposite endpoint. Supply valid ISO dates and ordered min/max limits.

The browser owns localized display and the calendar. Values never pass through
`Date` or time-zone conversion. The form owns requiredness, range validation and
submission feedback. The demo intentionally uses `noValidate` to demonstrate
explicit recovery messages. It does not store date drafts.

## File selection and progress

```tsx
const [files, setFiles] = useState<readonly File[]>([]);
const [rejected, setRejected] = useState<readonly FileRejection[]>([]);
<FilePicker
  label="Attachments"
  files={files}
  onChange={setFiles}
  onReject={setRejected}
  constraints={{ accept: [".txt", ".md"], maxFiles: 3, maxBytes: 1024 * 1024 }}
/>;
```

Render `rejected` in a Notice owned by the form. Constraints require positive
limits; `accept` supports extensions, exact MIME types and MIME wildcards. Empty
accept allows every type. Duplicate name/size/modified/type combinations are
rejected. Selection and drop apply the same rules; valid files survive a mixed
batch. The native picker resets so a removed file can be chosen again. Removal
returns keyboard focus to the picker. Disabled controls ignore drops.

Optional `progress: ReadonlyMap<File, number>` supplies completion percentages for
the same File objects. The demo uses a clearly labeled manual progress slider;
there is no simulated success, network transfer or file-content read. Add upload,
cancel and retry through a feature-owned integration. Validate content again on
the server; MIME/extension and size checks here are user feedback, not security.
