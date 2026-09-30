import type { ReactNode } from 'react';
import { Select } from 'antd';

import { appConfig } from '@/shared/config';
import { cx } from '@/shared/lib';
import { Page, PageHeader, SurfaceSection } from '@/shared/ui';

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

export function SettingsPage() {
  const [country] = appConfig.supportedCountries;

  return (
    <Page width="narrow">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Region, language and how SaleRadar reaches you."
      />

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
