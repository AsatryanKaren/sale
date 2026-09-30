import type { z } from 'zod';

import type { CURRENCIES } from './constants';
import type {
  checkoutRequestSchema,
  loginRequestSchema,
  planIdSchema,
  planIntervalSchema,
  planListResponseSchema,
  planSchema,
  sessionResponseSchema,
  signupRequestSchema,
  subscriptionSchema,
  subscriptionStatusSchema,
  userSchema,
} from './schemas';

export type PlanId = z.infer<typeof planIdSchema>;
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type User = z.infer<typeof userSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type Currency = (typeof CURRENCIES)[number];
export type Plan = z.infer<typeof planSchema>;
export type PlanInterval = z.infer<typeof planIntervalSchema>;
export type PlanListResponse = z.infer<typeof planListResponseSchema>;
