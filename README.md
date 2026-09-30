# SaleRadar

SaleRadar helps shoppers follow the stores they care about and receive meaningful alerts when sales start or discounts get better.

The first release is an Armenia-focused web MVP with a mocked HTTP API. The architecture is country-agnostic so later expansion to Georgia, Kazakhstan, UAE, Europe, and beyond stays straightforward.

## Architecture summary

- **Monorepo** with `pnpm` workspaces
- **`apps/web`** — React + Vite consumer web app
- **`packages/contracts`** — shared Zod schemas and domain types for web, future extension, and future API
- **TanStack Query** owns server/async state
- **URL search params** own shareable UI filters
- **Local React state** owns ephemeral UI only
- **MSW** mocks the same HTTP API a real backend will eventually expose
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
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:unit
pnpm test:component
pnpm test:e2e
```

Install Playwright Chromium once after install if needed:

```bash
pnpm --filter @saleradar/web test:install
```

## Mock API

Set in `.env` / `.env.example`:

```text
VITE_API_BASE_URL=/api
VITE_USE_MOCK_API=true
```

When `VITE_USE_MOCK_API=true`, the web app boots MSW and serves a realistic Armenia store dataset over HTTP. Components never import mock arrays directly and never call `fetch` themselves.

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
apps/extension   ← Chrome companion later
apps/api         ← real backend later
packages/contracts
```

Intentionally deferred: scraping, real auth, payments, push/Telegram notifications, affiliate flows, dark theme switcher, full i18n, and charts.
