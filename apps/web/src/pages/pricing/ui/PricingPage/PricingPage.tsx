import { useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, LockOutlined } from '@ant-design/icons';

import { formatAbsoluteDate, useNow } from '@/shared/lib';
import { AppErrorState, AppLoadingState, Page, PageHeader } from '@/shared/ui';
import { getAnnualSavingsPercent, usePlansQuery } from '@/entities/plan';
import { formatTimeLeft, getAccessState, useSessionQuery } from '@/entities/session';

import { PlanCard } from '../PlanCard';
import styles from './PricingPage.module.css';

export function PricingPage() {
  const navigate = useNavigate();
  const sessionQuery = useSessionQuery();
  const plansQuery = usePlansQuery();
  const now = useNow();

  if (plansQuery.isError) {
    return (
      <Page width="default">
        <AppErrorState
          title="Plans could not be loaded"
          description="Check your connection and try again."
          onRetry={() => {
            void plansQuery.refetch();
          }}
        />
      </Page>
    );
  }

  if (!sessionQuery.data || !plansQuery.data) {
    return <AppLoadingState rows={2} layout="grid" />;
  }

  const plans = plansQuery.data;

  const { subscription } = sessionQuery.data;
  const access = getAccessState(subscription, now);
  const currentPlan = access.kind === 'subscribed' ? subscription.plan : null;
  const savings = getAnnualSavingsPercent(plans);

  const goToApp = () => {
    void navigate('/discover');
  };

  return (
    <Page width="default">
      <PageHeader
        eyebrow="Plans"
        title={access.kind === 'subscribed' ? 'Your plan' : 'Keep your sale alerts running'}
        description="One plan with everything in it. Prices are fixed in dram and in dollars. Cancel anytime."
      />

      {access.kind === 'expired' ? (
        <div className={styles.notice} role="alert">
          <LockOutlined aria-hidden />
          <span>
            <strong>Your free trial has ended.</strong> Choose a plan to keep following stores and
            getting alerts.
          </span>
        </div>
      ) : null}

      {access.kind === 'trial' ? (
        <div className={styles.noticeSoft}>
          <ClockCircleOutlined aria-hidden />
          <span>
            <strong>Free trial: {formatTimeLeft(access.msLeft)}.</strong> Subscribe now and keep
            everything when it ends.
          </span>
        </div>
      ) : null}

      {access.kind === 'subscribed' && access.renewsAt ? (
        <div className={styles.noticeSoft}>
          <ClockCircleOutlined aria-hidden />
          <span>
            {access.cancelAtPeriodEnd ? 'Your plan ends on ' : 'Your plan renews on '}
            <strong>{formatAbsoluteDate(access.renewsAt.toISOString())}</strong>.
          </span>
        </div>
      ) : null}

      <div className={styles.plans}>
        {plans.map((plan) => {
          const isYearly = plan.interval === 'year';
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              {...(isYearly && savings !== null ? { badge: `Save ${savings}%` } : {})}
              highlighted={isYearly}
              isCurrent={currentPlan === plan.id}
              onSubscribed={goToApp}
            />
          );
        })}
      </div>

      <p className={styles.fineprint}>
        Dram and dollar prices are set separately and don't follow the exchange rate.
      </p>
    </Page>
  );
}
