import type { Sale, Store, Watch } from '@saleradar/contracts';
import { BellOutlined } from '@ant-design/icons';

import { Surface } from '@/shared/ui';
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

/** Store summary tile: identity, live sale signal, follow + alert controls. */
export function StoreCard({ store, sale, watch }: StoreCardProps) {
  const isFollowing = watch !== null;
  const hasActiveSale = sale?.status === 'active';

  return (
    <Surface
      as="article"
      padding="none"
      interactive
      className={hasActiveSale ? styles.cardLive : styles.card}
    >
      <div className={styles.body}>
        <div className={styles.top}>
          <StoreIdentity store={store} categoryLabel={getCategoryLabel(store.category)} />
          <FollowButton storeId={store.id} storeName={store.name} isFollowing={isFollowing} />
        </div>

        <SaleStatus sale={sale} />
      </div>

      {watch ? (
        <div className={styles.alertRow}>
          <span className={styles.alertLabel}>
            <BellOutlined aria-hidden /> Alert me at
          </span>
          <ConfigureAlertControl
            storeId={store.id}
            value={watch.minimumDiscountPercent}
            aria-label={`Alert threshold for ${store.name}`}
          />
        </div>
      ) : null}
    </Surface>
  );
}
