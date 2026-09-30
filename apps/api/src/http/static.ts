import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';

import type { Hono } from 'hono';

import type { AppEnv } from './types';

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/**
 * Serves the built web app from `distDir`, falling back to index.html so
 * client-side routes like /stores/zara load on refresh. Hashed assets are
 * cached for a year; index.html is always revalidated.
 */
export function serveWebApp(app: Hono<AppEnv>, distDir: string): void {
  const root = resolve(distDir);
  const indexFile = join(root, 'index.html');

  app.get('*', (c) => {
    let path: string;
    try {
      path = decodeURIComponent(c.req.path);
    } catch {
      path = '/';
    }
    const requested = resolve(root, `.${path}`);
    const insideRoot = requested === root || requested.startsWith(root + sep);
    const isFile = insideRoot && existsSync(requested) && statSync(requested).isFile();
    const file = isFile ? requested : indexFile;

    if (!existsSync(file)) {
      return c.text('The web app is not built yet. Run `pnpm build` first.', 404);
    }

    const immutable = isFile && requested.startsWith(join(root, 'assets') + sep);
    return c.body(readFileSync(file), 200, {
      'Content-Type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
  });
}
