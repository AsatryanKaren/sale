import { Suspense, useMemo } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BellOutlined, CompassOutlined, HeartOutlined, SettingOutlined } from '@ant-design/icons';

import { useNotificationsQuery } from '@/entities/notification';
import { appConfig } from '@/shared/config';
import { cx } from '@/shared/lib';
import { AppLoadingState, BrandMark } from '@/shared/ui';

import styles from './AppShell.module.css';

const NAV_ITEMS = [
  { to: '/discover', label: 'Discover', icon: <CompassOutlined /> },
  { to: '/following', label: 'Following', icon: <HeartOutlined /> },
  { to: '/notifications', label: 'Notifications', icon: <BellOutlined /> },
  { to: '/settings', label: 'Settings', icon: <SettingOutlined /> },
] as const;

function navClassName({ isActive }: { isActive: boolean }): string {
  return cx(isActive ? styles.navItemActive : styles.navItem);
}

function tabClassName({ isActive }: { isActive: boolean }): string {
  return cx(isActive ? styles.tabItemActive : styles.tabItem);
}

export function AppShell() {
  const notificationsQuery = useNotificationsQuery();

  const unreadCount = useMemo(() => {
    return (notificationsQuery.data ?? []).filter((item) => item.readAt === null).length;
  }, [notificationsQuery.data]);

  const [country] = appConfig.supportedCountries;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link to="/discover" className={styles.brand}>
          <BrandMark size={30} />
          <span>{appConfig.appName}</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClassName}>
              <span className={styles.navIcon} aria-hidden>
                {item.icon}
              </span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.to === '/notifications' && unreadCount > 0 ? (
                <span className={styles.count} aria-label={`${unreadCount} unread`}>
                  {unreadCount}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.liveDot} aria-hidden />
          <span>
            Tracking stores in <strong>{country.name}</strong>
          </span>
        </div>
      </aside>

      <header className={styles.topbar}>
        <Link to="/discover" className={styles.brand}>
          <BrandMark size={26} />
          <span>{appConfig.appName}</span>
        </Link>
      </header>

      <main className={styles.content}>
        <Suspense fallback={<AppLoadingState rows={3} />}>
          <Outlet />
        </Suspense>
      </main>

      <nav className={styles.tabbar} aria-label="Primary mobile">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={tabClassName}>
            <span className={styles.tabIcon} aria-hidden>
              {item.icon}
              {item.to === '/notifications' && unreadCount > 0 ? (
                <span className={styles.tabDot} />
              ) : null}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
