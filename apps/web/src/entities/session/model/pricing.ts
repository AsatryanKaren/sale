import { PLAN_CATALOG, type Currency, type PlanId } from '@saleradar/contracts';

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

export function getPlanPriceLabel(planId: PlanId, currency: Currency): string {
  return formatPrice(PLAN_CATALOG[planId].prices[currency], currency);
}

/** Percent saved by paying yearly instead of twelve monthly payments, rounded down. */
export function getAnnualSavingsPercent(currency: Currency): number {
  const monthlyTotal = PLAN_CATALOG.monthly.prices[currency] * 12;
  const annual = PLAN_CATALOG.annual.prices[currency];
  return Math.floor(((monthlyTotal - annual) / monthlyTotal) * 100);
}
