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

## Collections and controls

`DataTable` additionally accepts controlled `sorting` and `selection`. It emits
changes without sorting or loading rows. `ColumnVisibility` controls visible IDs.
`Checkbox` supports a native `indeterminate` state for partial page selection.
See [table and input recipes](input-recipes.md) for ownership and examples.

| Input                    | Responsibility                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `Combobox`               | Controlled scalar selection, local search, keyboard navigation and clear.                                        |
| `MultiSelect`            | Controlled string array, shared search/listbox behavior and removable tags.                                      |
| `DateInput`, `DateRange` | Native date editing with ISO date-only values, bounds and caller-supplied validation.                            |
| `FilePicker`             | File choice/drop, caller-supplied type/size/count rules, removal and supplied progress; no reading or uploading. |

| Component            | Responsibility and interface                                                                                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Card`               | Named section with `title`, optional `description`, `media`, `actions`, `footer`, and arbitrary children. `Panel` is the same implementation under its original name.                                                        |
| `List`, `ListItem`   | Labeled semantic list; each item composes `leading`, children, `meta`, and `actions`. No automatic selection or click handling.                                                                                              |
| `Avatar`             | Named image or initials fallback. An image error falls back to initials; a changed source can be tried again. No profile or user-data knowledge.                                                                             |
| `Pagination`         | Controlled page, size, total, page callback and optional page-size control. Named navigation, bounded page-number window, ellipses, current-page semantics, result range and disabled controls.                              |
| `getPagination`      | Pure one-based page normalization. Returns safe page/count and exclusive slice indexes; it never slices or loads data.                                                                                                       |
| `Checkbox`, `Switch` | Native checkbox semantics, label/help association and optional `onCheckedChange`. Switch uses `role="switch"`. Supports normal native props including name, checked/defaultChecked, disabled, required and form association. |
| `RadioGroup`         | Controlled typed string value, native fieldset/legend, named radios, disabled options/group and native arrow-key selection.                                                                                                  |
| `Breadcrumbs`        | Labeled navigation with ordered items and current-page semantics. Route values belong to the caller.                                                                                                                         |
| `Accordion`          | Native details/summary sections with stable item IDs; independently expandable with keyboard support.                                                                                                                        |
| `Dialog`, `Drawer`   | Controlled `open`/`onClose`, title, optional description/actions/initialFocus and arbitrary content. Same native modal lifecycle, different placement.                                                                       |
| `Popover`            | Labeled button and nonmodal content surface. Uses native light dismissal, Escape and focus order; stays within the viewport on scrolling/resizing.                                                                           |
| `Tooltip`            | Supplemental plain text shown on hover or focus, hoverable itself, dismissed with Escape. Render prop supplies `aria-describedby` to one focusable child.                                                                    |
| `Skeleton`           | Decorative placeholder lines. The caller supplies the busy region and loading announcement. No animation or timer.                                                                                                           |
| `Progress`           | Labeled native progress; omit value for an indeterminate state. Numeric values are clamped to the supplied maximum.                                                                                                          |
| `Toast`              | One controlled message `{ id, text, tone? }` or null, and `onDismiss`. Persistent live regions announce success/info politely and errors urgently. No queue or auto-dismiss timer.                                           |

`Menu` works in both the header and content areas. Its native disclosure uses
ordinary Tab order, not ARIA application-menu arrow keys. A disabled action can be
`{ label, disabled: true }` without a meaningless callback.

The Components gallery demonstrates the APIs through focused example modules in five tabs.
Its saved-resource set is shared only by the collection cards and list that use it.
The form, overlay preview and feedback preview each own their own state. Tabs keep
examples mounted so drafts survive tab and appearance changes; leaving the page
resets them. Gallery actions change only the current preview.

See [UI recipes](ui-recipes.md) for composition and extension examples.

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
