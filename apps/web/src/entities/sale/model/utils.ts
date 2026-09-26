export function formatDiscountPercent(value: number | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return `${value}%`;
}

export function formatDiscountLabel(value: number | null | undefined): string {
  const formatted = formatDiscountPercent(value);
  if (!formatted) {
    return 'Discount unknown';
  }

  return `Up to ${formatted}`;
}

export function isSaleActive(status: string): boolean {
  return status === 'active';
}

export function getSaleTone(
  maxDiscountPercent: number | null | undefined,
): 'hot' | 'moderate' | 'muted' {
  if (maxDiscountPercent === null || maxDiscountPercent === undefined) {
    return 'muted';
  }

  if (maxDiscountPercent >= 40) {
    return 'hot';
  }

  if (maxDiscountPercent >= 20) {
    return 'moderate';
  }

  return 'muted';
}
