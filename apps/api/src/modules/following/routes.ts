import { createWatchRequestSchema, updateWatchRequestSchema } from '@saleradar/contracts';
import { Hono } from 'hono';

import { apiError, readJson } from '../../http/errors';
import type { AppEnv } from '../../http/types';
import { findActiveSale, findStoreById } from '../catalog/repository';
import { createNotification } from '../notifications/repository';

import { createWatch, deleteWatch, listWatches, updateWatch } from './repository';

export const followingRoutes = new Hono<AppEnv>();

followingRoutes.get('/', async (c) => {
  return c.json({ items: await listWatches(c.get('user').id) });
});

followingRoutes.post('/', async (c) => {
  const parsed = createWatchRequestSchema.safeParse(await readJson(c));
  if (!parsed.success) {
    return apiError(c, 400, 'Please check the alert settings and try again.');
  }

  const store = await findStoreById(parsed.data.storeId);
  if (!store) {
    return apiError(c, 404, 'Store not found.');
  }

  const userId = c.get('user').id;
  const watch = await createWatch(userId, parsed.data);
  if (!watch) {
    return apiError(c, 409, 'Store is already followed.');
  }

  // A store that is already on sale gets an alert straight away, so a new
  // follower is not left waiting for the next change.
  const sale = await findActiveSale(store.id);
  const discount = sale?.maxDiscountPercent ?? null;
  const meetsMinimum =
    watch.minimumDiscountPercent === null ||
    (discount !== null && discount >= watch.minimumDiscountPercent);
  if (sale && watch.notifyOnSaleStart && meetsMinimum) {
    await createNotification({
      userId,
      storeId: store.id,
      type: 'sale_started',
      title: `${store.name} ${sale.title.toLowerCase()} is on`,
      body: discount === null ? 'Sale is live now' : `Up to ${discount}% off`,
    });
  }

  return c.json({ watch }, 201);
});

followingRoutes.patch('/:storeId', async (c) => {
  const parsed = updateWatchRequestSchema.safeParse(await readJson(c));
  if (!parsed.success) {
    return apiError(c, 400, 'Please check the alert settings and try again.');
  }
  const watch = await updateWatch(c.get('user').id, c.req.param('storeId'), parsed.data);
  if (!watch) {
    return apiError(c, 404, 'Watch not found.');
  }
  return c.json({ watch });
});

followingRoutes.delete('/:storeId', async (c) => {
  const deleted = await deleteWatch(c.get('user').id, c.req.param('storeId'));
  if (!deleted) {
    return apiError(c, 404, 'Watch not found.');
  }
  return c.body(null, 204);
});
