import { Select } from 'antd';

import { appConfig } from '@/shared/config';
import { PageHeader } from '@/shared/ui';

import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const [country] = appConfig.supportedCountries;

  return (
    <section className={styles.page}>
      <PageHeader
        title="Settings"
        description="Basic preferences for the SaleRadar MVP. Notification channels arrive in a later stage."
      />

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Country</h2>
        <p className={styles.helper}>
          SaleRadar is currently focused on Armenia, with a country-agnostic architecture.
        </p>
        <Select
          value={country.code}
          style={{ maxWidth: 280 }}
          aria-label="Country"
          options={appConfig.supportedCountries.map((item) => ({
            value: item.code,
            label: item.name,
          }))}
          disabled
        />
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Notification language</h2>
        <p className={styles.helper}>English for now. Localization can be added later.</p>
        <Select
          value="en"
          style={{ maxWidth: 280 }}
          aria-label="Preferred language"
          options={[{ value: 'en', label: 'English' }]}
          disabled
        />
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Notification channels</h2>
        <p className={styles.helper}>
          Web push, Telegram, and email alerts are planned. This screen is a placeholder only.
        </p>
        <ul className={styles.channels}>
          <li>In-app notifications — available in MVP</li>
          <li>Web push — coming later</li>
          <li>Telegram — coming later</li>
        </ul>
      </div>
    </section>
  );
}
