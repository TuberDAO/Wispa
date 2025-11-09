import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Generate a cryptographically secure nonce for CSP
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}

/**
 * Build strict Content Security Policy with nonce
 * In development, allows 'unsafe-eval' for Next.js hot reload
 */
function buildCSP(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  const cspDirectives = [
    `default-src 'self'`,
    // In dev: allow unsafe-eval for Next.js HMR; in prod: strict nonce-only
    `script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline'`, // Tailwind requires this for @apply
    `img-src 'self' data: https:`,
    `connect-src 'self' ${isDev ? 'ws: wss:' : ''} https:`, // WebSocket for HMR in dev
    `font-src 'self' data:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
  ];
  
  // Only add upgrade-insecure-requests in production (causes issues in dev)
  if (!isDev) {
    cspDirectives.push('upgrade-insecure-requests');
  }
  
  return cspDirectives.join('; ');
}

export function middleware(request: NextRequest) {
  // Generate cryptographic nonce for this request
  const nonce = generateNonce();
  
  const response = NextResponse.next();
  
  // Set nonce in custom header so layout can access it
  response.headers.set('x-nonce', nonce);
  
  // Content Security Policy with nonce
  response.headers.set('Content-Security-Policy', buildCSP(nonce));
  
  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '0'); // Disabled in favor of CSP
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  
  // HTTPS redirect in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    const httpsUrl = `https://${request.headers.get('host')}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(httpsUrl, 301);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes are handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

