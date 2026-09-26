import type { StoreListQuery } from '@saleradar/contracts';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { appConfig } from '@/shared/config';

import { storeKeys } from './queryKeys';
import { storeApi } from './storeApi';

export function storesQueryOptions(filters: StoreListQuery = {}) {
  return queryOptions({
    queryKey: storeKeys.list(filters),
    queryFn: async ({ signal }) => {
      const response = await storeApi.getStores(filters, signal);
      return response.items;
    },
    staleTime: appConfig.queryDefaults.staleTimeMs.stores,
  });
}

export function storeDetailQueryOptions(slug: string) {
  return queryOptions({
    queryKey: storeKeys.detail(slug),
    queryFn: async ({ signal }) => {
      const response = await storeApi.getStore(slug, signal);
      return response.store;
    },
    staleTime: appConfig.queryDefaults.staleTimeMs.storeDetails,
  });
}

export function storeSalesQueryOptions(slug: string) {
  return queryOptions({
    queryKey: storeKeys.sales(slug),
    queryFn: async ({ signal }) => storeApi.getStoreSales(slug, signal),
    staleTime: appConfig.queryDefaults.staleTimeMs.storeDetails,
  });
}

export function useStoresQuery(filters: StoreListQuery = {}) {
  return useQuery(storesQueryOptions(filters));
}

export function useStoreDetailQuery(slug: string) {
  return useQuery({
    ...storeDetailQueryOptions(slug),
    enabled: slug.length > 0,
  });
}

export function useStoreSalesQuery(slug: string) {
  return useQuery({
    ...storeSalesQueryOptions(slug),
    enabled: slug.length > 0,
  });
}
