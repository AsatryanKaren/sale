import { queryOptions, useQuery } from '@tanstack/react-query';

import { appConfig } from '@/shared/config';

import { watchKeys } from './queryKeys';
import { watchApi } from './watchApi';

export function followingQueryOptions() {
  return queryOptions({
    queryKey: watchKeys.list(),
    queryFn: async () => {
      const response = await watchApi.getFollowing();
      return response.items;
    },
    staleTime: appConfig.queryDefaults.staleTimeMs.following,
  });
}

export function useFollowingQuery() {
  return useQuery(followingQueryOptions());
}
