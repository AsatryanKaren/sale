import { DEFAULT_COUNTRY_CODE } from '@saleradar/contracts';

import { readAppEnv } from './env';

export const appConfig = {
  ...readAppEnv(),
  appName: 'SaleRadar',
  defaultCountryCode: DEFAULT_COUNTRY_CODE,
  supportedCountries: [
    {
      code: 'AM' as const,
      name: 'Armenia',
    },
  ],
  queryDefaults: {
    staleTimeMs: {
      stores: 60_000,
      following: 30_000,
      notifications: 15_000,
      storeDetails: 30_000,
    },
    retry: {
      queries: 1,
      mutations: 0,
    },
  },
  mockApi: {
    minLatencyMs: 200,
    maxLatencyMs: 450,
  },
} as const;

export type AppConfig = typeof appConfig;
