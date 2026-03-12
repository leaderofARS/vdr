/**
 * @file layout.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/layout.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import GlobalNavbar from "@/components/navbar/GlobalNavbar";
import CookieConsent from "@/components/ui/CookieConsent";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://app.sipheron.com'),
  title: {
    default: 'SipHeron VDR — Blockchain Document Verification on Solana',
    template: '%s | SipHeron VDR'
  },
  description: 'Anchor document hashes on Solana. Prove authenticity without uploading files. Immutable. Instant. Verifiable.',
  keywords: ['document verification', 'blockchain', 'Solana', 'hash registry', 'document authenticity', 'VDR', 'notarization'],
  authors: [{ name: 'SipHeron', url: 'https://sipheron.com' }],
  creator: 'SipHeron',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sipheron.com',
    siteName: 'SipHeron VDR',
    title: 'SipHeron VDR — Blockchain Document Verification',
    description: 'Anchor document hashes on Solana. Prove authenticity without uploading files.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'SipHeron VDR'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SipHeron VDR — Blockchain Document Verification',
    description: 'Anchor document hashes on Solana. Immutable. Instant. Verifiable.',
    images: ['/og-image.png'],
    creator: '@sipheron'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-50 flex flex-col min-h-screen`}
      >
        <div className="global-navbar-wrapper">
          <GlobalNavbar />
          <CookieConsent />
        </div>
        <Script
          defer
          data-domain="sipheron.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        <main className="flex-1">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
