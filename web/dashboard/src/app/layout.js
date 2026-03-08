/**
 * @file layout.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/layout.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import { Geist, Geist_Mono } from "next/font/google";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SipHeron VDR",
  description: "A lightweight integrity layer on Solana that lets developers timestamp and verify any data.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-50 flex flex-col min-h-screen`}
      >
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
