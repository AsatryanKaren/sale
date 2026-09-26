import type { StoreListQuery } from '@saleradar/contracts';
import {
  storeDetailResponseSchema,
  storeListResponseSchema,
  storeSalesResponseSchema,
} from '@saleradar/contracts';

import { apiClient } from '@/shared/api';

export const storeApi = {
  getStores(query: StoreListQuery = {}, signal?: AbortSignal) {
    return apiClient.get('/stores', storeListResponseSchema, {
      searchParams: {
        search: query.search,
        category: query.category,
        hasActiveSale: query.hasActiveSale,
        sort: query.sort,
      },
      ...(signal ? { signal } : {}),
    });
  },
  getStore(slug: string, signal?: AbortSignal) {
    return apiClient.get(`/stores/${slug}`, storeDetailResponseSchema, {
      ...(signal ? { signal } : {}),
    });
  },
  getStoreSales(slug: string, signal?: AbortSignal) {
    return apiClient.get(`/stores/${slug}/sales`, storeSalesResponseSchema, {
      ...(signal ? { signal } : {}),
    });
  },
};
