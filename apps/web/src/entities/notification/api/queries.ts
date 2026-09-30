import { queryOptions, useQuery } from '@tanstack/react-query';

import { appConfig } from '@/shared/config';

import { notificationApi } from './notificationApi';
import { notificationKeys } from './queryKeys';

export function notificationsQueryOptions() {
  return queryOptions({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const response = await notificationApi.getNotifications();
      return response.items;
    },
    staleTime: appConfig.queryDefaults.staleTimeMs.notifications,
  });
}

export function useNotificationsQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({ ...notificationsQueryOptions(), enabled });
}
