# Controls and quality expansion

This scope and ownership plan precedes implementation. It extends the reusable
UI layer and demonstrates behavior through existing features.

## Scope

- Controlled table sorting, row selection and column visibility; demonstrate in
  Records with selection across pages and explicit clearing on filter changes.
- Searchable single selection (combobox) and multiple selection with removable tags.
- Native date and date-range inputs, with explicit values and validation ownership.
- File selection/drop area, validation, selected-file list, removal and progress
  supplied by the caller. No automatic uploads or file-content reads.
- Chromium, Firefox and WebKit behavior checks; axe accessibility checks; visual
  regression baselines for both appearances; long-text, many-option, enlarged-text
  and constrained-layout tests; a manual assistive-technology review where available.

## Ownership

Shared UI receives typed values, callbacks and slots. DataTable never sorts or
loads records: its sort state/callback and selection interface describe controls.
The records feature owns comparisons, visible column IDs, selected row IDs and
page resets. Selection applies only to the current dataset; filter changes clear
it and refreshes reconcile missing IDs. A header checkbox selects eligible rows
on the current page and communicates a mixed state.

Selection controls share a private keyboard/listbox controller and popup markup.
Public Combobox and MultiSelect keep distinct typed value/callback interfaces.
Options are provided by the caller; filtering is local, with no hidden request or
storage. Disabled options cannot be committed; empty results and clearing are
explicit. Focus stays in the input with an active descendant.

Date controls compose Field and native date inputs. They use ISO date-only strings
and never convert through time zones. File selection validates only caller-supplied
type/count/size constraints, returns File objects, and does not read their contents.
The gallery owns selected files, messages, dates and illustrative progress; real
uploading belongs to a future injected integration.

The gallery gets separate selection, date and file example modules in one tab. Theme tokens remain
the source of colors, dimensions and interaction styles. There is no runtime plugin
system or new production dependency.

## Quality approach

Add axe only as a development dependency for browser accessibility assertions.
Use Playwright's existing screenshot comparison support. Baselines must be generated
and compared on the same OS/browser environment; never bless new images in normal CI.
Document the baseline update command and review policy. Keep behavior tests across
engines independent of platform-specific pixels.

Automated checks complement manual review. Record actual browser/screen-reader
coverage and any environment limits; an accessibility-tree inspection must not be
reported as a screen-reader session.
