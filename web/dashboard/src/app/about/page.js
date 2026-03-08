"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Shield,
    ShieldCheck,
    Zap,
    Globe,
    Lock,
    Cpu,
    Terminal,
    ArrowRight,
    ChevronRight,
    Code,
    Github,
    CheckCircle2,
    Clock,
    Layout,
    Server,
    Database,
    Search,
    Users,
    Building2,
    GraduationCap,
    Scale,
    RefreshCw,
    Info,
    ExternalLink
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';

// --- Components ---

const Badge = ({ children, className = "" }) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${className}`}>
        {children}
    </span>
);

const SectionHeader = ({ eyebrow, title, description, center = true }) => (
    <div className={`mb-16 ${center ? 'text-center' : 'text-left'}`}>
        <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7] mb-4">{eyebrow}</Badge>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">{title}</h2>
        {description && (
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">{description}</p>
        )}
    </div>
);

const RoadmapItem = ({ period, items, status = 'upcoming' }) => {
    const statusIcons = {
        completed: <CheckCircle2 className="w-5 h-5 text-[#10B981]" />,
        active: <RefreshCw className="w-5 h-5 text-[#4F6EF7] animate-spin-slow" />,
        upcoming: <div className="w-5 h-5 rounded-full border-2 border-[#1E1E2E]" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative pl-8 pb-12 last:pb-0 group"
        >
            {/* Line */}
            <div className="absolute left-2.5 top-0 bottom-0 w-px bg-[#1E1E2E] group-last:bg-transparent" />

            {/* Dot */}
            <div className="absolute left-0 top-0.5 z-10 bg-[#0A0A0F]">
                {statusIcons[status]}
            </div>

            <div>
                <h4 className={`text-sm font-black uppercase tracking-widest mb-3 ${status === 'completed' ? 'text-[#10B981]' : status === 'active' ? 'text-[#4F6EF7]' : 'text-[#6B7280]'}`}>
                    {period}
                </h4>
                <ul className="space-y-3">
                    {items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-[#F8F8FF] text-sm">
                            <ChevronRight className="w-3 h-3 text-[#1E1E2E]" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

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
                        <Link href="/" className="flex items-center gap-2 mb-8">
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
                    <p className="text-[#6B7280] text-sm">© 2026 SipHeron. Built on Solana.</p>
                    <div className="flex gap-8 text-sm text-[#6B7280]">
                        <span className="hover:text-[#F8F8FF] cursor-pointer">Security Audit</span>
                        <span className="hover:text-[#F8F8FF] cursor-pointer">Status</span>
                        <span className="hover:text-[#F8F8FF] cursor-pointer cursor-not-allowed opacity-50">v0.9-beta</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- Main Page ---

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF] font-sans selection:bg-[#4F6EF7]/30 selection:text-white overflow-x-hidden">
            <LandingNavbar />

            <main className="pt-32 pb-24">
                {/* Section 1: Hero */}
                <section className="px-6 mb-32">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7] mb-6">About SipHeron</Badge>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]"
                        >
                            Document trust shouldn't <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6]">require a third party.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-[#6B7280] mb-12 max-w-3xl mx-auto leading-relaxed"
                        >
                            We built SipHeron because notarization is broken. Slow, expensive, geographically limited, and dependent on institutions that can fail.
                            <span className="text-[#4F6EF7] font-medium"> Blockchain changes that.</span>
                        </motion.p>
                    </div>
                </section>

                {/* Section 2: Mission Statement */}
                <section className="px-6 mb-40">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-[#111118] border border-[#1E1E2E] rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -translate-y-12 translate-x-12" />

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <blockquote className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
                                        "Our mission is to make document authenticity as simple as running a command — and as permanent as the blockchain it's written on."
                                    </blockquote>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                                    <div>
                                        <h4 className="text-[#4F6EF7] font-bold uppercase tracking-widest text-xs mb-4">The Problem</h4>
                                        <p className="text-sm text-[#6B7280] leading-relaxed">
                                            Reliance on fragile physical seals, manually signed papers, and centralized databases that act as single points of failure.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-[#10B981] font-bold uppercase tracking-widest text-xs mb-4">The Solution</h4>
                                        <p className="text-sm text-[#6B7280] leading-relaxed">
                                            A high-performance, decentralized registry that cryptographically locks document metadata into a global ledger via SipHeron VDR.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: The Problem We're Solving */}
                <section className="px-6 mb-40">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Scale size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Traditional Notarization</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed">
                                    Costs $50—$200 per document, takes days to schedule, and is often paper-based. It's geographically trapped—valid in one state but questioned in another.
                                </p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-6">
                                <div className="w-12 h-12 rounded-xl bg-[#F28B82]/10 flex items-center justify-center text-[#F28B82]">
                                    <Server size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Centralized Databases</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed">
                                    Digital alternatives rely on private servers that can be hacked, records modified by rogue admins, or completely shut down when the company disappears.
                                </p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="space-y-6">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">The Trust Deficit</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed">
                                    The result is a world where critical documents—legal contracts, degree certificates, and health records—cannot be trusted instantly across borders or decades.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Section 4: How SipHeron Works (Technical) */}
                <section className="px-6 mb-40 py-24 bg-[#111118]/50 border-y border-[#1E1E2E]">
                    <div className="max-w-7xl mx-auto">
                        <SectionHeader
                            eyebrow="Architecture"
                            title="Cryptography, not trust."
                            description="SipHeron never sees your files. We only process mathematical proofs."
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#4F6EF7]/10 flex items-center justify-center text-[#4F6EF7] font-bold shrink-0">1</div>
                                    <div>
                                        <h4 className="text-white font-bold mb-2">SHA-256 Hashing</h4>
                                        <p className="text-sm text-[#6B7280]">Your document is hashed locally. The hash is a unique 64-character fingerprint. The actual content never leaves your environment.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#4F6EF7]/10 flex items-center justify-center text-[#4F6EF7] font-bold shrink-0">2</div>
                                    <div>
                                        <h4 className="text-white font-bold mb-2">Solana PDA Registration</h4>
                                        <p className="text-sm text-[#6B7280]">We use Program Derived Addresses (PDAs) to store the hash, timestamp, and issuer data directly in the Solana ledger state.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#4F6EF7]/10 flex items-center justify-center text-[#4F6EF7] font-bold shrink-0">3</div>
                                    <div>
                                        <h4 className="text-white font-bold mb-2">Immutable Verification</h4>
                                        <p className="text-sm text-[#6B7280]">Anyone with the file can re-hash it and verify it against the on-chain record. If a single pixel changes, the verification fails.</p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <p className="text-xs text-[#6B7280] mb-3 uppercase tracking-widest font-bold">Standardized Program ID</p>
                                    <Link
                                        href="https://explorer.solana.com/address/6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo?cluster=devnet"
                                        target="_blank"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg text-[#F8F8FF] font-mono text-xs hover:border-[#4F6EF7] transition-all"
                                    >
                                        6ecWPUK8...zAwv <ExternalLink size={12} />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl p-8 aspect-video flex flex-col items-center justify-center gap-6 shadow-2xl">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="flex-1 h-20 rounded-xl bg-[#111118] border border-[#1E1E2E] flex flex-col items-center justify-center text-[#6B7280]">
                                            <Terminal size={20} className="mb-1" />
                                            <span className="text-[10px] font-bold">CLI Client</span>
                                        </div>
                                        <ArrowRight className="text-[#1E1E2E]" />
                                        <div className="flex-1 h-20 rounded-xl bg-[#111118] border border-[#1E1E2E] flex flex-col items-center justify-center text-[#6B7280]">
                                            <Cpu size={20} className="mb-1" />
                                            <span className="text-[10px] font-bold">VDR API</span>
                                        </div>
                                        <ArrowRight className="text-[#1E1E2E]" />
                                        <div className="flex-1 h-20 rounded-xl bg-gradient-to-br from-[#4F6EF7]/20 to-[#9B5CF6]/20 border border-[#4F6EF7]/30 flex flex-col items-center justify-center text-[#F8F8FF]">
                                            <ShieldCheck size={20} className="mb-1" />
                                            <span className="text-[10px] font-bold">Solana</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-[#1E1E2E] rounded-full relative overflow-hidden">
                                        <motion.div
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#4F6EF7] to-transparent"
                                        />
                                    </div>
                                    <p className="text-[10px] text-[#6B7280] font-mono tracking-widest uppercase">Transaction Data Flow</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 5: Why Solana */}
                <section className="px-6 mb-40 text-center">
                    <div className="max-w-7xl mx-auto">
                        <SectionHeader
                            eyebrow="Infrastructure"
                            title="Why Solana?"
                            description="Institutional document management requires speed, scalability, and absolute cost efficiency."
                        />
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="p-8 rounded-2xl bg-[#111118] border border-[#1E1E2E]">
                                <p className="text-3xl font-black text-white mb-2">400ms</p>
                                <p className="text-xs text-[#6B7280] uppercase font-bold tracking-widest">Block Times</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-[#111118] border border-[#1E1E2E]">
                                <p className="text-3xl font-black text-white mb-2">$0.0002</p>
                                <p className="text-xs text-[#6B7280] uppercase font-bold tracking-widest">Avg. Tx Cost</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-[#111118] border border-[#1E1E2E]">
                                <p className="text-3xl font-black text-[#10B981] mb-2">100%</p>
                                <p className="text-xs text-[#6B7280] uppercase font-bold tracking-widest">Uptime Record</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-[#111118] border border-[#1E1E2E]">
                                <p className="text-3xl font-black text-white mb-2">Global</p>
                                <p className="text-xs text-[#6B7280] uppercase font-bold tracking-widest">Adoption</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 6: Use Cases */}
                <section className="px-6 mb-40">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-black text-center mb-16">Designed for real impact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Scale className="text-[#4F6EF7]" />,
                                    title: "Legal & Compliance",
                                    desc: "Create immutable audit trails for contracts and evidence that stand up in any jurisdiction.",
                                    color: "blue"
                                },
                                {
                                    icon: <GraduationCap className="text-[#9B5CF6]" />,
                                    title: "Academic Credentials",
                                    desc: "Eliminate transcript fraud with instant digital verification of degrees and diplomas.",
                                    color: "purple"
                                },
                                {
                                    icon: <Building2 className="text-[#10B981]" />,
                                    title: "Enterprise Control",
                                    desc: "Secure internal records and intellectual property across distributed global teams.",
                                    color: "green"
                                }
                            ].map((uc, i) => (
                                <div key={i} className="bg-[#111118] border border-[#1E1E2E] p-8 rounded-3xl hover:border-[#4F6EF7]/30 transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {uc.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{uc.title}</h3>
                                    <p className="text-[#6B7280] text-sm leading-relaxed mb-8">{uc.desc}</p>
                                    <Link href="https://app.sipheron.com/docs/use-cases" className="text-xs font-bold uppercase tracking-widest text-[#4F6EF7] flex items-center gap-2 hover:gap-3 transition-all">
                                        Learn more <ArrowRight size={14} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 7: Roadmap */}
                <section className="px-6 mb-40">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7] mb-4">The Future</Badge>
                            <h2 className="text-4xl font-black text-white">Project Roadmap</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <RoadmapItem
                                    period="Q1 2026"
                                    status="completed"
                                    items={["Devnet launch", "CLI v0.9 stable", "Core Dashboard UI"]}
                                />
                                <RoadmapItem
                                    period="Q1 2026"
                                    status="completed"
                                    items={["Organization accounts", "API key management", "Public Page generation"]}
                                />
                                <RoadmapItem
                                    period="Q2 2026"
                                    status="active"
                                    items={["Third-party security audit", "Mainnet genesis preparation", "Beta issuer program"]}
                                />
                            </div>
                            <div>
                                <RoadmapItem
                                    period="Q3 2026"
                                    items={["Mainnet public launch", "Pro tier subscriptions", "Enhanced Audit logs"]}
                                />
                                <RoadmapItem
                                    period="Q4 2026"
                                    items={["Enterprise Tier launch", "SSO/SAML integration", "Dedicated RPC support"]}
                                />
                                <RoadmapItem
                                    period="2027+"
                                    items={["Mobile Verification SDK", "Browser extension verifier", "Gov & Healthcare partnerships"]}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 8: Open Source */}
                <section className="px-6 mb-40">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-gradient-to-br from-[#111118] to-[#0A0A0F] border border-[#1E1E2E] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#4F6EF7] to-transparent" />
                            <div className="relative z-10">
                                <Github className="w-16 h-16 text-white mb-8 mx-auto opacity-20" />
                                <h2 className="text-3xl font-black text-white mb-6">Open Infrastructure</h2>
                                <p className="text-[#6B7280] text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                                    SipHeron is built on open standards. The core smart contract is verifiable on-chain, and our client tooling is built in the open. No black boxes.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        href="https://github.com/leaderofARS/solana-vdr"
                                        target="_blank"
                                        className="w-full sm:w-auto px-8 py-4 bg-[#1E1E2E] hover:bg-[#2C3038] rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                                    >
                                        <Github size={20} /> View Protocol Source
                                    </Link>
                                    <Link
                                        href="https://explorer.solana.com/address/6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo?cluster=devnet"
                                        target="_blank"
                                        className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-[#1E1E2E] hover:border-[#4F6EF7] rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                                    >
                                        <ShieldCheck size={20} /> Verify Smart Contract
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 9: Contact CTA */}
                <section className="px-6 relative overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Need document verification?</h2>
                        <p className="text-[#6B7280] text-lg md:text-xl mb-12 leading-relaxed">
                            We work with legal teams, universities, and enterprises to implement custom verification workflows. Let's secure your digital records.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/contact">
                                <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] text-white font-bold text-lg shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                                    Talk to us <ArrowRight size={22} />
                                </button>
                            </Link>
                            <Link href="https://app.sipheron.com/docs">
                                <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#111118] border border-[#1E1E2E] text-white font-bold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                                    Read the docs
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        html { scroll-behavior: smooth; }
      `}</style>
        </div>
    );
}
