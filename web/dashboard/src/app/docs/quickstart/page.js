"use client";

import { motion } from "framer-motion";
import { Terminal, Copy, Check, ArrowRight, Download, Shield } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function QuickstartPage() {
    const [copied, setCopied] = useState(false);
    const installCmd = "npm install -g @sipheron/vdr-cli";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(installCmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert max-w-none"
        >
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">Tutorial</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">Quickstart</h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                    Get up and running with the SipHeron VDR protocol in under 2 minutes. This guide will walk you through installing the CLI and anchoring your first cryptographic proof.
                </p>
            </div>

            <section className="mt-16">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-black flex items-center justify-center font-black text-sm">1</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Install the CLI</h3>
                </div>
                <p className="text-gray-400 font-light mb-6">
                    The SipHeron CLI is the primary interface for local hashing and Solana communication. Install it globally via NPM:
                </p>

                <div className="relative group not-prose">
                    <div className="bg-[#050505] border border-white/10 rounded-xl p-6 font-mono text-sm overflow-hidden flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-blue-500 opacity-50 select-none">➜</span>
                            <span className="text-gray-300">{installCmd}</span>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                        </button>
                    </div>
                </div>
            </section>

            <section className="mt-20">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-black flex items-center justify-center font-black text-sm">2</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Authenticate</h3>
                </div>
                <p className="text-gray-400 font-light mb-6">
                    Link your local environment to your SipHeron organization using your API key.
                </p>
                <div className="bg-[#050505] border border-white/10 rounded-xl p-6 font-mono text-xs text-gray-500 not-prose">
                    <div className="mb-1"><span className="text-blue-500">➜</span> sipheron-vdr link &lt;your_api_key&gt;</div>
                    <div className="text-emerald-500">✓ Identity successfully mapped to organization "SipHeron Labs"</div>
                </div>
            </section>

            <section className="mt-20">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-black flex items-center justify-center font-black text-sm">3</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Anchor Your First Asset</h3>
                </div>
                <p className="text-gray-400 font-light mb-6">
                    Stage a file locally to compute its cryptographic hash, then anchor it to the Solana network.
                </p>
                <div className="space-y-4 not-prose">
                    <div className="bg-[#050505] border border-white/10 rounded-xl p-6 font-mono text-xs text-gray-500 whitespace-pre">
                        <div className="mb-2"><span className="text-blue-500">➜</span> sipheron-vdr stage ./my_document.pdf</div>
                        <div className="text-emerald-500">✓ Hash computed locally: 1580...b9f26</div>
                        <div className="text-gray-600 italic">Privacy check: Raw file data never leaves your machine.</div>

                        <div className="mt-4 mb-2"><span className="text-blue-500">➜</span> sipheron-vdr anchor</div>
                        <div className="text-white">Preparing to push...</div>
                        <div className="text-emerald-400">Successfully dispatched to Solana!</div>
                        <div>Job ID: <span className="text-blue-400 underline">71f2...0e1f</span></div>
                    </div>
                </div>
            </section>

            <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                    <div>
                        <h4 className="text-lg font-black mb-2">Next Step: Deep Dive</h4>
                        <p className="text-sm text-gray-400 font-light leading-relaxed">Learn how to manage batch uploads and custom metadata.</p>
                    </div>
                    <Link href="/docs/cli-stage" className="mt-8 text-blue-400 text-sm font-bold flex items-center gap-2 group">
                        Explore CLI Guide
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                    <div>
                        <h4 className="text-lg font-black mb-2">API Integration</h4>
                        <p className="text-sm text-gray-400 font-light leading-relaxed">Integrate anchoring directly into your existing infrastructure.</p>
                    </div>
                    <Link href="/docs/api-overview" className="mt-8 text-blue-400 text-sm font-bold flex items-center gap-2 group">
                        View API Spec
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
