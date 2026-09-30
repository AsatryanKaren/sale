import {
  PLAN_CATALOG,
  TRIAL_DURATION_HOURS,
  type PlanId,
  type Subscription,
  type SubscriptionStatus,
} from '@saleradar/contracts';

import { query, toIso, toIsoOrNull } from '../../db';

const HOUR_MS = 60 * 60 * 1000;

type SubscriptionRow = {
  status: SubscriptionStatus;
  plan: PlanId | null;
  trial_ends_at: Date;
  current_period_end: Date | null;
  cancel_at_period_end: boolean;
};

function toSubscription(row: SubscriptionRow): Subscription {
  return {
    status: row.status,
    plan: row.plan,
    trialEndsAt: toIso(row.trial_ends_at),
    currentPeriodEnd: toIsoOrNull(row.current_period_end),
    cancelAtPeriodEnd: row.cancel_at_period_end,
  };
}

export function addPlanPeriod(from: Date, plan: PlanId): Date {
  const next = new Date(from);
  if (PLAN_CATALOG[plan].interval === 'year') {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}

async function save(userId: string, subscription: Subscription): Promise<Subscription> {
  await query(
    `INSERT INTO subscriptions (user_id, status, plan, trial_ends_at, current_period_end, cancel_at_period_end)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO UPDATE SET
       status = EXCLUDED.status,
       plan = EXCLUDED.plan,
       trial_ends_at = EXCLUDED.trial_ends_at,
       current_period_end = EXCLUDED.current_period_end,
       cancel_at_period_end = EXCLUDED.cancel_at_period_end`,
    [
      userId,
      subscription.status,
      subscription.plan,
      subscription.trialEndsAt,
      subscription.currentPeriodEnd,
      subscription.cancelAtPeriodEnd,
    ],
  );
  return subscription;
}

/** Starts the free trial for a new account. */
export async function startTrial(userId: string, now = new Date()): Promise<Subscription> {
  return save(userId, {
    status: 'trialing',
    plan: null,
    trialEndsAt: new Date(now.getTime() + TRIAL_DURATION_HOURS * HOUR_MS).toISOString(),
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  });
}

/**
 * Applies the time-based transitions (trial ended, paid period ended) and
 * returns the current subscription. A paid plan that was not cancelled renews
 * for another period; payments are simulated until a provider is connected.
 */
export async function getSubscription(userId: string, now = new Date()): Promise<Subscription> {
  const rows = await query<SubscriptionRow>(
    `SELECT status, plan, trial_ends_at, current_period_end, cancel_at_period_end
     FROM subscriptions WHERE user_id = $1`,
    [userId],
  );
  const row = rows[0];
  if (!row) {
    // Accounts always get a row at sign-up; treat a missing one as an ended trial.
    return save(userId, {
      status: 'expired',
      plan: null,
      trialEndsAt: now.toISOString(),
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    });
  }

  const current = toSubscription(row);
  let next = current;

  if (current.status === 'trialing' && new Date(current.trialEndsAt) <= now) {
    next = { ...current, status: 'expired' };
  }

  if (
    current.status === 'active' &&
    current.currentPeriodEnd &&
    new Date(current.currentPeriodEnd) <= now
  ) {
    next =
      current.cancelAtPeriodEnd || !current.plan
        ? { ...current, status: 'expired' }
        : { ...current, currentPeriodEnd: addPlanPeriod(now, current.plan).toISOString() };
  }

  return next === current ? current : save(userId, next);
}

export async function activatePlan(
  userId: string,
  plan: PlanId,
  now = new Date(),
): Promise<Subscription> {
  const current = await getSubscription(userId, now);
  return save(userId, {
    ...current,
    status: 'active',
    plan,
    currentPeriodEnd: addPlanPeriod(now, plan).toISOString(),
    cancelAtPeriodEnd: false,
  });
}

export async function setCancelAtPeriodEnd(
  userId: string,
  cancelAtPeriodEnd: boolean,
): Promise<Subscription | null> {
  const current = await getSubscription(userId);
  if (current.status !== 'active') {
    return null;
  }
  return save(userId, { ...current, cancelAtPeriodEnd });
}

export async function expireNow(userId: string, now = new Date()): Promise<Subscription> {
  return save(userId, {
    status: 'expired',
    plan: null,
    trialEndsAt: now.toISOString(),
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  });
}
