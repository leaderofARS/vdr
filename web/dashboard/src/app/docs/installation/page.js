"use client";

import { motion } from "framer-motion";
import { Terminal, Download, Shield, AlertTriangle, CheckCircle, Apple, Monitor, Globe, Command, Key, Copy, Check, ChevronRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function InstallationPage() {
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
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">Setup</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">Installation</h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                    Set up your secure cryptographic environment. SipHeron VDR requires a local runtime to ensure data privacy—your files never leave your machine.
                </p>
            </div>

            {/* Prerequisites */}
            <section id="system-requirements" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">System Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                    <div className="p-6 bg-[#050505] border border-white/5 rounded-2xl">
                        <h4 className="flex items-center gap-3 text-white font-bold mb-4">
                            <Monitor className="w-5 h-5 text-blue-500" /> Technical Stack
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-500 font-light">
                            <li className="flex justify-between"><span>Node.js</span> <span className="text-white font-mono">v18.0.0+</span></li>
                            <li className="flex justify-between"><span>NPM / PNPM</span> <span className="text-white font-mono">v8.0.0+</span></li>
                            <li className="flex justify-between"><span>Solana CLI</span> <span className="text-white font-mono">v1.18+ (Optional)</span></li>
                        </ul>
                    </div>
                    <div className="p-6 bg-[#050505] border border-white/5 rounded-2xl">
                        <h4 className="flex items-center gap-3 text-white font-bold mb-4">
                            <Globe className="w-5 h-5 text-purple-500" /> Network Access
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-500 font-light">
                            <li>Outbound access to <code className="text-blue-400">api.sipheron.com</code></li>
                            <li>Access to Solana RPC (Mainnet/Devnet)</li>
                            <li>Minimum 128MB RAM for local hashing scripts</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CLI Installation */}
            <section id="cli-installation" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Installing the VDR CLI</h2>
                <p className="text-gray-400 font-light mb-8">
                    The SipHeron CLI is available as a global NPM package. It handles local entropy generation and anchoring orchestration.
                </p>

                <div className="space-y-8">
                    <div className="not-prose group">
                        <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden">
                            <div className="px-6 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <span className="text-xs font-mono text-gray-400">Global Installation</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                                </div>
                            </div>
                            <div className="p-6 font-mono text-sm relative group/btn">
                                <button
                                    onClick={() => copyToClipboard("npm install -g @sipheron/vdr-cli", "install")}
                                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover/btn:opacity-100"
                                >
                                    {copied === "install" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <div className="flex items-center gap-4">
                                    <span className="text-blue-500 select-none">➜</span>
                                    <span className="text-gray-300">npm install -g @sipheron/vdr-cli</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl flex items-start gap-6 not-prose">
                        <Shield className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                        <div>
                            <h4 className="text-white font-bold mb-1">Security Note</h4>
                            <p className="text-sm text-gray-500 leading-relaxed font-light">
                                Always verify the package integrity. The CLI is architected to perform "blind anchoring"—it never reads the contents of your files, only their cryptographic SHA-256 signatures.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Post-Installation: Sipheron Doctor */}
            <section id="verify-installation" className="pt-8 border-t border-white/5 font-sans">
                <h2 className="text-3xl font-black tracking-tight mb-8">Verify Installation</h2>
                <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex flex-col md:flex-row items-center gap-8 group not-prose">
                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold mb-2 text-sm">Run the Doctor Diagnostic</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-light mb-4">
                            The <code className="text-emerald-400">doctor</code> command performs a suite of 12 internal checks, including keychain read/write permissions, RPC latency, and SHA-256 hardware acceleration.
                        </p>
                        <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-500/80 relative group/btn">
                            <button
                                onClick={() => copyToClipboard("sipheron-vdr doctor", "doctor")}
                                className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover/btn:opacity-100"
                            >
                                {copied === "doctor" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <div className="flex items-center gap-3">
                                <span className="opacity-50">➜</span>
                                <span>sipheron-vdr doctor</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Authentication Config */}
            <section id="initialize-identity" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Initialize Identity</h2>
                <p className="text-gray-400 font-light mb-8">
                    Once installed, you must link your local environment to your institutional identity on the SipHeron registry.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start not-prose">
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Key className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 text-sm">Retrieve API Key</h4>
                                <p className="text-xs text-gray-500 font-light leading-relaxed">Navigate to Settings &gt; API Keys in your SipHeron Dashboard to generate a new key.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Command className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 text-sm">Run the Link Command</h4>
                                <p className="text-xs text-gray-500 font-light leading-relaxed">This securely stores your key in your machine's local keychain (AES-256 encrypted).</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#050505] border border-white/10 rounded-xl p-8 font-mono text-sm text-gray-300 relative group/btn">
                        <button
                            onClick={() => copyToClipboard("sipheron-vdr link --key [YOUR_KEY]", "link")}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover/btn:opacity-100"
                        >
                            {copied === "link" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <div className="text-gray-500 mb-4 uppercase text-[10px] font-black">Authentication Command</div>
                        <div className="flex items-center gap-3">
                            <span className="opacity-50">➜</span>
                            <span>sipheron-vdr link --key [YOUR_KEY]</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Identity & Security Architecture */}
            <section id="identity-architecture" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Identity Architecture</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start not-prose">
                    <div className="space-y-6 text-gray-400 font-light leading-relaxed text-sm">
                        <p>
                            SipHeron VDR uses a <span className="text-white font-medium">Dual-Key Identity Model</span> to separate administrative authority from operational anchoring.
                        </p>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <h5 className="text-white font-bold mb-1 text-xs uppercase tracking-widest">1. The Organization Key (Ed25519)</h5>
                                <p className="text-[11px] text-gray-500 font-light">The master key associated with your SipHeron account. It is used to authorize new nodes and manage group permissions.</p>
                            </div>
                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                <h5 className="text-blue-400 font-bold mb-1 text-xs uppercase tracking-widest">2. The Session Token (AES-256)</h5>
                                <p className="text-[11px] text-gray-500 font-light">A short-lived, locally generated token used by the CLI to sign individual anchor requests. This prevents your master API key from ever being exposed to the network.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h4 className="text-sm font-bold text-white mb-4 relative flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" /> OS-Level Security
                        </h4>
                        <div className="space-y-4 relative">
                            {[
                                { platform: "macOS", tech: "Apple Keychain", desc: "Uses system Security.framework with hardware-backed encryption." },
                                { platform: "Windows", tech: "Credential Manager", desc: "Leverages DPAPI for user-scoped isolation." },
                                { platform: "Linux", tech: "Secret Service", desc: "Interfaces with libsecret via D-Bus." }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-start gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="shrink-0 text-[10px] font-black uppercase text-gray-600 w-16">{item.platform}</div>
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-300">{item.tech}</div>
                                        <div className="text-[10px] text-gray-500 font-light">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Advanced Deployment: Docker & CI/CD */}
            <section id="advanced-deployment" className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Advanced Deployment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 not-prose">
                    <div className="space-y-6 text-sm text-gray-400 font-light leading-relaxed">
                        <p>
                            For headless environments, microservices, or CI/CD pipelines where a local keychain is unavailable, you can use the production-ready <span className="text-white">Docker image</span>.
                        </p>
                        <div className="bg-[#050505] border border-white/10 rounded-xl p-6 font-mono text-xs text-gray-400 relative group/btn">
                            <button
                                onClick={() => copyToClipboard("docker pull sipheron/vdr-cli:latest", "docker")}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover/btn:opacity-100"
                            >
                                {copied === "docker" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <div className="flex items-center gap-3">
                                <span className="opacity-50">➜</span>
                                <span>docker pull sipheron/vdr-cli:latest</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <h4 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-blue-400" /> Environment Variables
                        </h4>
                        <p className="text-[11px] text-gray-500 mb-4">In headless mode, the CLI will prioritize environment variables over the local keychain.</p>
                        <div className="space-y-2 font-mono text-[10px]">
                            <div className="flex justify-between p-2 rounded bg-black/40 border border-white/5">
                                <span className="text-blue-400">SIPHERON_API_KEY</span>
                                <span className="text-gray-600">sk_live_...</span>
                            </div>
                            <div className="flex justify-between p-2 rounded bg-black/40 border border-white/5">
                                <span className="text-blue-400">SIPHERON_RPC_URL</span>
                                <span className="text-gray-600">https://api.mainnet...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Configuration Reference */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Configuration Reference</h2>
                <div className="p-8 bg-[#050505] border border-white/5 rounded-3xl not-prose">
                    <p className="text-xs text-gray-500 mb-6 font-light">Custom behavior can be defined in a <code className="text-white">.sipheronrc</code> file at your project root.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h5 className="text-[11px] font-black uppercase tracking-widest text-gray-600 mb-4">Core Settings</h5>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs font-bold text-white mb-1">batch_interval</div>
                                    <div className="text-[10px] text-gray-500 font-light">Frequency of anchor batching (default: 60s)</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white mb-1">storage_provider</div>
                                    <div className="text-[10px] text-gray-500 font-light">Target VDR (default: "solana-mainnet")</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-[11px] font-black uppercase tracking-widest text-gray-600 mb-4">Security Settings</h5>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs font-bold text-white mb-1">auto_lock</div>
                                    <div className="text-[10px] text-gray-500 font-light">Auto-purge session token after 24h</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white mb-1">encryption_level</div>
                                    <div className="text-[10px] text-gray-500 font-light">Hashing complexity factor (1-10)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Common Issues */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Common Issues</h2>
                <div className="space-y-6 not-prose">
                    <div className="flex gap-6 items-start p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                        <div>
                            <h4 className="text-white font-bold mb-1 text-sm">Permission Denied (EACCES)</h4>
                            <p className="text-[13px] text-gray-500 font-light leading-relaxed">
                                This occurs when trying to install NPM packages globally without root access. Fix permissions or use <code>nvm</code>.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                        <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                        <div>
                            <h4 className="text-white font-bold mb-1 text-sm">Connection Timeout</h4>
                            <p className="text-[13px] text-gray-500 font-light leading-relaxed">
                                Ensure port <code>443</code> is open for <code>api.sipheron.com</code> and Solana RPC endpoints are accessible.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="mt-32 flex justify-between items-center not-prose">
                <Link href="/docs" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to Introduction
                </Link>
                <Link href="/docs/quickstart" className="px-8 py-4 bg-white text-black font-bold flex items-center gap-3 hover:bg-gray-200 transition-all group rounded-xl">
                    Run your first Anchor
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
