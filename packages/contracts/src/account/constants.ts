export const PLAN_IDS = ['monthly', 'annual'] as const;

export const SUBSCRIPTION_STATUSES = ['trialing', 'active', 'expired'] as const;

export const CURRENCIES = ['AMD', 'USD'] as const;

/** Every new account gets full access for this long before it has to subscribe. */
export const TRIAL_DURATION_HOURS = 24;

export const PASSWORD_MIN_LENGTH = 8;

/**
 * Static price list. Prices are fixed per currency rather than converted, so a
 * shopper always sees the same round number in drams and in dollars.
 */
export const PLAN_CATALOG = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    interval: 'month',
    prices: { AMD: 1200, USD: 3 },
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    interval: 'year',
    prices: { AMD: 11500, USD: 29 },
  },
} as const;
