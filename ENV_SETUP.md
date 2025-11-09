# Environment Variables Setup

This document describes the required environment variables for the WispaGPT application.

## Required Variables

### Redis / KV Storage

The application requires Redis for rate limiting and data storage. You can use either:

**Option 1: Vercel KV (Recommended)**
```bash
KV_REST_API_URL=https://YOUR-UPSTASH-URL
KV_REST_API_TOKEN=YOUR-SECRET-TOKEN
NEXT_PUBLIC_SITE_ORIGIN=http://localhost:3000
```

**Option 2: Upstash Redis**
```bash
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

The application will prefer Vercel KV variables if both are set.

### Security Salt

Required for hashing PII (emails, IP addresses):

```bash
EMAIL_SALT=your_random_salt_here_min_32_chars
```

Generate a secure salt using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Optional Variables

### Origin Validation

For strict CSRF protection in production, set your site's origin:

```bash
NEXT_PUBLIC_SITE_ORIGIN=https://yourdomain.com
```

If not set, the application will validate that the Origin header matches the Host header.

## Setting Up Locally

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Setting Up on Vercel

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the required variables for Production, Preview, and Development environments
4. For KV storage, use the Vercel Dashboard to create a KV database (it will auto-populate the KV_REST_API_* variables)

