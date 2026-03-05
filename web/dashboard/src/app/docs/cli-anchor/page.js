"use client";

import { motion } from "framer-motion";
import { Send, Zap, Shield, Link as LinkIcon, Database, Cpu, Globe, ArrowRight, ChevronRight, Activity, Wallet, Lock, Layers, Copy, Check, Code2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CliAnchorPage() {
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-500/10 border border-purple-500/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 font-mono">CLI Reference</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">Anchoring to Solana</h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                    The <code className="text-purple-400 font-mono">anchor</code> command commits your staged hashes to the decentralized Solana ledger.
                    This creates an immutable, timestamped proof of existence that is globally verifiable.
                </p>
            </div>

            {/* Execution Flow */}
            <section id="execution-mechanism" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Execution Mechanism</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-gray-400 font-light leading-relaxed">
                            Anchoring is an asynchronous handshake between your local identity and the SipHeron VDR Smart Contract.
                            The CLI signs a payload containing your staged hashes and dispatches it to the SIP Gateway for <strong>Merkle Batching</strong> and high-throughput commitment.
                        </p>
                        <div className="bg-[#050505] border border-white/10 rounded-xl p-8 font-mono text-sm text-gray-300 relative group/btn">
                            <button
                                onClick={() => copyToClipboard("sipheron-vdr anchor", "anchor-cmd")}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover/btn:opacity-100"
                            >
                                {copied === "anchor-cmd" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <div className="text-gray-500 mb-4 uppercase text-[10px] font-black tracking-widest">Primary Command</div>
                            <div className="flex items-center gap-3">
                                <span className="opacity-50">➜</span>
                                <span>sipheron-vdr anchor</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-3xl">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-500" /> The SIP-Batching Protocol
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-light mb-4">
                            To minimize Solana rent and transaction fees, SipHeron uses a high-frequency aggregator.
                            Your individual hash is combined with hundreds of others in a <strong>Binary Merkle Tree</strong>.
                        </p>
                        <div className="space-y-3 font-mono text-[9px]">
                            <div className="flex justify-between text-gray-400"><span>Aggregator Throughput</span> <span className="text-purple-400">1,500 Anchors/Batch</span></div>
                            <div className="flex justify-between text-gray-400"><span>Batch Frequency</span> <span className="text-purple-400">Every 15s (Default)</span></div>
                            <div className="flex justify-between text-gray-400"><span>Commitment Layer</span> <span className="text-purple-400">Solana Sealevel</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Merkle Tree deep-dive */}
            <section id="merkle-aggregation" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Merkle Tree Aggregation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <p className="text-gray-400 font-light leading-relaxed">
                            SipHeron VDR doesn't just store hashes; it builds <strong>Certified Provenance Graphs</strong>.
                            When a batch is committed, only the Merkle Root is stored on-chain, while the full proof-path is archived in your local manifest.
                        </p>
                        <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                            <h4 className="text-white font-bold text-xs uppercase mb-3 tracking-widest">Security Benefits</h4>
                            <ul className="text-[11px] text-gray-500 space-y-3 list-none p-0 font-light">
                                <li className="flex gap-2"><span className="text-purple-500">◈</span> <span><strong>O(log N) Verification:</strong> Prove inclusion of your anchor without downloading the entire batch.</span></li>
                                <li className="flex gap-2"><span className="text-purple-500">◈</span> <span><strong>Tamper-Proof Batches:</strong> A single changed bit in the batch alters the root, triggering a global alert.</span></li>
                                <li className="flex gap-2"><span className="text-purple-500">◈</span> <span><span><strong>Privacy Preservation:</strong> Only the final root is public; individual hashes remain private until verified.</span></span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="relative aspect-video bg-black/50 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center p-8 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative text-center">
                            <Layers className="w-12 h-12 text-purple-500 mx-auto mb-4 opacity-50" />
                            <div className="text-[10px] text-gray-500 font-mono space-y-1">
                                <div className="text-white font-bold mb-2">Root Commitment (On-Chain)</div>
                                <div className="p-2 bg-white/5 rounded">Hash A + Hash B = Root AB</div>
                                <div className="p-2 bg-white/5 rounded">Hash C + Hash D = Root CD</div>
                                <div className="p-2 bg-purple-500/20 rounded border border-purple-500/30 text-purple-400">Final PDA Root (ABCD)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PDA Logic */}
            <section id="pda-derivation" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">PDA Derivation Architecture</h2>
                <div className="space-y-8">
                    <p className="text-gray-400 font-light leading-relaxed">
                        Every anchor on Solana is stored within a <strong>Program Derived Address (PDA)</strong>.
                        A PDA is a deterministic address that "lives" on the blockchain but has no private key; it is controlled through <strong>Seeds</strong> and <strong>Cross-Program Invocations (CPI)</strong>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                        <div className="p-6 bg-[#050505] border border-white/5 rounded-2xl hover:border-purple-500/20 transition-all">
                            <div className="text-[10px] font-black uppercase text-gray-600 mb-4 tracking-[0.2em]">Security Seed 01</div>
                            <h4 className="text-white font-bold mb-2">"anchor"</h4>
                            <p className="text-[11px] text-gray-500 font-light">Namespace isolation seed to prevent collision with other program accounts.</p>
                        </div>
                        <div className="p-6 bg-[#050505] border border-white/5 rounded-2xl hover:border-purple-500/20 transition-all">
                            <div className="text-[10px] font-black uppercase text-gray-600 mb-4 tracking-[0.2em]">Authority PK</div>
                            <h4 className="text-white font-bold mb-2">Ed25519 Link</h4>
                            <p className="text-[11px] text-gray-500 font-light">Your institution's public key, ensuring only you can authorize the anchor.</p>
                        </div>
                        <div className="p-6 bg-[#050505] border border-white/5 rounded-2xl hover:border-purple-500/20 transition-all">
                            <div className="text-[10px] font-black uppercase text-gray-600 mb-4 tracking-[0.2em]">Entropy Hash</div>
                            <h4 className="text-white font-bold mb-2">SHA-256 Digest</h4>
                            <p className="text-[11px] text-gray-500 font-light">The 32-byte binary fingerprint that uniquely identifies the digital asset.</p>
                        </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 font-mono text-xs overflow-x-auto relative group">
                        <div className="text-gray-500 mb-4 uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
                            <Code2 className="w-3 h-3 text-purple-400" /> Rust Side-Audit (Program State)
                        </div>
                        <pre className="text-purple-400">
                            {`#[account(
    init_if_needed,
    payer = authority,
    space = 8 + AnchorRecord::LEN,
    seeds = [b"anchor", authority.key().as_ref(), hash.as_ref()],
    bump
)]
pub record: Account<'info, AnchorRecord>,

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct AnchorRecord {
    pub timestamp: i64,      // Finalized epoch
    pub authority: Pubkey,  // Verified signer
    pub merkle_root: [u8; 32] // For batched anchors
}`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Sovereignty Audit */}
            <section id="sovereignty-audit" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Sovereignty Audit</h2>
                <div className="p-8 bg-blue-900/5 border border-blue-500/10 rounded-3xl flex flex-col md:flex-row items-center gap-8">
                    <Shield className="w-12 h-12 text-blue-500 shrink-0" />
                    <div>
                        <h4 className="text-white font-bold mb-2">Independent Resolution</h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-light">
                            Because PDAs are deterministic, the SipHeron company does not hold your "proofs." Anyone with the original file and your Public Key can derive the PDA address independently and query the Solana network. This ensures <strong>Zero Platform Risk</strong>—if SipHeron disappears, your anchors remain globally verifiable.
                        </p>
                    </div>
                </div>
            </section>

            {/* Economic Model & Fees */}
            <section id="economic-model-fees" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Economic Model & Fees</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-gray-400 font-light leading-relaxed">
                            On-chain storage on Solana is a precious resource. SipHeron VDR automates <strong>Rent Exemption Management</strong> to ensure your proofs are permanent without manual wallet handling.
                        </p>
                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                            <Wallet className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-bold mb-1 text-sm">Automated "Anchor Credits"</h4>
                                <p className="text-xs text-gray-500 leading-relaxed font-light">
                                    Instead of managing SOL balances on individual CLI nodes, institutions use a central credit pool. The SIP Gateway pays for the rent-exempt PDA storage and transaction space in realtime.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#050505] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="p-4 text-[10px] font-black uppercase text-gray-600 tracking-widest">Resource</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-gray-600 tracking-widest">Commitment</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-light text-gray-400">
                                <tr className="border-b border-white/5">
                                    <td className="p-4 text-white font-bold italic italic">PDA State Size</td>
                                    <td className="p-4 font-mono">112 Bytes (Verified)</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="p-4 text-white font-bold">Persistence Type</td>
                                    <td className="p-4 font-mono text-emerald-400">Rent-Exempt (Permanent)</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="p-4 text-white font-bold">Aggregated Batch Cost</td>
                                    <td className="p-4 text-purple-400 font-bold">0.0000034 SOL / Anchor</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-white font-bold">Network Priority</td>
                                    <td className="p-4 text-gray-600 italic">Static Fee Tier 1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Lifecycle Statuses */}
            <section id="lifecycle-states" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Anchor Lifecycle States</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { status: "PENDING", color: "bg-blue-500/10 text-blue-400", desc: "Hash received by SIP Gateway, awaiting next Merkle batching cycle." },
                        { status: "BATCHED", color: "bg-purple-500/10 text-purple-400", desc: "Hash included in a specific Merkle Tree root. Payload signed by authority." },
                        { status: "COMMITTED", color: "bg-yellow-500/10 text-yellow-400", desc: "Transaction broadcasted to Solana validators. Awaiting leader confirmation." },
                        { status: "FINALIZED", color: "bg-emerald-500/10 text-emerald-500", desc: "Proof achieved 'Max Confirmation.' Globally resolvable and unchangeable." }
                    ].map((item, i) => (
                        <div key={i} className={`p-6 rounded-2xl border border-white/5 ${item.color.split(' ')[0]} group hover:border-white/20 transition-all`}>
                            <div className={`${item.color.split(' ')[1]} font-black mb-3 text-sm tracking-tighter`}>{item.status}</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-light">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Navigation */}
            <div className="mt-32 flex justify-between items-center not-prose">
                <Link href="/docs/cli-stage" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to Staging
                </Link>
                <Link href="/docs/cli-verify" className="px-8 py-4 bg-white text-black font-bold flex items-center gap-3 hover:bg-gray-200 transition-all group rounded-xl">
                    Proceed to Verification
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
