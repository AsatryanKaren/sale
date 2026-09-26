import type { Sale } from '@saleradar/contracts';
import { Tag } from 'antd';

import { cssModuleClass } from '@/shared/lib';

import { SALE_KIND_LABELS, formatDiscountLabel, getSaleTone } from '../../model';
import styles from './SaleStatus.module.css';

type SaleStatusProps = {
  sale: Sale | null;
  compact?: boolean;
};

export function SaleStatus({ sale, compact = false }: SaleStatusProps) {
  if (sale?.status !== 'active') {
    return (
      <div className={cssModuleClass(styles, 'root')}>
        <Tag className={cssModuleClass(styles, 'mutedTag')}>No active sale</Tag>
        {!compact ? (
          <p className={cssModuleClass(styles, 'helper')}>
            We will alert you when a meaningful sale appears.
          </p>
        ) : null}
      </div>
    );
  }

  const tone = getSaleTone(sale.maxDiscountPercent);
  const discountLabel = formatDiscountLabel(sale.maxDiscountPercent);

  return (
    <div className={cssModuleClass(styles, 'root')}>
      <div className={cssModuleClass(styles, 'row')}>
        <Tag className={cssModuleClass(styles, tone)}>{discountLabel}</Tag>
        <span className={cssModuleClass(styles, 'kind')}>{SALE_KIND_LABELS[sale.kind]}</span>
      </div>
      {!compact ? (
        <p className={cssModuleClass(styles, 'title')}>{sale.title}</p>
      ) : null}
    </div>
  );
}
