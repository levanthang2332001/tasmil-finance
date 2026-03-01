# Server Module Structure (Target)

This directory documents the target domain-first NestJS module layout.

```txt
src/
  modules/
    <domain>/
      <domain>.controller.ts
      <domain>.service.ts
      dto/
      types/
      mapper/
      guards/ (if domain-specific)
```

## Conventions

- Keep controllers thin (HTTP only).
- Keep business logic in services.
- Keep DTOs and parsing helpers near owning domain.
- Use `common/*` only for truly cross-cutting concerns.

## Migration

Current code can be migrated incrementally without breaking API contracts.
