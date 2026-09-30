import { Link } from 'react-router-dom';

import { StoreAvatar } from '../StoreAvatar';
import styles from './StoreIdentity.module.css';

type StoreIdentityProps = {
  name: string;
  slug: string;
  categoryLabel: string;
  linkToStore?: boolean;
};

export function StoreIdentity({
  name,
  slug,
  categoryLabel,
  linkToStore = true,
}: StoreIdentityProps) {
  const content = (
    <>
      <StoreAvatar name={name} />
      <span className={styles.copy}>
        <span className={styles.name}>{name}</span>
        <span className={styles.category}>{categoryLabel}</span>
      </span>
    </>
  );

  if (!linkToStore) {
    return <div className={styles.root}>{content}</div>;
  }

  return (
    <Link className={styles.root} to={`/stores/${slug}`} aria-label={`Open ${name}`}>
      {content}
    </Link>
  );
}
