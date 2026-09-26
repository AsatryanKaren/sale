import { z } from 'zod';

import { NOTIFICATION_TYPES } from './constants';

export const notificationTypeSchema = z.enum(NOTIFICATION_TYPES);

export const notificationSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  type: notificationTypeSchema,
  title: z.string().min(1),
  body: z.string().min(1),
  createdAt: z.iso.datetime(),
  readAt: z.iso.datetime().nullable(),
});

export const notificationListResponseSchema = z.object({
  items: z.array(notificationSchema),
});

export const notificationResponseSchema = z.object({
  notification: notificationSchema,
});
