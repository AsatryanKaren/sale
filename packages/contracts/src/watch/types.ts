import type { z } from 'zod';

import type {
  createWatchRequestSchema,
  followingListResponseSchema,
  updateWatchRequestSchema,
  watchResponseSchema,
  watchSchema,
} from './schemas';

export type Watch = z.infer<typeof watchSchema>;
export type CreateWatchRequest = z.infer<typeof createWatchRequestSchema>;
export type UpdateWatchRequest = z.infer<typeof updateWatchRequestSchema>;
export type FollowingListResponse = z.infer<typeof followingListResponseSchema>;
export type WatchResponse = z.infer<typeof watchResponseSchema>;
