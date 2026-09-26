import { createHash } from 'node:crypto';

/**
 * Hashes a raw JWT so we can store / look it up without persisting the
 * token itself. Used for refresh-token storage and access-token denylist.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Extracts the raw JWT from an "Authorization: Bearer <token>" header.
 * Returns null when the header is missing or malformed.
 */
export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');

  return scheme?.toLowerCase() === 'bearer' ? token ?? null : null;
}