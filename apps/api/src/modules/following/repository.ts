import { randomUUID } from 'node:crypto';

import type { CreateWatchRequest, UpdateWatchRequest, Watch } from '@saleradar/contracts';

import { query, toIso } from '../../db';

type WatchRow = {
  id: string;
  store_id: string;
  minimum_discount_percent: number | null;
  notify_on_sale_start: boolean;
  notify_on_discount_increase: boolean;
  notify_on_new_sale_items: boolean;
  created_at: Date;
};

const COLUMNS = `id, store_id, minimum_discount_percent, notify_on_sale_start,
  notify_on_discount_increase, notify_on_new_sale_items, created_at`;

function toWatch(row: WatchRow): Watch {
  return {
    id: row.id,
    storeId: row.store_id,
    minimumDiscountPercent: row.minimum_discount_percent,
    notifyOnSaleStart: row.notify_on_sale_start,
    notifyOnDiscountIncrease: row.notify_on_discount_increase,
    notifyOnNewSaleItems: row.notify_on_new_sale_items,
    createdAt: toIso(row.created_at),
  };
}

export async function listWatches(userId: string): Promise<Watch[]> {
  const rows = await query<WatchRow>(
    `SELECT ${COLUMNS} FROM watches WHERE user_id = $1 ORDER BY created_at`,
    [userId],
  );
  return rows.map(toWatch);
}

/** Returns null when the user already follows the store. */
export async function createWatch(
  userId: string,
  input: CreateWatchRequest,
): Promise<Watch | null> {
  const rows = await query<WatchRow>(
    `INSERT INTO watches (id, user_id, store_id, minimum_discount_percent, notify_on_sale_start,
       notify_on_discount_increase, notify_on_new_sale_items)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id, store_id) DO NOTHING
     RETURNING ${COLUMNS}`,
    [
      `watch_${randomUUID()}`,
      userId,
      input.storeId,
      input.minimumDiscountPercent ?? null,
      input.notifyOnSaleStart ?? true,
      input.notifyOnDiscountIncrease ?? true,
      input.notifyOnNewSaleItems ?? false,
    ],
  );
  const row = rows[0];
  return row ? toWatch(row) : null;
}

export async function updateWatch(
  userId: string,
  storeId: string,
  input: UpdateWatchRequest,
): Promise<Watch | null> {
  const rows = await query<WatchRow>(
    `UPDATE watches SET
       minimum_discount_percent = CASE WHEN $3 THEN $4::integer ELSE minimum_discount_percent END,
       notify_on_sale_start = COALESCE($5, notify_on_sale_start),
       notify_on_discount_increase = COALESCE($6, notify_on_discount_increase),
       notify_on_new_sale_items = COALESCE($7, notify_on_new_sale_items)
     WHERE user_id = $1 AND store_id = $2
     RETURNING ${COLUMNS}`,
    [
      userId,
      storeId,
      input.minimumDiscountPercent !== undefined,
      input.minimumDiscountPercent ?? null,
      input.notifyOnSaleStart ?? null,
      input.notifyOnDiscountIncrease ?? null,
      input.notifyOnNewSaleItems ?? null,
    ],
  );
  const row = rows[0];
  return row ? toWatch(row) : null;
}

export async function deleteWatch(userId: string, storeId: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    'DELETE FROM watches WHERE user_id = $1 AND store_id = $2 RETURNING id',
    [userId, storeId],
  );
  return rows.length > 0;
}
