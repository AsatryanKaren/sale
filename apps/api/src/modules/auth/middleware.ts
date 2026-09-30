import type { MiddlewareHandler } from 'hono';

import { apiError } from '../../http/errors';
import type { AppEnv } from '../../http/types';

import { findSessionUser, readSessionCookie } from './sessions';

/** 401 unless the request carries a live session; sets `user` and `sessionId`. */
export const requireUser: MiddlewareHandler<AppEnv> = async (c, next) => {
  const sessionId = readSessionCookie(c);
  const user = sessionId ? await findSessionUser(sessionId) : null;
  if (!sessionId || !user) {
    return apiError(c, 401, 'Please sign in to continue.');
  }
  c.set('user', user);
  c.set('sessionId', sessionId);
  return next();
};
