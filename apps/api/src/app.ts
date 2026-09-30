import { Hono } from 'hono';

import { config } from './config';
import { apiError } from './http/errors';
import { jsonBodyLimit, sameOriginWrites, securityHeaders } from './http/security';
import { serveWebApp } from './http/static';
import type { AppEnv } from './http/types';
import { requireUser } from './modules/auth/middleware';
import { authRoutes } from './modules/auth/routes';
import { requireAccess } from './modules/billing/middleware';
import { billingRoutes, demoRoutes, planRoutes } from './modules/billing/routes';
import { catalogRoutes } from './modules/catalog/routes';
import { followingRoutes } from './modules/following/routes';
import { notificationRoutes } from './modules/notifications/routes';

export type CreateAppOptions = {
  /** Serve the built web app for non-API paths (production). */
  webDistDir?: string | undefined;
  /** Mount /api/dev/* helpers. */
  demoTools?: boolean;
};

export function createApp(options: CreateAppOptions = {}): Hono<AppEnv> {
  const app = new Hono<AppEnv>();

  app.use('*', securityHeaders);
  app.use('/api/*', jsonBodyLimit);
  app.use('/api/*', sameOriginWrites);

  app.get('/api/health', (c) => c.json({ ok: true }));

  app.route('/api/auth', authRoutes);
  app.route('/api/plans', planRoutes);
  app.route('/api/billing', billingRoutes);
  if (options.demoTools) {
    app.route('/api/dev', demoRoutes);
  }

  // Everything below needs a signed-in account with an active trial or plan.
  for (const path of ['/api/stores', '/api/following', '/api/notifications']) {
    app.use(path, requireUser, requireAccess);
    app.use(`${path}/*`, requireUser, requireAccess);
  }
  app.route('/api/stores', catalogRoutes);
  app.route('/api/following', followingRoutes);
  app.route('/api/notifications', notificationRoutes);

  app.all('/api/*', (c) => apiError(c, 404, 'Not found.'));

  if (options.webDistDir) {
    serveWebApp(app, options.webDistDir);
  }

  app.onError((error, c) => {
    console.error(error);
    return apiError(c, 500, 'Something went wrong on our side. Please try again.');
  });

  return app;
}

export function createAppFromConfig(): Hono<AppEnv> {
  return createApp({
    webDistDir: config.isProduction ? config.webDistDir : undefined,
    demoTools: config.demoTools,
  });
}
