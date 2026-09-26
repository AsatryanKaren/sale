import { Button } from 'antd';

import { useMarkNotificationReadMutation } from '@/entities/notification';

type MarkNotificationReadButtonProps = {
  notificationId: string;
  isRead: boolean;
};

export function MarkNotificationReadButton({
  notificationId,
  isRead,
}: MarkNotificationReadButtonProps) {
  const mutation = useMarkNotificationReadMutation();

  if (isRead) {
    return null;
  }

  return (
    <Button
      size="small"
      loading={mutation.isPending}
      onClick={() => {
        mutation.mutate(notificationId);
      }}
    >
      Mark as read
    </Button>
  );
}
