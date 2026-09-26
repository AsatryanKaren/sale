import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Badge, Layout, Menu } from 'antd';
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

const { Content, Header, Sider } = Layout;

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

  const menuItems = NAV_ITEMS.map((item) => ({
    key: item.key,
    icon: item.icon,
    label:
      item.key === '/notifications' && unreadCount > 0 ? (
        <span className={styles.navLabel}>
          <span>{item.label}</span>
          <Badge count={unreadCount} size="small" color={lightBrandTokens.saleHot} />
        </span>
      ) : (
        item.label
      ),
  }));

  return (
    <Layout className={styles.layout}>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        width={232}
        className={styles.sider}
        trigger={null}
      >
        <div className={styles.brandBlock}>
          <Link to="/discover" className={styles.brandLink} aria-label={appConfig.appName}>
            <span className={styles.brandMark} aria-hidden />
            <span className={styles.brand}>{appConfig.appName}</span>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          className={styles.menu}
          items={menuItems.map((item) => ({
            ...item,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Link to="/discover" className={styles.mobileBrand} aria-label={appConfig.appName}>
            <span className={styles.brandMarkCompact} aria-hidden />
            <span>{appConfig.appName}</span>
          </Link>
          <nav className={styles.mobileNav} aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const isActive = selectedKey === item.key;
              const showUnreadBadge = item.key === '/notifications' && unreadCount > 0;

              return (
                <Link
                  key={item.key}
                  to={item.key}
                  className={isActive ? styles.mobileNavItemActive : styles.mobileNavItem}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={
                    showUnreadBadge
                      ? `${item.label}, ${unreadCount} unread`
                      : item.label
                  }
                >
                  <span className={styles.mobileIcon}>
                    {showUnreadBadge ? (
                      <Badge
                        count={unreadCount}
                        size="small"
                        color={lightBrandTokens.saleHot}
                        offset={[6, -2]}
                      >
                        <BellOutlined style={{ color: 'rgba(248, 250, 252, 0.72)' }} />
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </span>
                  <span className={styles.mobileLabel}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
