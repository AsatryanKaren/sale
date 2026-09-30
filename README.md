# SaleRadar

SaleRadar helps shoppers follow the stores they care about and receive meaningful alerts when sales start or discounts get better.

The first release is an Armenia-focused web MVP with its own API and Postgres database, deployable to Railway as one service. The architecture is country-agnostic so later expansion to Georgia, Kazakhstan, UAE, Europe, and beyond stays straightforward.

## Architecture summary

- **Monorepo** with `pnpm` workspaces
- **`apps/web`** — React + Vite consumer web app
- **`apps/api`** — Hono API on Node with Postgres (PGlite locally), cookie sessions, and the trial/plan rules; in production it also serves the built web app
- **`packages/contracts`** — shared Zod schemas and domain types used by both the web app and the API
- **TanStack Query** owns server/async state
- **URL search params** own shareable UI filters
- **Local React state** owns ephemeral UI only
- **MSW** mocks the same HTTP API for UI-only work (`pnpm dev:mock`)
- **Ant Design** provides the UI foundation, themed through centralized brand tokens
- **Geist** (self-hosted via `@fontsource-variable/geist`) is the type family
- Routes are **lazy-loaded** per page

Dependency direction (Feature-Sliced Design, enforced by ESLint `no-restricted-imports`):

```text
app → pages → widgets → features → entities → shared
```

- `widgets` compose features and entities into reusable blocks (for example `StoreCard`)
- `features` are user actions (follow, configure alert, mark read)
- `entities` are domain models, API hooks and presentational pieces with no user actions

See [`apps/web/DESIGN.md`](apps/web/DESIGN.md) for the visual system.

## Folder structure

```text
/
├─ apps/
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ db/          (schema, seed catalog, pg/PGlite client)
│  │  │  ├─ http/        (security middleware, static web serving)
│  │  │  └─ modules/     (auth, billing, catalog, following, notifications)
│  │  └─ tests/
│  └─ web/
│     ├─ src/
│     │  ├─ app/
│     │  ├─ pages/
│     │  ├─ widgets/
│     │  ├─ features/
│     │  ├─ entities/
│     │  └─ shared/
│     ├─ tests/
│     │  ├─ unit/
│     │  ├─ component/
│     │  └─ e2e/
│     └─ playwright/
├─ packages/
│  └─ contracts/
├─ Dockerfile
├─ railway.json
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ eslint.config.mjs
├─ prettier.config.mjs
└─ README.md
```

## Requirements

- Node.js 22+
- pnpm 10+

## Commands

From the repository root:

```bash
pnpm install
pnpm dev            # API on :8787 + web on :5173, real database
pnpm dev:mock       # web only, on the MSW mock API
pnpm build
pnpm start          # production server: API + built web app
pnpm lint
pnpm typecheck
pnpm test           # API tests, then web unit, component and e2e
pnpm test:api
pnpm test:unit
pnpm test:component
pnpm test:e2e       # e2e on the mock API
pnpm test:e2e:api   # e2e on the real API (in-memory database)
```

`pnpm dev` needs no database setup: without `DATABASE_URL` the API stores data in `apps/api/.data` using PGlite (Postgres compiled to WebAssembly). Delete that folder to start fresh.

Install Playwright Chromium once after install if needed:

```bash
pnpm --filter @saleradar/web test:install
```

## Backend

`apps/api` follows the same shape as the August project: Hono on `@hono/node-server`, run with `tsx`.

- **Database**: `pg` when `DATABASE_URL` is set, otherwise PGlite. Tables are created on boot (`src/db/schema.ts`) and the store catalog is seeded with `ON CONFLICT DO NOTHING` (`src/db/catalog.ts`), so a new store added there appears on the next deploy.
- **Auth**: bcrypt password hashes and a random 32-byte session id in an httpOnly, SameSite=Lax cookie (`saleradar_session`, 14 days).
- **Security**: secure headers, a 64 KB body limit, cross-origin writes blocked, and sign-in/sign-up rate limited per IP.
- **Access**: `/api/stores`, `/api/following` and `/api/notifications` answer `401` without a session and `402` once the trial or plan has ended.
- **Alerts**: following a store that is already on sale creates a notification straight away. An automatic sale checker is not built yet.
- Environment variables are listed in [`apps/api/.env.example`](apps/api/.env.example).

## Deploying to Railway

1. In Railway, create a project from this GitHub repository. It builds with the root `Dockerfile` (see `railway.json`).
2. Add a **Postgres** service and, on the app service, set `DATABASE_URL` to `${{Postgres.DATABASE_URL}}`.
3. Generate a public domain for the app service. Railway provides `PORT`; the health check is `/api/health`.

The one service serves both the API and the web app, so no CORS setup is needed. `DEMO_TOOLS` is off in production, and so is simulated checkout (`SIMULATED_PAYMENTS`): until a payment provider is connected, production answers checkout with "Payments are not available yet" so nobody gets a paid plan for free.

## Mock API

The web app picks its API by Vite mode: `pnpm dev:mock` uses `apps/web/.env.example` defaults (mock on), `pnpm dev` runs Vite with `--mode api` (`.env.api`), and production builds use `.env.production`. Both turn the mock off.

```text
VITE_API_BASE_URL=/api
VITE_USE_MOCK_API=true
```

When `VITE_USE_MOCK_API=true`, the web app boots MSW and serves a realistic Armenia store dataset over HTTP. Components never import mock arrays directly and never call `fetch` themselves.

## Accounts, trial and plans

- Everyone signs up with name, email and password and gets a **1-day free trial** (`TRIAL_DURATION_HOURS` in `packages/contracts`).
- After the trial, the app routes redirect to `/pricing` until a plan is bought. The API and the mock both enforce the same rule (they answer `402`).
- Plans and prices live in `PLAN_CATALOG` in `packages/contracts`. They are fixed separately in AMD and USD: Monthly is 1,200 ֏ / $3 and Annual is 11,500 ֏ / $29.
- Checkout is **simulated**: no payment provider is connected yet.
- In local development, **Settings → End trial** skips the 24-hour wait so you can try the paywall (`POST /api/dev/expire-trial`, off in production). Mock accounts are kept in `localStorage` (`saleradar.mock-auth`).

## Architecture rules

- No Redux / Zustand / other global client stores
- No `any`, non-null assertions, or `@ts-ignore`
- `index.ts` files are public API barrels only
- Query keys come from factories
- Mutations invalidate/update query caches explicitly
- Brand colors live in `app/theme/brandTokens.ts` only; CSS modules read them as `--sr-*` variables
- Layers only import downward (see dependency direction above)
- Country configuration stays centralized (`countryCode`, not Armenia hardcoding)

## Future applications planned

```text
apps/web         ← current
apps/api         ← current
apps/extension   ← Chrome companion later
packages/contracts
```

Intentionally deferred: the automatic sale checker (scraping), a real payment provider, push/Telegram notifications, affiliate flows, dark theme switcher, full i18n, and charts.
