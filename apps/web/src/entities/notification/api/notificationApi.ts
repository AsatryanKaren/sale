import {
  notificationListResponseSchema,
  notificationResponseSchema,
} from '@saleradar/contracts';

import { apiClient } from '@/shared/api';

export const notificationApi = {
  getNotifications() {
    return apiClient.get('/notifications', notificationListResponseSchema);
  },
  markAsRead(notificationId: string) {
    return apiClient.patch(
      `/notifications/${notificationId}/read`,
      notificationResponseSchema,
    );
  },
};
