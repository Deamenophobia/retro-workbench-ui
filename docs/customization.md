# Customization and extension

## Branding and navigation

Edit `src/app/config.ts` for the product name, text mark, version, home URL, and page
links. Also update the static title and description in `index.html` for the initial
document. Change labels, icons, or ordering in `src/app/pages.tsx`. The shell renders
that registry; it does not contain a switch statement for each page.

Menus are explicit arrays of links or callback actions in `src/app/App.tsx`.
Shared `Menu` supports either `{ label, href }` or
`{ label, onSelect, disabled? }`. Use links for navigation and callbacks for actions.
The shell's appearance, menus, sidebar notes, content, and footer are composition
slots. Route IDs are stable identifiers; if you rename one, update its links and any
saved-start-page schema that refers to it. Labels can change independently.

## Add a page

1. Create `src/features/notes/index.tsx`:

   ```tsx
   import { PageHeading, Panel } from "../../shared/ui";

   export function NotesPage() {
     return (
       <>
         <PageHeading
           eyebrow="Workspace / Notes"
           title="Notes"
           description="A home for small ideas."
         />
         <div className="page-body">
           <Panel title="First note">Your content goes here.</Panel>
         </div>
       </>
     );
   }
   ```

2. Import `NotesPage` from `../features/notes` in `src/app/pages.tsx` and append:

   ```tsx
   { id: "notes", label: "Notes", icon: "≡", href: "#/notes", render: () => <NotesPage /> }
   ```

3. Run `npm run format` and `npm run check`. Open `#/notes`, then use the sidebar,
   browser Back/Forward, and both appearances. Add behavioral tests if the page has
   interactions. No shell, router, or existing feature changes are required.

The included `features/guide/index.tsx` follows this exact pattern. It was added
through the registry with no Guide branches in the shell or navigation. A browser
test verifies its link, view, active state, and history behavior. Remove its registry
entry and overview/menu links if you do not want it in your adapted application.

Features may import shared UI, contracts, and their own files. Never import another
feature, even its public entry point. Compose features through the application or
extract a genuinely shared contract. Add feature-specific CSS beside its feature;
use semantic tokens and keep it scoped to that feature's classes.

## Add or adjust an appearance

`tokens.css` owns scale tokens; `classic.css` and `studio.css` assign semantic
palette values. Shared component styles consume variables and contain no theme
selectors. There are no duplicate theme-specific component trees.

To add an appearance:

1. Copy the complete semantic token set into `src/themes/paper.css`, scoped to
   `:root[data-theme="paper"]`. Set `color-scheme` and override the font/radius if
   needed. Define every palette token; do not rely on accidental Classic fallbacks.
2. Add `paper: { label: "Paper", chromeColor: "#..." }` to `themes.ts`.
3. Import the stylesheet after Classic in `src/main.tsx`.
4. Verify control states, text contrast, focus, menu surfaces, tables, and notices.
   Extend the browser appearance matrix to include the new ID.

The selector derives its options from the registry and `resolveTheme` validates
saved IDs against that registry. Unknown preferences fall back to Classic. The
browser adapter owns storage and document attributes. Changing appearance does not
remount the page, so form drafts and filters stay intact.

## Connect a data source

`RecordsSource` in `src/contracts/records.ts` defines
`list(query, signal): Promise<readonly WorkRecord[]>`. The feature only knows this
interface. The sample implementation fetches `public/demo-records.json`, validates
the response and unique IDs, then filters the small collection locally.

For an API, implement that interface in `src/integrations/apiRecords.ts`. Pass the
provided AbortSignal to `fetch`, check the HTTP status, validate the response, and
return the contract's shape. Do not trust a TypeScript cast to validate network
data. Perform server-side search/pagination for large collections rather than
downloading everything. Compose the new adapter in `src/main.tsx` and pass it to
`App`; do not change the table or import the adapter from a feature.

Keep credentials on the server. Vite variables and every asset in `public/` are
shipped to the browser. Authentication, permissions, API caching, and pagination
are application-specific work, not hidden services in this starter.

`useRecords` aborts obsolete requests and ignores results after cleanup even when
an adapter ignores cancellation. Keep this guard when replacing the adapter. The
loading, error/retry, and empty paths use the same shared state components.

`SettingsStore` is deliberately synchronous because its implementation is browser
storage. For remote saving, change that explicit contract to a Promise, add a
pending/disabled state and cancellation ownership to the settings feature, and
test failure and stale-result handling. Do not disguise asynchronous persistence
as a synchronous boolean. Give your adapted application its own versioned storage
keys in `integrations/appearance.ts` and `integrations/settings.ts`.

## Interaction and scope

Main content scrolls independently. Sidebar navigation remains visible at narrow
widths; wide tables have their own focusable horizontal scroll region. The compact
layout is intended for workbench use and is tested at 390px and desktop width.
Native form controls, visible focus outlines, semantic landmarks, route-heading
focus, and a skip link provide keyboard access. Disclosure menus intentionally use
normal Tab navigation rather than claiming an ARIA application-menu role.

Page-local filters and unsaved form drafts reset when leaving their page. Appearance
changes and settings tabs preserve the current draft. Saved settings survive
reloads. There is no cross-tab synchronization, authentication, SSR, virtualization,
or offline service worker. Test additional browsers and assistive technologies for
your application's supported environments.
