"use client";

import { motion } from "framer-motion";
import { Terminal, Download, Shield, AlertTriangle, CheckCircle, Apple, Monitor, Globe, Command, Key } from "lucide-react";
import Link from "next/link";

export default function InstallationPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert max-w-none space-y-16"
        >
            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">Setup</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-6">Installation</h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                    Set up your secure cryptographic environment. SipHeron VDR requires a local runtime to ensure data privacy—your files never leave your machine.
                </p>
            </div>

            {/* Prerequisites */}
            <section className="pt-8 border-t border-white/5">
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
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Installing the VDR CLI</h2>
                <p className="text-gray-400 font-light mb-8">
                    The SipHeron CLI is available as a global NPM package. It handles local entropy generation and anchoring orchestration.
                </p>

                <div className="space-y-8">
                    {/* NPM Install */}
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
                            <div className="p-6 font-mono text-sm">
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

            {/* Authentication Config */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Initialize Identity</h2>
                <p className="text-gray-400 font-light mb-8">
                    Once installed, you must link your local environment to your institutional identity on the SipHeron registry.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
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

                    <div className="not-prose">
                        <div className="bg-[#050505] border border-white/10 rounded-xl p-6 font-mono text-xs overflow-hidden">
                            <div className="text-gray-500 mb-2"># Link your account</div>
                            <div className="flex items-center gap-3">
                                <span className="text-blue-500">➜</span>
                                <span className="text-gray-300">sipheron-vdr link --key [YOUR_KEY]</span>
                            </div>
                            <div className="mt-4 text-emerald-500 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3" />
                                Success: Identity mapped to "SipHeron Labs"
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Troubleshooting */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-3xl font-black tracking-tight mb-8">Common Issues</h2>
                <div className="space-y-6">
                    <div className="flex gap-6 items-start not-prose p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                        <div>
                            <h4 className="text-white font-bold mb-1 text-sm">Permission Denied (EACCES)</h4>
                            <p className="text-[13px] text-gray-500 font-light leading-relaxed">
                                This occurs when trying to install NPM packages globally without root access. We recommend using a version manager like <code>nvm</code> or fixing your global directory permissions.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start not-prose p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                        <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                        <div>
                            <h4 className="text-white font-bold mb-1 text-sm">Connection Timeout</h4>
                            <p className="text-[13px] text-gray-500 font-light leading-relaxed">
                                If you are behind a corporate firewall, ensure that port <code>443</code> is open for <code>api.sipheron.com</code> and that your Solana RPC endpoint is accessible.
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
