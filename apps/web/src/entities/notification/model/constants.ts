import type { NotificationType } from '@saleradar/contracts';

export const NOTIFICATION_TYPE_LABELS = {
  sale_started: 'Sale started',
  discount_increased: 'Deeper discount',
  new_sale_items: 'New sale items',
  sale_ending: 'Ending soon',
} as const satisfies Record<NotificationType, string>;
