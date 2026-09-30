import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined, ExportOutlined } from '@ant-design/icons';

import { appConfig } from '@/shared/config';
import { toUserFacingApiError } from '@/shared/api';
import { formatAbsoluteDate, formatShortDate } from '@/shared/lib';
import {
  AppEmptyState,
  AppErrorState,
  AppLoadingState,
  Page,
  Stat,
  StatGroup,
  Surface,
  SurfaceSection,
} from '@/shared/ui';
import { DiscountBadge, SALE_KIND_LABELS, SaleStatus } from '@/entities/sale';
import {
  StoreAvatar,
  getCategoryLabel,
  useStoreDetailQuery,
  useStoreSalesQuery,
} from '@/entities/store';
import { formatAlertThreshold, useFollowingQuery } from '@/entities/watch';
import { ConfigureAlertControl } from '@/features/configure-alert';
import { FollowButton } from '@/features/follow-store';

import styles from './StoreDetailsPage.module.css';

function getCountryName(countryCode: string): string {
  return (
    appConfig.supportedCountries.find((country) => country.code === countryCode)?.name ??
    countryCode
  );
}

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

    return followingQuery.data?.find((item) => item.storeId === storeQuery.data.id) ?? null;
  }, [followingQuery.data, storeQuery.data]);

  if (!storeSlug) {
    return (
      <AppErrorState title="Store not found" description="This store link looks incomplete." />
    );
  }

  if (storeQuery.isLoading || salesQuery.isLoading || followingQuery.isLoading) {
    return (
      <Page width="default">
        <AppLoadingState rows={3} />
      </Page>
    );
  }

  if (storeQuery.isError) {
    return (
      <Page width="default">
        <AppErrorState
          title="We couldn't load this store"
          description={toUserFacingApiError(storeQuery.error)}
          onRetry={() => {
            void storeQuery.refetch();
          }}
        />
      </Page>
    );
  }

  if (!storeQuery.data) {
    return (
      <Page width="default">
        <AppEmptyState
          title="Store not found"
          description="This store is not in the current catalog."
        />
      </Page>
    );
  }

  const store = storeQuery.data;
  const activeSale = salesQuery.data?.activeSale ?? null;
  const liveSale = activeSale?.status === 'active' ? activeSale : null;
  const history = salesQuery.data?.history ?? [];

  return (
    <Page width="default">
      <Link to="/discover" className={styles.back}>
        <ArrowLeftOutlined aria-hidden /> Discover
      </Link>

      <Surface padding="lg" className={styles.hero}>
        <StoreAvatar store={store} size="lg" />
        <div className={styles.heroCopy}>
          <h1 className={styles.name}>{store.name}</h1>
          <p className={styles.subtitle}>
            {getCategoryLabel(store.category)} · {getCountryName(store.countryCode)}
          </p>
        </div>
        <div className={styles.heroActions}>
          <Button
            href={store.websiteUrl}
            target="_blank"
            rel="noreferrer"
            icon={<ExportOutlined />}
            iconPosition="end"
          >
            Website
          </Button>
          <FollowButton
            storeId={store.id}
            storeName={store.name}
            isFollowing={watch !== null}
            size="middle"
          />
        </div>
      </Surface>

      <StatGroup aria-label="Sale overview">
        <Stat
          label="Current discount"
          value={liveSale?.maxDiscountPercent != null ? `${liveSale.maxDiscountPercent}%` : '—'}
          tone={liveSale ? 'accent' : 'default'}
          hint={liveSale ? 'Maximum advertised' : 'No active sale'}
        />
        <Stat label="Sale type" value={liveSale ? SALE_KIND_LABELS[liveSale.kind] : '—'} />
        <Stat
          label="Your alert"
          value={watch ? formatAlertThreshold(watch.minimumDiscountPercent) : 'Off'}
          hint={watch ? 'Following' : 'Follow to enable'}
        />
      </StatGroup>

      <SurfaceSection
        title="Current sale"
        {...(activeSale?.updatedAt
          ? { description: `Updated ${formatAbsoluteDate(activeSale.updatedAt)}` }
          : {})}
      >
        <SaleStatus sale={activeSale} />
      </SurfaceSection>

      {watch ? (
        <SurfaceSection
          title="Alert settings"
          description="We'll notify you when the discount reaches your threshold."
          actions={
            <ConfigureAlertControl
              storeId={store.id}
              value={watch.minimumDiscountPercent}
              aria-label={`Alert threshold for ${store.name}`}
            />
          }
        />
      ) : null}

      <SurfaceSection title="Sale history">
        {history.length === 0 ? (
          <p className={styles.muted}>No sale history recorded yet.</p>
        ) : (
          <ol className={styles.timeline}>
            {history.map((event) => (
              <li key={event.id} className={styles.timelineItem}>
                <span className={styles.timelineDot} aria-hidden />
                <div className={styles.timelineBody}>
                  <span className={styles.timelineLabel}>{event.label}</span>
                  <time dateTime={event.occurredAt} className={styles.timelineDate}>
                    {formatShortDate(event.occurredAt)}
                  </time>
                </div>
                <DiscountBadge value={event.maxDiscountPercent} size="sm" />
              </li>
            ))}
          </ol>
        )}
      </SurfaceSection>
    </Page>
  );
}
