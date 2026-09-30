import { randomUUID } from 'node:crypto';

import type { Notification, NotificationType } from '@saleradar/contracts';

import { query, toIso, toIsoOrNull } from '../../db';

type NotificationRow = {
  id: string;
  store_id: string;
  type: NotificationType;
  title: string;
  body: string;
  created_at: Date;
  read_at: Date | null;
};

const COLUMNS = 'id, store_id, type, title, body, created_at, read_at';

function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    storeId: row.store_id,
    type: row.type,
    title: row.title,
    body: row.body,
    createdAt: toIso(row.created_at),
    readAt: toIsoOrNull(row.read_at),
  };
}

export async function listNotifications(userId: string): Promise<Notification[]> {
  const rows = await query<NotificationRow>(
    `SELECT ${COLUMNS} FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 200`,
    [userId],
  );
  return rows.map(toNotification);
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
): Promise<Notification | null> {
  const rows = await query<NotificationRow>(
    `UPDATE notifications SET read_at = COALESCE(read_at, now())
     WHERE id = $1 AND user_id = $2
     RETURNING ${COLUMNS}`,
    [notificationId, userId],
  );
  const row = rows[0];
  return row ? toNotification(row) : null;
}

export type NewNotification = {
  userId: string;
  storeId: string;
  type: NotificationType;
  title: string;
  body: string;
};

export async function createNotification(input: NewNotification): Promise<void> {
  await query(
    `INSERT INTO notifications (id, user_id, store_id, type, title, body)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [`notif_${randomUUID()}`, input.userId, input.storeId, input.type, input.title, input.body],
  );
}
