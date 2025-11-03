import { NextRequest, NextResponse } from 'next/server';
import { sha256Hex, hashPII } from '@/app/utils/crypto';

// Edge Runtime for better performance and KV compatibility
export const runtime = 'edge';

// Simple RFC-ish email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeRequest {
  email: string;
  tag?: 'notify' | 'whitepaper';
  company?: string; // Honeypot field
}

interface StoredEmail {
  email: string;
  tag?: string;
  ts: number;
  ua?: string;
  ipHash: string;
}

/**
 * Rate limiting using Vercel KV
 * 5 requests per 60 seconds per IP
 */
async function checkRateLimit(ipHash: string): Promise<boolean> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    // No rate limiting in dev without KV
    return true;
  }

  const rateKey = `rate:${ipHash}`;
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  try {
    // Get current count
    const getResponse = await fetch(`${kvUrl}/get/${rateKey}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });

    let count = 0;
    if (getResponse.ok) {
      const data = await getResponse.json();
      count = parseInt(data.result || '0', 10);
    }

    if (count >= 5) {
      return false; // Rate limit exceeded
    }

    // Increment counter with 60s TTL
    await fetch(`${kvUrl}/set/${rateKey}/${count + 1}/ex/60`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kvToken}` },
    });

    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Fail open
  }
}

/**
 * Store email in Vercel KV
 */
async function storeInKV(emailHash: string, data: StoredEmail): Promise<boolean> {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return false;
  }

  try {
    const key = `email:${emailHash}`;
    const response = await fetch(`${kvUrl}/set/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error('KV storage failed:', error);
    return false;
  }
}

/**
 * Local fallback for development (file-based storage)
 * ONLY used when KV envs are missing and NOT on Vercel
 */
async function storeLocalFallback(emailHash: string, data: StoredEmail): Promise<boolean> {
  // Reject if running on Vercel
  if (process.env.VERCEL) {
    throw new Error('Local storage not available in production');
  }

  // Edge Runtime doesn't have fs access
  // This would need to be handled differently in a real dev setup
  // For now, just log it
  console.log('[DEV] Email stored (in-memory only):', { emailHash, tag: data.tag });
  return true;
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  // Try Vercel's forwarded IP headers first
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return '127.0.0.1'; // Fallback
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json();

    // Honeypot check - if company field is filled, silently reject
    if (body.company && body.company.trim() !== '') {
      return NextResponse.json({ ok: true }, { status: 204 });
    }

    // Validate email
    const email = body.email?.trim().toLowerCase();
    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate tag if provided
    if (body.tag && !['notify', 'whitepaper'].includes(body.tag)) {
      return NextResponse.json(
        { error: 'Invalid tag' },
        { status: 400 }
      );
    }

    const salt = process.env.EMAIL_SALT || 'default-salt-change-me';
    const clientIP = getClientIP(request);
    const ipHash = await hashPII(clientIP, salt);

    // Rate limiting
    const rateLimitOk = await checkRateLimit(ipHash);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Hash email for storage key
    const emailHash = await hashPII(email, salt);

    // Prepare data to store
    const data: StoredEmail = {
      email,
      tag: body.tag,
      ts: Date.now(),
      ua: request.headers.get('user-agent') || undefined,
      ipHash,
    };

    // Try to store in KV first
    const kvStored = await storeInKV(emailHash, data);

    // If KV not available and not on Vercel, use local fallback
    if (!kvStored && !process.env.VERCEL) {
      await storeLocalFallback(emailHash, data);
    } else if (!kvStored && process.env.VERCEL) {
      // KV should be available on Vercel
      return NextResponse.json(
        { error: 'Storage unavailable' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });

  } catch (error) {
    console.error('Subscribe error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

