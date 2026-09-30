import { serve } from '@hono/node-server';

import { createAppFromConfig } from './app';
import { config } from './config';
import { closeDb, openDb, seedCatalog } from './db';

await openDb({ databaseUrl: config.databaseUrl, pgliteDir: config.pgliteDir });
await seedCatalog();

const app = createAppFromConfig();
const server = serve({ fetch: app.fetch, port: config.port, hostname: config.host }, (info) => {
  const database = config.databaseUrl ? 'Postgres' : `PGlite (${config.pgliteDir})`;
  console.log(`SaleRadar API on http://${config.host}:${info.port} using ${database}`);
});

async function shutdown(): Promise<void> {
  server.close();
  await closeDb();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
