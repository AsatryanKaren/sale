import type { Notification } from '@saleradar/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificationApi } from './notificationApi';
import { notificationKeys } from './queryKeys';

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId),
    onSuccess: (response) => {
      queryClient.setQueryData<Notification[]>(notificationKeys.list(), (current) => {
        if (!current) {
          return [response.notification];
        }

        return current.map((notification) =>
          notification.id === response.notification.id
            ? response.notification
            : notification,
        );
      });
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
