import type { ReactNode } from 'react';
import { Button } from 'antd';
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';

import styles from './FeedbackState.module.css';

type FeedbackFrameProps = {
  icon: ReactNode;
  tone: 'neutral' | 'danger';
  title: string;
  description: string;
  action?: ReactNode;
  role?: 'status' | 'alert';
};

function FeedbackFrame({ icon, tone, title, description, action, role }: FeedbackFrameProps) {
  return (
    <div className={styles.root} role={role}>
      <span className={tone === 'danger' ? styles.iconDanger : styles.icon} aria-hidden>
        {icon}
      </span>
      <div className={styles.copy}>
        <strong className={styles.title}>{title}</strong>
        <p className={styles.description}>{description}</p>
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}

type AppEmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function AppEmptyState({
  title,
  description,
  icon = <InboxOutlined />,
  actionLabel,
  onAction,
}: AppEmptyStateProps) {
  return (
    <FeedbackFrame
      icon={icon}
      tone="neutral"
      title={title}
      description={description}
      role="status"
      action={
        actionLabel && onAction ? (
          <Button type="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null
      }
    />
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
    <FeedbackFrame
      icon={<ExclamationCircleOutlined />}
      tone="danger"
      title={title}
      description={description}
      role="alert"
      action={onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    />
  );
}
