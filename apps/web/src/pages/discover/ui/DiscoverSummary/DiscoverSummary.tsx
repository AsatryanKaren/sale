import type { StoreListItem, Watch } from '@saleradar/contracts';

import { Stat, StatGroup } from '@/shared/ui';

import { summarizeCatalog } from '../../model';

type DiscoverSummaryProps = {
  stores: readonly StoreListItem[];
  watches: readonly Watch[];
};

export function DiscoverSummary({ stores, watches }: DiscoverSummaryProps) {
  const summary = summarizeCatalog(stores, watches);

  return (
    <StatGroup aria-label="Catalog summary">
      <Stat label="Stores tracked" value={summary.storeCount} />
      <Stat
        label="Live sales"
        value={summary.liveSaleCount}
        hint={summary.liveSaleCount > 0 ? 'Running right now' : 'Nothing live yet'}
      />
      <Stat
        label="Best discount"
        value={summary.bestDiscountPercent === null ? '—' : `${summary.bestDiscountPercent}%`}
        {...(summary.bestDiscountStoreName ? { hint: `at ${summary.bestDiscountStoreName}` } : {})}
        tone="accent"
      />
      <Stat label="Following" value={summary.followingCount} />
    </StatGroup>
  );
}
