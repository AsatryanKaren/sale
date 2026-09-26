import type { StoreCategory } from '@saleradar/contracts';

import { CATEGORY_LABELS } from './constants';

export function getCategoryLabel(category: StoreCategory): string {
  return CATEGORY_LABELS[category];
}
