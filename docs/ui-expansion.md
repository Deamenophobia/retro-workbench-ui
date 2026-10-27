# UI expansion scope

Ownership and interfaces were defined before this expansion was implemented.
The aim is a coherent workbench component set, not an application framework.

## Delivery checklist

All items below are implemented. See `validation.md` for the recorded checks and
`ui-recipes.md` for usage examples and limitations.

- Collections: composable Card, List/ListItem, Avatar, and controlled Pagination.
- Forms: Checkbox, RadioGroup, and Switch using native inputs and fieldsets.
  Existing Field + input/select/textarea remain the text-entry API.
- Navigation: Breadcrumbs, native Accordion, and the existing Menu styled for
  page content as well as the header.
- Overlays: controlled Dialog and Drawer sharing native modal behavior; native
  Popover for nonmodal content; Tooltip for supplemental text only.
- Feedback: Skeleton, native Progress, and a controlled dismissible Toast.
- Demonstrations: a registered Components page with separate collection, form,
  navigation/overlay, and feedback examples; real pagination in Records.
- Verification: interaction/failure tests, both appearances, narrow layouts,
  formatting, strict types, boundaries/cycles, production build, and CI.

## Responsibilities and dependency direction

`shared/ui` owns semantic markup, keyboard/focus handling and component styling.
It takes typed props, explicit callbacks and composition slots. It does not load
data, know routes, save browser preferences, or import feature code. Keep each
component's API focused: cards and lists have content slots, not a switch for
every possible business use. Panel can reuse Card's surface and heading structure.

`features/components` owns the gallery's small fictional fixtures and local
example state. Each example group is a separate module; the page only composes
them. It imports public shared UI exports. No existing feature imports the gallery.
App composition registers the page and supplies navigation destinations.

`features/records` owns filtering, page number, page size, and slicing its small
loaded collection. Pagination only renders controls and calls its callbacks. It
must also be usable with externally paged data; it never slices or fetches rows.
Changing a filter or page size resets the feature's page. A shrinking result set
clamps the displayed page. Existing request cancellation remains intact.

Themes own every new palette value and shared size token. Shared CSS consumes
tokens and never selects an appearance. Existing boundary and cycle checks apply
to every new source module; no runtime dependency is planned.

## Interaction contract

- Lists are semantic lists, not pretend listboxes. Selection uses real checkboxes
  or buttons supplied by the caller. Cards never wrap nested actions in a link.
- Pagination uses labeled buttons and `aria-current`; zero results, a final partial
  page, disabled controls, page-size changes, and compact page ranges are covered.
- Modals use native dialog focus containment, Escape, labeled headings, explicit
  dismissal, and focus restoration. Drawer is a placement of that same behavior.
- Popovers use the platform's nonmodal dismissal. Tooltips also appear on focus,
  dismiss with Escape, and contain no interactive or essential content.
- Toasts are feature-owned messages with explicit dismissal and no forced timer.
  Progress is labeled; skeletons are decorative inside an announced busy region.
- Examples demonstrate loading, empty, error, validation, and disabled paths.

## Deliberate limits

No server paging adapter, authentication, data cache, editor, drag-and-drop,
virtualization, notification store, runtime plugin system, or canvas engine.
Demo constants are illustrative content, not global component assumptions.
Native dialog and popover require modern browsers. Automated coverage is Chromium;
other browser engines and assistive-technology testing remain adoption work.
