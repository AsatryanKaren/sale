/**
 * Tables are created on boot with IF NOT EXISTS, so a fresh Railway Postgres or
 * a local PGlite file needs no separate migration step. Add new columns with
 * `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` at the end of this list.
 */
export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id text PRIMARY KEY,
    user_id text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS sessions_user_id ON sessions (user_id)`,
  `CREATE TABLE IF NOT EXISTS subscriptions (
    user_id text PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    status text NOT NULL,
    plan text,
    trial_ends_at timestamptz NOT NULL,
    current_period_end timestamptz,
    cancel_at_period_end boolean NOT NULL DEFAULT false
  )`,
  `CREATE TABLE IF NOT EXISTS plans (
    id text PRIMARY KEY,
    name text NOT NULL,
    interval text NOT NULL,
    price_amd integer NOT NULL,
    price_usd_cents integer NOT NULL,
    sort integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true
  )`,
  `CREATE TABLE IF NOT EXISTS stores (
    id text PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    website_url text NOT NULL,
    logo_url text,
    country_code text NOT NULL,
    category text NOT NULL,
    is_active boolean NOT NULL DEFAULT true
  )`,
  `CREATE TABLE IF NOT EXISTS sales (
    id text PRIMARY KEY,
    store_id text NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
    title text NOT NULL,
    kind text NOT NULL,
    status text NOT NULL,
    min_discount_percent integer,
    max_discount_percent integer,
    started_at timestamptz NOT NULL,
    ends_at timestamptz,
    source_url text,
    updated_at timestamptz NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS sales_store_status ON sales (store_id, status)`,
  `CREATE TABLE IF NOT EXISTS sale_history (
    id text PRIMARY KEY,
    store_id text NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
    sale_id text NOT NULL REFERENCES sales (id) ON DELETE CASCADE,
    type text NOT NULL,
    max_discount_percent integer,
    occurred_at timestamptz NOT NULL,
    label text NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS sale_history_store ON sale_history (store_id, occurred_at DESC)`,
  `CREATE TABLE IF NOT EXISTS watches (
    id text PRIMARY KEY,
    user_id text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    store_id text NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
    minimum_discount_percent integer,
    notify_on_sale_start boolean NOT NULL,
    notify_on_discount_increase boolean NOT NULL,
    notify_on_new_sale_items boolean NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, store_id)
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id text PRIMARY KEY,
    user_id text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    store_id text NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    read_at timestamptz
  )`,
  `CREATE INDEX IF NOT EXISTS notifications_user ON notifications (user_id, created_at DESC)`,
];
