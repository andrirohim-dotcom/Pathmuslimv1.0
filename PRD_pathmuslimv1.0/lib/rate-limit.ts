import { NextRequest } from 'next/server';
import { createError } from '@/lib/errors';

interface RateLimitOptions {
  /** Maximum number of requests in the time window */
  limit: number;
  /** Time window in milliseconds */
  window: number;
}

interface WindowEntry {
  timestamps: number[];
}

// In-memory store — suitable for single-instance dev/staging.
// For multi-instance production, replace with Redis.
const store = new Map<string, WindowEntry>();

/** Get the client identifier from the request (IP or user id). */
function getKey(request: NextRequest, prefix: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `${prefix}:${ip}`;
}

/** Get the authenticated user key, falling back to IP. */
function getUserKey(request: NextRequest, prefix: string): string {
  const userId = request.headers.get('x-user-id');
  if (userId && userId !== 'anonymous') return `${prefix}:user:${userId}`;
  return getKey(request, prefix);
}

/**
 * Sliding-window rate limiter.
 *
 * @param key    Unique string identifying the caller (e.g. IP or user id).
 * @param opts   { limit, window } — max requests per window ms.
 * @throws AppError (429) when the limit is exceeded.
 */
export function rateLimitByKey(key: string, opts: RateLimitOptions): void {
  const now = Date.now();
  const windowStart = now - opts.window;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Drop timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= opts.limit) {
    throw createError.rateLimitExceeded();
  }

  entry.timestamps.push(now);
}

/**
 * Rate-limit by IP address.
 * Use for unauthenticated endpoints (e.g. search).
 */
export function rateLimitByIp(
  request: NextRequest,
  prefix: string,
  opts: RateLimitOptions
): void {
  rateLimitByKey(getKey(request, prefix), opts);
}

/**
 * Rate-limit by authenticated user id, falling back to IP.
 * Use for endpoints that require auth (e.g. submit question, helpful).
 */
export function rateLimitByUser(
  request: NextRequest,
  prefix: string,
  opts: RateLimitOptions
): void {
  rateLimitByKey(getUserKey(request, prefix), opts);
}
