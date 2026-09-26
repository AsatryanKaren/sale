import type { Sale, Store, Watch } from '@saleradar/contracts';

import { SaleStatus, getSaleTone } from '@/entities/sale';
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
  const isHot =
    sale?.status === 'active' && getSaleTone(sale.maxDiscountPercent) === 'hot';

  return (
    <article className={[styles.card, isHot ? styles.cardHot : ''].filter(Boolean).join(' ')}>
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

      <SaleStatus sale={sale} compact />

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
