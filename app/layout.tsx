import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "WispAGPT - Verifiable AI Built on MegaETH",
  description: "AI that runs privately inside secure enclaves and proves its integrity on-chain. Trusted by users, verifiable by cryptography.",
  keywords: ["AI", "blockchain", "MegaETH", "privacy", "verifiable AI", "crypto", "secure inference"],
  authors: [{ name: "WispAGPT Team" }],
  openGraph: {
    title: "WispAGPT - Verifiable AI Built on MegaETH",
    description: "AI that runs privately inside secure enclaves and proves its integrity on-chain.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WispAGPT - Verifiable AI Built on MegaETH",
    description: "AI that runs privately inside secure enclaves and proves its integrity on-chain.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get CSP nonce from middleware (if any scripts need it)
  const headersList = headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="gradient-background" />
        <div className="grid-background" />
        <div className="scan-lines" />
        {children}
        {/* Any future scripts that need nonce can use: <Script nonce={nonce} /> */}
      </body>
    </html>
  );
}

