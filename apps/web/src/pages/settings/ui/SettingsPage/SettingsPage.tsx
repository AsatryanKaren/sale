import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLAN_CATALOG } from '@saleradar/contracts';
import { Button, Select } from 'antd';

import { appConfig } from '@/shared/config';
import { cx, formatAbsoluteDate, useNow } from '@/shared/lib';
import { Page, PageHeader, SurfaceSection } from '@/shared/ui';
import {
  formatTimeLeft,
  getAccessState,
  getPlanPriceLabel,
  useExpireTrialForDemoMutation,
  useSessionQuery,
} from '@/entities/session';
import { LogoutButton } from '@/features/auth';
import { ManageSubscription } from '@/features/subscribe';

import styles from './SettingsPage.module.css';

type ChannelStatus = 'available' | 'planned';

const CHANNELS: readonly { name: string; description: string; status: ChannelStatus }[] = [
  { name: 'In-app', description: 'Alerts in the Notifications tab', status: 'available' },
  {
    name: 'Web push',
    description: 'Browser notifications, even when the tab is closed',
    status: 'planned',
  },
  { name: 'Telegram', description: 'Messages from the SaleRadar bot', status: 'planned' },
  { name: 'Email', description: 'A daily digest of meaningful sales', status: 'planned' },
];

type SettingRowProps = {
  label: string;
  hint: string;
  control: ReactNode;
};

function SettingRow({ label, hint, control }: SettingRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.rowCopy}>
        <span className={styles.rowLabel}>{label}</span>
        <span className={styles.rowHint}>{hint}</span>
      </div>
      <div className={styles.rowControl}>{control}</div>
    </div>
  );
}

function SubscriptionSection() {
  const navigate = useNavigate();
  const sessionQuery = useSessionQuery();
  const expireTrial = useExpireTrialForDemoMutation();
  const now = useNow();

  if (!sessionQuery.data) {
    return null;
  }

  const { subscription } = sessionQuery.data;
  const access = getAccessState(subscription, now);
  const seePlans = (
    <Button
      type={access.kind === 'subscribed' ? 'default' : 'primary'}
      onClick={() => {
        void navigate('/pricing');
      }}
    >
      {access.kind === 'subscribed' ? 'Change plan' : 'See plans'}
    </Button>
  );

  let label: string;
  let hint: string;
  let status: ReactNode;

  if (access.kind === 'trial') {
    label = 'Free trial';
    hint = `Ends ${formatAbsoluteDate(access.endsAt.toISOString())}, ${formatTimeLeft(access.msLeft)}.`;
    status = <span className={styles.statusTrial}>Trial</span>;
  } else if (access.kind === 'subscribed' && subscription.plan) {
    const plan = PLAN_CATALOG[subscription.plan];
    label = `${plan.name} plan · ${getPlanPriceLabel(plan.id, 'AMD')} (${getPlanPriceLabel(plan.id, 'USD')}) / ${plan.interval}`;
    const date = access.renewsAt ? formatAbsoluteDate(access.renewsAt.toISOString()) : '';
    hint = access.cancelAtPeriodEnd ? `Cancelled. Access ends ${date}.` : `Renews ${date}.`;
    status = <span className={styles.statusOn}>Active</span>;
  } else {
    label = 'No active plan';
    hint = 'Your free trial has ended. Choose a plan to keep your alerts.';
    status = <span className={styles.statusOff}>Expired</span>;
  }

  return (
    <SurfaceSection title="Subscription" actions={seePlans}>
      <div className={styles.rows}>
        <SettingRow label={label} hint={hint} control={status} />
        {access.kind === 'subscribed' && access.renewsAt ? (
          <SettingRow
            label="Billing"
            hint="Payments are simulated in this demo."
            control={
              <ManageSubscription
                cancelAtPeriodEnd={access.cancelAtPeriodEnd}
                periodEndLabel={formatAbsoluteDate(access.renewsAt.toISOString())}
              />
            }
          />
        ) : null}
        {(appConfig.useMockApi || import.meta.env.DEV) && access.kind === 'trial' ? (
          <SettingRow
            label="Demo: end trial now"
            hint="Skip the 24-hour wait to try the paywall. Only in local and demo builds."
            control={
              <Button
                loading={expireTrial.isPending}
                onClick={() => {
                  expireTrial.mutate(undefined);
                }}
              >
                End trial
              </Button>
            }
          />
        ) : null}
      </div>
    </SurfaceSection>
  );
}

function AccountSection() {
  const navigate = useNavigate();
  const sessionQuery = useSessionQuery();

  if (!sessionQuery.data) {
    return null;
  }

  const { user } = sessionQuery.data;

  return (
    <SurfaceSection
      title="Account"
      actions={
        <LogoutButton
          onSuccess={() => {
            void navigate('/login', { replace: true });
          }}
        />
      }
    >
      <div className={styles.rows}>
        <SettingRow label={user.name} hint={user.email} control={null} />
      </div>
    </SurfaceSection>
  );
}

export function SettingsPage() {
  const [country] = appConfig.supportedCountries;

  return (
    <Page width="narrow">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Your account, plan, region and how SaleRadar reaches you."
      />

      <AccountSection />
      <SubscriptionSection />

      <SurfaceSection title="Region & language">
        <div className={styles.rows}>
          <SettingRow
            label="Country"
            hint="SaleRadar tracks stores in Armenia first. More countries are on the way."
            control={
              <Select
                value={country.code}
                className={cx(styles.select)}
                aria-label="Country"
                options={appConfig.supportedCountries.map((item) => ({
                  value: item.code,
                  label: item.name,
                }))}
                disabled
              />
            }
          />
          <SettingRow
            label="Notification language"
            hint="English for now. Localization comes later."
            control={
              <Select
                value="en"
                className={cx(styles.select)}
                aria-label="Preferred language"
                options={[{ value: 'en', label: 'English' }]}
                disabled
              />
            }
          />
        </div>
      </SurfaceSection>

      <SurfaceSection
        title="Notification channels"
        description="Where alerts are delivered. More channels arrive in a later release."
      >
        <ul className={styles.channels}>
          {CHANNELS.map((channel) => (
            <li key={channel.name} className={styles.channel}>
              <div className={styles.rowCopy}>
                <span className={styles.rowLabel}>{channel.name}</span>
                <span className={styles.rowHint}>{channel.description}</span>
              </div>
              <span
                className={channel.status === 'available' ? styles.statusOn : styles.statusPlanned}
              >
                {channel.status === 'available' ? 'On' : 'Coming soon'}
              </span>
            </li>
          ))}
        </ul>
      </SurfaceSection>
    </Page>
  );
}
