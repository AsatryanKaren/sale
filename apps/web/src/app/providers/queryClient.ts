import { QueryClient } from '@tanstack/react-query';

import { appConfig } from '@/shared/config';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: appConfig.queryDefaults.staleTimeMs.stores,
        retry: appConfig.queryDefaults.retry.queries,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: appConfig.queryDefaults.retry.mutations,
      },
    },
  });
}
