import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { appConfig } from '@/shared/config';
import { getSafeRedirectPath } from '@/shared/lib';
import { AuthFrame } from '@/shared/ui';
import { LoginForm } from '@/features/auth';
import { AuthPitch } from '@/widgets/auth-pitch';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = getSafeRedirectPath(searchParams.get('next'));

  return (
    <AuthFrame
      appName={appConfig.appName}
      title="Welcome back"
      description="Sign in to see what's on sale at the stores you follow."
      aside={<AuthPitch />}
      footer={
        <>
          New to {appConfig.appName}?{' '}
          <Link to={`/signup${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`}>
            Start a free trial
          </Link>
        </>
      }
    >
      <LoginForm
        onSuccess={() => {
          void navigate(next, { replace: true });
        }}
      />
    </AuthFrame>
  );
}
