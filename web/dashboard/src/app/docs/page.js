"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Database, ArrowRight, Code2, Terminal, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-invert max-w-none"
        >
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-mono">Documentation</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">
                    The Verifiable Data <br />
                    Registry Protocol.
                </h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed mb-8">
                    SipHeron VDR is a specialized cryptographic layer built on the Solana blockchain for anchoring, verifying, and resolving digital asset provenance at institutional scale.
                </p>
            </div>

            <section className="mt-20">
                <h3 className="text-2xl font-black tracking-tight mb-6">The Problem: Provenance in the AI Era</h3>
                <p className="text-gray-400 leading-relaxed font-light mb-6">
                    In a digital landscape increasingly defined by generative media and automated systems, the authenticity of data is no longer guaranteed. Raw data can be forged, manipulated, or simulated with near-perfect fidelity.
                </p>
                <div className="p-8 bg-[#050505] border border-white/5 rounded-2xl border-l-4 border-l-blue-500">
                    <p className="text-gray-300 italic font-light leading-relaxed">
                        "Without an immutable trail of history, data has no truth. SipHeron VDR provides that trail by anchoring cryptographic proof deeply into the Solana cluster."
                    </p>
                </div>
            </section>

            <section className="mt-20">
                <h3 className="text-2xl font-black tracking-tight mb-6">Core Architecture</h3>
                <p className="text-gray-400 leading-relaxed font-light mb-10">
                    The VDR Protocol operates as a decentralized ledger of cryptographic hashes (signatures) that correspond to specific digital files, documents, or data streams.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                    {[
                        { icon: Lock, title: "Zero-Knowledge Local Staging", desc: "Files are hashed on your infrastructure. Raw data never touches the network." },
                        { icon: Database, title: "PDA-Based Anchoring", desc: "Hashes are stored in Program Derived Addresses (PDAs) owned by your public key." },
                        { icon: Zap, title: "Sub-Second Resolution", desc: "Solana's Sealevel runtime enables global verification in under 400ms." },
                        { icon: ShieldCheck, title: "Permissionless Verification", desc: "Anyone with the original file can verify its integrity without third-party trust." }
                    ].map((feature, i) => (
                        <div key={i} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-xl hover:border-gray-700 transition-colors group">
                            <feature.icon className="w-5 h-5 text-blue-500 mb-4" />
                            <h4 className="text-white font-bold mb-2">{feature.title}</h4>
                            <p className="text-xs text-gray-500 leading-relaxed font-light">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-20">
                <h3 className="text-2xl font-black tracking-tight mb-6">Prerequisites</h3>
                <p className="text-gray-400 leading-relaxed font-light mb-6">
                    Before integrating the VDR protocol, ensure you have the following environment configuration:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-gray-400 font-light">
                    <li><strong className="text-white">Node.js v18.0+</strong> — Required for processing the CLI and local hashing.</li>
                    <li><strong className="text-white">Solana CLI</strong> — For managing institutional keypairs locally.</li>
                    <li><strong className="text-white">SipHeron API Key</strong> — Required for submitting anchors to the batch queue.</li>
                </ul>
            </section>

            <div className="mt-32 p-10 bg-gradient-to-br from-blue-900/20 to-[#050505] border border-blue-500/20 rounded-3xl flex flex-col items-center text-center">
                <h2 className="text-3xl font-black mb-4">Ready to start building?</h2>
                <p className="text-gray-400 font-light mb-8 max-w-lg">
                    Follow our quickstart guide to get the SipHeron CLI installed and anchor your first asset in less than 2 minutes.
                </p>
                <Link href="/docs/quickstart" className="px-8 py-4 bg-white text-black font-bold flex items-center gap-3 hover:bg-gray-200 transition-all group rounded-xl">
                    Follow the Quickstart
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
