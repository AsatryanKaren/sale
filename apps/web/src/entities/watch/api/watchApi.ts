import {
  createWatchRequestSchema,
  followingListResponseSchema,
  updateWatchRequestSchema,
  watchResponseSchema,
  type CreateWatchRequest,
  type UpdateWatchRequest,
} from '@saleradar/contracts';
import { z } from 'zod';

import { apiClient } from '@/shared/api';

const emptyResponseSchema = z.undefined();

export const watchApi = {
  getFollowing() {
    return apiClient.get('/following', followingListResponseSchema);
  },
  followStore(payload: CreateWatchRequest) {
    const body = createWatchRequestSchema.parse(payload);
    return apiClient.post('/following', watchResponseSchema, body);
  },
  updateWatch(storeId: string, payload: UpdateWatchRequest) {
    const body = updateWatchRequestSchema.parse(payload);
    return apiClient.patch(`/following/${storeId}`, watchResponseSchema, body);
  },
  unfollowStore(storeId: string) {
    return apiClient.delete(`/following/${storeId}`, emptyResponseSchema);
  },
};
