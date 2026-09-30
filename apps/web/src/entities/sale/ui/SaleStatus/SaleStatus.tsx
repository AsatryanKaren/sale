import type { Sale } from '@saleradar/contracts';

import { SALE_KIND_LABELS } from '../../model';
import { DiscountBadge } from '../DiscountBadge';
import styles from './SaleStatus.module.css';

type SaleStatusProps = {
  sale: Sale | null;
  compact?: boolean;
};

export function SaleStatus({ sale, compact = false }: SaleStatusProps) {
  if (sale?.status !== 'active') {
    return (
      <div className={styles.idle}>
        <span className={styles.idleDot} aria-hidden />
        <span className={styles.idleLabel}>No active sale</span>
        {!compact ? <span className={styles.idleHint}>· watching for the next one</span> : null}
      </div>
    );
  }

  return (
    <div className={styles.active}>
      <div className={styles.row}>
        <DiscountBadge value={sale.maxDiscountPercent} />
        <span className={styles.kind}>{SALE_KIND_LABELS[sale.kind]}</span>
      </div>
      {!compact ? <p className={styles.title}>{sale.title}</p> : null}
    </div>
  );
}
