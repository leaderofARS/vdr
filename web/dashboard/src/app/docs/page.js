"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Database, ArrowRight, Code2, Terminal, ChevronRight, Activity, Cpu, Globe } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-invert max-w-none space-y-16"
        >
            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-mono">Documentation</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">
                    The Verifiable Data <br />
                    Registry Protocol.
                </h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed mb-8">
                    SipHeron VDR is a purpose-built cryptographic layer for anchoring and resolving digital asset provenance.
                    It bridges the gap between raw data storage and institutional verification using the Solana blockchain.
                </p>
            </div>

            {/* The Mission Section */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">The Problem: Truth in the AI Era</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6 text-gray-400 font-light leading-relaxed">
                        <p>
                            We are entering an era where generative models can simulate high-fidelity data with zero cost.
                            From scientific datasets to institutional contracts, the <span className="text-white font-medium">cost of forgery</span> has dropped to near-zero.
                        </p>
                        <p>
                            Traditional checksums and PKI systems are insufficient for global, high-frequency data anchoring. They lack
                            <span className="text-white font-medium"> immutable timestamps, public availability</span>, and <span className="text-white font-medium">high-throughput resolution</span>.
                        </p>
                        <p>
                            SipHeron VDR provides an <span className="text-blue-400 font-medium italic italic">Unforgeable Ledger of Provenance</span>. By anchoring a SHA-256 fingerprint
                            instead of raw data, we enable absolute verification without sacrificing privacy or speed.
                        </p>
                    </div>
                    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                            <h4 className="text-lg font-bold text-white">Trust without Disclosure</h4>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed font-light italic italic">
                            "The VDR protocol ensures that the 'Fingerprint' of your data survives long after the 'Container' is gone. Anyone with the file
                            can prove it existed exactly in this state, at this time, owned by this institution."
                        </p>
                    </div>
                </div>
            </section>

            {/* How it Works: The Mental Model */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Core Architecture</h2>
                <div className="space-y-12">
                    <p className="text-gray-400 font-light text-lg">
                        The SipHeron VDR protocol is built on three core pillars:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-[#050505] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-colors group">
                            <Lock className="w-8 h-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-4">1. Local Staging</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-light">
                                All hashing happens in your secure environment. Raw bytes never leave your node. This provides
                                <span className="text-white"> Zero-Knowledge Staging</span>—proving content without exposing it.
                            </p>
                        </div>
                        <div className="p-8 bg-[#050505] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-colors group">
                            <Activity className="w-8 h-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-4">2. CPI Anchoring</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-light">
                                Anchors are submitted via Cross-Program Invocations (CPI) on Solana. This creates a permanent
                                <span className="text-white"> PDA (Program Derived Address)</span> that maps your identity to the asset hash.
                            </p>
                        </div>
                        <div className="p-8 bg-[#050505] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-colors group">
                            <Zap className="w-8 h-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-4">3. Universal Resolve</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-light">
                                Anyone can query the Solana network directly to verify an asset. Verification takes <span className="text-white">&lt;400ms</span>
                                globally, making it suitable for real-time verification pipelines.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Protocol Primitives */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Technical Primitives</h2>
                <div className="bg-[#050505] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Component</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Specification</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-light text-gray-400">
                            <tr className="border-b border-white/5">
                                <td className="p-6 text-white font-bold">Hashing Algorithm</td>
                                <td className="p-6 font-mono font-mono text-gray-500">SHA-256 (64-character hex string)</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="p-6 text-white font-bold">Blockchain Layer</td>
                                <td className="p-6 text-gray-500">Solana Mainnet-Beta (Devnet for testing)</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="p-6 text-white font-bold">Smart Contract</td>
                                <td className="p-6 font-mono font-mono text-gray-500">SipHeron VDR v0.9 (Anchor-based)</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="p-6 text-white font-bold">Data Persistence</td>
                                <td className="p-6 text-gray-500">PDA State (Program Derived Address) with Account Realloc</td>
                            </tr>
                            <tr>
                                <td className="p-6 text-white font-bold">Identity Model</td>
                                <td className="p-6 text-gray-500">Ed25519 Public Key Cryptography</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Next Step CTA */}
            <div className="mt-32 p-12 bg-gradient-to-br from-blue-900/10 to-[#050505] border border-blue-500/10 rounded-3xl flex flex-col items-center text-center">
                <h2 className="text-3xl font-black mb-4">Ready to dive in?</h2>
                <p className="text-gray-400 font-light mb-8 max-w-lg">
                    Begin your journey by installing the SipHeron CLI and setting up your local cryptographic environment.
                </p>
                <Link href="/docs/installation" className="px-10 py-5 bg-white text-black font-bold flex items-center gap-3 hover:bg-gray-200 transition-all group rounded-xl">
                    Proceed to Installation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
