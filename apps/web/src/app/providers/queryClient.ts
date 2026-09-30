import { QueryCache, QueryClient } from '@tanstack/react-query';

import { appConfig } from '@/shared/config';
import { isApiErrorWithCode } from '@/shared/api';
import { sessionKeys } from '@/entities/session';

export function createQueryClient(): QueryClient {
  const queryClient: QueryClient = new QueryClient({
    // A signed-out or expired account can surface on any request (the trial can
    // end mid-visit). Re-reading the session lets the route guards react.
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.queryKey[0] === sessionKeys.all[0]) {
          return;
        }
        if (
          isApiErrorWithCode(error, 'unauthorized') ||
          isApiErrorWithCode(error, 'payment_required')
        ) {
          void queryClient.invalidateQueries({ queryKey: sessionKeys.all });
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: appConfig.queryDefaults.staleTimeMs.stores,
        retry: (failureCount, error) =>
          !isApiErrorWithCode(error, 'unauthorized') &&
          !isApiErrorWithCode(error, 'payment_required') &&
          failureCount < appConfig.queryDefaults.retry.queries,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: appConfig.queryDefaults.retry.mutations,
      },
    },
  });

  return queryClient;
}
