import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { toUserFacingApiError } from '@/shared/api';
import { AppEmptyState, AppErrorState, AppLoadingState, PageHeader } from '@/shared/ui';
import { StoreCard, useStoresQuery } from '@/entities/store';
import { useFollowingQuery } from '@/entities/watch';

import {
  parseDiscoverFilters,
  serializeDiscoverFilters,
  toStoreListQuery,
} from '../../model';
import { DiscoverFiltersBar } from '../DiscoverFiltersBar';
import styles from './DiscoverPage.module.css';

export function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseDiscoverFilters(searchParams), [searchParams]);
  const listQuery = useMemo(() => toStoreListQuery(filters), [filters]);

  const storesQuery = useStoresQuery(listQuery);
  const followingQuery = useFollowingQuery();

  const watchesByStoreId = useMemo(() => {
    return new Map((followingQuery.data ?? []).map((watch) => [watch.storeId, watch] as const));
  }, [followingQuery.data]);

  return (
    <section className={styles.page}>
      <PageHeader
        title="Discover"
        description="Never miss a sale from the stores you actually care about. Follow favorites and get notified when meaningful discounts start or get better."
      />

      <DiscoverFiltersBar
        filters={filters}
        onChange={(next) => {
          setSearchParams(serializeDiscoverFilters(next), { replace: true });
        }}
      />

      {storesQuery.isLoading || followingQuery.isLoading ? <AppLoadingState rows={5} /> : null}

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
          {storesQuery.data.map((item) => {
            const watch = watchesByStoreId.get(item.store.id) ?? null;
            return (
              <StoreCard
                key={item.store.id}
                store={item.store}
                sale={item.activeSale}
                watch={watch}
              />
            );
          })}
        </div>
      ) : null}

      <p className={styles.disclaimer}>
        Demo discounts are mocked for development and may not reflect live store pricing.
      </p>
    </section>
  );
}
