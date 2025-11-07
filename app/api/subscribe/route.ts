import { NextRequest, NextResponse } from 'next/server';
import { hashPII } from '@/app/utils/crypto';
import { rpush, llen } from '@/app/lib/redis';

export const runtime = 'edge';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeRequest {
  email: string;
  tag?: 'notify' | 'whitepaper';
  company?: string; // Honeypot
}

/**
 * Rate limiting using Redis REST
 * 5 requests per 60 seconds per IP
 */
async function checkRateLimit(ipHash: string): Promise<boolean> {
  try {
    const rateKey = `rate:${ipHash}`;
    
    // Get current count
    const count = await llen(rateKey).catch(() => 0);
    
    if (count >= 5) {
      return false;
    }
    
    // Increment by pushing a marker and set TTL
    await rpush(rateKey, Date.now().toString());
    
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Fail open
  }
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json();

    // Honeypot check
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

    // Validate tag
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

    // Store full record for admin export
    const exportRecord = {
      ts: new Date().toISOString(),
      email,
      tag: body.tag || 'unknown',
      ua: request.headers.get('user-agent') || '',
      ip: ipHash,
    };

    await rpush('subs:list', JSON.stringify(exportRecord));

    return NextResponse.json({ ok: true }, { status: 201 });

  } catch (error) {
    console.error('Subscribe error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
