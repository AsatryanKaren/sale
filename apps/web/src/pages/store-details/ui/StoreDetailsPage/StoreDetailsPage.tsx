import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

import { toUserFacingApiError } from '@/shared/api';
import { formatAbsoluteDate, formatShortDate } from '@/shared/lib';
import { AppEmptyState, AppErrorState, AppLoadingState, PageHeader } from '@/shared/ui';
import { SaleStatus, formatDiscountPercent } from '@/entities/sale';
import {
  StoreIdentity,
  getCategoryLabel,
  useStoreDetailQuery,
  useStoreSalesQuery,
} from '@/entities/store';
import { useFollowingQuery } from '@/entities/watch';
import { ConfigureAlertControl } from '@/features/configure-alert';
import { FollowButton } from '@/features/follow-store';

import styles from './StoreDetailsPage.module.css';

export function StoreDetailsPage() {
  const params = useParams();
  const storeSlug = params.storeSlug ?? '';

  const storeQuery = useStoreDetailQuery(storeSlug);
  const salesQuery = useStoreSalesQuery(storeSlug);
  const followingQuery = useFollowingQuery();

  const watch = useMemo(() => {
    if (!storeQuery.data) {
      return null;
    }

    return (
      followingQuery.data?.find((item) => item.storeId === storeQuery.data.id) ?? null
    );
  }, [followingQuery.data, storeQuery.data]);

  if (!storeSlug) {
    return (
      <AppErrorState
        title="Store not found"
        description="This store link looks incomplete."
      />
    );
  }

  if (storeQuery.isLoading || salesQuery.isLoading || followingQuery.isLoading) {
    return <AppLoadingState rows={4} />;
  }

  if (storeQuery.isError) {
    return (
      <AppErrorState
        title="We couldn't load this store"
        description={toUserFacingApiError(storeQuery.error)}
        onRetry={() => {
          void storeQuery.refetch();
        }}
      />
    );
  }

  if (!storeQuery.data) {
    return (
      <AppEmptyState
        title="Store not found"
        description="This store is not in the current catalog."
      />
    );
  }

  const store = storeQuery.data;
  const activeSale = salesQuery.data?.activeSale ?? null;
  const history = salesQuery.data?.history ?? [];

  return (
    <section className={styles.page}>
      <PageHeader
        title={store.name}
        description={`${getCategoryLabel(store.category)} · ${store.countryCode}`}
        actions={
          <div className={styles.actions}>
            <Button
              size="small"
              href={store.websiteUrl}
              target="_blank"
              rel="noreferrer"
              icon={<LinkOutlined />}
            >
              Website
            </Button>
            <FollowButton
              storeId={store.id}
              storeName={store.name}
              isFollowing={watch !== null}
            />
          </div>
        }
      />

      <div className={styles.heroIdentity}>
        <StoreIdentity
          name={store.name}
          slug={store.slug}
          categoryLabel={getCategoryLabel(store.category)}
          size="large"
          linkToStore={false}
        />
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Current sale</h2>
        <SaleStatus sale={activeSale} />
        {activeSale?.updatedAt ? (
          <p className={styles.meta}>Updated {formatAbsoluteDate(activeSale.updatedAt)}</p>
        ) : null}
      </div>

      {watch ? (
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Alert settings</h2>
          <div className={styles.alertRow}>
            <p className={styles.meta}>Notify when discount reaches your threshold.</p>
            <ConfigureAlertControl
              storeId={store.id}
              value={watch.minimumDiscountPercent}
              aria-label={`Alert threshold for ${store.name}`}
            />
          </div>
        </div>
      ) : null}

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Sale history</h2>
        {history.length === 0 ? (
          <p className={styles.meta}>No sale history recorded yet.</p>
        ) : (
          <ol className={styles.timeline}>
            {history.map((event) => {
              const discount = formatDiscountPercent(event.maxDiscountPercent);
              return (
                <li key={event.id} className={styles.timelineItem}>
                  <div className={styles.timelineDate}>{formatShortDate(event.occurredAt)}</div>
                  <div>
                    <div className={styles.timelineLabel}>{event.label}</div>
                    <div className={styles.meta}>{discount ? `Up to ${discount}` : 'Discount unknown'}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <p className={styles.back}>
        <Link to="/discover">Back to Discover</Link>
      </p>
    </section>
  );
}
