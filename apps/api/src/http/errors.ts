import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/** Error body the web client reads: `{ message }`, shown to the user as is. */
export function apiError(c: Context, status: ContentfulStatusCode, message: string) {
  return c.json({ message }, status);
}

/** Parses a JSON body, returning undefined for a missing or malformed one. */
export async function readJson(c: Context): Promise<unknown> {
  try {
    return await c.req.json();
  } catch {
    return undefined;
  }
}
