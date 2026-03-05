"use client";

/**
 * @file page.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/page.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldLink, Zap, Lock, Globe, ArrowRight, ShieldCheck, Activity, Database, Key, CheckCircle, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden flex flex-col">
      {/* Background Decorations - Scale.com Style (Subtle, Stark) */}
      <div className="absolute inset-0 bg-[#000000] z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/40 via-[#000000] to-[#000000] z-0 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#000000] to-[#000000] opacity-50 z-0 pointer-events-none" />

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-center pt-40 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="mb-10 w-32 h-32 mx-auto relative group"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[40px] rounded-full group-hover:bg-blue-400/30 transition-colors duration-500" />
            <Image
              src="/sipheron_vdap_logo.png"
              alt="SipHeron Logo"
              fill
              className="object-contain relative z-10 drop-shadow-[0_0_30px_rgba(37,99,235,0.8)] filter brightness-110"
              priority
            />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 mb-10 transition-colors hover:bg-white/10">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-gray-300 tracking-wide">SipHeron VDR Protocol v0.9 Available</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1]">
            Data Infrastructure <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">Built for Truth</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light tracking-tight">
            The cryptographic layer for institutional provenance. Anchor, verify, and resolve digital assets on Solana with absolute cryptographic certainty.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center group"
            >
              Start Building
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/verify"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-base hover:bg-white/5 transition-colors flex items-center justify-center"
            >
              Public Verifier
            </Link>
          </div>
        </motion.div>

        {/* Console/Code Preview Mockup (Scale.com style) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-24 w-full max-w-5xl mx-auto text-left"
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#111]">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs font-mono text-gray-500">vdr-cli anchor asset.bin</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              <div className="text-gray-400"><span className="text-blue-400">➜</span>  <span className="text-white">vdr</span> anchor ./dataset_v2.csv --sign</div>
              <div className="text-gray-500 mt-2">Computing SHA-256 local entropy... [██████████] 100%</div>
              <div className="text-gray-500">Hash: <span className="text-emerald-400">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span></div>
              <div className="text-gray-500 mt-2">Connecting to Solana Mainnet-Beta...</div>
              <div className="text-gray-500">Submitting CPI instruction to SipHeron Registry...</div>
              <div className="text-white mt-2 font-bold">✓ Asset anchored successfully</div>
              <div className="text-gray-500">Tx: <span className="text-blue-400 underline cursor-pointer">4fG29...8Pqm</span></div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid - Scale.com Style (Minimal, Sharp) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-32 mb-20 px-4"
        >
          {[
            { icon: Zap, title: "Extreme Velocity", desc: "Anchored in seconds on Solana. Blazing fast off-chain indexing for instant resolution." },
            { icon: Lock, title: "Deep Privacy", desc: "ZKP Staging. Your raw data never leaves your infrastructure; only cryptographic proofs persist." },
            { icon: Globe, title: "Global Trust", desc: "Unforgeable. Every record is cryptographically timestamped and immutable by the cluster." }
          ].map((feature, i) => (
            <div key={i} className="group relative p-8 bg-[#050505] border justify-start border-white/10 hover:border-gray-500 transition-colors duration-300 text-left overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <feature.icon className="w-5 h-5 text-gray-300 mb-6" />
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* How it Works Section - Scale.com Style (Technical, Linear) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl w-full mx-auto px-4 mb-32 mt-16"
        >
          <div className="text-left mb-16 border-b border-white/10 pb-8">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">The Integration Flow</h2>
            <p className="text-gray-400 max-w-2xl text-lg font-light">Secure your digital assets with enterprise-grade cryptography and Solana's high-performance blockchain. Deploy in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-white/10 bg-[#050505] divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { icon: FileText, title: "Asset Ingestion", desc: "Submit your document, binary, or dataset via API or CLI. SipHeron processes it locally." },
              { icon: Key, title: "Zero-Knowledge Hash", desc: "Generating a secure SHA-256 signature locally without extracting or uploading raw data." },
              { icon: Database, title: "Network Anchoring", desc: "The cryptographic proof is permanently anchored to the Solana network as an immutable PDA." },
              { icon: CheckCircle, title: "Atomic Verification", desc: "Anyone can instantly and independently verify the asset's authenticity globally." }
            ].map((step, i) => (
              <div key={i} className="p-8 relative group hover:bg-white/[0.02] transition-colors text-left flex flex-col justify-start">
                <div className="text-[10px] font-mono text-gray-600 mb-4">0{i + 1}</div>
                <step.icon className="w-6 h-6 text-gray-300 mb-6" />
                <h4 className="text-base font-bold text-white mb-3">{step.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section - Scale.com Style (Monochrome, Stark) */}
        <div className="pb-20 pt-10 border-t border-white/10 w-full max-w-6xl mx-auto flex flex-wrap justify-between gap-12 px-8">
          <div className="text-left">
            <div className="text-4xl font-black text-white mb-2 tracking-tighter">400ms</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Block Finality</div>
          </div>
          <div className="text-left">
            <div className="text-4xl font-black text-white mb-2 tracking-tighter">~$0.0003</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Average Tx Fee</div>
          </div>
          <div className="text-left">
            <div className="text-4xl font-black text-white mb-2 tracking-tighter">65,000+</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Peak Network TPS</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-gray-500 text-sm font-medium">
            © 2026 SipHeron VDR Protocol. Built on Solana for Creators.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Activity className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><ShieldCheck className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
