# Client Feature Structure (Gradual Migration)

This folder is reserved for **feature-first modules**.

Target structure for each feature:

```txt
src/features/<feature>/
  components/
  hooks/
  services/
  types/
  utils/
```

## Conventions

- Keep route composition in `src/app/*`.
- Move business logic into `src/features/*`.
- Keep `src/components/ui/*` generic (no domain logic).
- Keep reusable app-shell elements in `src/components/layout/*` (or existing admin-panel).

## Import Guidance

- `app/*` can import from `features/*` and shared UI.
- `features/*` should avoid importing from route files in `app/*`.
- Prefer local feature types/helpers over cross-feature coupling.

This is a **non-breaking foundation** file to guide incremental refactors.
