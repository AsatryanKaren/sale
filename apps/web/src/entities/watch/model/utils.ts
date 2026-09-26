export const THRESHOLD_LABELS = {
  any: 'Any sale',
  20: '20%+',
  30: '30%+',
  40: '40%+',
  50: '50%+',
} as const;

export type AlertThresholdValue = null | 20 | 30 | 40 | 50;

export function formatAlertThreshold(value: number | null): string {
  if (value === null) {
    return THRESHOLD_LABELS.any;
  }

  if (value === 20 || value === 30 || value === 40 || value === 50) {
    return THRESHOLD_LABELS[value];
  }

  return `${value}%+`;
}

export function matchesAlertThreshold(
  maxDiscountPercent: number | null,
  minimumDiscountPercent: number | null,
): boolean {
  if (minimumDiscountPercent === null) {
    return true;
  }

  if (maxDiscountPercent === null) {
    return false;
  }

  return maxDiscountPercent >= minimumDiscountPercent;
}
