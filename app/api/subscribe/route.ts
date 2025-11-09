/**
 * Email subscription API endpoint - PRODUCTION MODE
 * 
 * Security features:
 * - Zod validation for email
 * - CSRF/Origin validation
 * - Rate limiting via @upstash/ratelimit (5 req/5min per IP)
 * - Honeypot spam protection
 * - PII hashing for privacy
 * - Edge runtime for performance
 * 
 * REQUIRES: Redis/KV credentials must be set
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPII } from '@/app/utils/crypto';
import { getRedisClient, getRateLimiter } from '@/app/lib/redis';
import { 
  subscribeRequestSchema, 
  validateOrigin, 
  getClientIP 
} from '@/app/lib/validation';

// Edge runtime for optimal performance
export const runtime = 'edge';

/**
 * POST /api/subscribe
 * Subscribe an email to the waitlist
 */
export async function POST(request: NextRequest) {
  try {
    // 0. Verify Redis credentials are configured (REQUIRED)
    if (!process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
      console.error('[CONFIG] Redis configuration missing. Email cannot be saved.');
      return NextResponse.json(
        { ok: false, error: 'Server misconfigured' },
        { status: 500 }
      );
    }

    if (!process.env.KV_REST_API_TOKEN && !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.error('[CONFIG] Redis token missing. Email cannot be saved.');
      return NextResponse.json(
        { ok: false, error: 'Server misconfigured' },
        { status: 500 }
      );
    }

    if (!process.env.EMAIL_SALT) {
      console.error('[CONFIG] EMAIL_SALT missing. Email cannot be saved.');
      return NextResponse.json(
        { ok: false, error: 'Server misconfigured' },
        { status: 500 }
      );
    }

    // 1. CSRF Protection: Validate origin
    if (!validateOrigin(request)) {
      console.warn('[SECURITY] Invalid origin blocked', {
        origin: request.headers.get('origin'),
        host: request.headers.get('host'),
      });
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // 2. Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // 3. Validate with Zod schema
    const validation = subscribeRequestSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid request data' },
        { status: 400 }
      );
    }

    const { email, tag, company } = validation.data;

    // 4. Honeypot check - if filled, silently succeed
    if (company && company.trim() !== '') {
      console.info('[SECURITY] Honeypot triggered', { email: 'redacted' });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 5. Rate limiting per IP (REQUIRED)
    const clientIP = getClientIP(request);
    const rateLimiter = getRateLimiter();
    const { success: rateLimitOk, limit, remaining, reset } = await rateLimiter.limit(clientIP);
    
    if (!rateLimitOk) {
      const resetDate = new Date(reset);
      console.warn('[SECURITY] Rate limit exceeded', { 
        ip: clientIP.substring(0, 8) + '...', // Partial IP for logs
        reset: resetDate.toISOString() 
      });
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((reset - Date.now()) / 1000) 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(reset),
          }
        }
      );
    }

    // 6. Hash PII for privacy (REQUIRED)
    const salt = process.env.EMAIL_SALT;
    const ipHash = await hashPII(clientIP, salt);

    // 7. Store subscription in Redis (REQUIRED)
    const redis = getRedisClient();
    
    // Store individual email record with timestamp as key
    const timestamp = Date.now();
    await redis.set(`sub:${email}`, timestamp);
    
    // Also store in a list for admin access
    const record = {
      ts: new Date().toISOString(),
      email,
      tag: tag || 'notify',
      ua: request.headers.get('user-agent') || '',
      ip: ipHash,
    };
    await redis.rpush('subs:list', JSON.stringify(record));

    console.log('[SUCCESS] Email stored in Redis:', email);

    // 8. Success response
    return NextResponse.json(
      { ok: true },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
        }
      }
    );

  } catch (error) {
    // Log error without exposing sensitive details
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ERROR] Subscribe failed:', errorMessage);
    
    return NextResponse.json(
      { ok: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Reject non-POST requests
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}
