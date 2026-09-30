import type { Plan } from '@saleradar/contracts';
import { CheckOutlined } from '@ant-design/icons';

import { cx } from '@/shared/lib';
import { getPlanPriceLabel } from '@/entities/plan';
import { ChoosePlanButton } from '@/features/subscribe';

import styles from './PlanCard.module.css';

const FEATURES = [
  'Follow unlimited stores',
  'Alerts when a sale starts or deepens',
  'Your own discount thresholds per store',
  'Full sale history for every store',
];

type PlanCardProps = {
  plan: Plan;
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
  return (
    <article
      className={cx(styles.card, highlighted && styles.highlighted)}
      aria-label={`${plan.name} plan`}
    >
      <header className={styles.header}>
        <h2 className={styles.name}>{plan.name}</h2>
        {badge ? <span className={styles.badge}>{badge}</span> : null}
      </header>

      <div className={styles.price}>
        <span className={styles.amount}>{getPlanPriceLabel(plan, 'AMD')}</span>
        <span className={styles.interval}>/ {plan.interval}</span>
      </div>
      <p className={styles.usd}>
        {getPlanPriceLabel(plan, 'USD')} / {plan.interval}
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
