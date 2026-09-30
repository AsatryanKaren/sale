import { expect, test } from '@playwright/test';

import {
  formatDiscountLabel,
  formatDiscountPercent,
  getSaleTone,
} from '../../src/entities/sale/model/utils';
import { formatAlertThreshold, matchesAlertThreshold } from '../../src/entities/watch/model/utils';
import { getStoreInitials } from '../../src/shared/lib/storeIdentity';
import {
  parseDiscoverFilters,
  serializeDiscoverFilters,
  toStoreListQuery,
} from '../../src/pages/discover/model/filters';
import { summarizeCatalog } from '../../src/pages/discover/model/summary';
import { storeKeys } from '../../src/entities/store/api/queryKeys';
import { getStoreDomain, getStoreLogoCandidates } from '../../src/entities/store/model/logo';

test.describe('discount formatting', () => {
  test('formats known percentages', () => {
    expect(formatDiscountPercent(50)).toBe('50%');
    expect(formatDiscountLabel(40)).toBe('Up to 40%');
  });

  test('handles unknown discounts', () => {
    expect(formatDiscountPercent(null)).toBeNull();
    expect(formatDiscountLabel(null)).toBe('Discount unknown');
  });

  test('maps sale tone', () => {
    expect(getSaleTone(50)).toBe('hot');
    expect(getSaleTone(25)).toBe('moderate');
    expect(getSaleTone(10)).toBe('muted');
    expect(getSaleTone(null)).toBe('muted');
  });
});

test.describe('alert thresholds', () => {
  test('formats threshold labels', () => {
    expect(formatAlertThreshold(null)).toBe('Any sale');
    expect(formatAlertThreshold(40)).toBe('40%+');
  });

  test('matches thresholds', () => {
    expect(matchesAlertThreshold(50, null)).toBe(true);
    expect(matchesAlertThreshold(50, 40)).toBe(true);
    expect(matchesAlertThreshold(30, 40)).toBe(false);
    expect(matchesAlertThreshold(null, 20)).toBe(false);
  });
});

test.describe('store identity helpers', () => {
  test('builds initials', () => {
    expect(getStoreInitials('Zara')).toBe('ZA');
    expect(getStoreInitials('New Balance')).toBe('NB');
    expect(getStoreInitials('')).toBe('?');
  });
});

test.describe('discover filter serialization', () => {
  test('round-trips url params', () => {
    const filters = parseDiscoverFilters(
      new URLSearchParams('search=zara&category=fashion&sale=active&sort=sale'),
    );

    expect(filters).toEqual({
      search: 'zara',
      category: 'fashion',
      sale: 'active',
      sort: 'sale',
    });

    expect(serializeDiscoverFilters(filters).toString()).toBe(
      'search=zara&category=fashion&sale=active&sort=sale',
    );
    expect(toStoreListQuery(filters)).toEqual({
      search: 'zara',
      category: 'fashion',
      hasActiveSale: true,
      sort: 'sale',
    });
  });
});

test.describe('query key factories', () => {
  test('builds stable store keys', () => {
    expect(storeKeys.list({ search: 'zara' })).toEqual(['stores', 'list', { search: 'zara' }]);
    expect(storeKeys.detail('zara')).toEqual(['stores', 'detail', 'zara']);
  });
});

test.describe('discover summary', () => {
  test('counts live sales and finds the best discount', () => {
    const store = (id: string, name: string) => ({
      id,
      slug: id,
      name,
      websiteUrl: 'https://example.com',
      countryCode: 'AM',
      category: 'fashion' as const,
      isActive: true,
    });
    const sale = (storeId: string, maxDiscountPercent: number | null) => ({
      id: `sale_${storeId}`,
      storeId,
      title: 'Sale',
      kind: 'promotion' as const,
      status: 'active' as const,
      minDiscountPercent: null,
      maxDiscountPercent,
      startedAt: '2026-06-01T00:00:00.000Z',
      endsAt: null,
      sourceUrl: null,
      updatedAt: '2026-06-01T00:00:00.000Z',
    });

    const summary = summarizeCatalog(
      [
        { store: store('a', 'Alpha'), activeSale: sale('a', 30) },
        { store: store('b', 'Beta'), activeSale: sale('b', 55) },
        { store: store('c', 'Gamma'), activeSale: null },
      ],
      [],
    );

    expect(summary).toEqual({
      storeCount: 3,
      liveSaleCount: 2,
      followingCount: 0,
      bestDiscountPercent: 55,
      bestDiscountStoreName: 'Beta',
    });
  });
});

test.describe('store logos', () => {
  test('normalizes store domains', () => {
    expect(getStoreDomain('https://www.zara.com')).toBe('zara.com');
    expect(getStoreDomain('https://shop.mango.com/am')).toBe('mango.com');
    expect(getStoreDomain('https://ispace.am')).toBe('ispace.am');
    expect(getStoreDomain('not a url')).toBeNull();
  });

  test('prefers the curated logo, then favicon services', () => {
    expect(
      getStoreLogoCandidates({
        websiteUrl: 'https://www.zara.com',
        logoUrl: 'https://cdn.example.com/zara.svg',
      }),
    ).toEqual([
      'https://cdn.example.com/zara.svg',
      'https://www.google.com/s2/favicons?domain=zara.com&sz=128',
      'https://icons.duckduckgo.com/ip3/zara.com.ico',
    ]);
    expect(
      getStoreLogoCandidates({ websiteUrl: 'https://www.nike.com', logoUrl: null }),
    ).toHaveLength(2);
  });
});
