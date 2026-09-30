import type { SessionResponse } from '@saleradar/contracts';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { isApiErrorWithCode } from '@/shared/api';

import { sessionKeys } from './queryKeys';
import { sessionApi } from './sessionApi';

/** The signed-in session, or null when nobody is signed in. */
export function sessionQueryOptions() {
  return queryOptions({
    queryKey: sessionKeys.current(),
    queryFn: async (): Promise<SessionResponse | null> => {
      try {
        return await sessionApi.getSession();
      } catch (error) {
        if (isApiErrorWithCode(error, 'unauthorized')) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useSessionQuery() {
  return useQuery(sessionQueryOptions());
}
