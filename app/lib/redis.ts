/**
 * Upstash Redis client for Vercel Edge Runtime
 * Supports both KV_REST_API_* (preferred) and UPSTASH_REDIS_REST_* env vars
 */

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

function getEnv(name: string): string | undefined {
  return process.env[name]?.trim();
}

/**
 * Get Redis credentials from environment variables
 * Prefers KV_REST_API_* (Vercel KV), falls back to UPSTASH_REDIS_REST_*
 */
function getCredentials(): { url: string; token: string } {
  // Prefer Vercel KV env vars
  const kvUrl = getEnv('KV_REST_API_URL');
  const kvToken = getEnv('KV_REST_API_TOKEN');
  
  if (kvUrl && kvToken) {
    return { url: kvUrl, token: kvToken };
  }
  
  // Fallback to Upstash env vars
  const upstashUrl = getEnv('UPSTASH_REDIS_REST_URL');
  const upstashToken = getEnv('UPSTASH_REDIS_REST_TOKEN');
  
  if (upstashUrl && upstashToken) {
    return { url: upstashUrl, token: upstashToken };
  }

  throw new Error(
    'Redis credentials missing. Set either:\n' +
    '  - KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV)\n' +
    '  - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (Upstash)'
  );
}

/**
 * Singleton Redis client instance
 */
let redisInstance: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisInstance) {
    const { url, token } = getCredentials();
    redisInstance = new Redis({ url, token });
  }
  return redisInstance;
}

/**
 * Singleton Ratelimit instance for email subscriptions
 * 5 requests per 5 minutes per IP
 */
let rateLimiterInstance: Ratelimit | null = null;

export function getRateLimiter(): Ratelimit {
  if (!rateLimiterInstance) {
    const redis = getRedisClient();
    rateLimiterInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(5, '300s'), // 5 requests per 5 minutes
      analytics: true,
      prefix: 'ratelimit:subscribe',
    });
  }
  return rateLimiterInstance;
}

/**
 * Legacy compatibility functions for existing code
 */
export async function rpush(key: string, value: string): Promise<number> {
  const redis = getRedisClient();
  return redis.rpush(key, value);
}

export async function lrange(
  key: string,
  start: number,
  stop: number
): Promise<string[]> {
  const redis = getRedisClient();
  return redis.lrange(key, start, stop);
}

export async function llen(key: string): Promise<number> {
  const redis = getRedisClient();
  return redis.llen(key);
}

