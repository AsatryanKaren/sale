/**
 * Validates a post-login `next` target so only in-app paths are followed
 * (never `//evil.example` or absolute URLs).
 */
export function getSafeRedirectPath(next: string | null, fallback = '/discover'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return fallback;
  }

  return next;
}
