import { TRIAL_DURATION_HOURS } from '@saleradar/contracts';
import { BellFilled } from '@ant-design/icons';

import { findPlanByInterval, getPlanPriceLabel, usePlansQuery } from '@/entities/plan';

import styles from './AuthPitch.module.css';

const SAMPLE_ALERTS = [
  { store: 'Zara', text: 'Sale increased to 50%', time: 'now' },
  { store: 'Mango', text: 'Seasonal sale started, up to 40%', time: '2h' },
  { store: 'Nike', text: 'Clearance now reaches 50%', time: '1d' },
];

/** Dark promotional panel beside the sign-in and sign-up forms. */
export function AuthPitch() {
  const monthly = findPlanByInterval(usePlansQuery().data ?? [], 'month');

  return (
    <div className={styles.pitch}>
      <div className={styles.alerts} aria-hidden>
        {SAMPLE_ALERTS.map((alert, index) => (
          <div
            key={alert.store}
            className={styles.alert}
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <span className={styles.alertIcon}>
              <BellFilled />
            </span>
            <span className={styles.alertCopy}>
              <strong>{alert.store}</strong>
              <span>{alert.text}</span>
            </span>
            <span className={styles.alertTime}>{alert.time}</span>
          </div>
        ))}
      </div>

      <div className={styles.copy}>
        <h2 className={styles.headline}>Hear about the sale before everyone else does.</h2>
        <p className={styles.lede}>
          Follow the stores you love. SaleRadar pings you when a sale starts or the discount gets
          deeper.
        </p>
        <p className={styles.offer}>
          <span className={styles.offerBadge}>{TRIAL_DURATION_HOURS} hours free</span>
          {monthly
            ? `then ${getPlanPriceLabel(monthly, 'AMD')} (${getPlanPriceLabel(monthly, 'USD')}) a month`
            : 'then one simple plan'}
        </p>
      </div>
    </div>
  );
}
