export const SALE_KINDS = [
  'seasonal_sale',
  'promotion',
  'clearance',
  'special_offer',
] as const;

export const SALE_STATUSES = ['active', 'upcoming', 'expired'] as const;

export const SALE_HISTORY_EVENT_TYPES = [
  'sale_started',
  'discount_increased',
  'discount_decreased',
  'sale_ended',
] as const;
