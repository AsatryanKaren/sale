import { Link } from 'react-router-dom';
import type { Store } from '@saleradar/contracts';

import { StoreAvatar } from '../StoreAvatar';
import styles from './StoreIdentity.module.css';

type StoreIdentityProps = {
  store: Pick<Store, 'name' | 'slug' | 'websiteUrl' | 'logoUrl'>;
  categoryLabel: string;
  linkToStore?: boolean;
};

export function StoreIdentity({ store, categoryLabel, linkToStore = true }: StoreIdentityProps) {
  const content = (
    <>
      <StoreAvatar store={store} />
      <span className={styles.copy}>
        <span className={styles.name}>{store.name}</span>
        <span className={styles.category}>{categoryLabel}</span>
      </span>
    </>
  );

  if (!linkToStore) {
    return <div className={styles.root}>{content}</div>;
  }

  return (
    <Link className={styles.root} to={`/stores/${store.slug}`} aria-label={`Open ${store.name}`}>
      {content}
    </Link>
  );
}
