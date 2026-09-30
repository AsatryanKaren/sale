import { Suspense, useMemo } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BellOutlined, CompassOutlined, HeartOutlined, SettingOutlined } from '@ant-design/icons';

import { appConfig } from '@/shared/config';
import { cx, getStoreInitials, useNow } from '@/shared/lib';
import { AppLoadingState, BrandMark } from '@/shared/ui';
import { useNotificationsQuery } from '@/entities/notification';
import {
  formatTimeLeft,
  getAccessState,
  useSessionQuery,
  type AccessState,
} from '@/entities/session';

import styles from './AppShell.module.css';

const NAV_ITEMS = [
  { to: '/discover', label: 'Discover', icon: <CompassOutlined /> },
  { to: '/following', label: 'Following', icon: <HeartOutlined /> },
  { to: '/notifications', label: 'Notifications', icon: <BellOutlined /> },
  { to: '/settings', label: 'Settings', icon: <SettingOutlined /> },
] as const;

function describeAccess(access: AccessState | null): string {
  switch (access?.kind) {
    case 'trial':
      return `Trial · ${formatTimeLeft(access.msLeft)}`;
    case 'subscribed':
      return access.cancelAtPeriodEnd ? 'Plan ends soon' : 'Subscribed';
    case 'expired':
      return 'Trial ended';
    default:
      return '';
  }
}

function navClassName({ isActive }: { isActive: boolean }): string {
  return cx(isActive ? styles.navItemActive : styles.navItem);
}

function tabClassName({ isActive }: { isActive: boolean }): string {
  return cx(isActive ? styles.tabItemActive : styles.tabItem);
}

export function AppShell() {
  const sessionQuery = useSessionQuery();
  const now = useNow();
  const access = sessionQuery.data ? getAccessState(sessionQuery.data.subscription, now) : null;
  const user = sessionQuery.data?.user ?? null;
  const notificationsQuery = useNotificationsQuery({
    enabled: access !== null && access.kind !== 'expired',
  });

  const unreadCount = useMemo(() => {
    return (notificationsQuery.data ?? []).filter((item) => item.readAt === null).length;
  }, [notificationsQuery.data]);

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

        {user ? (
          <Link to="/settings" className={styles.userCard}>
            <span className={styles.userAvatar} aria-hidden>
              {getStoreInitials(user.name)}
            </span>
            <span className={styles.userCopy}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userPlan}>{describeAccess(access)}</span>
            </span>
          </Link>
        ) : null}
      </aside>

      <header className={styles.topbar}>
        <Link to="/discover" className={styles.brand}>
          <BrandMark size={26} />
          <span>{appConfig.appName}</span>
        </Link>
      </header>

      <main className={styles.content}>
        {access?.kind === 'trial' ? (
          <div className={styles.trialBanner}>
            <span>
              <strong>Free trial</strong> · {formatTimeLeft(access.msLeft)}
            </span>
            <Link to="/pricing" className={styles.trialLink}>
              See plans
            </Link>
          </div>
        ) : null}
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
