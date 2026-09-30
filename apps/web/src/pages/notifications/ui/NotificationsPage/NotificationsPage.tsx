import { useMemo } from 'react';
import type { Notification } from '@saleradar/contracts';
import { BellOutlined } from '@ant-design/icons';

import { toUserFacingApiError } from '@/shared/api';
import { formatRelativeDate } from '@/shared/lib';
import { AppEmptyState, AppErrorState, AppLoadingState, Page, PageHeader } from '@/shared/ui';
import { NOTIFICATION_TYPE_LABELS, useNotificationsQuery } from '@/entities/notification';
import { StoreAvatar, useStoresQuery } from '@/entities/store';
import { MarkNotificationReadButton } from '@/features/mark-notification-read';

import styles from './NotificationsPage.module.css';

type NotificationItemProps = {
  notification: Notification;
  storeName: string;
};

function NotificationItem({ notification, storeName }: NotificationItemProps) {
  const isUnread = notification.readAt === null;

  return (
    <article
      className={isUnread ? styles.itemUnread : styles.item}
      aria-label={`${storeName}: ${notification.title}`}
    >
      <StoreAvatar name={storeName} />
      <div className={styles.main}>
        <div className={styles.meta}>
          <span className={styles.store}>{storeName}</span>
          <span className={styles.type}>{NOTIFICATION_TYPE_LABELS[notification.type]}</span>
          <time dateTime={notification.createdAt} className={styles.time}>
            {formatRelativeDate(notification.createdAt)}
          </time>
        </div>
        <h2 className={styles.title}>{notification.title}</h2>
        <p className={styles.body}>{notification.body}</p>
      </div>
      <div className={styles.side}>
        {isUnread ? (
          <span className={styles.unread}>
            <span className={styles.unreadDot} aria-hidden />
            Unread
          </span>
        ) : (
          <span className={styles.read}>Read</span>
        )}
        <MarkNotificationReadButton notificationId={notification.id} isRead={!isUnread} />
      </div>
    </article>
  );
}

export function NotificationsPage() {
  const notificationsQuery = useNotificationsQuery();
  const storesQuery = useStoresQuery();

  const storeNameById = useMemo(() => {
    return new Map(
      (storesQuery.data ?? []).map((item) => [item.store.id, item.store.name] as const),
    );
  }, [storesQuery.data]);

  const unreadCount = (notificationsQuery.data ?? []).filter((item) => item.readAt === null).length;

  return (
    <Page width="default">
      <PageHeader
        eyebrow={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        title="Notifications"
        description="Sale updates from the stores you follow, filtered by your alert thresholds."
      />

      {notificationsQuery.isLoading ? <AppLoadingState rows={4} /> : null}

      {notificationsQuery.isError ? (
        <AppErrorState
          title="We couldn't load notifications"
          description={toUserFacingApiError(notificationsQuery.error)}
          onRetry={() => {
            void notificationsQuery.refetch();
          }}
        />
      ) : null}

      {notificationsQuery.isSuccess && notificationsQuery.data.length === 0 ? (
        <AppEmptyState
          icon={<BellOutlined />}
          title="No notifications yet"
          description="Follow stores and set thresholds to start receiving sale alerts."
        />
      ) : null}

      {notificationsQuery.isSuccess && notificationsQuery.data.length > 0 ? (
        <div className={styles.list}>
          {notificationsQuery.data.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              storeName={storeNameById.get(notification.storeId) ?? 'Store'}
            />
          ))}
        </div>
      ) : null}
    </Page>
  );
}
