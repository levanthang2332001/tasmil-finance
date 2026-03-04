# Playwright E2E (Real API)

These tests are designed to run against the **real backend API** (no request mocking).

## Required env

Create `.env.local` (or export in CI) for the client app:

- `NEXT_PUBLIC_API_URL=<your-real-backend-base-url>`

Example:

```bash
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## Run

```bash
npm run test:e2e
```

Run with UI mode:

```bash
npm run test:e2e:ui
```

Install browser binaries (first run):

```bash
npx playwright install
```
