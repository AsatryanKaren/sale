import { z } from 'zod';

export const watchSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  minimumDiscountPercent: z.number().int().min(0).max(100).nullable(),
  notifyOnSaleStart: z.boolean(),
  notifyOnDiscountIncrease: z.boolean(),
  notifyOnNewSaleItems: z.boolean(),
  createdAt: z.iso.datetime(),
});

export const createWatchRequestSchema = z.object({
  storeId: z.string().min(1),
  minimumDiscountPercent: z.number().int().min(0).max(100).nullable().optional(),
  notifyOnSaleStart: z.boolean().optional(),
  notifyOnDiscountIncrease: z.boolean().optional(),
  notifyOnNewSaleItems: z.boolean().optional(),
});

export const updateWatchRequestSchema = z.object({
  minimumDiscountPercent: z.number().int().min(0).max(100).nullable().optional(),
  notifyOnSaleStart: z.boolean().optional(),
  notifyOnDiscountIncrease: z.boolean().optional(),
  notifyOnNewSaleItems: z.boolean().optional(),
});

export const followingListResponseSchema = z.object({
  items: z.array(watchSchema),
});

export const watchResponseSchema = z.object({
  watch: watchSchema,
});
