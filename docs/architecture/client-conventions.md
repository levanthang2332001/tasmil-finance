# Client Architecture Conventions

## Goals

- Improve maintainability with clear boundaries.
- Reduce duplication and route-level complexity.
- Make feature ownership obvious.

## Layers

- `app/`: routing, layout, loading/error boundaries, page composition.
- `features/`: domain logic (dashboard/community/portfolio/...)
- `components/ui/`: pure reusable UI primitives.
- `lib/`: framework glue (query client, HTTP client, helpers).

## Rules

1. Avoid domain/business logic in `app/*` route files.
2. Keep API/data mapping close to owning feature.
3. Prefer small feature-local files over global `utils.ts` growth.
4. Introduce unit tests for feature utils/hooks; keep e2e at user-flow level.

## Migration Strategy

- Move one feature at a time.
- Keep behavior unchanged in refactor PRs.
- Add short note in PR body: scope, no-functional-change.
