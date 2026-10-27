# Component responsibilities

All public UI exports live in `src/shared/ui/index.ts`. Shared components may import
React and other shared UI, never features, contracts, adapters, or application
configuration. They receive data and explicit callbacks and own only interaction
state such as focus or disclosure visibility.

| Component          | Responsibility and interface                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppShell`         | Persistent header/sidebar/footer and scrolling main; typed branding/navigation plus composition slots. No routing or persistence.            |
| `Menu`             | Native disclosure with link/action union; Escape, outside click, and focus-leave dismissal.                                                  |
| `AppearanceSelect` | Controlled native select; receives string options and `onChange`. No theme knowledge or storage.                                             |
| `PageHeading`      | One page title, eyebrow, description, optional action slot.                                                                                  |
| `Panel`            | Labeled section, heading and optional actions, arbitrary content.                                                                            |
| `Toolbar`          | Named group of controls; ordinary Tab order, no misleading toolbar arrow-key semantics.                                                      |
| `Button`           | Native button props with primary/secondary/text variant; safe `type="button"` default.                                                       |
| `Field`            | Associates label, help/error and control using a render prop. Supplies ID and ARIA attributes; does not own the value.                       |
| `DataTable<T>`     | Semantic table with caption, typed column renderers and stable row key; focusable horizontal scroll region. Filtering belongs to the caller. |
| `Tabs`             | Controlled selection, roving focus, arrow/Home/End keys, tab/panel IDs; keeps hidden panels mounted to preserve drafts.                      |
| `Notice`           | Info/success/warning status or error alert.                                                                                                  |
| `LoadingState`     | Consistent loading announcement and quiet progress marker.                                                                                   |
| `EmptyState`       | Title, explanation and optional recovery action.                                                                                             |
| `ErrorState`       | Error announcement plus an explicit recovery action supplied by the feature.                                                                 |
| `Badge`            | Compact neutral/success/warning label; always includes text so meaning does not depend on color.                                             |

`features/records` owns query, filters, async lifecycle and record columns;
`features/settings` owns draft validation, discard, save feedback, and tabs;
Overview and Guide are small presentation pages. Settings only notify composition
after a successful save because the header and sidebar also consume those values.
No global feature-state store is needed.

`LineChart`, `BarChart`, and `DonutChart` are exported through the same shared UI
entry point. They take plain typed data, a title and description; they never load
data or import features. LineChart owns series visibility and point inspection.
ChartFrame provides a consistent figure caption and a native data-table disclosure.
SVG coordinates adapt to the measured width; theme tokens provide all series colors.
The gallery feature owns the illustrative values and range selector.

Browser adapters use namespaced storage keys and report failures instead of
throwing into rendering. The records adapter validates JSON at the integration
boundary. The shell never knows where records or preferences came from.
