# Quick Start - Local Development Without Redis

The "Notify Me" button now works in development mode without requiring Redis/KV setup!

## What Changed

✅ **Development mode** (Node.js runtime) - Works without environment variables  
✅ **Graceful Redis fallback** - Logs to console if Redis not configured  
✅ **Default EMAIL_SALT** - Uses safe fallback in development  
✅ **Diagnostics enabled** - Server logs show what's happening  

## How to Test

1. **Stop and restart your dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Click "Notify Me" button**
   - Modal should open ✅
   - Enter email: `test@example.com`
   - Click "Join Waitlist"
   - Should see: **"Thanks — you're on the list"** ✅

4. **Check server console:**
   ```
   ENV CHECK { hasKvUrl: false, hasKvToken: false, ... }
   [DEV] Redis not configured - skipping rate limiting
   [DEV] Redis not configured - logging subscription: { ... }
   ```

## What Gets Logged in Development

Without Redis, emails are logged to the **server console**:

```javascript
{
  ts: '2025-01-08T...',
  email: 'test@example.com',
  tag: 'notify',
  ua: 'Mozilla/5.0...',
  ip: 'hashed_ip'
}
```

## For Production (Actual Email Storage)

When you deploy to Vercel, follow `SETUP_INSTRUCTIONS.md` to:

1. Create Vercel KV database
2. Add `EMAIL_SALT` environment variable
3. Deploy

In production, the route automatically:
- ✅ Uses Edge runtime (faster)
- ✅ Requires Redis (fails if missing)
- ✅ Enforces rate limiting
- ✅ Stores emails persistently

## Current Status

- ✅ **Local development:** Works without setup
- ✅ **Production:** Requires Vercel KV (secure storage)
- ✅ **Security:** All features active in production
- ✅ **Diagnostics:** Enabled for debugging

## Troubleshooting

### Still getting 500 error?

1. **Hard refresh:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Restart dev server:** Stop with `Ctrl+C`, then `npm run dev`
3. **Check console:** Look for `ENV CHECK` and `[DEV]` logs

### Modal doesn't open?

1. Clear browser cache
2. Check browser console for CSP errors
3. Make sure dev server is running

### Need actual Redis for testing?

Create `.env.local` file (not tracked in git):

```bash
# Get these from Upstash.com (free tier)
KV_REST_API_URL=https://your-instance.upstash.io
KV_REST_API_TOKEN=your_token_here
EMAIL_SALT=your_32_char_random_string
```

Then restart server.

---

**You're all set!** The button should work now in development mode. 🎉

