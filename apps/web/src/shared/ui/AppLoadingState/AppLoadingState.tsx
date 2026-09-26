import { Skeleton } from 'antd';

import styles from './AppLoadingState.module.css';

type AppLoadingStateProps = {
  rows?: number;
};

export function AppLoadingState({ rows = 4 }: AppLoadingStateProps) {
  return (
    <div className={styles.root} aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, index) => (
        <div className={styles.card} key={index}>
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </div>
      ))}
    </div>
  );
}
