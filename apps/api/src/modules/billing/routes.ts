import { checkoutRequestSchema, type SessionResponse, type User } from '@saleradar/contracts';
import { Hono } from 'hono';

import { apiError, readJson } from '../../http/errors';
import type { AppEnv } from '../../http/types';
import { requireUser } from '../auth/middleware';

import { activatePlan, expireNow, getSubscription, setCancelAtPeriodEnd } from './subscriptions';

async function sessionResponse(user: User): Promise<SessionResponse> {
  return { user, subscription: await getSubscription(user.id) };
}

/**
 * Billing. Checkout is simulated: choosing a plan activates it immediately.
 * Swap `activatePlan` behind a payment provider's webhook before charging.
 */
export const billingRoutes = new Hono<AppEnv>();

billingRoutes.use('*', requireUser);

billingRoutes.post('/checkout', async (c) => {
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
