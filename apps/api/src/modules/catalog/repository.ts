import type { Sale, SaleHistoryEvent, Store, StoreCategory, StoreSort } from '@saleradar/contracts';

import { query, toIso, toIsoOrNull } from '../../db';

type StoreRow = {
  id: string;
  slug: string;
  name: string;
  website_url: string;
  logo_url: string | null;
  country_code: string;
  category: Store['category'];
  is_active: boolean;
};

type SaleRow = {
  id: string;
  store_id: string;
  title: string;
  kind: Sale['kind'];
  status: Sale['status'];
  min_discount_percent: number | null;
  max_discount_percent: number | null;
  started_at: Date;
  ends_at: Date | null;
  source_url: string | null;
  updated_at: Date;
};

type HistoryRow = {
  id: string;
  store_id: string;
  sale_id: string;
  type: SaleHistoryEvent['type'];
  max_discount_percent: number | null;
  occurred_at: Date;
  label: string;
};

const STORE_COLUMNS = 'id, slug, name, website_url, logo_url, country_code, category, is_active';
const SALE_COLUMNS = `id, store_id, title, kind, status, min_discount_percent, max_discount_percent,
  started_at, ends_at, source_url, updated_at`;

function toStore(row: StoreRow): Store {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    websiteUrl: row.website_url,
    logoUrl: row.logo_url,
    countryCode: row.country_code,
    category: row.category,
    isActive: row.is_active,
  };
}

function toSale(row: SaleRow): Sale {
  return {
    id: row.id,
    storeId: row.store_id,
    title: row.title,
    kind: row.kind,
    status: row.status,
    minDiscountPercent: row.min_discount_percent,
    maxDiscountPercent: row.max_discount_percent,
    startedAt: toIso(row.started_at),
    endsAt: toIsoOrNull(row.ends_at),
    sourceUrl: row.source_url,
    updatedAt: toIso(row.updated_at),
  };
}

function toHistoryEvent(row: HistoryRow): SaleHistoryEvent {
  return {
    id: row.id,
    storeId: row.store_id,
    saleId: row.sale_id,
    type: row.type,
    maxDiscountPercent: row.max_discount_percent,
    occurredAt: toIso(row.occurred_at),
    label: row.label,
  };
}

export type StoreFilters = {
  search?: string | undefined;
  category?: StoreCategory | undefined;
  hasActiveSale?: boolean | undefined;
  sort?: StoreSort | undefined;
};

export async function listStores(
  filters: StoreFilters,
): Promise<{ store: Store; activeSale: Sale | null }[]> {
  const where: string[] = ['is_active'];
  const params: unknown[] = [];

  const search = filters.search?.trim().toLowerCase();
  if (search) {
    params.push(`%${search.replace(/[\\%_]/g, (char) => `\\${char}`)}%`);
    where.push(`(lower(name) LIKE $${params.length} OR slug LIKE $${params.length})`);
  }
  if (filters.category) {
    params.push(filters.category);
    where.push(`category = $${params.length}`);
  }

  const stores = (
    await query<StoreRow>(
      `SELECT ${STORE_COLUMNS} FROM stores WHERE ${where.join(' AND ')}`,
      params,
    )
  ).map(toStore);
  const activeSales = await listActiveSales();

  let items = stores.map((store) => ({ store, activeSale: activeSales.get(store.id) ?? null }));

  if (filters.hasActiveSale === true) {
    items = items.filter((item) => item.activeSale !== null);
  }

  if (filters.sort === 'sale') {
    const discount = (sale: Sale | null) => sale?.maxDiscountPercent ?? -1;
    items.sort((left, right) => discount(right.activeSale) - discount(left.activeSale));
  } else if (filters.sort === 'recent') {
    items.sort((left, right) => right.store.name.localeCompare(left.store.name));
  } else {
    items.sort((left, right) => left.store.name.localeCompare(right.store.name));
  }

  return items;
}

async function listActiveSales(): Promise<Map<string, Sale>> {
  const rows = await query<SaleRow>(
    `SELECT ${SALE_COLUMNS} FROM sales WHERE status = 'active' ORDER BY updated_at DESC`,
  );
  const byStore = new Map<string, Sale>();
  for (const row of rows) {
    if (!byStore.has(row.store_id)) byStore.set(row.store_id, toSale(row));
  }
  return byStore;
}

export async function findStoreBySlug(slug: string): Promise<Store | null> {
  const rows = await query<StoreRow>(`SELECT ${STORE_COLUMNS} FROM stores WHERE slug = $1`, [slug]);
  const row = rows[0];
  return row ? toStore(row) : null;
}

export async function findStoreById(id: string): Promise<Store | null> {
  const rows = await query<StoreRow>(`SELECT ${STORE_COLUMNS} FROM stores WHERE id = $1`, [id]);
  const row = rows[0];
  return row ? toStore(row) : null;
}

export async function findActiveSale(storeId: string): Promise<Sale | null> {
  const rows = await query<SaleRow>(
    `SELECT ${SALE_COLUMNS} FROM sales
     WHERE store_id = $1 AND status = 'active'
     ORDER BY updated_at DESC LIMIT 1`,
    [storeId],
  );
  const row = rows[0];
  return row ? toSale(row) : null;
}

export async function listSaleHistory(storeId: string): Promise<SaleHistoryEvent[]> {
  const rows = await query<HistoryRow>(
    `SELECT id, store_id, sale_id, type, max_discount_percent, occurred_at, label
     FROM sale_history WHERE store_id = $1 ORDER BY occurred_at DESC`,
    [storeId],
  );
  return rows.map(toHistoryEvent);
}
