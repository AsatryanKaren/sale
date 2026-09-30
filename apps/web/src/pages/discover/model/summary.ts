import type { StoreListItem, Watch } from '@saleradar/contracts';

export type CatalogSummary = {
  storeCount: number;
  liveSaleCount: number;
  followingCount: number;
  bestDiscountPercent: number | null;
  bestDiscountStoreName: string | null;
};

export function summarizeCatalog(
  stores: readonly StoreListItem[],
  watches: readonly Watch[],
): CatalogSummary {
  let liveSaleCount = 0;
  let bestDiscountPercent: number | null = null;
  let bestDiscountStoreName: string | null = null;

  for (const { store, activeSale } of stores) {
    if (activeSale?.status !== 'active') {
      continue;
    }

    liveSaleCount += 1;
    const discount = activeSale.maxDiscountPercent;
    if (discount !== null && (bestDiscountPercent === null || discount > bestDiscountPercent)) {
      bestDiscountPercent = discount;
      bestDiscountStoreName = store.name;
    }
  }

  return {
    storeCount: stores.length,
    liveSaleCount,
    followingCount: watches.length,
    bestDiscountPercent,
    bestDiscountStoreName,
  };
}
