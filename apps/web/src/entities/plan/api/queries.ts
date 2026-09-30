import type { Plan } from '@saleradar/contracts';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { planApi } from './planApi';
import { planKeys } from './queryKeys';

/** Plans and prices as the API sells them. Public: works before sign-in. */
export function plansQueryOptions() {
  return queryOptions({
    queryKey: planKeys.list(),
    queryFn: async (): Promise<Plan[]> => (await planApi.getPlans()).items,
    staleTime: 10 * 60_000,
  });
}

export function usePlansQuery() {
  return useQuery(plansQueryOptions());
}
