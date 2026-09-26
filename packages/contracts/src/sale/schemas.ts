import { z } from 'zod';

import {
  SALE_HISTORY_EVENT_TYPES,
  SALE_KINDS,
  SALE_STATUSES,
} from './constants';

export const saleKindSchema = z.enum(SALE_KINDS);
export const saleStatusSchema = z.enum(SALE_STATUSES);
export const saleHistoryEventTypeSchema = z.enum(SALE_HISTORY_EVENT_TYPES);

export const saleSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  title: z.string().min(1),
  kind: saleKindSchema,
  status: saleStatusSchema,
  minDiscountPercent: z.number().min(0).max(100).nullable(),
  maxDiscountPercent: z.number().min(0).max(100).nullable(),
  startedAt: z.iso.datetime(),
  endsAt: z.iso.datetime().nullable(),
  sourceUrl: z.url().nullable(),
  updatedAt: z.iso.datetime(),
});

export const saleSnapshotSchema = z.object({
  storeId: z.string().min(1),
  saleId: z.string().min(1),
  maxDiscountPercent: z.number().min(0).max(100).nullable(),
  discountedProductCount: z.number().int().nonnegative().nullable(),
  capturedAt: z.iso.datetime(),
});

export const saleHistoryEventSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  saleId: z.string().min(1),
  type: saleHistoryEventTypeSchema,
  maxDiscountPercent: z.number().min(0).max(100).nullable(),
  occurredAt: z.iso.datetime(),
  label: z.string().min(1),
});

export const storeSalesResponseSchema = z.object({
  activeSale: saleSchema.nullable(),
  history: z.array(saleHistoryEventSchema),
});
