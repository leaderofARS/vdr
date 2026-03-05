"use client";

import { motion } from "framer-motion";
import { Terminal, Copy, Check, ArrowRight, Download, Shield, Sparkles, FileCode, Send, LayoutGrid, Search } from "lucide-react";
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
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">Tutorial</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">Quickstart Guide</h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                    Learn how to anchor your first digital asset to the Solana human-history ledger. This guide takes you from an empty directory to a globally verifiable cryptographic proof.
                </p>
            </div>

            {/* What you'll achieve */}
            <section className="pt-8 border-t border-white/5">
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
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg">01</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Initialize and Link</h3>
                </div>
                <p className="text-gray-400 font-light mb-8">
                    Assuming you have followed the <Link href="/docs/installation" className="text-blue-400 font-medium">Installation Guide</Link>, initialize your local identity using your organization API key.
                </p>

                <div className="group relative not-prose">
                    <div className="bg-[#050505] border border-white/10 rounded-xl p-8 font-mono text-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-gray-600 uppercase font-black">Link API Key</span>
                            <button onClick={() => copyToClipboard("sipheron-vdr link --key [YOUR_KEY]", "link")} className="text-gray-500 hover:text-white transition-colors">
                                {copied === "link" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-blue-500">➜</span>
                            <span className="text-gray-300">sipheron-vdr link --key sk_live_...</span>
                        </div>
                        <div className="mt-4 text-emerald-500">✓ Securely linked to SipHeron Labs</div>
                    </div>
                </div>
            </section>

            {/* Step 2 */}
            <section className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg">02</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Local Entropy Generation</h3>
                </div>
                <p className="text-gray-400 font-light mb-8">
                    The <code className="text-white bg-white/5 px-1.5 py-0.5 rounded">stage</code> command computes the local hash. This is the first half of the ZK-on-Solana logic.
                </p>

                <div className="bg-[#050505] border border-white/10 rounded-xl p-8 space-y-4 not-prose">
                    <div className="flex items-center gap-4 font-mono text-sm">
                        <span className="text-blue-500">➜</span>
                        <span className="text-gray-300">sipheron-vdr stage ./legal_contract.pdf</span>
                    </div>
                    <div className="font-mono text-xs space-y-2 py-4 border-l-2 border-white/10 ml-1 pl-6">
                        <div className="text-gray-500">Computing SHA-256 local entropy... [██████████] 100%</div>
                        <div className="text-gray-400">Hash: e3b0c442...5b2b855</div>
                        <div className="text-emerald-500 font-bold italic">✓ File successfully staged for anchoring.</div>
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
            <section className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg">03</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Anchor to the Registry</h3>
                </div>
                <p className="text-gray-400 font-light mb-8">
                    Push the staged hash to the SipHeron registry on Solana. This creates a permanent, timestamped record.
                </p>

                <div className="bg-[#050505] border border-white/10 rounded-xl p-8 space-y-4 not-prose">
                    <div className="flex items-center gap-4 font-mono text-sm">
                        <span className="text-blue-500">➜</span>
                        <span className="text-gray-300">sipheron-vdr anchor</span>
                    </div>
                    <div className="font-mono text-xs space-y-2 py-4 border-l-2 border-white/10 ml-1 pl-6">
                        <div className="text-gray-500">Connecting to Solana Mainnet-Beta...</div>
                        <div className="text-gray-500">Submitting CPI instruction to SipHeron Registry...</div>
                        <div className="text-emerald-500 font-bold">✓ Asset anchored successfully</div>
                        <div className="text-gray-400">Tx: <span className="text-blue-400 underline cursor-pointer">4fG29...8Pqm</span></div>
                    </div>
                </div>
            </section>

            {/* Step 4 */}
            <section className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg">04</div>
                    <h3 className="text-2xl font-black tracking-tight margin-0">Verification flow</h3>
                </div>
                <p className="text-gray-400 font-light mb-8">
                    Verify the file at any time. The CLI will recompute the hash locally and compare it with the on-chain record.
                </p>

                <div className="bg-[#050505] border border-white/10 rounded-xl p-8 not-prose">
                    <div className="flex items-center gap-4 font-mono text-sm mb-4">
                        <span className="text-blue-500">➜</span>
                        <span className="text-gray-300">sipheron-vdr verify ./legal_contract.pdf</span>
                    </div>
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-6">
                        <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                        <div>
                            <h4 className="text-emerald-400 font-bold mb-1 text-sm">AUTHENTIC ASSET</h4>
                            <p className="text-[10px] text-emerald-900 font-black uppercase tracking-[0.2em]">Verified by SipHeron Public Ledger</p>
                            <div className="mt-2 flex gap-4 text-[10px] text-emerald-800/80 font-mono">
                                <span>SOLANA_TS: 171203495</span>
                                <span>OWNER: Dk92...3k1a</span>
                            </div>
                        </div>
                    </div>
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
