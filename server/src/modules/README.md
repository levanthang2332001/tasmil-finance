# Target server structure

This PR applies initial server folder structure for gradual migration:

- `modules/` (auth, dashboard, community, wallet)
- `common/` (decorators, filters, interceptors, pipes, guards)
- `infra/` (redis, supabase, http)
- `config/` (`env.schema.ts`, `app.config.ts`)

Existing runtime code remains intact; migration is incremental.
