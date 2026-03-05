"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Database, ArrowRight, Code2, Terminal, ChevronRight, Activity, Cpu, Globe, CheckCircle, Server, Link as LinkIcon } from "lucide-react";
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
            <div id="overview">
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

            {/* Why SipHeron? Philosophical Contrast */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Why SipHeron?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                    <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-5 h-5 text-red-500" />
                            <h4 className="text-white font-bold">Traditional Storage</h4>
                        </div>
                        <ul className="space-y-3 text-xs text-gray-500 font-light list-none p-0">
                            <li className="flex gap-2"><span>✕</span> <span>Mutable: Files can be overwritten without a trace.</span></li>
                            <li className="flex gap-2"><span>✕</span> <span>Centralized: Trust resides in the cloud provider.</span></li>
                            <li className="flex gap-2"><span>✕</span> <span>Ephemeral: If the company vanishes, the "proof" dies with it.</span></li>
                        </ul>
                    </div>
                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <h4 className="text-white font-bold">SipHeron VDR</h4>
                        </div>
                        <ul className="space-y-3 text-xs text-gray-500 font-light list-none p-0">
                            <li className="flex gap-2"><span className="text-emerald-500">✓</span> <span className="text-gray-300">Immutable: Every anchor is a permanent cryptographic law.</span></li>
                            <li className="flex gap-2"><span className="text-emerald-500">✓</span> <span className="text-gray-300">Decentralized: Verification lives on the global Solana ledger.</span></li>
                            <li className="flex gap-2"><span className="text-emerald-500">✓</span> <span className="text-gray-300">Eternal: Proof persists even if SipHeron infrastructure goes offline.</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* The Mission Section */}
            <section id="the-problem" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">The Problem: Truth in the AI Era</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6 text-gray-400 font-light leading-relaxed">
                        <p>
                            We are entering an era where generative models can simulate high-fidelity data with zero cost. From scientific datasets used to train models to institutional contracts, the <span className="text-white font-medium">cost of forgery</span> has effectively dropped to zero.
                        </p>
                        <p>
                            SipHeron VDR provides an <span className="text-blue-400 font-medium italic italic">Unforgeable Ledger of Provenance</span>. By anchoring a SHA-256 fingerprint instead of raw data, we enable absolute verification without sacrificing data privacy or storage efficiency.
                        </p>
                    </div>
                    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 mb-6 relative">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                            <h4 className="text-lg font-bold text-white">The Economics of Truth</h4>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed font-light italic italic relative">
                            "In a world where data is infinite and easily manufactured, the only thing that matters is the <strong>source</strong> and the <strong>time</strong>. SipHeron VDR turns provenance from a business process into a cryptographic law."
                        </p>
                    </div>
                </div>
            </section>

            {/* How it Works: The Mental Model */}
            <section id="core-architecture" className="pt-8 border-t border-white/5">
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

            {/* Lifecycle of an Anchor */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Lifecycle of an Anchor</h2>
                <div className="relative">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 hidden md:block" />
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                        {[
                            { label: "Draft", desc: "Local File", icon: Database },
                            { label: "Staged", desc: "SHA-256 Digest", icon: CheckCircle },
                            { label: "Signed", desc: "Ed25519 Authority", icon: Lock },
                            { label: "Anchored", desc: "Solana Transaction", icon: Globe },
                            { label: "Verified", desc: "Public Proof", icon: ShieldCheck }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 bg-[#050505] border border-white/5 rounded-2xl relative z-10 group hover:border-blue-500/50 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-black transition-all">
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">{step.label}</h4>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{step.desc}</p>
                            </div>
                        ))}
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

            {/* Performance & Scaling */}
            <section id="performance-scaling" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Performance & Scaling</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                    <div className="p-6 rounded-2xl bg-[#050505] border border-white/5 group hover:border-blue-500/20 transition-all">
                        <Activity className="w-5 h-5 text-blue-500 mb-4" />
                        <div className="text-2xl font-black text-white mb-1">10k+ <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Anchors/Sec</span></div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-light uppercase tracking-widest">Aggregate Throughput</p>
                        <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-gray-600 leading-relaxed italic">
                            Through SIP-Batching orchestration, thousands of individual fingerprints are compressed into a single Solana transaction.
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#050505] border border-white/5 group hover:border-blue-500/20 transition-all">
                        <Zap className="w-5 h-5 text-purple-500 mb-4" />
                        <div className="text-2xl font-black text-white mb-1">&lt;400ms <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Latency</span></div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-light uppercase tracking-widest">Global Resolve Speed</p>
                        <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-gray-600 leading-relaxed italic">
                            By leveraging Solana's parallel execution (Sealevel), resolution requests are served at the speed of the global edge.
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#050505] border border-white/5 group hover:border-blue-500/20 transition-all">
                        <Database className="w-5 h-5 text-emerald-500 mb-4" />
                        <div className="text-2xl font-black text-white mb-1">64-Byte <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">State</span></div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-light uppercase tracking-widest">Storage Efficiency</p>
                        <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-gray-600 leading-relaxed italic">
                            O(1) storage overhead. The VDR registry only tracks cryptographic signatures, not the data itself.
                        </div>
                    </div>
                </div>
            </section>

            {/* Network Topology */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Network Topology</h2>
                <div className="p-8 bg-[#050505] border border-white/5 rounded-3xl relative overflow-hidden group">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                                <Server className="w-5 h-5" />
                            </div>
                            <h4 className="text-white font-bold">1. Institutional Node</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Your local environment (CLI, SDK, or Docker). Perfroms SHA-256 hashing and Ed25519 signing. Raw data remains air-gapped here.
                            </p>
                        </div>
                        <div className="space-y-4 flex flex-col items-center md:items-start">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <h4 className="text-white font-bold">2. SIP Gateway</h4>
                            <p className="text-xs text-gray-500 leading-relaxed text-center md:text-left">
                                The SipHeron API. Orchestrates high-frequency batching and provides a RESTful interface for resolving complex organizational hierarchies.
                            </p>
                        </div>
                        <div className="space-y-4 flex flex-col items-center md:items-start">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h4 className="text-white font-bold">3. Solana cluster</h4>
                            <p className="text-xs text-gray-500 leading-relaxed text-center md:text-left">
                                The decentralized source of truth. Validates the batch signature and commits the hash to the permanent PDA state with a global timestamp.
                            </p>
                        </div>
                    </div>
                    {/* Visual Connector Line (Decorative) */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-12 hidden md:block" />
                </div>
            </section>

            {/* Governance & Trust */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Governance & Trust</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-white font-bold flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-blue-500" /> Open Source Sovereignty
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-light">
                            The SipHeron VDR smart contract and CLI are fully open-source. Anyone can audit the cryptographic implementation, fork the protocol, or run their own independent resolve nodes. We believe that global truth cannot be owned by a single entity.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-white font-bold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Decentralized Governance
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-light">
                            Protocol updates are managed via a transparent proposal system. Future iterations of the VDR will include DAO-led treasury management for protocol-level insurance of anchored assets, ensuring long-term institutional stability.
                        </p>
                    </div>
                </div>
            </section>

            {/* Next Step CTA */}
            <div id="next-steps" className="mt-32 p-12 bg-gradient-to-br from-blue-900/10 to-[#050505] border border-blue-500/10 rounded-3xl flex flex-col items-center text-center">
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
