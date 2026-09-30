import type { CSSProperties } from 'react';

import { cx, getStoreHue, getStoreInitials } from '@/shared/lib';

import styles from './StoreAvatar.module.css';

type StoreAvatarSize = 'sm' | 'md' | 'lg';

type StoreAvatarProps = {
  name: string;
  size?: StoreAvatarSize;
};

const SIZE_CLASS: Record<StoreAvatarSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

/** Monogram tile tinted with a hue derived from the store name. */
export function StoreAvatar({ name, size = 'md' }: StoreAvatarProps) {
  const style = { '--sr-avatar-hue': getStoreHue(name) } as CSSProperties;

  return (
    <span className={cx(styles.avatar, SIZE_CLASS[size])} style={style} aria-hidden>
      {getStoreInitials(name)}
    </span>
  );
}
