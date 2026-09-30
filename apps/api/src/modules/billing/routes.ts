import { checkoutRequestSchema, type SessionResponse, type User } from '@saleradar/contracts';
import { Hono } from 'hono';

import { config } from '../../config';
import { apiError, readJson } from '../../http/errors';
import type { AppEnv } from '../../http/types';
import { requireUser } from '../auth/middleware';

import { activatePlan, expireNow, getSubscription, setCancelAtPeriodEnd } from './subscriptions';

async function sessionResponse(user: User): Promise<SessionResponse> {
  return { user, subscription: await getSubscription(user.id) };
}

/**
 * Billing. Until a payment provider is connected, checkout is simulated:
 * choosing a plan activates it immediately. Production refuses it (503) so
 * nobody gets a paid plan for free; set SIMULATED_PAYMENTS=true to override.
 */
export const billingRoutes = new Hono<AppEnv>();

billingRoutes.use('*', requireUser);

billingRoutes.post('/checkout', async (c) => {
  if (!config.simulatedPayments) {
    return apiError(
      c,
      503,
      'Payments are not available yet. Your free trial is still yours to use.',
    );
  }
  const parsed = checkoutRequestSchema.safeParse(await readJson(c));
  if (!parsed.success) {
    return apiError(c, 400, 'Unknown plan.');
  }
  const user = c.get('user');
  await activatePlan(user.id, parsed.data.plan);
  return c.json(await sessionResponse(user));
});

billingRoutes.post('/cancel', async (c) => {
  const user = c.get('user');
  const updated = await setCancelAtPeriodEnd(user.id, true);
  if (!updated) {
    return apiError(c, 409, 'There is no active plan to cancel.');
  }
  return c.json(await sessionResponse(user));
});

billingRoutes.post('/resume', async (c) => {
  const user = c.get('user');
  const updated = await setCancelAtPeriodEnd(user.id, false);
  if (!updated) {
    return apiError(c, 409, 'There is no active plan to resume.');
  }
  return c.json(await sessionResponse(user));
});

/** Demo helpers, mounted only when DEMO_TOOLS is on (the default outside production). */
export const demoRoutes = new Hono<AppEnv>();

demoRoutes.use('*', requireUser);

demoRoutes.post('/expire-trial', async (c) => {
  const user = c.get('user');
  await expireNow(user.id);
  return c.json(await sessionResponse(user));
});
