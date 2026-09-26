import { Tag } from 'antd';

import { cssModuleClass } from '@/shared/lib';

import { formatDiscountPercent, getSaleTone } from '../../model';
import styles from './DiscountBadge.module.css';

type DiscountBadgeProps = {
  value: number | null;
};

export function DiscountBadge({ value }: DiscountBadgeProps) {
  const formatted = formatDiscountPercent(value);
  const tone = getSaleTone(value);
  const className = cssModuleClass(styles, tone);

  if (!formatted) {
    return <Tag className={className}>—</Tag>;
  }

  return <Tag className={className}>Up to {formatted}</Tag>;
}
