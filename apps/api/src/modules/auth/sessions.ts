import { randomBytes } from 'node:crypto';

import type { User } from '@saleradar/contracts';
import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { config } from '../../config';
import { query, toIso } from '../../db';

const COOKIE_NAME = 'saleradar_session';
const SESSION_DAYS = 14;

type UserRow = {
  id: string;
  email: string;
  name: string;
  created_at: Date;
};

export function toUser(row: UserRow): User {
  return { id: row.id, email: row.email, name: row.name, createdAt: toIso(row.created_at) };
}

export async function createSession(userId: string): Promise<string> {
  await query('DELETE FROM sessions WHERE expires_at <= now()');
  const id = randomBytes(32).toString('hex');
  await query(
    `INSERT INTO sessions (id, user_id, expires_at)
     VALUES ($1, $2, now() + make_interval(days => $3))`,
    [id, userId, SESSION_DAYS],
  );
  return id;
}

export async function findSessionUser(sessionId: string): Promise<User | null> {
  const rows = await query<UserRow>(
    `SELECT users.id, users.email, users.name, users.created_at
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = $1 AND sessions.expires_at > now()`,
    [sessionId],
  );
  const row = rows[0];
  return row ? toUser(row) : null;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await query('DELETE FROM sessions WHERE id = $1', [sessionId]);
}

export function readSessionCookie(c: Context): string | undefined {
  return getCookie(c, COOKIE_NAME);
}

export function writeSessionCookie(c: Context, sessionId: string): void {
  setCookie(c, COOKIE_NAME, sessionId, {
    httpOnly: true,
    path: '/',
    sameSite: 'Lax',
    secure: config.isProduction,
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export function clearSessionCookie(c: Context): void {
  deleteCookie(c, COOKIE_NAME, { path: '/', secure: config.isProduction });
}
