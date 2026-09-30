import { Hono } from 'hono';

import { apiError } from '../../http/errors';
import type { AppEnv } from '../../http/types';

import { listNotifications, markNotificationRead } from './repository';

export const notificationRoutes = new Hono<AppEnv>();

notificationRoutes.get('/', async (c) => {
  return c.json({ items: await listNotifications(c.get('user').id) });
});

notificationRoutes.patch('/:notificationId/read', async (c) => {
  const notification = await markNotificationRead(c.get('user').id, c.req.param('notificationId'));
  if (!notification) {
    return apiError(c, 404, 'Notification not found.');
  }
  return c.json({ notification });
});
