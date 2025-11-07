import { NextRequest, NextResponse } from 'next/server';
import { llen, lrange } from '@/app/lib/redis';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Auth check
  const adminKey = request.headers.get('x-admin-key');
  
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    // Parse n param
    const { searchParams } = new URL(request.url);
    const nParam = searchParams.get('n');
    let n = parseInt(nParam || '50', 10);
    
    // Clamp between 1 and 1000
    if (isNaN(n) || n < 1) n = 50;
    if (n > 1000) n = 1000;

    // Get list length
    const len = await llen('subs:list');
    
    // Calculate range for last n items
    const start = Math.max(0, len - n);
    const raw = await lrange('subs:list', start, -1);
    
    // Parse and reverse to get newest first
    const items = raw.map((item) => {
      try {
        return JSON.parse(item);
      } catch {
        return { raw: item };
      }
    }).reverse();

    return NextResponse.json(
      {
        count: items.length,
        items,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    return NextResponse.json(
      {
        error: 'internal error',
        message: error instanceof Error ? error.message : 'unknown',
      },
      { status: 500 }
    );
  }
}
