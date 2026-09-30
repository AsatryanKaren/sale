import { z } from 'zod';

import { PASSWORD_MIN_LENGTH, PLAN_IDS, PLAN_INTERVALS, SUBSCRIPTION_STATUSES } from './constants';

export const planIdSchema = z.enum(PLAN_IDS);
export const subscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES);
export const planIntervalSchema = z.enum(PLAN_INTERVALS);

/**
 * A plan as the API sells it. Prices are set separately per currency (not
 * converted), so a shopper always sees the same round number in each.
 */
export const planSchema = z.object({
  id: planIdSchema,
  name: z.string().min(1),
  interval: planIntervalSchema,
  prices: z.object({
    AMD: z.number().nonnegative(),
    USD: z.number().nonnegative(),
  }),
});

export const planListResponseSchema = z.object({
  items: z.array(planSchema),
});

export const userSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  name: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const subscriptionSchema = z.object({
  status: subscriptionStatusSchema,
  /** Paid plan; null while on the free trial. */
  plan: planIdSchema.nullable(),
  trialEndsAt: z.iso.datetime(),
  /** End of the paid period; null while on the free trial. */
  currentPeriodEnd: z.iso.datetime().nullable(),
  cancelAtPeriodEnd: z.boolean(),
});

export const sessionResponseSchema = z.object({
  user: userSchema,
  subscription: subscriptionSchema,
});

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const signupRequestSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.email(),
  password: z.string().min(PASSWORD_MIN_LENGTH),
});

export const checkoutRequestSchema = z.object({
  plan: planIdSchema,
});
