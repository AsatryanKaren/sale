import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { appConfig } from '@/shared/config';
import { getSafeRedirectPath } from '@/shared/lib';
import { AuthFrame } from '@/shared/ui';
import { SignupForm } from '@/features/auth';
import { findPlanByInterval, getPlanPriceLabel, usePlansQuery } from '@/entities/plan';
import { AuthPitch } from '@/widgets/auth-pitch';

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = getSafeRedirectPath(searchParams.get('next'));
  const monthly = findPlanByInterval(usePlansQuery().data ?? [], 'month');
  const priceNote = monthly
    ? ` Then ${getPlanPriceLabel(monthly, 'AMD')} (${getPlanPriceLabel(monthly, 'USD')}) a month.`
    : '';

  return (
    <AuthFrame
      appName={appConfig.appName}
      title="Try SaleRadar free for a day"
      description={`Full access for 24 hours, no card needed.${priceNote}`}
      aside={<AuthPitch />}
      footer={
        <>
          Already have an account?{' '}
          <Link to={`/login${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`}>
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm
        onSuccess={() => {
          void navigate(next, { replace: true });
        }}
      />
    </AuthFrame>
  );
}
