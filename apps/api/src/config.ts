import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(8787),
  /** Postgres connection string. Railway fills this in; unset means a local PGlite file. */
  DATABASE_URL: z.string().min(1).optional(),
  /** Directory for the local PGlite database when DATABASE_URL is unset. */
  PGLITE_DIR: z.string().min(1).default('.data/saleradar'),
  /** Public URL of the web app, allowed as an Origin for writes (e.g. https://saleradar.up.railway.app). */
  APP_ORIGIN: z.string().min(1).optional(),
  /** Enables /api/dev/* helpers such as ending a trial early. Off in production unless set. */
  DEMO_TOOLS: z.enum(['true', 'false']).optional(),
  /** Sign-in and sign-up attempts allowed per IP every 15 minutes. */
  AUTH_RATE_LIMIT: z.coerce.number().int().positive().default(30),
  /** Lets checkout activate a plan without payment. On by default outside production. */
  SIMULATED_PAYMENTS: z.enum(['true', 'false']).optional(),
  /** Loads the made-up sample sales. Off in production so the public site never shows fake sales. */
  SAMPLE_SALES: z.enum(['true', 'false']).optional(),
  /** Built web app to serve in production. */
  WEB_DIST_DIR: z.string().min(1).default('../web/dist'),
});

const env = envSchema.parse(process.env);
const isProduction = env.NODE_ENV === 'production';

export const config = {
  env: env.NODE_ENV,
  isProduction,
  port: env.PORT,
  host: isProduction ? '0.0.0.0' : '127.0.0.1',
  databaseUrl: env.DATABASE_URL,
  pgliteDir: env.PGLITE_DIR,
  appOrigin: env.APP_ORIGIN,
  demoTools: env.DEMO_TOOLS ? env.DEMO_TOOLS === 'true' : !isProduction,
  simulatedPayments: env.SIMULATED_PAYMENTS ? env.SIMULATED_PAYMENTS === 'true' : !isProduction,
  sampleSales: env.SAMPLE_SALES ? env.SAMPLE_SALES === 'true' : !isProduction,
  authRateLimit: env.AUTH_RATE_LIMIT,
  webDistDir: env.WEB_DIST_DIR,
} as const;

export type Config = typeof config;
