import type { Sale, Store, Watch } from '@saleradar/contracts';

import { SaleStatus } from '@/entities/sale';
import { StoreIdentity, getCategoryLabel } from '@/entities/store';
import { ConfigureAlertControl } from '@/features/configure-alert';
import { FollowButton } from '@/features/follow-store';

import styles from './StoreCard.module.css';

type StoreCardProps = {
  store: Store;
  sale: Sale | null;
  watch: Watch | null;
};

export function StoreCard({ store, sale, watch }: StoreCardProps) {
  const isFollowing = watch !== null;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <StoreIdentity
          name={store.name}
          slug={store.slug}
          categoryLabel={getCategoryLabel(store.category)}
        />
        <FollowButton
          storeId={store.id}
          storeName={store.name}
          isFollowing={isFollowing}
        />
      </div>

      <SaleStatus sale={sale} />

      {watch ? (
        <div className={styles.alertRow}>
          <span className={styles.alertLabel}>Alert when</span>
          <ConfigureAlertControl
            storeId={store.id}
            value={watch.minimumDiscountPercent}
            aria-label={`Alert threshold for ${store.name}`}
          />
        </div>
      ) : null}
    </article>
  );
}
