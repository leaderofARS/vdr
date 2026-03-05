"use client";

/**
 * @file page.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/page.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldLink, Zap, Lock, Globe, ArrowRight, ShieldCheck, Activity, Database, Key, CheckCircle, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden flex flex-col">
      {/* Background Decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />


      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-center pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Verifiable Data Registry v2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Immutable Truth for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Digital Era.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            SipHeron VDR is the institutional backbone for content provenance. Cryptographically anchor, manage, and verify digital assets on Solana with zero-knowledge privacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center group"
            >
              Provision Organization
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/verify"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass border border-white/10 text-white font-bold text-lg hover:bg-white/5 transition-all flex items-center justify-center"
            >
              Verify a File
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-32 mb-20 px-4"
        >
          {[
            { icon: Zap, title: "Extreme Velocity", desc: "Anchored in seconds on Solana. Blazing fast off-chain indexing for instant resolution." },
            { icon: Lock, title: "Deep Privacy", desc: "ZKP Staging. Your raw data never leaves your infrastructure; only cryptographic proofs persist." },
            { icon: Globe, title: "Global Trust", desc: "Unforgeable. Every record is cryptographically timestamped and immutable by the cluster." }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-3xl text-left border border-white/5 hover:border-white/10 transition-all hover:translate-y-[-5px]">
              <div className="p-3 rounded-2xl bg-white/5 w-fit mb-6">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* How it Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl w-full mx-auto px-4 mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How SipHeron VDR Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Secure your digital assets with enterprise-grade cryptography and Solana's high-performance blockchain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -translate-y-1/2 hidden md:block" />

            {[
              { icon: FileText, title: "1. Asset Ingestion", desc: "Submit your document, binary, or dataset. SipHeron processes it locally." },
              { icon: Key, title: "2. Cryptographic Proof", desc: "Generating a secure, zero-knowledge hash signature without extracting raw data." },
              { icon: Database, title: "3. Decentralized Anchoring", desc: "The proof is permanently anchored to the Solana network as an immutable record." },
              { icon: CheckCircle, title: "4. Global Verification", desc: "Anyone can instantly and independently verify the asset's authenticity globally." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 group-hover:bg-blue-600/20 group-hover:border-blue-500/40 transition-all duration-300 shadow-xl">
                  <step.icon className="w-10 h-10 text-blue-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed px-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="pb-20 flex flex-wrap justify-center gap-12 md:gap-24">
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-1 tracking-tighter">400ms</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Block Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-1 tracking-tighter">0.0003$</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Avg. Fee</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-1 tracking-tighter">65,000+</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Peak TPS</div>
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
