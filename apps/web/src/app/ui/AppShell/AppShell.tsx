import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Badge, Layout } from 'antd';
import {
  BellOutlined,
  CompassOutlined,
  HeartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { lightBrandTokens } from '@/app/theme';
import { useNotificationsQuery } from '@/entities/notification';
import { appConfig } from '@/shared/config';

import styles from './AppShell.module.css';

const { Content, Header } = Layout;

const NAV_ITEMS = [
  { key: '/discover', label: 'Discover', icon: <CompassOutlined /> },
  { key: '/following', label: 'Following', icon: <HeartOutlined /> },
  { key: '/notifications', label: 'Notifications', icon: <BellOutlined /> },
  { key: '/settings', label: 'Settings', icon: <SettingOutlined /> },
] as const;

export function AppShell() {
  const location = useLocation();
  const notificationsQuery = useNotificationsQuery();

  const unreadCount = useMemo(() => {
    return (notificationsQuery.data ?? []).filter((item) => item.readAt === null).length;
  }, [notificationsQuery.data]);

  const selectedKey =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.key))?.key ?? '/discover';

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/discover" className={styles.brandLink} aria-label={appConfig.appName}>
            <span className={styles.brandMark} aria-hidden />
            <span className={styles.brand}>{appConfig.appName}</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const isActive = selectedKey === item.key;
              const hasUnread = item.key === '/notifications' && unreadCount > 0;

              return (
                <Link
                  key={item.key}
                  to={item.key}
                  className={isActive ? styles.navItemActive : styles.navItem}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={
                    hasUnread ? `${item.label}, ${unreadCount} unread` : item.label
                  }
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabelText}>{item.label}</span>
                  {hasUnread ? (
                    <Badge
                      count={unreadCount}
                      size="small"
                      color={lightBrandTokens.saleHot}
                      className={styles.navBadge ?? ''}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}
