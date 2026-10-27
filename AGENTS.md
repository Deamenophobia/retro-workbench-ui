# Contributor guidance

- Read `docs/architecture.md` before changing ownership or dependencies.
- Keep shared UI independent of features, application state, contracts and browser
  persistence. Keep features independent of each other and inject integrations.
- Add pages through `src/app/pages.tsx`; expose features through `index.ts(x)`.
- Put semantic tokens in `src/themes`; both appearances share component behavior.
- Keep state local to its owner. Prefer typed props, callbacks and composition.
- Do not introduce a canvas engine, runtime plugin system, worker or global state
  library without a concrete application requirement.
- Preserve native semantics, keyboard behavior, focus, state feedback and internal
  scrolling. Keep stale-response protection when changing data adapters.
- Run `npm run format` then `npm run check` before committing. Inspect screenshots
  and browser behavior for appearance or interaction changes.
- Keep changes proportionate and document new dependencies and extension points.
