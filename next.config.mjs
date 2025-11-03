// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  images: { unoptimized: true },

  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';

    // Development CSP: Relaxed to allow Next.js dev tooling
    // - unsafe-eval: Required for React Refresh and Fast Refresh
    // - unsafe-inline: Required for Next.js HMR (Hot Module Replacement)
    // - blob: and data: for dev server assets
    // - ws://localhost:* for WebSocket HMR connection
    const devCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: data:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "connect-src 'self' http://localhost:* ws://localhost:* https://api.vercel.com https://*.upstash.io https://*.vercel-storage.com",
      "font-src 'self' data:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; ');

    // Production CSP: Strict security policy
    // - NO unsafe-eval or unsafe-inline
    // - Only self-hosted scripts and styles
    // - Vercel KV and Upstash for email storage
    const prodCSP = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://*.vercel-storage.com https://api.vercel.com https://*.upstash.io",
      "font-src 'self' data:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: isDev ? devCSP : prodCSP,
          },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
