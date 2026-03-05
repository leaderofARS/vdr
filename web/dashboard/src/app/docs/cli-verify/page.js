"use client";

import { motion } from "framer-motion";
import { Search, Shield, CheckCircle2, Globe, Cpu, Database, Link as LinkIcon, ArrowRight, ChevronRight, Activity, Zap, Lock, FileSearch, Scale, Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CliVerifyPage() {
    const [copied, setCopied] = useState("");

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(""), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert max-w-none space-y-16"
        >
            {/* Header */}
            <div id="overview">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">CLI Reference</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">Verifying Integrity</h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                    The <code className="text-emerald-400 font-mono">verify</code> command performs a multi-stage forensic audit of a digital asset.
                    It bridges the gap between your local file and the immutable record on the Solana blockchain.
                </p>
            </div>

            {/* Verification Flow */}
            <section id="forensic-handshake" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Forensic Handshake</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-gray-400 font-light leading-relaxed">
                            Verification is not a simple lookup. It is a <strong>three-way cryptographic handshake</strong> that ensures the file in your hand matches the fingerprint exactly as it was committed by the authorized entity.
                        </p>
                        <div className="bg-[#050505] border border-white/10 rounded-xl p-8 font-mono text-sm text-gray-300 relative group/btn">
                            <button
                                onClick={() => copyToClipboard("sipheron-vdr verify ./contract.pdf", "verify-cmd")}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover/btn:opacity-100"
                            >
                                {copied === "verify-cmd" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <div className="text-gray-500 mb-4 uppercase text-[10px] font-black tracking-widest">Primary Command</div>
                            <div className="flex items-center gap-3">
                                <span className="opacity-50">➜</span>
                                <span>sipheron-vdr verify ./contract.pdf</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl relative overflow-hidden group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <Cpu className="w-4 h-4 text-emerald-500" />
                                </div>
                                <h4 className="text-white font-bold m-0 text-sm italic italic italic">Stage 1: Local Re-Hashing</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-light font-light m-0">The CLI re-computes the SHA-256 hash of the local file to ensure it hasn&apos;t been altered since the initial staging.</p>
                        </div>
                        <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl relative overflow-hidden group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <Globe className="w-4 h-4 text-blue-500" />
                                </div>
                                <h4 className="text-white font-bold m-0 text-sm">Stage 2: Global Resolution</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-light m-0">The CLI queries the SipHeron registry on Solana to locate the PDA associated with this specific hash and authority.</p>
                        </div>
                        <div className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-2xl relative overflow-hidden group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                    <Shield className="w-4 h-4 text-purple-500" />
                                </div>
                                <h4 className="text-white font-bold m-0 text-sm">Stage 3: Integrity Validation</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-light m-0">The on-chain timestamp and anchor metadata are compared against the local manifest for a 100% binary match.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Merkle Proof Validation */}
            <section id="merkle-proofs" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Merkle Proof Validation</h2>
                <div className="p-8 bg-blue-900/5 border border-blue-500/10 rounded-3xl">
                    <div className="flex items-center gap-4 mb-6">
                        <Scale className="w-6 h-6 text-blue-500" />
                        <h3 className="text-xl font-bold m-0">Probabilistic vs. Deterministic Proofs</h3>
                    </div>
                    <p className="text-gray-400 font-light leading-relaxed mb-8">
                        Because SipHeron batches anchors into Merkle Trees to save costs, the CLI must perform <strong>Path Verification</strong>.
                        It reconstructs your branch of the tree to prove your hash is a valid member of the root committed to Solana.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                        <div className="space-y-4">
                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">The Challenge</div>
                            <p className="text-xs text-gray-400 font-light leading-relaxed">
                                A single Solana transaction might contain 500+ anchors. How do we verify your specific anchor without reading the other 499?
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">The Solution</div>
                            <p className="text-xs text-emerald-500/60 font-light leading-relaxed">
                                We provide a proof array (sibling hashes). Your CLI performs log2(N) hashing operations to reach the tree root. If the root matches the on-chain state, integrity is 100% guaranteed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* On-Chain Resolution */}
            <section id="on-chain-resolution" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">On-Chain Resolution Logic</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <p className="text-gray-400 font-light leading-relaxed">
                            When resolving an anchor, the CLI translates its local context into a verifiable Solana RPC query.
                            It looks for an account with the following signature:
                        </p>
                        <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-4 font-mono text-[10px]">
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Network</span>
                                <span className="text-emerald-500">Mainnet-Beta</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Program ID</span>
                                <span className="text-white">SipH...vdr1</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span>PDA Seed</span>
                                <span className="text-blue-400">b"anchor"</span>
                            </div>
                            <div className="pt-2 border-t border-white/5">
                                <div className="text-gray-600 mb-2 uppercase text-[9px] font-black">Forensic Result</div>
                                <div className="bg-black/50 p-4 rounded-lg break-all text-emerald-400 leading-relaxed">
                                    [SUCCESS] Anchor Found<br />
                                    Timestamp: 1740982341 (Finalized)<br />
                                    Authority: 6f82...22a1
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            Unstoppable Availability
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-light">
                            Unlike traditional databases where a server outage can prevent verification, SipHeron VDR anchors exist on 1,500+ global Solana nodes.
                            If the SipHeron company ceased to exist tomorrow, your CLI would still be able to verify these assets directly from the chain.
                            <strong>True Sovereignty.</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* Verification Results */}
            <section id="interpreting-results" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Interpreting Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "MATCH", color: "bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, desc: "The local file is identical to the on-chain anchor. Integrity verified." },
                        { title: "MISMATCH", color: "bg-red-500/10 border-red-500/20", icon: <Activity className="w-5 h-5 text-red-500" />, desc: "The file has been modified or corrupted. Forensic failure." },
                        { title: "NOT_FOUND", color: "bg-yellow-500/10 border-yellow-500/20", icon: <FileSearch className="w-5 h-5 text-yellow-500" />, desc: "This asset was never anchored to the SipHeron registry." }
                    ].map((item, i) => (
                        <div key={i} className={`p-6 rounded-2xl border ${item.color}`}>
                            <div className="flex items-center gap-3 mb-4">
                                {item.icon}
                                <span className="font-black text-xs tracking-widest text-white uppercase">{item.title}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 font-light leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Advanced: Forensic API */}
            <section id="forensic-api" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Advanced: Forensic Verification API</h2>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden group">
                    <div className="px-6 py-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-mono text-gray-400">Verifying via REST (Postman/Curl)</span>
                    </div>
                    <div className="p-8 font-mono text-xs overflow-x-auto">
                        <pre className="text-emerald-500/80">
                            {`curl -X GET "https://api.sipheron.io/v1/verify/0xe3b0c..." \\
     -H "Authorization: Bearer sk_live_..." \\
     -H "Accept: application/json"`}
                        </pre>
                    </div>
                </div>
                <p className="mt-6 text-sm text-gray-500 font-light italic italic italic">
                    For high-volume automated systems, you can bypass the CLI and query our Forensic API directly to integrate integrity checks into your existing ERP or CMS.
                </p>
            </section>

            {/* Navigation */}
            <div className="mt-32 flex justify-between items-center not-prose">
                <Link href="/docs/cli-anchor" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to Anchoring
                </Link>
                <Link href="/docs/api-overview" className="px-8 py-4 bg-white text-black font-bold flex items-center gap-3 hover:bg-gray-200 transition-all group rounded-xl">
                    Explore API Reference
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
