# WispAGPT - Verifiable AI on MegaETH

A high-security, single-page landing website for WispAGPT, a private, verifiable AI inference platform powered by MegaETH blockchain.

## 🚀 Features

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for modern, responsive styling
- **High Security**: Strict CSP headers, XSS protection, HTTPS enforcement
- **Rate Limiting**: Built-in rate limiting stubs for API protection
- **SEO Optimized**: Complete meta tags and Open Graph support
- **Privacy First**: No external tracking, telemetry, or analytics
- **Vercel Ready**: Optimized for instant deployment

## 🏗️ Project Structure

```
WispaGPT/
├── app/
│   ├── components/
│   │   └── EmailModal.tsx       # Secure email capture modal
│   ├── utils/
│   │   └── sanitize.ts          # Input sanitization & rate limiting
│   ├── globals.css              # Global styles & grid background
│   ├── layout.tsx               # Root layout with SEO meta tags
│   └── page.tsx                 # Main landing page
├── public/
│   └── grid.svg                 # Subtle grid background pattern
├── next.config.mjs              # Security headers & configuration
├── tailwind.config.ts           # Tailwind theme customization
└── package.json
```

## 🛠️ Installation

1. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. **Open in browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/wispagpt)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and deploy
4. Set environment variables if needed (see `.env.example`)

## 🔒 Security Features

### Content Security Policy (CSP)
Strict CSP headers configured in `next.config.mjs`:
- Blocks inline scripts (except necessary ones)
- Restricts external resources to approved domains
- Prevents clickjacking and XSS attacks

### Input Sanitization
All user inputs are sanitized in `app/utils/sanitize.ts`:
- Email validation and sanitization
- XSS prevention
- HTML tag stripping
- Character whitelisting

### Rate Limiting
Basic rate limiting implemented for API endpoints:
- In-memory store (replace with Redis in production)
- Configurable limits per endpoint
- Automatic cleanup of old records

### HTTPS Enforcement
- Strict-Transport-Security headers
- HTTPS-only cookies (when implemented)
- Secure referrer policy

## 🎨 Design System

### Colors
- **Primary Green**: `#00ff88` (cyber-green)
- **Background**: `#050810` (cyber-darker)
- **Dark**: `#0a0e1a` (cyber-dark)
- **Border**: `#1a2332` (cyber-border)

### Grid Background
Subtle translucent grid pattern with green lines:
- 40px × 40px squares
- 8% opacity green lines
- Seamless tiling across all screen sizes

### Typography
System font stack for optimal performance:
- -apple-system, BlinkMacSystemFont
- Segoe UI, Roboto, Oxygen
- Clean, readable, and fast loading

## 🔌 Future Extensions

### Web3 Wallet Integration (Placeholder)
Ready for wallet connection implementation:
```typescript
// Commented placeholders in code for:
// - WalletConnect integration
// - MetaMask connection
// - MegaETH network configuration
```

### Email Service Integration
Replace the mock submission in `EmailModal.tsx` with your preferred service:
- Mailchimp
- SendGrid
- Custom API endpoint
- Database storage

### API Routes
Create API routes in `app/api/` for:
- Email capture: `/api/subscribe`
- Contact form: `/api/contact`
- Whitepaper download: `/api/whitepaper`

## 📝 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.wispagpt.com

# Email Service
EMAIL_SERVICE_API_KEY=your_key_here

# Web3 Configuration
NEXT_PUBLIC_MEGAETH_RPC_URL=https://rpc.megaeth.com
NEXT_PUBLIC_CHAIN_ID=1

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

## 🧪 Lighthouse Score

Target scores:
- **Performance**: 90+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100
- **Security**: No high/medium vulnerabilities

## 📄 License

All rights reserved © 2025 WispAGPT

## 🤝 Contributing

This is a private project. For inquiries, contact the WispAGPT team.

---

**Powered by MegaETH** 🚀

