import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';

import { toUserFacingApiError } from '@/shared/api';
import { getSafeRedirectPath, useNow } from '@/shared/lib';
import { AppErrorState, AppLoadingState, Page } from '@/shared/ui';
import { hasAccess, useSessionQuery } from '@/entities/session';

function SessionPending() {
  return (
    <Page width="narrow">
      <AppLoadingState rows={2} />
    </Page>
  );
}

function SessionFailed({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <Page width="narrow">
      <AppErrorState
        title="We couldn't check your account"
        description={toUserFacingApiError(error)}
        onRetry={onRetry}
      />
    </Page>
  );
}

/** Signed-in routes. Visitors are sent to sign in and brought back afterwards. */
export function RequireAuth() {
  const location = useLocation();
  const sessionQuery = useSessionQuery();

  if (sessionQuery.isPending) {
    return <SessionPending />;
  }

  if (sessionQuery.isError) {
    return (
      <SessionFailed
        error={sessionQuery.error}
        onRetry={() => {
          void sessionQuery.refetch();
        }}
      />
    );
  }

  if (!sessionQuery.data) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return <Outlet />;
}

/** Routes that need an active trial or paid plan. Otherwise: the plans page. */
export function RequireAccess() {
  const sessionQuery = useSessionQuery();
  const now = useNow(30_000);

  if (sessionQuery.data && !hasAccess(sessionQuery.data.subscription, now)) {
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
}

/**
 * Sign-in and sign-up: signed-in people go straight to the app, or to the page
 * that sent them here (`?next=`). This also completes the redirect after a
 * successful sign-in, since the session lands in the cache first.
 */
export function PublicOnly() {
  const sessionQuery = useSessionQuery();
  const [searchParams] = useSearchParams();

  if (sessionQuery.isPending) {
    return null;
  }

  if (sessionQuery.data) {
    return <Navigate to={getSafeRedirectPath(searchParams.get('next'))} replace />;
  }

  return <Outlet />;
}
