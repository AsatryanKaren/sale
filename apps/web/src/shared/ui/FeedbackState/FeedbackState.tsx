import { Button, Empty, Result } from 'antd';

import styles from './FeedbackState.module.css';

type AppEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function AppEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: AppEmptyStateProps) {
  return (
    <div className={styles.root}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className={styles.copy}>
            <strong>{title}</strong>
            <p>{description}</p>
          </div>
        }
      >
        {actionLabel && onAction ? (
          <Button type="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Empty>
    </div>
  );
}

type AppErrorStateProps = {
  title?: string;
  description: string;
  onRetry?: () => void;
};

export function AppErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: AppErrorStateProps) {
  return (
    <div className={styles.root}>
      <Result
        status="error"
        title={title}
        subTitle={description}
        extra={
          onRetry ? (
            <Button type="primary" onClick={onRetry}>
              Try again
            </Button>
          ) : null
        }
      />
    </div>
  );
}
