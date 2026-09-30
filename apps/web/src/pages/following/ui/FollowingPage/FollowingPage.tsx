import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';

import { toUserFacingApiError } from '@/shared/api';
import { AppEmptyState, AppErrorState, AppLoadingState, Page, PageHeader } from '@/shared/ui';
import { useStoresQuery } from '@/entities/store';
import { useFollowingQuery } from '@/entities/watch';
import { StoreCard } from '@/widgets/store-card';

import styles from './FollowingPage.module.css';

export function FollowingPage() {
  const navigate = useNavigate();
  const followingQuery = useFollowingQuery();
  const storesQuery = useStoresQuery();

  const storesById = useMemo(() => {
    return new Map((storesQuery.data ?? []).map((item) => [item.store.id, item] as const));
  }, [storesQuery.data]);

  const followedCount = followingQuery.data?.length ?? 0;

  return (
    <Page width="wide">
      <PageHeader
        eyebrow={followedCount > 0 ? `${followedCount} stores` : 'Your list'}
        title="Following"
        description="Stores you're watching. Set how deep a discount has to be before we ping you."
      />

      {followingQuery.isLoading || storesQuery.isLoading ? (
        <AppLoadingState rows={3} layout="grid" />
      ) : null}

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
          icon={<HeartOutlined />}
          title="You're not following any stores yet"
          description="Browse Discover and follow the stores you care about."
          actionLabel="Browse stores"
          onAction={() => {
            void navigate('/discover');
          }}
        />
      ) : null}

      {followingQuery.isSuccess && storesQuery.isSuccess && followingQuery.data.length > 0 ? (
        <div className={styles.grid}>
          {followingQuery.data.map((watch) => {
            const item = storesById.get(watch.storeId);
            if (!item) {
              return null;
            }

            return (
              <StoreCard key={watch.id} store={item.store} sale={item.activeSale} watch={watch} />
            );
          })}
        </div>
      ) : null}
    </Page>
  );
}
