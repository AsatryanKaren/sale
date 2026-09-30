import { randomUUID } from 'node:crypto';

import {
  loginRequestSchema,
  signupRequestSchema,
  type SessionResponse,
  type User,
} from '@saleradar/contracts';
import bcrypt from 'bcryptjs';
import { Hono } from 'hono';

import { config } from '../../config';
import { query } from '../../db';
import { apiError, readJson } from '../../http/errors';
import { rateLimit } from '../../http/security';
import type { AppEnv } from '../../http/types';
import { getSubscription, startTrial } from '../billing/subscriptions';

import { requireUser } from './middleware';
import {
  clearSessionCookie,
  createSession,
  deleteSession,
  readSessionCookie,
  toUser,
  writeSessionCookie,
} from './sessions';

const BCRYPT_ROUNDS = config.env === 'test' ? 4 : 12;

async function sessionResponse(user: User): Promise<SessionResponse> {
  return { user, subscription: await getSubscription(user.id) };
}

export const authRoutes = new Hono<AppEnv>();

const limitAttempts = rateLimit();

authRoutes.get('/session', requireUser, async (c) => {
  return c.json(await sessionResponse(c.get('user')));
});

authRoutes.post('/signup', limitAttempts, async (c) => {
  const parsed = signupRequestSchema.safeParse(await readJson(c));
  if (!parsed.success) {
    return apiError(c, 400, 'Please check the form and try again.');
  }

  const email = parsed.data.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(parsed.data.password, BCRYPT_ROUNDS);
  const rows = await query<{ id: string; email: string; name: string; created_at: Date }>(
    `INSERT INTO users (id, email, name, password_hash)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, name, created_at`,
    [`user_${randomUUID()}`, email, parsed.data.name.trim(), passwordHash],
  );
  const row = rows[0];
  if (!row) {
    return apiError(c, 409, 'An account with this email already exists. Try signing in.');
  }

  const user = toUser(row);
  await startTrial(user.id);
  writeSessionCookie(c, await createSession(user.id));
  return c.json(await sessionResponse(user), 201);
});

authRoutes.post('/login', limitAttempts, async (c) => {
  const parsed = loginRequestSchema.safeParse(await readJson(c));
  const invalid = () => apiError(c, 401, 'Email or password is incorrect.');
  if (!parsed.success) {
    return invalid();
  }

  const rows = await query<{
    id: string;
    email: string;
    name: string;
    created_at: Date;
    password_hash: string;
  }>('SELECT id, email, name, created_at, password_hash FROM users WHERE email = $1', [
    parsed.data.email.trim().toLowerCase(),
  ]);
  const row = rows[0];
  if (!row || !(await bcrypt.compare(parsed.data.password, row.password_hash))) {
    return invalid();
  }

  const user = toUser(row);
  writeSessionCookie(c, await createSession(user.id));
  return c.json(await sessionResponse(user));
});

authRoutes.post('/logout', async (c) => {
  const sessionId = readSessionCookie(c);
  if (sessionId) {
    await deleteSession(sessionId);
  }
  clearSessionCookie(c);
  return c.body(null, 204);
});
