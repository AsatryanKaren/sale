import { expect, test } from '@playwright/test';

import { formatDiscountLabel, formatDiscountPercent, getSaleTone } from '../../src/entities/sale/model/utils';
import { formatAlertThreshold, matchesAlertThreshold } from '../../src/entities/watch/model/utils';
import { getStoreInitials } from '../../src/shared/lib/storeIdentity';
import {
  parseDiscoverFilters,
  serializeDiscoverFilters,
  toStoreListQuery,
} from '../../src/pages/discover/model/filters';
import { storeKeys } from '../../src/entities/store/api/queryKeys';

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
    expect(storeKeys.list({ search: 'zara' })).toEqual([
      'stores',
      'list',
      { search: 'zara' },
    ]);
    expect(storeKeys.detail('zara')).toEqual(['stores', 'detail', 'zara']);
  });
});
