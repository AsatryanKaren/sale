import type { Currency, Plan, PlanInterval } from '@saleradar/contracts';

const FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  AMD: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }),
};

/** "1,200 ֏" or "$3". The dram sign follows the amount, as it is written in Armenia. */
export function formatPrice(amount: number, currency: Currency): string {
  const formatted = FORMATTERS[currency].format(amount);
  return currency === 'AMD' ? `${formatted} ֏` : formatted;
}

export function getPlanPriceLabel(plan: Plan, currency: Currency): string {
  return formatPrice(plan.prices[currency], currency);
}

export function findPlanByInterval(plans: Plan[], interval: PlanInterval): Plan | undefined {
  return plans.find((plan) => plan.interval === interval);
}

/**
 * Percent saved by paying yearly instead of twelve monthly payments, rounded
 * down and taken in whichever currency saves less, so the badge is never an
 * overstatement. Null when there is no monthly/yearly pair to compare.
 */
export function getAnnualSavingsPercent(plans: Plan[]): number | null {
  const monthly = findPlanByInterval(plans, 'month');
  const annual = findPlanByInterval(plans, 'year');
  if (!monthly || !annual) {
    return null;
  }

  const savings = (['AMD', 'USD'] as const).map((currency) => {
    const monthlyTotal = monthly.prices[currency] * 12;
    return monthlyTotal > 0
      ? Math.floor(((monthlyTotal - annual.prices[currency]) / monthlyTotal) * 100)
      : 0;
  });
  const lowest = Math.min(...savings);
  return lowest > 0 ? lowest : null;
}
