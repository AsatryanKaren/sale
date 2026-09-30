import type { MiddlewareHandler } from 'hono';

import { apiError } from '../../http/errors';
import type { AppEnv } from '../../http/types';

import { getSubscription } from './subscriptions';

/** 402 once the trial or paid period has ended. Runs after `requireUser`. */
export const requireAccess: MiddlewareHandler<AppEnv> = async (c, next) => {
  const subscription = await getSubscription(c.get('user').id);
  if (subscription.status === 'expired') {
    return apiError(c, 402, 'Your free trial has ended. Choose a plan to keep using SaleRadar.');
  }
  return next();
};
