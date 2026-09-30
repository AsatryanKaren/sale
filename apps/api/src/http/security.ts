import type { Context, MiddlewareHandler } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { secureHeaders } from 'hono/secure-headers';

import { config } from '../config';

import { apiError } from './errors';

const JSON_LIMIT_BYTES = 64 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;

export const securityHeaders = secureHeaders({
  crossOriginResourcePolicy: false,
  referrerPolicy: 'strict-origin-when-cross-origin',
  strictTransportSecurity: 'max-age=15552000',
});

export const jsonBodyLimit = bodyLimit({
  maxSize: JSON_LIMIT_BYTES,
  onError: (c) => apiError(c, 413, 'Request body is too large.'),
});

function originAllowed(c: Context): boolean {
  const origin = c.req.header('origin');
  if (!origin) return true;

  const allowed = new Set(
    [config.appOrigin, 'http://127.0.0.1:5173', 'http://localhost:5173'].filter(
      (value): value is string => Boolean(value),
    ),
  );
  if (allowed.has(origin)) return true;

  try {
    return new URL(origin).host === (c.req.header('host') ?? '');
  } catch {
    return false;
  }
}

/**
 * Blocks cross-site writes. The session cookie is SameSite=Lax, and this check
 * covers the rest: a write must come from the app itself or APP_ORIGIN.
 */
export const sameOriginWrites: MiddlewareHandler = async (c, next) => {
  if (c.req.method === 'GET' || c.req.method === 'HEAD') return next();
  if (!originAllowed(c)) return apiError(c, 403, 'Cross-origin request blocked.');
  return next();
};

export function clientIp(c: Context): string {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
}

/** In-memory limiter for sign-in and sign-up: AUTH_RATE_LIMIT attempts per IP per 15 minutes. */
export function rateLimit(): MiddlewareHandler {
  const attempts = new Map<string, { count: number; resetAt: number }>();

  return async (c, next) => {
    const now = Date.now();
    if (attempts.size > 10_000) {
      for (const [key, value] of attempts) {
        if (value.resetAt < now) attempts.delete(key);
      }
    }

    const ip = clientIp(c);
    const current = attempts.get(ip);
    if (!current || current.resetAt < now) {
      attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    } else {
      current.count += 1;
      if (current.count > config.authRateLimit) {
        return apiError(c, 429, 'Too many attempts. Please wait a few minutes and try again.');
      }
    }

    return next();
  };
}
