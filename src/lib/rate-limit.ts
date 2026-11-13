/**
 * Rate limiter for server API routes (default: 5 submissions per hour per IP).
 * Uses Upstash Redis REST API when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * are configured in production, with a clean in-memory sliding-window fallback
 * for local development and tests.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAtMs: number;
}

const DEFAULT_MAX_REQUESTS = 5;
const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const memoryBuckets = new Map<string, number[]>();

export async function checkRateLimit(
  identifier: string,
  maxRequests = DEFAULT_MAX_REQUESTS,
  windowMs = DEFAULT_WINDOW_MS,
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const key = `iseoluwa:ratelimit:contact:${identifier}`;
      const windowSec = Math.ceil(windowMs / 1000);
      const response = await fetch(`${upstashUrl.replace(/\/$/, '')}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSec, 'NX'],
          ['TTL', key],
        ]),
      });

      if (response.ok) {
        const json = (await response.json()) as Array<{ result?: number }>;
        const count = Number(json?.[0]?.result ?? 1);
        const ttlSec = Number(json?.[2]?.result ?? windowSec);
        return {
          allowed: count <= maxRequests,
          remaining: Math.max(0, maxRequests - count),
          resetAtMs: Date.now() + Math.max(1, ttlSec) * 1000,
        };
      }
    } catch {
      // Fall back to in-memory limiter if Upstash is unreachable
    }
  }

  const now = Date.now();
  const windowStart = now - windowMs;
  const existing = memoryBuckets.get(identifier) ?? [];
  const activeTimestamps = existing.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= maxRequests) {
    const oldest = activeTimestamps[0] ?? now;
    return {
      allowed: false,
      remaining: 0,
      resetAtMs: oldest + windowMs,
    };
  }

  activeTimestamps.push(now);
  memoryBuckets.set(identifier, activeTimestamps);

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - activeTimestamps.length),
    resetAtMs: now + windowMs,
  };
}

export function resetMemoryRateLimiter(): void {
  memoryBuckets.clear();
}
