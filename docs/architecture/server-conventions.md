# Server Architecture Conventions

## Goals

- Consistent request parsing and validation.
- Domain-oriented modules with explicit boundaries.
- Easier onboarding and safer refactors.

## Recommended Boundaries

- `modules/*`: domain controllers/services/dto/types.
- `infra/*`: external systems (redis, supabase, http clients).
- `common/*`: shared guards/pipes/filters/interceptors only.

## Coding Rules

1. Parse and normalize query params via domain helpers.
2. Avoid inline string parsing/casting repeated across controllers.
3. Keep response mapping in dedicated mappers/types where needed.
4. Refactor-only PRs should preserve endpoint behavior.

## Testing Direction

- Unit tests for domain service/helper logic.
- Integration tests for core module endpoints.
