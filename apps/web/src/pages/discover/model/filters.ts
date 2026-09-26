import type { StoreCategory, StoreListQuery } from '@saleradar/contracts';
import { STORE_CATEGORIES } from '@saleradar/contracts';

export type DiscoverFilters = {
  search: string;
  category: StoreCategory | 'all';
  sale: 'all' | 'active';
  sort: NonNullable<StoreListQuery['sort']>;
};

export const DEFAULT_DISCOVER_FILTERS: DiscoverFilters = {
  search: '',
  category: 'all',
  sale: 'all',
  sort: 'name',
};

function isStoreCategory(value: string): value is StoreCategory {
  return (STORE_CATEGORIES as readonly string[]).includes(value);
}

export function parseDiscoverFilters(
  params: URLSearchParams,
): DiscoverFilters {
  const search = params.get('search')?.trim() ?? '';
  const categoryParam = params.get('category');
  const saleParam = params.get('sale');
  const sortParam = params.get('sort');

  const category =
    categoryParam && isStoreCategory(categoryParam) ? categoryParam : 'all';
  const sale = saleParam === 'active' ? 'active' : 'all';
  const sort =
    sortParam === 'sale' || sortParam === 'recent' || sortParam === 'name'
      ? sortParam
      : 'name';

  return {
    search,
    category,
    sale,
    sort,
  };
}

export function serializeDiscoverFilters(
  filters: DiscoverFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search.trim().length > 0) {
    params.set('search', filters.search.trim());
  }

  if (filters.category !== 'all') {
    params.set('category', filters.category);
  }

  if (filters.sale === 'active') {
    params.set('sale', 'active');
  }

  if (filters.sort !== 'name') {
    params.set('sort', filters.sort);
  }

  return params;
}

export function toStoreListQuery(filters: DiscoverFilters): StoreListQuery {
  const query: StoreListQuery = {
    sort: filters.sort,
  };

  if (filters.search.trim().length > 0) {
    query.search = filters.search.trim();
  }

  if (filters.category !== 'all') {
    query.category = filters.category;
  }

  if (filters.sale === 'active') {
    query.hasActiveSale = true;
  }

  return query;
}
