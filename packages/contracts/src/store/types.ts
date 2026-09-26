import type { z } from 'zod';

import type {
  storeCategorySchema,
  storeDetailResponseSchema,
  storeListItemSchema,
  storeListQuerySchema,
  storeListResponseSchema,
  storeSchema,
  storeSortSchema,
} from './schemas';

export type StoreCategory = z.infer<typeof storeCategorySchema>;
export type StoreSort = z.infer<typeof storeSortSchema>;
export type Store = z.infer<typeof storeSchema>;
export type StoreListItem = z.infer<typeof storeListItemSchema>;
export type StoreListQuery = z.infer<typeof storeListQuerySchema>;
export type StoreListResponse = z.infer<typeof storeListResponseSchema>;
export type StoreDetailResponse = z.infer<typeof storeDetailResponseSchema>;
