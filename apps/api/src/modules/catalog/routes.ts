import { storeCategorySchema, storeSortSchema } from '@saleradar/contracts';
import { Hono } from 'hono';

import { apiError } from '../../http/errors';
import type { AppEnv } from '../../http/types';

import { findActiveSale, findStoreBySlug, listSaleHistory, listStores } from './repository';

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return undefined;
}

export const catalogRoutes = new Hono<AppEnv>();

catalogRoutes.get('/', async (c) => {
  const category = storeCategorySchema.safeParse(c.req.query('category'));
  const sort = storeSortSchema.safeParse(c.req.query('sort'));
  const items = await listStores({
    search: c.req.query('search'),
    category: category.success ? category.data : undefined,
    hasActiveSale: parseBoolean(c.req.query('hasActiveSale')),
    sort: sort.success ? sort.data : undefined,
  });
  return c.json({ items });
});

catalogRoutes.get('/:slug', async (c) => {
  const store = await findStoreBySlug(c.req.param('slug'));
  if (!store) {
    return apiError(c, 404, 'Store not found.');
  }
  return c.json({ store });
});

catalogRoutes.get('/:slug/sales', async (c) => {
  const store = await findStoreBySlug(c.req.param('slug'));
  if (!store) {
    return apiError(c, 404, 'Store not found.');
  }
  const [activeSale, history] = await Promise.all([
    findActiveSale(store.id),
    listSaleHistory(store.id),
  ]);
  return c.json({ activeSale, history });
});
