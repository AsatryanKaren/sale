import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { toUserFacingApiError } from '@/shared/api';
import { appConfig } from '@/shared/config';
import { AppEmptyState, AppErrorState, AppLoadingState } from '@/shared/ui';
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
      <div className={styles.hero}>
        <p className={styles.brand}>{appConfig.appName}</p>
        <h1 className={styles.headline}>
          Never miss a sale from the stores you actually care about.
        </h1>
        <p className={styles.support}>
          Follow your favorites and get notified when meaningful sales start or discounts get
          better.
        </p>
      </div>

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
          {storesQuery.data.map((item, index) => {
            const watch = watchesByStoreId.get(item.store.id) ?? null;
            return (
              <div
                key={item.store.id}
                className={styles.cardMotion}
                style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
              >
                <StoreCard store={item.store} sale={item.activeSale} watch={watch} />
              </div>
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
