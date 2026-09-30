import type { ReactNode } from 'react';

import styles from './Stat.module.css';

type StatTone = 'default' | 'accent';

type StatProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: StatTone;
};

export function Stat({ label, value, hint, tone = 'default' }: StatProps) {
  return (
    <div className={styles.stat}>
      <dt className={styles.label}>{label}</dt>
      <dd className={tone === 'accent' ? styles.valueAccent : styles.value}>{value}</dd>
      {hint ? <dd className={styles.hint}>{hint}</dd> : null}
    </div>
  );
}

type StatGroupProps = {
  children: ReactNode;
  'aria-label'?: string;
};

export function StatGroup({ children, 'aria-label': ariaLabel }: StatGroupProps) {
  return (
    <dl className={styles.group} aria-label={ariaLabel}>
      {children}
    </dl>
  );
}
