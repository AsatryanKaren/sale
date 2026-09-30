import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/app/ui/AppShell';

import { PublicOnly, RequireAccess, RequireAuth } from './guards';

// Pages are code-split per route so the first paint only ships the shell.
const DiscoverPage = lazy(() =>
  import('@/pages/discover').then((module) => ({ default: module.DiscoverPage })),
);
const FollowingPage = lazy(() =>
  import('@/pages/following').then((module) => ({ default: module.FollowingPage })),
);
const StoreDetailsPage = lazy(() =>
  import('@/pages/store-details').then((module) => ({ default: module.StoreDetailsPage })),
);
const NotificationsPage = lazy(() =>
  import('@/pages/notifications').then((module) => ({ default: module.NotificationsPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/settings').then((module) => ({ default: module.SettingsPage })),
);
const PricingPage = lazy(() =>
  import('@/pages/pricing').then((module) => ({ default: module.PricingPage })),
);
const LoginPage = lazy(() =>
  import('@/pages/login').then((module) => ({ default: module.LoginPage })),
);
const SignupPage = lazy(() =>
  import('@/pages/signup').then((module) => ({ default: module.SignupPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((module) => ({ default: module.NotFoundPage })),
);

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route
          path="login"
          element={
            <Suspense fallback={null}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="signup"
          element={
            <Suspense fallback={null}>
              <SignupPage />
            </Suspense>
          }
        />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/discover" replace />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route element={<RequireAccess />}>
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="following" element={<FollowingPage />} />
            <Route path="stores/:storeSlug" element={<StoreDetailsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
