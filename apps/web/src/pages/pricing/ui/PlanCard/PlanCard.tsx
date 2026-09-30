import { PLAN_CATALOG, type PlanId } from '@saleradar/contracts';
import { CheckOutlined } from '@ant-design/icons';

import { cx } from '@/shared/lib';
import { getPlanPriceLabel } from '@/entities/session';
import { ChoosePlanButton } from '@/features/subscribe';

import styles from './PlanCard.module.css';

const FEATURES = [
  'Follow unlimited stores',
  'Alerts when a sale starts or deepens',
  'Your own discount thresholds per store',
  'Full sale history for every store',
];

type PlanCardProps = {
  plan: PlanId;
  badge?: string;
  highlighted?: boolean;
  isCurrent: boolean;
  onSubscribed: () => void;
};

export function PlanCard({
  plan,
  badge,
  highlighted = false,
  isCurrent,
  onSubscribed,
}: PlanCardProps) {
  const details = PLAN_CATALOG[plan];

  return (
    <article
      className={cx(styles.card, highlighted && styles.highlighted)}
      aria-label={`${details.name} plan`}
    >
      <header className={styles.header}>
        <h2 className={styles.name}>{details.name}</h2>
        {badge ? <span className={styles.badge}>{badge}</span> : null}
      </header>

      <div className={styles.price}>
        <span className={styles.amount}>{getPlanPriceLabel(plan, 'AMD')}</span>
        <span className={styles.interval}>/ {details.interval}</span>
      </div>
      <p className={styles.usd}>
        {getPlanPriceLabel(plan, 'USD')} / {details.interval}
      </p>

      <ul className={styles.features}>
        {FEATURES.map((feature) => (
          <li key={feature}>
            <CheckOutlined aria-hidden className={styles.check} />
            {feature}
          </li>
        ))}
      </ul>

      <ChoosePlanButton
        plan={plan}
        primary={highlighted}
        isCurrent={isCurrent}
        onSubscribed={onSubscribed}
      />
    </article>
  );
}
