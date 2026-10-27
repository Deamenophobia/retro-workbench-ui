# Architecture and ownership

This ownership map was established before implementation. The source reference is
Streamweave commit `8d813c1b64e96405a2b9fcbe8425a54f167b5e87`, inspected read-only.

## Reuse decision

Reuse the presentation language from `workspace.css`, `style.css`,
`features/appearance/classic*.css`, and `themes.ts`: 224px persistent sidebar,
compact header menus, independent scrolling content, status bar, Classic colors,
square panels, small controls, and Studio's dark green palette. Adapt the native
disclosure-menu interaction and appearance fallback behavior. Reimplement the
components with domain-free props; do not copy the original application graph.

Exclude the core package, datasets, calculations, graph editing/execution, workers,
file codecs, document history, domain-specific charts, React Flow, and canvas dependencies.

The chart gallery adds domain-free SVG presentation under `shared/ui/charts`.
Those components own only drawing, legends and accessible data disclosure. The
`features/charts` page owns fictional example values and gallery controls. Palette
values remain in theme tokens; no charting, canvas or analytics package is needed.

## Ownership and dependency direction

| Directory             | Owns                                                                   | May depend on                       |
| --------------------- | ---------------------------------------------------------------------- | ----------------------------------- |
| `src/app`             | Branding, page registration, composition, routing and appearance state | All public entry points             |
| `src/shared/ui`       | Shell, navigation, menus, headings, controls, tables, tabs, feedback   | React and other shared UI           |
| `src/features/<name>` | One page's presentation and local state                                | Its own files, shared UI, contracts |
| `src/contracts`       | Plain data types and integration interfaces                            | Other contracts only                |
| `src/integrations`    | Browser persistence, URL navigation, demo records                      | Contracts and theme metadata        |
| `src/themes`          | Semantic tokens, appearance metadata, theme values                     | Other theme files only              |

Application composition injects concrete integrations through typed props. Shared
UI never imports features or services. Features never import each other, including
public entry points. Cross-page navigation is an ordinary link. Feature entry
points are `index.ts`; application code cannot import feature internals. UI exports
are similarly collected in `shared/ui/index.ts`. No runtime plugin system exists.

`scripts/check-boundaries.mjs` resolves TypeScript imports and exports, rejects
cycles, enforces these layers and public entry points, and rejects browser storage
and data-client access in presentation code. It runs in `npm run check` and CI.
DOM focus, disclosure dismissal, and keyboard navigation belong to UI interaction;
persistence and external data access belong to integrations.

## State and interfaces

The component expansion follows the same layers; its up-front scope is recorded in
[`ui-expansion.md`](ui-expansion.md) and [`controls-and-quality.md`](controls-and-quality.md).
`features/components` composes five independent
example groups, owns their fictional fixtures and local state, and receives route
destinations from app composition. It does not become a dependency of other pages.
Cards and lists use content slots. `Panel` is an alias of Card, not a duplicate
surface implementation. Checkbox and Switch share one native-input implementation;
Dialog and Drawer share one native-dialog controller. The floating-position hook
is internal to Popover, Tooltip and selection inputs and contains only DOM interaction code.

Combobox and MultiSelect have distinct value types and share one private listbox
implementation. Focus, search text and active-option state belong there; selected
values belong to the consumer. FilePicker owns drag feedback only, returns File
objects through callbacks, and never reads or uploads their contents. DateRange
composes native date inputs with date-only strings; validation messages belong to
the form. `records/recordView.ts` owns sorting and selected-ID reconciliation.
The table renders controlled headers and checkboxes without sorting, fetching or
persisting data. ColumnVisibility describes visible IDs without importing columns
from any feature. There is no global table, selection or upload service.

Pagination owns no collection or network state. Its range helper normalizes page
bounds, while Records owns filters, page size, page resets and slicing the loaded
demo rows. The same control can consume an API's total count without modification.
Toasts receive one feature-owned message and a dismissal callback; there is no
global notification service, automatic timer, or queue.

Only routing and appearance belong to application composition. A feature owns its
query, tab selection, loading state, form draft, and save result. Records receive a
`RecordsSource`; settings receive a `SettingsStore`. Requests use an AbortSignal
and a current-request guard so even a non-cooperative adapter cannot publish stale
results. Appearance is applied before React mounts to avoid a saved-theme flash.

The shell takes branding, navigation, menu, appearance, sidebar, and footer slots.
Shared controls use native HTML props plus small discriminated variants. The table
takes typed columns and row keys; sorting/filtering remain with the feature. Tabs
own keyboard focus, while selection and panel content belong to their consumer.

## Deliberate limits

This is a client-only starter, not an authentication or backend framework. Demo
records are a small fictional directory; settings are browser-local. Hash routes
work on static hosting. No server rendering, remote synchronization, virtualized
tables, canvas engine, or runtime extensions are included. Add these only when an
application actually needs them. Appearance is shared within a page, with the last
saved choice used on reload; cross-tab synchronization is not implemented.
