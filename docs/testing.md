# Testing and visual baselines

Run `npm run format` then `npm run check`. The latter runs formatting, strict
TypeScript, dependency directions/cycles, unit behavior, production build and
Playwright against that build on port 5191. Install browsers with
`npx playwright install chromium firefox webkit` (`--with-deps` on Linux).

## Coverage

- Chromium 1280 × 800 and 390 × 844, Firefox and WebKit run the same behavior suite.
- Axe checks WCAG 2 A/AA, 2.1 A/AA and 2.2 AA rules on all pages, gallery tabs,
  an open listbox and modal in both appearances. No rule exclusions are configured.
- Stress checks exercise a 180-character unbroken record at 320px, doubled type
  tokens at 390px, and keyboard navigation through 250 choices. Tables retain
  their own horizontal scroll; the document and main content must not overflow.
- The dedicated Chromium `visual` project compares fourteen screenshots: records,
  collections, open choices, dates, file progress, modal and narrow inputs in each appearance.

Axe and keyboard tests cannot establish screen-reader usability or complete WCAG
conformance. Test target assistive technologies and physical touch devices when
adapting this starter. Token enlargement is a text-reflow stress test, not an OS
magnifier or browser-zoom certification. See [actual results and limits](validation.md).

## Review screenshot changes

Expected images live in `tests/visual-baselines/{platform}`. Windows references
are `win32`; GitLab's Node 22 Debian Bookworm environment uses `linux`. Different
fonts and native controls make cross-OS comparisons inappropriate. Use the pinned
Playwright version and installed browsers from the lockfile.

```sh
npm run build
npx playwright test --project=visual
# Only after an intentional appearance change:
npx playwright test --project=visual --update-snapshots
```

Inspect every changed image before committing it. Normal CI never accepts new
baselines automatically. Missing images and visual differences fail verification.
For Linux updates without a local Linux environment, start an explicit GitLab
pipeline and explicitly run its manual `capture-visual-baselines` job. It exports
references as artifacts. Download, review and commit the Linux images, then require a normal
pipeline to pass. Update Windows references separately. Other OS baselines are
not bundled; capture and review them in that environment before running visuals.

Animations and carets are suppressed only for deterministic screenshots; behavioral
tests remain separate. The comparison permits 0.2% differing pixels for minor
rasterization variation. CI retains build output, traces, screenshots, HTML and
JUnit reports for seven days. A capture job is not evidence of a passing comparison.

If a downloaded browser fails to launch, reinstall it first. Report environment
failures separately from application failures; never silently skip a browser or
weaken assertions to obtain a green result.
