# UI recipes

Import from `src/shared/ui`'s public entry point. Shared UI never knows your routes,
record types, data clients, or storage. The live examples are at `#/components`;
the feature is registered in `src/app/pages.tsx` like every other page.

## Compose a card and list

```tsx
<Card
  title="Recent documents"
  description="The latest items in this workspace"
  actions={<Badge>{documents.length}</Badge>}
  footer={<a href={allDocumentsHref}>View all documents</a>}
>
  <List label="Recent documents">
    {documents.map((document) => (
      <ListItem
        key={document.id}
        leading={<Avatar name={document.owner} />}
        meta={<Badge>{document.status}</Badge>}
        actions={<Button onClick={() => onArchive(document.id)}>Archive</Button>}
      >
        <a href={document.href}>{document.title}</a>
        <p>{document.summary}</p>
      </ListItem>
    ))}
  </List>
</Card>
```

Use normal links for navigation and buttons for actions. Do not wrap an entire card
or row in a link when it contains other actions. For selection, compose a Checkbox;
do not add listbox roles to a document list. Show EmptyState instead of an empty
List. Card's optional media and footer slots support summary, record and action
cards without adding domain-specific flags. Existing Panel consumers keep working.

## Paginate a collection

```tsx
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const range = getPagination(filteredItems.length, page, pageSize);
const visibleItems = filteredItems.slice(range.startIndex, range.endIndex);

<Pagination
  label="Document pages"
  page={range.page}
  pageSize={pageSize}
  totalItems={filteredItems.length}
  onPageChange={setPage}
  pageSizeControl={{
    options: [10, 25, 50],
    onChange: (size) => {
      setPageSize(size);
      setPage(1);
    },
  }}
/>;
```

Render `visibleItems` through List or DataTable. Reset the feature's page when a
filter changes. If refreshed results shrink, synchronize the stored page to
`range.page`; Records demonstrates that guard. Empty collections show `0–0 of 0`
with no active page actions. Use `disabled` while a page request is pending.
For an API that already returns one page, **do not slice that page again**: pass
the API's total count to Pagination and render its returned items directly.
Extend your integration contract to carry page, size and total; keep cancellation
and stale-response protection in the feature's request owner.

## Use form controls

```tsx
<Field label="Title" help="A short, recognizable name." {...(titleError ? { error: titleError } : {})}>
  {(props) => <input {...props} value={title} onChange={(event) => setTitle(event.target.value)} />}
</Field>
<Switch label="Show reminders" checked={reminders} onCheckedChange={setReminders} />
<Checkbox label="Include notes" defaultChecked onCheckedChange={onNotesChange} />
<RadioGroup
  label="Visibility"
  value={visibility}
  onChange={setVisibility}
  options={[{ value: "private", label: "Only me" }, { value: "workspace", label: "Workspace" }]}
/>
```

With `exactOptionalPropertyTypes`, omit an absent `error` prop rather than passing
undefined (the gallery uses a conditional spread). Use Field with native select,
input and textarea instead of adding wrappers that only rename their props.
Pass native `name` attributes when submitting FormData. Keep validation and save
behavior with the form owner; move persistence to an injected integration.

## Open an overlay

```tsx
const [open, setOpen] = useState(false);
const input = useRef<HTMLInputElement>(null);

<Button onClick={() => setOpen(true)}>Rename</Button>;
<Dialog open={open} onClose={() => setOpen(false)} title="Rename document" initialFocus={input}>
  <Field label="Document name">{(props) => <input {...props} ref={input} />}</Field>
</Dialog>;
```

Use Drawer with the same props for side content. Native `showModal()` makes the
background inert. Escape or the Close button calls `onClose`; the owner must update
`open`. Closing restores the connected trigger. Native keyboard navigation can
visit browser chrome but cannot activate background document controls. Backdrop
clicking does not discard edits. For a form, put submit buttons inside the form,
or use their native `form` attribute if composing an actions footer.

Use Popover for short nonmodal content; the trigger and Close button are supplied.
Use Tooltip only for supplemental text:

```tsx
<Tooltip text="Changes affect this preview only.">
  {(props) => <Button {...props}>Preview information</Button>}
</Tooltip>
```

Supply one focusable child. Merge `aria-describedby` IDs if that control already
has another description. Essential help belongs in Field or visible page content;
tooltips contain no controls. Hover exit has a short grace period so the pointer can
cross into the tooltip. Popover and Tooltip share an internal positioning hook
that responds to scrolling/resizing and constrains the surface to the viewport.

## Show status

Keep Toast mounted with `message={null}` until needed, then provide a unique ID,
plain text and optional info/success/error tone. Dismissal belongs to the owner;
the gallery restores focus to the notification trigger. Use Notice for persistent
inline guidance and ErrorState for a failure that needs a recovery action. Toasts
do not replace validation feedback or operate a hidden global queue.

Place Skeleton in a labeled busy/status region. Progress takes a label, optional
value and maximum. Omit value for indefinite work; do not invent completion
percentages when the integration cannot provide them.

## Customize and validate

Shared size tokens live in `themes/tokens.css`; the two appearance files own
palette values, backdrop and skeleton colors. Component styles consume these
tokens. Gallery-specific layouts and fictional fixtures remain inside the feature.
The gallery is removable through its page registration without affecting shared UI.

Run `npm run check` after changes. Add behavioral coverage when introducing new
interactions, including focus, dismissal, disabled states and narrow layouts.
Native dialog, popover and ResizeObserver need modern browsers. Tests currently
cover Chromium desktop and narrow viewports; verify your supported browser and
screen-reader matrix before deploying an adapted application.

Platform references: [native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
and [native popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using).
