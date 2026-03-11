"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calendar,
    ArrowRight,
    Zap,
    CheckCircle2,
    Package,
    Rocket,
    ShieldCheck,
    ExternalLink,
    Terminal,
    Cpu,
    Box,
    AlertTriangle,
    Bug,
    History,
    Github,
    ChevronRight,
    Search,
    Link as LinkIcon
} from 'lucide-react';


// --- Shared Components ---

const Badge = ({ children, className = "" }) => (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${className}`}>
        {children}
    </span>
);

const Footer = () => {
    const columns = [
        {
            title: 'Platform',
            links: [
                { name: 'Dashboard', href: 'https://app.sipheron.com' },
                { name: 'Explorer', href: 'https://app.sipheron.com/explorer' },
                { name: 'CLI Tool', href: 'https://app.sipheron.com/docs/cli' },
                { name: 'Pricing', href: '/pricing' }
            ]
        },
        {
            title: 'Developers',
            links: [
                { name: 'Docs', href: 'https://app.sipheron.com/docs' },
                { name: 'CLI Reference', href: 'https://app.sipheron.com/docs/cli' },
                { name: 'API Reference', href: 'https://app.sipheron.com/docs/api' },
                { name: 'GitHub', href: 'https://github.com/leaderofARS/solana-vdr' }
            ]
        },
        {
            title: 'Resources',
            links: [
                { name: 'Security', href: '#' },
                { name: 'Legal', href: '#' },
                { name: 'Privacy', href: '#' },
                { name: 'Terms', href: '#' }
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Blog', href: '/blog' },
                { name: 'Changelog', href: '/changelog' }
            ]
        }
    ];

    return (
        <footer className="pt-32 pb-12 bg-[#0A0A0F] border-t border-[#1E1E2E]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center p-1 border border-white/10 hover:border-[#4F6EF7]/50 transition-all">
                                <img src="/sipheron_vdap_logo.png" alt="SipHeron" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-[#F8F8FF]">SIPHERON</span>
                        </Link>
                        <p className="text-[#6B7280] max-w-sm leading-relaxed mb-8">
                            Securing the world's digital provenance on Solana's high-performance blockchain. Immutable truth for the digital era.
                        </p>
                        <div className="flex gap-4">
                            {['Tw', 'Gh', 'In', 'Dc'].map(s => (
                                <div key={s} className="w-10 h-10 rounded-full bg-[#111118] border border-[#1E1E2E] flex items-center justify-center text-[#6B7280] hover:text-[#F8F8FF] hover:border-[#F8F8FF] transition-all cursor-pointer font-bold text-xs uppercase">
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                    {columns.map(col => (
                        <div key={col.title}>
                            <h4 className="text-[#F8F8FF] font-bold text-sm mb-6 uppercase tracking-widest">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map(link => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-[#6B7280] hover:text-[#4F6EF7] transition-colors text-sm">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="pt-12 border-t border-[#1E1E2E] flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[#6B7280] text-sm">&copy; 2026 SipHeron. Built on Solana.</p>
                    <div className="flex gap-8 text-sm text-[#6B7280]">
                        <span className="hover:text-[#F8F8FF] cursor-pointer">Security Audit</span>
                        <span className="hover:text-[#F8F8FF] cursor-pointer">Status</span>
                        <span className="hover:text-[#F8F8FF] cursor-pointer cursor-not-allowed opacity-50">v0.9.4-beta</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- Changelog Components ---

const ChangelogItem = ({ version, date, tag, changes, latest = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative pl-12 pb-24 group last:pb-0"
        >
            {/* Vertical Line */}
            <div className={`absolute left-4 top-1.5 bottom-0 w-px ${latest ? 'bg-gradient-to-b from-[#4F6EF7] via-[#1E1E2E] to-[#1E1E2E]' : 'bg-[#1E1E2E]'} group-last:bg-transparent`} />

            {/* Marker */}
            <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 z-10 ${latest ? 'bg-[#4F6EF7]/20 border-[#4F6EF7] text-[#4F6EF7] shadow-[0_0_15px_rgba(79,110,247,0.4)]' : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#6B7280] group-hover:border-[#4285F4]/30'}`}>
                {latest ? <Zap size={16} fill="currentColor" fillOpacity={0.2} /> : <History size={16} />}
            </div>

            <div className="bg-[#111118] border border-[#1E1E2E] rounded-[2rem] p-8 md:p-10 group-hover:border-[#4F6EF7]/30 transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-white tracking-tight">{version}</span>
                        {tag && (
                            <Badge className={latest ? "bg-[#4F6EF7] text-white px-3 shadow-lg" : "bg-white/5 text-[#6B7280] border border-[#1E1E2E]"}>
                                {tag}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-[#6B7280] font-bold text-xs uppercase tracking-widest">
                        <Calendar size={14} /> {date}
                    </div>
                </div>

                <ul className="space-y-4">
                    {changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-4">
                            <div className={`mt-0.5 p-1 rounded bg-white/5 ${change.type === 'fix' ? 'text-blue-400' : change.type === 'release' ? 'text-yellow-400' : 'text-[#10B981]'}`}>
                                {change.type === 'fix' ? <Bug size={14} /> : change.type === 'release' ? <Rocket size={14} /> : <CheckCircle2 size={14} />}
                            </div>
                            <span className="text-[#F8F8FF] text-sm leading-relaxed">{change.text}</span>
                        </li>
                    ))}
                </ul>

                {latest && (
                    <div className="mt-10 pt-8 border-t border-[#1E1E2E] flex flex-wrap gap-3">
                        <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7]">Stability Fix</Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-500">Security Patch</Badge>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- Main Page ---

export default function ChangelogPage() {
    const releases = [
        {
            version: "v0.9.4",
            date: "March 8, 2026",
            tag: "Latest",
            latest: true,
            changes: [
                { type: 'done', text: "Fixed Anchor 0.29.0 IDL compatibility for old-format IDL registrations." },
                { type: 'fix', text: "Fixed treasury PublicKey serialization for cross-platform compliance." },
                { type: 'done', text: "Fixed optional organization account parsing in transactional logic." },
                { type: 'done', text: "End-to-end hash registration and verification confirmed working." },
                { type: 'done', text: "Hash Decoder utility added to dashboard for manual provenance checks." }
            ]
        },
        {
            version: "v0.9.3",
            date: "March 6, 2026",
            tag: "Stable",
            changes: [
                { type: 'fix', text: "Dashboard cookie authentication fix (sameSite: none) for cross-domain sessions." },
                { type: 'done', text: "CLI security audit complete — 0 critical vulnerabilities found." },
                { type: 'done', text: "AES-256-CBC upgraded to AES-256-GCM for faster verified encryption." },
                { type: 'done', text: "Implemented Streaming SHA-256 for processing multi-GB files in terminal." }
            ]
        },
        {
            version: "v0.9.2",
            date: "March 5, 2026",
            tag: "Stable",
            changes: [
                { type: 'done', text: "High-level DNS subdomain setup finalized (api.sipheron.com, app.sipheron.com)." },
                { type: 'done', text: "Backend service successfully deployed to Railway for redundancy." },
                { type: 'done', text: "Dashboard deployed to global Vercel edge network." },
                { type: 'done', text: "npm package published for sipheron-vdr and ready for enterprise installs." }
            ]
        },
        {
            version: "v0.9.1",
            date: "March 3, 2026",
            tag: "Stable",
            changes: [
                { type: 'done', text: "Institutional smart contract successfully deployed to Solana Devnet." },
                { type: 'done', text: "Program ID: 6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo verified." },
                { type: 'done', text: "Protocol global configuration initialized on-chain." },
                { type: 'done', text: "Primary Organization PDA created with multi-sig backup." }
            ]
        },
        {
            version: "v0.9.0-beta",
            date: "March 1, 2026",
            tag: "Beta",
            changes: [
                { type: 'release', text: "🚀 Initial beta release of SipHeron VDR Protocol." },
                { type: 'done', text: "CLI: Full support for stage, anchor, verify, and link commands." },
                { type: 'done', text: "Backend API: Released auth, keys, and batch register endpoints." },
                { type: 'done', text: "Dashboard: Live release for login, analytics, and API key management." }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF] font-sans selection:bg-[#4F6EF7]/30 selection:text-white overflow-x-hidden">


            <main className="pt-32 pb-24 px-6">
                {/* Hero Section */}
                <header className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7] mb-6 tracking-[0.3em]">Protocol Lifecycle</Badge>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]"
                    >
                        Project <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6]">Changelog.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Follow our journey as we build the world's most performant provenance registry on Solana.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex items-center justify-center"
                    >
                        <Link href="https://github.com/leaderofARS/solana-vdr/releases" target="_blank">
                            <button className="px-10 py-5 rounded-2xl bg-[#111118] border border-[#1E1E2E] text-white font-bold text-lg hover:border-[#4F6EF7] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                                <Github size={22} /> Subscribe to releases
                            </button>
                        </Link>
                    </motion.div>
                </header>

                {/* Timeline Section */}
                <section className="max-w-4xl mx-auto pb-40">
                    <div className="relative">
                        {releases.map((release, i) => (
                            <ChangelogItem
                                key={release.version}
                                {...release}
                            />
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="max-w-4xl mx-auto">
                    <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-[#111118] to-[#0A0A0F] border border-[#1E1E2E] text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4F6EF705_0%,_transparent_70%)] pointer-events-none" />
                        <h2 className="text-3xl font-black text-white mb-6">Want to influence our roadmap?</h2>
                        <p className="text-[#6B7280] mb-12 max-w-xl mx-auto leading-relaxed">
                            We build for our community and institutional partners. Share your feature requests or technical needs.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] text-white font-bold rounded-2xl shadow-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest text-sm">
                            Contact Product Team <ArrowRight size={18} />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,_#4F6EF705_0%,_transparent_40%)] pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_80%,_#9B5CF605_0%,_transparent_40%)] pointer-events-none -z-10" />

            <style jsx global>{`
                html { scroll-behavior: smooth; }
            `}</style>
        </div>
    );
}
