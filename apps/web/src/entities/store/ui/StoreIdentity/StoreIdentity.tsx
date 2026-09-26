import { Avatar } from 'antd';
import { Link } from 'react-router-dom';

import { cssModuleClass, getStoreInitials } from '@/shared/lib';

import styles from './StoreIdentity.module.css';

type StoreIdentityProps = {
  name: string;
  slug: string;
  categoryLabel: string;
  size?: 'default' | 'large';
  linkToStore?: boolean;
};

export function StoreIdentity({
  name,
  slug,
  categoryLabel,
  size = 'default',
  linkToStore = true,
}: StoreIdentityProps) {
  const content = (
    <>
      <Avatar
        size={size === 'large' ? 56 : 44}
        className={cssModuleClass(styles, 'avatar')}
        aria-hidden
      >
        {getStoreInitials(name)}
      </Avatar>
      <div className={cssModuleClass(styles, 'copy')}>
        <span
          className={cssModuleClass(styles, size === 'large' ? 'nameLarge' : 'name')}
        >
          {name}
        </span>
        <span className={cssModuleClass(styles, 'category')}>{categoryLabel}</span>
      </div>
    </>
  );

  if (!linkToStore) {
    return <div className={cssModuleClass(styles, 'root')}>{content}</div>;
  }

  return (
    <Link
      className={cssModuleClass(styles, 'root')}
      to={`/stores/${slug}`}
      aria-label={`Open ${name}`}
    >
      {content}
    </Link>
  );
}
