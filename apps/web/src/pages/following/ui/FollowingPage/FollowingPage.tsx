import { useMemo } from 'react';

import { toUserFacingApiError } from '@/shared/api';
import { AppEmptyState, AppErrorState, AppLoadingState, PageHeader } from '@/shared/ui';
import { SaleStatus } from '@/entities/sale';
import { StoreIdentity, getCategoryLabel, useStoresQuery } from '@/entities/store';
import { formatAlertThreshold, useFollowingQuery } from '@/entities/watch';
import { ConfigureAlertControl } from '@/features/configure-alert';
import { UnfollowButton } from '@/features/unfollow-store';

import styles from './FollowingPage.module.css';

export function FollowingPage() {
  const followingQuery = useFollowingQuery();
  const storesQuery = useStoresQuery();

  const storesById = useMemo(() => {
    return new Map(
      (storesQuery.data ?? []).map((item) => [item.store.id, item] as const),
    );
  }, [storesQuery.data]);

  return (
    <section className={styles.page}>
      <PageHeader
        title="Following"
        description="Stores you are watching, with the alert threshold that matters to you."
      />

      {followingQuery.isLoading || storesQuery.isLoading ? <AppLoadingState rows={3} /> : null}

      {followingQuery.isError ? (
        <AppErrorState
          title="We couldn't load followed stores"
          description={toUserFacingApiError(followingQuery.error)}
          onRetry={() => {
            void followingQuery.refetch();
          }}
        />
      ) : null}

      {followingQuery.isSuccess && followingQuery.data.length === 0 ? (
        <AppEmptyState
          title="You are not following any stores yet"
          description="Browse Discover and follow the stores you care about."
        />
      ) : null}

      {followingQuery.isSuccess &&
      storesQuery.isSuccess &&
      followingQuery.data.length > 0 ? (
        <div className={styles.list}>
          {followingQuery.data.map((watch) => {
            const item = storesById.get(watch.storeId);
            if (!item) {
              return null;
            }

            return (
              <article key={watch.id} className={styles.card}>
                <div className={styles.top}>
                  <StoreIdentity
                    name={item.store.name}
                    slug={item.store.slug}
                    categoryLabel={getCategoryLabel(item.store.category)}
                  />
                  <UnfollowButton storeId={watch.storeId} storeName={item.store.name} />
                </div>

                <SaleStatus sale={item.activeSale} />

                <div className={styles.alertRow}>
                  <div>
                    <div className={styles.metaLabel}>Current rule</div>
                    <div className={styles.metaValue}>
                      {formatAlertThreshold(watch.minimumDiscountPercent)}
                    </div>
                  </div>
                  <ConfigureAlertControl
                    storeId={watch.storeId}
                    value={watch.minimumDiscountPercent}
                    aria-label={`Edit alert threshold for ${item.store.name}`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
