import type { Subscription } from '@saleradar/contracts';

export type AccessState =
  | { kind: 'trial'; endsAt: Date; msLeft: number }
  | { kind: 'subscribed'; renewsAt: Date | null; cancelAtPeriodEnd: boolean }
  | { kind: 'expired' };

/**
 * What the signed-in person may do right now. The server enforces the same
 * rules; the client re-derives them so the UI flips the moment a trial ends.
 */
export function getAccessState(subscription: Subscription, now: Date = new Date()): AccessState {
  if (subscription.status === 'active') {
    const renewsAt = subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null;
    if (!renewsAt || renewsAt > now || !subscription.cancelAtPeriodEnd) {
      return { kind: 'subscribed', renewsAt, cancelAtPeriodEnd: subscription.cancelAtPeriodEnd };
    }
    return { kind: 'expired' };
  }

  if (subscription.status === 'trialing') {
    const endsAt = new Date(subscription.trialEndsAt);
    const msLeft = endsAt.getTime() - now.getTime();
    if (msLeft > 0) {
      return { kind: 'trial', endsAt, msLeft };
    }
  }

  return { kind: 'expired' };
}

export function hasAccess(subscription: Subscription, now: Date = new Date()): boolean {
  return getAccessState(subscription, now).kind !== 'expired';
}

/** "23h 12m left", "45m left" or "less than a minute left". */
export function formatTimeLeft(msLeft: number): string {
  const totalMinutes = Math.floor(msLeft / 60_000);
  if (totalMinutes < 1) {
    return 'less than a minute left';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
}
