import { z } from 'zod';

import { saleSchema } from '../sale/schemas';
import { STORE_CATEGORIES, STORE_SORT_OPTIONS } from './constants';

export const storeCategorySchema = z.enum(STORE_CATEGORIES);
export const storeSortSchema = z.enum(STORE_SORT_OPTIONS);

export const storeSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  websiteUrl: z.url(),
  /** Curated logo from the backend. When absent, clients derive one from `websiteUrl`. */
  logoUrl: z.url().nullable().optional(),
  countryCode: z.string().length(2),
  category: storeCategorySchema,
  isActive: z.boolean(),
});

export const storeListItemSchema = z.object({
  store: storeSchema,
  activeSale: saleSchema.nullable(),
});

export const storeListQuerySchema = z.object({
  search: z.string().optional(),
  category: storeCategorySchema.optional(),
  hasActiveSale: z.boolean().optional(),
  sort: storeSortSchema.optional(),
});

export const storeListResponseSchema = z.object({
  items: z.array(storeListItemSchema),
});

export const storeDetailResponseSchema = z.object({
  store: storeSchema,
});
