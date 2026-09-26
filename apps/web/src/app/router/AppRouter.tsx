import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/app/ui/AppShell';
import { DiscoverPage } from '@/pages/discover';
import { FollowingPage } from '@/pages/following';
import { NotFoundPage } from '@/pages/not-found';
import { NotificationsPage } from '@/pages/notifications';
import { SettingsPage } from '@/pages/settings';
import { StoreDetailsPage } from '@/pages/store-details';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/discover" replace />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="following" element={<FollowingPage />} />
        <Route path="stores/:storeSlug" element={<StoreDetailsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
