"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Globe, Zap, Lock, Landmark, Database, Fingerprint, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex flex-col relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#000000] to-[#000000] pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-full bg-mesh opacity-20 pointer-events-none" />

            <main className="relative z-10 flex-grow pt-40 pb-32">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 text-left mb-32">
                    <motion.div {...fadeIn} className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 mb-8">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-mono">Our Mission</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[1.1]">
                            The Institutional Backbone <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">
                                of Digital Truth.
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-3xl mb-12">
                            SipHeron VDR is the first cryptographic registry designed for the institutional era. We provide the infrastructure needed to anchor, verify, and govern the provenance of digital assets on the Solana blockchain.
                        </p>
                    </motion.div>
                </section>

                {/* Core Philosophy Grid */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden">
                        <div className="bg-[#050505] p-12 md:p-16">
                            <h2 className="text-3xl font-black mb-6 tracking-tight">Provenance as Infrastructure</h2>
                            <p className="text-gray-400 leading-relaxed font-light text-lg">
                                In a world increasingly saturated by generative AI and sophisticated misinformation, the ability to prove where data originated is no longer a luxury—it is a societal necessity. SipHeron empowers creators and institutions to build an immutable trail of history for every byte of data they produce.
                            </p>
                        </div>
                        <div className="bg-[#050505] p-12 md:p-16 flex flex-col justify-center border-t md:border-t-0 border-white/10">
                            <div className="space-y-8">
                                {[
                                    { icon: Fingerprint, title: "Cryptographic Identity", desc: "Every anchor is tied to a verifiable institutional public key." },
                                    { icon: Landmark, title: "Regulatory Readiness", desc: "Built with compliance in mind, featuring field-level encryption and secure TTLs." },
                                    { icon: Database, title: "On-Chain Resolution", desc: "Global data availability with sub-second finality via Solana's high-speed network." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <item.icon className="w-6 h-6 text-blue-500 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-400 font-light">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Technology Section */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-40">
                    <div className="flex flex-col md:flex-row gap-20 items-center">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Engineered for <br />Extreme Velocity.</h2>
                            <p className="text-gray-400 text-lg font-light leading-relaxed mb-8">
                                Conventional registries are too slow and expensive for high-volume content creators. SipHeron utilizes Solana's Sealevel runtime to process thousands of anchors per second at a fraction of a cent.
                            </p>
                            <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/10">
                                <div>
                                    <div className="text-3xl font-black text-white mb-1">65k+</div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Peak TPS</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white mb-1">400ms</div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Finality</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="aspect-square relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full" />
                                <div className="relative w-full aspect-video bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 overflow-hidden">
                                    <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                        <span className="ml-4 text-[10px] font-mono text-gray-600 uppercase">Architecture_v0.9.bin</span>
                                    </div>
                                    <div className="space-y-4 font-mono text-xs text-gray-500">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Instruction_Type</span>
                                            <span className="text-blue-400">Anchor_Signature_V2</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Runtime_Engine</span>
                                            <span className="text-emerald-400">Solana_Sealevel</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Cryptography</span>
                                            <span className="text-white">Ed25519_Secp256k1</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Privacy_Layer</span>
                                            <span className="text-purple-400">Zero_Knowledge_Local</span>
                                        </div>
                                        <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-lg text-[9px] leading-relaxed">
                                            The VDR Protocol utilizes locally-derived SHA-256 entropy strings to ensure raw data payloads are never exposed to the public ledger. Privacy is maintained via cryptographic mapping.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Closing CTA */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        whileInView={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        className="p-12 md:p-24 bg-[#050505] border border-white/10 relative overflow-hidden text-center flex flex-col items-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter relative z-10">Join the Era of Verified Data.</h2>
                        <p className="text-gray-400 text-lg font-light max-w-2xl mb-12 relative z-10 leading-relaxed">
                            Start building on the SipHeron VDR protocol today and secure your organization&apos;s digital legacy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                            <Link href="/auth/register" className="px-10 py-5 bg-white text-black font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 group">
                                Create Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/explorer" className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold text-base hover:bg-white/5 transition-colors">
                                Browse Registry
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
