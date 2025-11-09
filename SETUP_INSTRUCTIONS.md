# WispA Email Collection Setup - Quick Start

## ✅ Issue Fixed
The CSP error has been resolved. The "Notify Me" button should now work in development mode.

## 🚀 To Collect Emails with Vercel + Redis

### Step 1: Set Up Vercel KV (Redis)

1. **Install dependencies first:**
   ```bash
   npm install
   ```

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your WispAGPT project

3. **Create KV Database**
   - Click **"Storage"** tab
   - Click **"Create Database"**
   - Select **"KV"** (Redis)
   - Name it: `wispagpt-kv`
   - Click **"Create"**

4. **Connect to Project**
   - Click **"Connect to Project"**
   - Select your project
   - This auto-creates these env vars:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`

### Step 2: Add Email Salt

1. **Generate a secure salt:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **In Vercel Dashboard:**
   - Go to **Settings** → **Environment Variables**
   - Add new variable:
     - **Name:** `EMAIL_SALT`
     - **Value:** (paste the generated salt)
     - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

### Step 3: Set Up Local Development

1. **Create `.env.local` file:**
   ```bash
   # Copy from Vercel Dashboard → Settings → Environment Variables
   KV_REST_API_URL=your_url_here
   KV_REST_API_TOKEN=your_token_here
   EMAIL_SALT=your_salt_here
   ```

2. **Restart your dev server:**
   ```bash
   npm run dev
   ```

### Step 4: Test It!

1. Open http://localhost:3000
2. Scroll to bottom and click **"Notify Me"**
3. Enter email and submit
4. Should see: "Thanks — you're on the list."

### Step 5: View Collected Emails

**Option A: Vercel KV Dashboard**
- Go to Storage → Your KV Database → Data Browser
- Look for key: `subs:list`

**Option B: API Endpoint** (if you set up admin access)
- Visit: `/api/admin/subs?password=YOUR_ADMIN_PASSWORD`

---

## 🔧 Troubleshooting

### "Server configuration error"
- ❌ `EMAIL_SALT` env var is missing
- ✅ Add it in Vercel Dashboard or `.env.local`

### "Redis credentials missing"
- ❌ KV database not connected
- ✅ Create KV database in Vercel Dashboard

### Modal doesn't open
- ❌ Old browser cache
- ✅ Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### CSP errors in console
- ❌ Server needs restart after middleware changes
- ✅ Stop and restart `npm run dev`

---

## 📊 What Gets Stored

Each submission stores:
```json
{
  "ts": "2025-01-08T12:00:00.000Z",
  "email": "user@example.com",
  "tag": "notify",
  "ua": "Mozilla/5.0...",
  "ip": "hashed_ip_address"
}
```

IP addresses are **hashed for privacy** using your `EMAIL_SALT`.

---

## 🔒 Security Features Active

✅ Content Security Policy (CSP) with nonce  
✅ CSRF protection via Origin validation  
✅ Rate limiting: 5 requests per 5 minutes per IP  
✅ Honeypot spam protection  
✅ Email validation with Zod  
✅ PII hashing  
✅ Accessible modal (WCAG compliant)  

---

## Need Help?

Check `ENV_SETUP.md` for detailed environment variable documentation.

