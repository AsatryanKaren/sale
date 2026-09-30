import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import { appConfig } from '@/shared/config';
import { toUserFacingApiError } from '@/shared/api';
import { AppEmptyState, AppErrorState, AppLoadingState, Page, PageHeader } from '@/shared/ui';
import { useStoresQuery } from '@/entities/store';
import { useFollowingQuery } from '@/entities/watch';
import { StoreCard } from '@/widgets/store-card';

import { parseDiscoverFilters, serializeDiscoverFilters, toStoreListQuery } from '../../model';
import { DiscoverFiltersBar } from '../DiscoverFiltersBar';
import { DiscoverSummary } from '../DiscoverSummary';
import styles from './DiscoverPage.module.css';

export function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseDiscoverFilters(searchParams), [searchParams]);
  const listQuery = useMemo(() => toStoreListQuery(filters), [filters]);

  const storesQuery = useStoresQuery(listQuery);
  const catalogQuery = useStoresQuery();
  const followingQuery = useFollowingQuery();

  const watchesByStoreId = useMemo(() => {
    return new Map((followingQuery.data ?? []).map((watch) => [watch.storeId, watch] as const));
  }, [followingQuery.data]);

  const [country] = appConfig.supportedCountries;

  return (
    <Page width="wide">
      <PageHeader
        eyebrow={`${country.name} · Sale radar`}
        title="Discover"
        description="Follow the stores you care about and hear about it the moment a sale starts or gets deeper."
      />

      {catalogQuery.isSuccess && followingQuery.isSuccess ? (
        <DiscoverSummary stores={catalogQuery.data} watches={followingQuery.data} />
      ) : null}

      <DiscoverFiltersBar
        filters={filters}
        onChange={(next) => {
          setSearchParams(serializeDiscoverFilters(next), { replace: true });
        }}
      />

      {storesQuery.isLoading || followingQuery.isLoading ? (
        <AppLoadingState rows={6} layout="grid" />
      ) : null}

      {storesQuery.isError ? (
        <AppErrorState
          title="We couldn't load stores"
          description={toUserFacingApiError(storesQuery.error)}
          onRetry={() => {
            void storesQuery.refetch();
          }}
        />
      ) : null}

      {storesQuery.isSuccess && storesQuery.data.length === 0 ? (
        <AppEmptyState
          icon={<SearchOutlined />}
          title="No stores match"
          description="Try a different search or clear the active filters."
          actionLabel="Clear filters"
          onAction={() => {
            setSearchParams(new URLSearchParams(), { replace: true });
          }}
        />
      ) : null}

      {storesQuery.isSuccess && storesQuery.data.length > 0 ? (
        <div className={styles.grid}>
          {storesQuery.data.map((item) => (
            <StoreCard
              key={item.store.id}
              store={item.store}
              sale={item.activeSale}
              watch={watchesByStoreId.get(item.store.id) ?? null}
            />
          ))}
        </div>
      ) : null}

      <p className={styles.disclaimer}>
        Demo discounts are mocked for development and may not reflect live store pricing.
      </p>
    </Page>
  );
}
