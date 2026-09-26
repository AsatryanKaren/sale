import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Badge, Layout, Menu } from 'antd';
import {
  BellOutlined,
  CompassOutlined,
  HeartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

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
          <Badge count={unreadCount} size="small" />
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
        width={240}
        className={styles.sider}
        trigger={null}
      >
        <div className={styles.brandBlock}>
          <Link to="/discover" className={styles.brand}>
            {appConfig.appName}
          </Link>
          <p className={styles.brandTagline}>Follow stores. Catch better sales.</p>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems.map((item) => ({
            ...item,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Link to="/discover" className={styles.mobileBrand}>
            {appConfig.appName}
          </Link>
          <nav className={styles.mobileNav} aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const isActive = selectedKey === item.key;
              return (
                <Link
                  key={item.key}
                  to={item.key}
                  className={isActive ? styles.mobileNavItemActive : styles.mobileNavItem}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.mobileIcon}>{item.icon}</span>
                  <span>
                    {item.label}
                    {item.key === '/notifications' && unreadCount > 0
                      ? ` (${unreadCount})`
                      : ''}
                  </span>
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
