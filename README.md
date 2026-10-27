# Retro Workbench UI

A standalone React + TypeScript starter based on Streamweave's **Classic · Retro**
interface: charcoal header, light workspace, blue links, compact controls, square
panels, persistent sidebar, top menus, and separate content views.

**Classic is the default.** Studio · Original is an optional dark appearance. The
selector saves a browser preference, applied before React mounts. Both appearances
use exactly the same components and behavior.

## Start developing

Requires Node.js **22.12 or newer** and npm.

```sh
git clone git@gitlab.com:Deamenophobia/retro-workbench-ui.git
cd retro-workbench-ui
npm ci
npm run dev
```

Open <http://127.0.0.1:5190>. This is a private repository; cloning requires access.
On Windows, use `npm.cmd` if PowerShell's execution policy blocks `npm.ps1`.

```sh
npm run build
npm run preview
```

The production output is `dist/`. Serve that directory with a static web server;
opening `index.html` directly as a file is not supported. Relative assets and hash
routes support hosting at a subdirectory without server-side route rewrites.
No backend, secrets, or environment variables are required.

## What's included

- Configurable shell, branding, page registry, navigation, and disclosure menus.
- Page headings, panels, toolbars, buttons, labeled fields, typed tables, keyboard
  tabs, notices, badges, and loading/empty/error states.
- Overview, a searchable fictional records directory, saved workspace settings,
  and a Guide page demonstrating the documented extension point.
- Semantic theme tokens separated from component styles and page behavior.
- A chart gallery with reusable SVG line, bar, and donut charts, interactive line
  legends, keyboard point inspection, and accessible data tables. No chart library.
- Explicit integration interfaces for records and browser settings.
- Enforced dependency directions, cycle detection, strict types, behavioral tests,
  and GitLab CI testing the production build at desktop and narrow widths.

The only runtime packages are **React and React DOM**. There is no React Flow,
canvas engine, analytics core, worker, trading logic, or Streamweave dataset.

## Customize and extend

| Change                                 | Start here                                          |
| -------------------------------------- | --------------------------------------------------- |
| Product name, mark, version, home link | `src/app/config.ts`                                 |
| Sidebar labels, ordering, icons, pages | `src/app/pages.tsx`                                 |
| Top menus and shell composition        | `src/app/App.tsx`                                   |
| Colors and appearance metadata         | `src/themes/classic.css`, `studio.css`, `themes.ts` |
| Type, spacing, borders, control sizing | `src/themes/tokens.css`                             |
| Shared components                      | `src/shared/ui/index.ts`                            |
| Records adapter                        | `src/integrations/demoRecords.ts`                   |
| Settings persistence                   | `src/integrations/settings.ts`                      |

Read [architecture and ownership](docs/architecture.md), the
[customization guide](docs/customization.md), and the
[component reference](docs/components.md) before extending the starter.
For chart props and limits, see [charts and graphs](docs/charts.md).

## Verify

Install the test browser once (on Linux use `--with-deps`):

```sh
npx playwright install chromium
npm run format
npm run check
```

`check` runs formatting, strict types, dependency/cycle checks, unit tests,
production build, and Playwright tests against that build. Individual commands are
`format:check`, `typecheck`, `check:boundaries`, `test`, `build`, and `test:e2e`.
Browser tests use port 5191; leave it free. HTML reports, traces on failure, and
screenshots are written to ignored `playwright-report/` and `test-results/`.

GitLab CI installs Chromium and its Linux dependencies and runs the same command.
Its artifacts retain build output, screenshots, traces, and JUnit results for seven
days. See [validation evidence](docs/validation.md) for the checks actually run.

## Provenance and scope

The visual reference is Streamweave commit
`8d813c1b64e96405a2b9fcbe8425a54f167b5e87`. Its colors, dimensions, visual
hierarchy, disclosure-menu pattern, and appearance fallback behavior were adapted.
Components were rewritten around domain-free interfaces; the original repository
is not a dependency and was left unchanged. See the ownership document for the
exclusion list and deliberate limits.

Tooling follows the source's Vite, TypeScript, Prettier, and tsx stack. Two additional
development tools have specific jobs: Playwright tests real browser behavior and
captures layout evidence; Babel's parser gives the boundary checker actual
TypeScript/JSX syntax trees rather than fragile text matching. Neither ships to
the browser. Versions and transitive dependencies are locked in `package-lock.json`.
