"use client";

import { motion } from "framer-motion";
import { Terminal, Copy, Check, CheckCircle, ArrowRight, Download, Shield, Sparkles, FileCode, Send, LayoutGrid, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function QuickstartPage() {
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
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">Tutorial</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">Quickstart Guide</h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                    Learn how to anchor your first digital asset to the Solana human-history ledger. This guide takes you from an empty directory to a globally verifiable cryptographic proof.
                </p>
            </div>

            {/* What you'll achieve */}
            <section id="what-youll-build" className="pt-8 border-t border-white/5">
                <h2 className="text-2xl font-black tracking-tight mb-8">What you&apos;ll build</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                    <div className="p-6 bg-[#050505] border border-white/5 rounded-2xl">
                        <FileCode className="w-5 h-5 text-blue-500 mb-4" />
                        <h4 className="text-sm font-bold text-white mb-2">Local Entropy</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">Compute a unique SHA-256 fingerprint for a local file.</p>
                    </div>
                    <div className="p-6 bg-[#050505] border border-white/5 rounded-2xl">
                        <Send className="w-5 h-5 text-purple-500 mb-4" />
                        <h4 className="text-sm font-bold text-white mb-2">On-Chain Anchor</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">Commit the fingerprint to a Solana PDA for permanent storage.</p>
                    </div>
                    <div className="p-6 bg-[#050505] border border-white/5 rounded-2xl">
                        <Search className="w-5 h-5 text-emerald-500 mb-4" />
                        <h4 className="text-sm font-bold text-white mb-2">Global Resolution</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">Verify the asset against the registry via CLI or Explorer.</p>
                    </div>
                </div>
            </section>

            {/* Step 1 */}
            <section id="step-01-link-key">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg">01</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Initialize and Link</h3>
                </div>
                <p className="text-gray-400 font-light mb-8">
                    Assuming you have followed the <Link href="/docs/installation" className="text-blue-400 font-medium">Installation Guide</Link>, initialize your local identity using your organization API key.
                </p>

                <div className="group relative not-prose">
                    <div className="bg-[#050505] border border-white/10 rounded-xl p-8 font-mono text-sm text-gray-300 relative group">
                        <button
                            onClick={() => copyToClipboard("sipheron-vdr link --key [YOUR_KEY]", "link")}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            {copied === "link" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <div className="text-xs text-gray-600 uppercase font-black mb-4">Link API Key</div>
                        <div className="flex items-center gap-4">
                            <span className="opacity-50">➜</span>
                            <span>sipheron-vdr link --key sk_live_...</span>
                        </div>
                    </div>
                </div>
                <p className="mt-6 text-gray-400 font-light text-sm leading-relaxed italic italic">
                    Linking assigns your institutional identity to the local CLI instance. This key is used to sign requests to the SipHeron API, which orchestrates the batching of your hashes before they are committed to the Solana blockchain.
                </p>
            </section>

            {/* Step 2 */}
            <section id="step-02-local-entropy" className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg">02</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Local Entropy Generation</h3>
                </div>
                <p className="text-gray-400 font-light mb-8">
                    The <code className="text-white bg-white/5 px-1.5 py-0.5 rounded">stage</code> command is the entry point for local integrity validation. It reads your file as a bitstream and applies the <span className="text-white font-medium">FIPS 180-4 standard (SHA-256)</span> to produce a unique digest.
                </p>

                <div className="bg-[#050505] border border-white/10 rounded-xl p-8 space-y-4 not-prose relative group">
                    <button
                        onClick={() => copyToClipboard("sipheron-vdr stage ./legal_contract.pdf", "stage")}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        {copied === "stage" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center gap-4 font-mono text-sm text-gray-300">
                        <span className="opacity-50">➜</span>
                        <span>sipheron-vdr stage ./legal_contract.pdf</span>
                    </div>
                </div>

                <div className="space-y-6 mt-8">
                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-gray-400 font-light leading-relaxed">
                        <h4 className="text-white font-bold text-sm mb-3">Deep Dive: Deterministic Entropy</h4>
                        <p className="text-xs leading-relaxed">
                            Our CLI uses a <strong>buffered chunking strategy</strong> (default 64KB blocks). This allows us to hash multi-gigabyte datasets without loading them entirely into system memory. The resulting 64-character hex string is the only piece of data that will ever be communicated to the SipHeron API, ensuring that your raw data remains air-gapped from the public ledger.
                        </p>
                        <p className="text-xs mt-4 leading-relaxed">
                            Even a single bit change in the original PDF—such as a modified character in a contract—will result in a completely different hash, triggering an immediate validation failure during the verify phase.
                        </p>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-4">
                    <Shield className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 leading-relaxed font-light italic">
                        <strong className="text-white font-bold">Privacy Check:</strong> The CLI only generated a 64-character hash. The original PDF contents were never sent to our servers or the blockchain.
                    </p>
                </div>
            </section>

            {/* Step 3 */}
            <section id="step-03-on-chain-anchor" className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg">03</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Anchor to the Registry</h3>
                </div>
                <p className="text-gray-400 font-light mb-8">
                    Push the staged hash to the SipHeron registry on Solana. This creates a permanent, timestamped record.
                </p>

                <div className="bg-[#050505] border border-white/10 rounded-xl p-8 space-y-4 not-prose relative group">
                    <button
                        onClick={() => copyToClipboard("sipheron-vdr anchor", "anchor")}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        {copied === "anchor" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center gap-4 font-mono text-sm text-gray-300">
                        <span className="opacity-50">➜</span>
                        <span>sipheron-vdr anchor</span>
                    </div>
                </div>

                <div className="space-y-6 mt-8">
                    <p className="text-gray-400 font-light leading-relaxed">
                        The <code className="text-white">anchor</code> command bridges the gap between your local environment and the global consensus. It dispatches an instruction to the **SipHeron VDR Smart Contract** on Solana.
                    </p>
                    <div className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                        <h4 className="text-white font-bold text-sm mb-3">Deep Dive: The PDA & CPI Mechanism</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-light">
                            Assets are not stored in a traditional list. Instead, we use <strong>Program Derived Addresses (PDAs)</strong>. A PDA is a deterministic address on Solana generated from the file hash and your organization's public key. This architecture allows for <strong>O(1) resolution speed</strong>—anyone can calculate the address locally and query the blockchain directly without needing a central database.
                        </p>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 mt-6">
                        <li className="p-4 rounded-xl border border-white/5 bg-white/2 text-[11px] text-gray-500 leading-relaxed group-hover:border-purple-500/10 transition-colors">
                            <strong className="text-white block mb-1 font-bold">Atomic Finality</strong>
                            Once committed, the transaction is immutable. The blockhash serves as an irrefutable proof of time across the entire Solana network.
                        </li>
                        <li className="p-4 rounded-xl border border-white/5 bg-white/2 text-[11px] text-gray-500 leading-relaxed group-hover:border-purple-500/10 transition-colors">
                            <strong className="text-white block mb-1 font-bold">Economic Weight</strong>
                            Every anchor represents a real cryptographic commitment backed by the decentralized security of global validators.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Step 4 */}
            <section id="verification-flow" className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg">04</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Verification flow</h3>
                </div>
                <p className="text-gray-400 font-light mb-8">
                    Verify the file at any time. The CLI will recompute the hash locally and compare it with the on-chain record.
                </p>

                <div className="bg-[#050505] border border-white/10 rounded-xl p-8 not-prose relative group">
                    <button
                        onClick={() => copyToClipboard("sipheron-vdr verify ./legal_contract.pdf", "verify")}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        {copied === "verify" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center gap-4 font-mono text-sm text-gray-300">
                        <span className="opacity-50">➜</span>
                        <span>sipheron-vdr verify ./legal_contract.pdf</span>
                    </div>
                </div>

                <div className="space-y-6 mt-8">
                    <h4 className="text-white font-bold text-sm">The 3-Step Verification Handshake:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 p-5 rounded-2xl border border-white/5 bg-[#050505] shadow-xl group/step">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover/step:text-blue-500 transition-colors">Step 01</span>
                            <p className="text-[11px] text-gray-400 font-light leading-relaxed">CLI re-hashes the local file to find its current cryptographic <strong>State Digest</strong>.</p>
                        </div>
                        <div className="space-y-2 p-5 rounded-2xl border border-white/5 bg-[#050505] shadow-xl group/step">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover/step:text-purple-500 transition-colors">Step 02</span>
                            <p className="text-[11px] text-gray-400 font-light leading-relaxed">The CLI queries the <strong>PDA State</strong> on Solana for that specific hash-identity pair.</p>
                        </div>
                        <div className="space-y-2 p-5 rounded-2xl border border-white/5 bg-[#050505] shadow-xl group/step">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover/step:text-emerald-500 transition-colors">Step 03</span>
                            <p className="text-[11px] text-gray-400 font-light leading-relaxed">A bitwise comparison is made. If matches, integrity is cryptographically <strong>Validated</strong>.</p>
                        </div>
                    </div>
                    <p className="text-gray-500 font-light text-sm italic border-l border-white/10 pl-6 py-2">
                        "Verification is the heart of the SipHeron protocol. It transforms a simple file into a globally recognized truth, independent of any central authority."
                    </p>
                </div>
            </section>

            {/* Success Footer */}
            <div className="mt-32 p-12 bg-gradient-to-br from-emerald-900/10 to-[#050505] border border-emerald-500/10 rounded-3xl flex flex-col items-center text-center">
                <Sparkles className="w-10 h-10 text-emerald-500 mb-6" />
                <h2 className="text-3xl font-black mb-4">Congratulations!</h2>
                <p className="text-gray-400 font-light mb-8 max-w-lg">
                    You have now mastered the CORE flow of the SipHeron VDR protocol. Your data is now anchored to human history.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/docs/cli-stage" className="px-8 py-4 bg-white text-black font-bold flex items-center gap-2 hover:bg-gray-200 transition-all rounded-xl">
                        Deep CLI Guide
                    </Link>
                    <Link href="/docs/api-overview" className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold flex items-center gap-2 hover:bg-white/10 transition-all rounded-xl">
                        API Reference
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
