export const PLAN_IDS = ['monthly', 'annual'] as const;

export const SUBSCRIPTION_STATUSES = ['trialing', 'active', 'expired'] as const;

export const CURRENCIES = ['AMD', 'USD'] as const;

/** Every new account gets full access for this long before it has to subscribe. */
export const TRIAL_DURATION_HOURS = 24;

export const PASSWORD_MIN_LENGTH = 8;

export const PLAN_INTERVALS = ['month', 'year'] as const;
