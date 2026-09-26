import type { z } from 'zod';

import type {
  notificationListResponseSchema,
  notificationResponseSchema,
  notificationSchema,
  notificationTypeSchema,
} from './schemas';

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationListResponse = z.infer<typeof notificationListResponseSchema>;
export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
