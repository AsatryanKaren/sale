import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, devices } from '@playwright/test';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** `pnpm test:e2e:api` runs the e2e suite against the real API instead of the mock. */
const useRealApi = process.env.E2E_API === '1';
const API_PORT = '8799';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'unit',
      testMatch: /tests\/unit\/.*\.spec\.ts/,
    },
    {
      name: 'component',
      testMatch: /tests\/component\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:5173/playwright/gallery.html',
      },
      dependencies: [],
    },
    {
      name: 'e2e',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:5173',
      },
    },
  ],
  webServer: useRealApi
    ? [
        {
          // A fresh in-memory database per run, so accounts never collide.
          command: 'pnpm --filter @saleradar/api start',
          cwd: rootDir,
          url: `http://127.0.0.1:${API_PORT}/api/health`,
          env: {
            PORT: API_PORT,
            PGLITE_DIR: 'memory://',
            AUTH_RATE_LIMIT: '1000',
            DEMO_TOOLS: 'true',
          },
          reuseExistingServer: false,
          timeout: 120_000,
        },
        {
          command: 'pnpm dev --mode api --host 127.0.0.1 --port 5173',
          cwd: rootDir,
          url: 'http://127.0.0.1:5173',
          env: { API_PORT },
          reuseExistingServer: false,
          timeout: 120_000,
        },
      ]
    : {
        command: 'pnpm dev --host 127.0.0.1 --port 5173',
        cwd: rootDir,
        url: 'http://127.0.0.1:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
