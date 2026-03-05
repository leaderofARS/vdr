"use client";

import { motion } from "framer-motion";
import { Terminal, Copy, Check, Shield, Zap, Database, Lock, Cpu, Info, AlertCircle, FileCode, Search, Share2, Layers, ChevronRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CliStagePage() {
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-mono">CLI Reference</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">Staging Assets</h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                    The <code className="text-blue-400 font-mono">stage</code> command is the first step in the SipHeron VDR lifecycle.
                    It performs local, deterministic hashing of your data to create a cryptographic fingerprint—without ever touching the network.
                </p>
            </div>

            {/* Execution Flow */}
            <section id="execution-flow" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Execution Flow</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-gray-400 font-light leading-relaxed">
                            When you run the stage command, the SipHeron CLI initializes a local pipeline that bridges your filesystem with our cryptographic engine.
                            This stage is 100% air-gapped; no data is sent to SipHeron servers or the Solana blockchain during this phase.
                        </p>
                        <div className="bg-[#050505] border border-white/10 rounded-xl p-8 font-mono text-sm text-gray-300 relative group/btn">
                            <button
                                onClick={() => copyToClipboard("sipheron-vdr stage ./path/to/asset.pdf", "stage-cmd")}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover/btn:opacity-100"
                            >
                                {copied === "stage-cmd" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <div className="text-gray-500 mb-4 uppercase text-[10px] font-black tracking-widest">Primary Command</div>
                            <div className="flex items-center gap-3">
                                <span className="opacity-50">➜</span>
                                <span>sipheron-vdr stage ./contract.pdf</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative pt-4">
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-white/5 to-transparent hidden md:block" />
                        <div className="space-y-8">
                            {[
                                { title: "Binary Read", desc: "The CLI opens a read-stream to the target file using OS-native file descriptors." },
                                { title: "Chunking", desc: "Data is processed in 64KB blocks to prevent memory exhaustion on large datasets." },
                                { title: "Hashing", desc: "The SHA-256 algorithm is applied to the bitstream in a single pass." },
                                { title: "Persistence", desc: "The resulting hash and metadata are saved to your local .sipheron state file." }
                            ].map((step, i) => (
                                <div key={i} className="relative pl-12">
                                    <div className="absolute left-3 w-3 h-3 rounded-full bg-blue-500 border-4 border-[#000] -translate-x-1.5 hidden md:block" />
                                    <h4 className="text-white font-bold mb-1 text-sm">{step.title}</h4>
                                    <p className="text-xs text-gray-500 font-light">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Buffering & Chunking */}
            <section id="buffering-chunking" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Buffering & Chunking</h2>
                <div className="p-8 bg-blue-900/5 border border-blue-500/10 rounded-3xl">
                    <div className="flex items-center gap-4 mb-6">
                        <Cpu className="w-6 h-6 text-blue-500" />
                        <h3 className="text-xl font-bold m-0">Memory-Safe Orchestration</h3>
                    </div>
                    <p className="text-gray-400 font-light leading-relaxed mb-8">
                        Traditional hashing tools often load the entire file into RAM. For institutional-grade data (e.g., 50GB genomic sequences or cinematic masters), this causes system crashes.
                        SipHeron VDR uses a <strong>Buffered Stream Pipeline</strong>:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 group hover:border-blue-500/20 transition-all">
                            <div className="text-blue-400 font-black mb-2 text-sm tracking-tighter">64KB WINDOW</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-light">The standard window size optimized for both SSD throughput and L3 cache performance.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 group hover:border-blue-500/20 transition-all">
                            <div className="text-purple-400 font-black mb-2 text-sm tracking-tighter">ZERO-COPY</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-light">Memory is reused across chunks to minimize garbage collection overhead in the Node environment.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 group hover:border-blue-500/20 transition-all">
                            <div className="text-emerald-400 font-black mb-2 text-sm tracking-tighter">HARDWARE ACCEL</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-light">Leverages Intel SHA and ARMv8 Cryptography Extensions when available via the host OS.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cryptographic Standard */}
            <section id="cryptographic-standard" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Cryptographic Standard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <p className="text-gray-400 font-light leading-relaxed">
                            SipHeron VDR strictly adheres to the <strong>FIPS 180-4</strong> standard. We utilize the SHA-256 (Secure Hash Algorithm 2) function to generate a fixed 256-bit (32-byte) digest.
                        </p>
                        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-400 leading-relaxed font-light italic">
                                <strong className="text-white font-bold">SHA-256 Deep Dive:</strong> The input is padded so its length is a multiple of 512 bits. It is then parsed into 512-bit message blocks.
                                The algorithm uses 64 rounds of constant-base bitwise operations (Ch, Maj, 𝝨0, 𝝨1, 𝞂0, 𝞂1) to achieve maximum entropy and avalanche effect.
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#050505] border border-white/5 rounded-2xl p-8 space-y-6 font-mono text-xs">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-gray-500">Input Size</span>
                            <span className="text-white">Any (up to 2^64 bits)</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-gray-500">Output Size</span>
                            <span className="text-white">256 bits</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-gray-500">Hex Length</span>
                            <span className="text-blue-400">64 characters</span>
                        </div>
                        <div className="pt-2">
                            <div className="text-[10px] text-gray-600 mb-3 uppercase tracking-widest font-black">Sample Output</div>
                            <div className="bg-black p-4 rounded-lg break-all text-emerald-500/80 leading-relaxed">
                                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scaling & Concurrency */}
            <section id="scaling-concurrency" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Scaling & Concurrency</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
                    <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-6">
                        <h4 className="text-xl font-bold text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-500" /> Operational Efficiency
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-light">
                            In institutional environments, multiple staging processes may occur simultaneously on a single shared filesystem.
                            The SipHeron CLI remains safe using a <strong>Local State Semaphore</strong>:
                        </p>
                        <ul className="text-xs text-gray-500 space-y-4 font-light">
                            <li className="flex gap-3"><div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />Atomic writes to the <code>.sipheron</code> staged registry.</li>
                            <li className="flex gap-3"><div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />File-handle locks prevent concurrent writes to the same asset metadata.</li>
                            <li className="flex gap-3"><div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />Stateless hashing allows multiple files across different nodes to be staged without collision.</li>
                        </ul>
                    </div>
                    <div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-3xl flex flex-col justify-center">
                        <div className="text-center space-y-4">
                            <Zap className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-white">Performance Benchmarks</h4>
                            <div className="space-y-4 text-left font-mono text-[10px]">
                                {[
                                    { hw: "Intel Core i9-14900K (AVX2)", speed: "940 MB/s", obs: "Hardware Accel" },
                                    { hw: "Apple M3 Pro (NEON)", speed: "880 MB/s", obs: "Crypto Extensions" },
                                    { hw: "AWS t3.micro (Shared CPU)", speed: "120 MB/s", obs: "Software Fallback" }
                                ].map((bench, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <span className="text-gray-500">{bench.hw}</span>
                                        <span className="text-emerald-500">{bench.speed}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Error Handling */}
            <section id="error-handling" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Error Handling Matrix</h2>
                <div className="overflow-hidden border border-white/5 rounded-2xl bg-[#050505]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-4 text-[10px] font-black uppercase text-gray-600 tracking-widest w-1/4">Code</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-600 tracking-widest w-1/4">Scenario</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-600 tracking-widest">Remediation</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-light text-gray-400">
                            {[
                                { code: "ENOENT", scene: "Asset file not found", rem: "Verify path accuracy and ensure file is not a symlink." },
                                { code: "EACCES", scene: "Permission denied", rem: "Check 'read' permissions on source asset and 'write' permissions on .sipheron directory." },
                                { code: "ENOSPC", scene: "Disk space exhausted", rem: "Cleanup temporary cache or expand target device storage." },
                                { code: "ERR_CRYPTO", scene: "Hardware failure", rem: "Reinstall CLI to reset hardware acceleration flags." }
                            ].map((err, i) => (
                                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
                                    <td className="p-4 font-mono text-red-400">{err.code}</td>
                                    <td className="p-4 text-white font-bold">{err.scene}</td>
                                    <td className="p-4 text-[11px] leading-relaxed">{err.rem}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Local Metadata */}
            <section id="local-metadata" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Local Metadata Storage</h2>
                <p className="text-gray-400 font-light mb-8">
                    Following a successful stage, the CLI persists the results in a hidden configuration directory at your project root.
                    This file serves as the local <strong>Manifest of Truth</strong>.
                </p>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden group">
                    <div className="px-6 py-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-mono text-gray-400">.sipheron/staged.json</span>
                    </div>
                    <div className="p-8 font-mono text-xs overflow-x-auto">
                        <pre className="text-blue-500/80">
                            {`{
  "asset_path": "./legal_contract.pdf",
  "hash": "e3b0c442...5b2b855",
  "staged_at": "2026-03-05T22:24:12Z",
  "identity": "sip_pub_6f82...22a1",
  "status": "STAGED_LOCAL"
}`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Privacy & Sovereignty */}
            <section id="privacy-sovereignty" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Privacy & Sovereignty</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h4 className="text-lg font-bold text-white mb-4 relative flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" /> Blind Anchoring
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-light relative">
                            Our "Blind Anchoring" philosophy means we never see your data. By staging locally, we only ever receive the 64-character hash. It is mathematically impossible for SipHeron or any third party to reconstruct your original file from this hash.
                        </p>
                    </div>
                    <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h4 className="text-lg font-bold text-white mb-4 relative flex items-center gap-2">
                            <Lock className="w-5 h-5 text-blue-500" /> Zero-Trust Environment
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-light relative">
                            Even if the SipHeron API were compromised, the adversary would only possess a list of non-reversible hashes. Your intellectual property remains securely air-gapped within your institutional firewall.
                        </p>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="mt-32 flex justify-between items-center not-prose">
                <Link href="/docs/installation" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to Installation
                </Link>
                <Link href="/docs/cli-anchor" className="px-8 py-4 bg-white text-black font-bold flex items-center gap-3 hover:bg-gray-200 transition-all group rounded-xl">
                    Proceed to Anchoring
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
