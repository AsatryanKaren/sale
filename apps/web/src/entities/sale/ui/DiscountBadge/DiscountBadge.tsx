import { cx } from '@/shared/lib';

import { formatDiscountLabel, getSaleTone } from '../../model';
import styles from './DiscountBadge.module.css';

type DiscountBadgeProps = {
  value: number | null;
  size?: 'sm' | 'md';
};

const TONE_CLASS = {
  hot: styles.hot,
  moderate: styles.moderate,
  muted: styles.muted,
} as const;

export function DiscountBadge({ value, size = 'md' }: DiscountBadgeProps) {
  const tone = getSaleTone(value);
  const label = value === null ? '—' : formatDiscountLabel(value);

  return (
    <span className={cx(styles.badge, TONE_CLASS[tone], size === 'sm' && styles.sm)}>{label}</span>
  );
}
