import { useMemo } from 'react';

import { toUserFacingApiError } from '@/shared/api';
import { formatRelativeDate } from '@/shared/lib';
import { AppEmptyState, AppErrorState, AppLoadingState, PageHeader } from '@/shared/ui';
import { useNotificationsQuery } from '@/entities/notification';
import { useStoresQuery } from '@/entities/store';
import { MarkNotificationReadButton } from '@/features/mark-notification-read';

import styles from './NotificationsPage.module.css';

export function NotificationsPage() {
  const notificationsQuery = useNotificationsQuery();
  const storesQuery = useStoresQuery();

  const storeNameById = useMemo(() => {
    return new Map(
      (storesQuery.data ?? []).map((item) => [item.store.id, item.store.name] as const),
    );
  }, [storesQuery.data]);

  return (
    <section className={styles.page}>
      <PageHeader
        title="Notifications"
        description="Meaningful sale updates from the stores you follow."
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
          title="No notifications yet"
          description="Follow stores and configure thresholds to start receiving sale alerts."
        />
      ) : null}

      {notificationsQuery.isSuccess && notificationsQuery.data.length > 0 ? (
        <div className={styles.list}>
          {notificationsQuery.data.map((notification) => {
            const isUnread = notification.readAt === null;
            const storeName = storeNameById.get(notification.storeId) ?? 'Store';

            return (
              <article
                key={notification.id}
                className={isUnread ? styles.cardUnread : styles.card}
                aria-label={`${storeName}: ${notification.title}`}
              >
                <div className={styles.top}>
                  <div>
                    <div className={styles.store}>{storeName}</div>
                    <h2 className={styles.title}>{notification.title}</h2>
                  </div>
                  <div className={styles.status}>
                    <span className={isUnread ? styles.unread : styles.read}>
                      {isUnread ? 'Unread' : 'Read'}
                    </span>
                    <time dateTime={notification.createdAt}>
                      {formatRelativeDate(notification.createdAt)}
                    </time>
                  </div>
                </div>
                <p className={styles.body}>{notification.body}</p>
                <MarkNotificationReadButton
                  notificationId={notification.id}
                  isRead={!isUnread}
                />
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
