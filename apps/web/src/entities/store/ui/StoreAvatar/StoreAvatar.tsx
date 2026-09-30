import { useState, type CSSProperties } from 'react';
import type { Store } from '@saleradar/contracts';

import { cx, getStoreHue, getStoreInitials } from '@/shared/lib';

import { getStoreLogoCandidates } from '../../model';
import styles from './StoreAvatar.module.css';

type StoreAvatarSize = 'sm' | 'md' | 'lg';

type StoreAvatarProps = {
  store: Pick<Store, 'name' | 'websiteUrl' | 'logoUrl'>;
  size?: StoreAvatarSize;
};

const SIZE_CLASS: Record<StoreAvatarSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

/**
 * Favicon services answer unknown domains with a tiny generic globe instead of
 * an error, so anything smaller than this is treated as "no logo".
 */
const MIN_LOGO_SIZE_PX = 32;

/** Store logo, falling back through candidate sources to a tinted monogram. */
export function StoreAvatar({ store, size = 'md' }: StoreAvatarProps) {
  const candidates = getStoreLogoCandidates(store);
  const candidatesKey = candidates.join('|');
  // Failures and load state are tied to the sources they were observed for, so
  // a new store (or new logoUrl) starts over from the first candidate.
  const [failures, setFailures] = useState({ key: candidatesKey, count: 0 });
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const failedCount = failures.key === candidatesKey ? failures.count : 0;
  const source = candidates[failedCount];

  const tryNext = () => {
    setFailures({ key: candidatesKey, count: failedCount + 1 });
  };

  if (!source) {
    const style = { '--sr-avatar-hue': getStoreHue(store.name) } as CSSProperties;
    return (
      <span
        className={cx(styles.avatar, styles.monogram, SIZE_CLASS[size])}
        style={style}
        aria-hidden
      >
        {getStoreInitials(store.name)}
      </span>
    );
  }

  return (
    <span className={cx(styles.avatar, styles.logo, SIZE_CLASS[size])} aria-hidden>
      <img
        key={source}
        src={source}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={cx(styles.image, loadedSource === source && styles.imageLoaded)}
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth < MIN_LOGO_SIZE_PX) {
            tryNext();
            return;
          }
          setLoadedSource(source);
        }}
        onError={tryNext}
      />
    </span>
  );
}
