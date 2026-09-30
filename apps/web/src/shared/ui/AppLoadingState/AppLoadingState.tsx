import { Skeleton } from 'antd';

import styles from './AppLoadingState.module.css';

type AppLoadingStateProps = {
  rows?: number;
  layout?: 'list' | 'grid';
};

export function AppLoadingState({ rows = 4, layout = 'list' }: AppLoadingStateProps) {
  return (
    <div
      className={layout === 'grid' ? styles.grid : styles.list}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: rows }, (_, index) => (
        <div className={styles.card} key={index}>
          <Skeleton active avatar={{ shape: 'square' }} paragraph={{ rows: 2 }} />
        </div>
      ))}
    </div>
  );
}
