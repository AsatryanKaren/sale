import type { Sale } from '@saleradar/contracts';

import { cssModuleClass } from '@/shared/lib';

import { SALE_KIND_LABELS, formatDiscountPercent, getSaleTone } from '../../model';
import styles from './SaleStatus.module.css';

type SaleStatusProps = {
  sale: Sale | null;
  compact?: boolean;
};

export function SaleStatus({ sale, compact = false }: SaleStatusProps) {
  if (sale?.status !== 'active') {
    return (
      <div className={cssModuleClass(styles, 'rootEmpty')}>
        <p className={cssModuleClass(styles, 'emptyTitle')}>No active sale</p>
        {!compact ? (
          <p className={cssModuleClass(styles, 'helper')}>
            Alerts will appear when a meaningful sale starts.
          </p>
        ) : null}
      </div>
    );
  }

  const tone = getSaleTone(sale.maxDiscountPercent);
  const percent = formatDiscountPercent(sale.maxDiscountPercent);
  const toneClass =
    tone === 'hot' ? 'discountHot' : tone === 'moderate' ? 'discountModerate' : 'discountMuted';
  const rootToneClass =
    tone === 'hot' ? 'rootHot' : tone === 'moderate' ? 'rootModerate' : 'rootMuted';

  return (
    <div className={cssModuleClass(styles, rootToneClass)}>
      <div className={cssModuleClass(styles, 'row')}>
        <p className={cssModuleClass(styles, toneClass)}>
          {percent ? (
            <>
              <span className={cssModuleClass(styles, 'discountPrefix')}>Up to</span>
              <span className={cssModuleClass(styles, 'discountValue')}>{percent}</span>
            </>
          ) : (
            <span className={cssModuleClass(styles, 'discountValue')}>Sale</span>
          )}
        </p>
        <div className={cssModuleClass(styles, 'meta')}>
          <span className={cssModuleClass(styles, 'kind')}>{SALE_KIND_LABELS[sale.kind]}</span>
          {!compact ? <span className={cssModuleClass(styles, 'title')}>{sale.title}</span> : null}
        </div>
      </div>
    </div>
  );
}
