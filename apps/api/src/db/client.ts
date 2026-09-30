import { mkdirSync } from 'node:fs';

import pg from 'pg';

import { schemaStatements } from './schema';

type Row = Record<string, unknown>;

/** The small slice of a Postgres client the API needs, shared by pg and PGlite. */
type Driver = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: Row[] }>;
  close: () => Promise<void>;
};

let driver: Driver | null = null;

function sslFor(url: string): pg.ConnectionConfig['ssl'] {
  if (/localhost|127\.0\.0\.1|railway\.internal/.test(url)) return undefined;
  if (url.includes('sslmode=disable')) return undefined;
  if (url.includes('sslmode=require') || url.includes('rlwy.net')) {
    return { rejectUnauthorized: false };
  }
  return undefined;
}

export type OpenDbOptions = {
  /** Postgres URL. When absent, PGlite is used instead. */
  databaseUrl?: string | undefined;
  /** PGlite data directory; omit it (or pass `memory://`) for an in-memory database. */
  pgliteDir?: string | undefined;
};

/** Opens the database and creates any missing tables. */
export async function openDb(options: OpenDbOptions): Promise<void> {
  if (options.databaseUrl) {
    const pool = new pg.Pool({
      connectionString: options.databaseUrl,
      ssl: sslFor(options.databaseUrl),
    });
    driver = {
      query: async (text, params) => pool.query(text, params),
      close: async () => pool.end(),
    };
  } else {
    if (options.pgliteDir && !options.pgliteDir.includes('://')) {
      mkdirSync(options.pgliteDir, { recursive: true });
    }
    const { PGlite } = await import('@electric-sql/pglite');
    const lite = new PGlite(options.pgliteDir);
    driver = {
      query: async (text, params) => lite.query<Row>(text, params),
      close: async () => lite.close(),
    };
  }

  for (const statement of schemaStatements) {
    await driver.query(statement);
  }
}

export async function query<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  if (!driver) {
    throw new Error('Database is not open.');
  }
  const result = await driver.query(text, params);
  return result.rows as T[];
}

export async function closeDb(): Promise<void> {
  await driver?.close();
  driver = null;
}
