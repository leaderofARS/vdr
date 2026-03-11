"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    ArrowRight,
    Search,
    Mail,
    Zap,
    TrendingUp,
    Cpu,
    ShieldCheck,
    Scale,
    GraduationCap,
    BookOpen,
    CheckCircle2,
    ExternalLink
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

// --- Blog Components ---

const PostCard = ({ slug, category, title, excerpt, date, readTime, author }) => (
    <Link href={`/blog/${slug}`} className="block h-full">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-[#111118] border border-[#1E1E2E] rounded-3xl overflow-hidden hover:border-[#4F6EF7]/40 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            <div className="p-8 flex flex-col h-full">
                <div className="mb-6 flex items-center justify-between">
                    <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7]">
                        {category}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                        <Clock size={12} /> {readTime}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#4F6EF7] transition-colors line-clamp-2 leading-snug">
                    {title}
                </h3>

                <p className="text-[#6B7280] text-sm leading-relaxed mb-8 line-clamp-2">
                    {excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-[#1E1E2E]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F6EF7] to-[#9B5CF6] flex items-center justify-center text-[10px] font-bold text-white border border-white/10 shadow-lg">
                            {author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#F8F8FF]">{author}</span>
                            <span className="text-[10px] text-[#6B7280]">{date}</span>
                        </div>
                    </div>
                    <ArrowRight size={18} className="text-[#1E1E2E] group-hover:text-[#4F6EF7] group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </motion.div>
    </Link>
);

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    return (
        <section className="px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="relative p-12 md:p-20 rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#111118] to-[#0A0A0F] border border-[#1E1E2E]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -translate-y-12 translate-x-12 pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Stay in the loop.</h2>
                            <p className="text-[#6B7280] text-lg lg:max-w-md">
                                Stay updated on SipHeron developments, new features, and the future of on-chain trust.
                            </p>
                        </div>

                        <div className="w-full max-w-md">
                            <form onSubmit={handleSubscribe} className="relative group">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your institutional email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-6 pr-40 py-5 bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl text-[#F8F8FF] focus:outline-none focus:border-[#4F6EF7] transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 bottom-2 px-8 bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] text-white font-bold rounded-xl text-sm shadow-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    Subscribe
                                </button>
                            </form>
                            <AnimatePresence>
                                {subscribed && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-4 flex items-center gap-2 text-[#10B981] text-sm font-bold justify-center lg:justify-start"
                                    >
                                        <CheckCircle2 size={16} /> Subscription successful!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Main Page ---

export default function BlogPage() {
    const posts = [
        {
            slug: "why-document-authenticity-matters",
            title: "Why Document Authenticity Matters in 2025",
            category: "Opinion",
            date: "March 15, 2026",
            readTime: "8 min read",
            author: "SipHeron Team",
            excerpt: "Fraudulent documents lead to billion-dollar losses. We explore the cost of fake records in a world of advanced AI."
        },
        {
            slug: "solana-for-document-registry",
            title: "Why We Built on Solana Instead of Ethereum",
            category: "Technical",
            date: "March 10, 2026",
            readTime: "6 min read",
            author: "SipHeron Team",
            excerpt: "Speed, cost, finality. Comparing Solana vs Ethereum for a high-frequency global document verification layer."
        },
        {
            slug: "how-vdr-works-technically",
            title: "How SipHeron VDR Works Under the Hood",
            category: "Technical",
            date: "March 5, 2026",
            readTime: "7 min read",
            author: "SipHeron Team",
            excerpt: "A technical deep dive into SHA-256, Anchor programs, and the PDA-based hash registration flow."
        },
        {
            slug: "cli-workflow-guide",
            title: "The 3-Command Workflow That Proves Any Document",
            category: "Guide",
            date: "Feb 28, 2026",
            readTime: "5 min read",
            author: "SipHeron Team",
            excerpt: "Install, anchor, verify. A practical walkthrough for using the SipHeron CLI in your daily development."
        },
        {
            slug: "use-cases-legal-finance",
            title: "5 Use Cases for Blockchain Document Verification",
            category: "Use Cases",
            date: "Feb 20, 2026",
            readTime: "6 min read",
            author: "SipHeron Team",
            excerpt: "How top-tier law firms and financial institutions are cementing the chain of custody for mission-critical documents."
        },
        {
            slug: "devnet-to-mainnet",
            title: "From Devnet to Mainnet: Our Roadmap",
            category: "Updates",
            date: "Feb 15, 2026",
            readTime: "4 min read",
            author: "SipHeron Team",
            excerpt: "A look at our current status on devnet, impending security audit, and the timeline for mainnet launch."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF] font-sans selection:bg-[#4F6EF7]/30 selection:text-white overflow-x-hidden">


            <main className="pt-32 pb-24">
                {/* Hero Section */}
                <header className="px-6 mb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7] mb-6">Latest Insights</Badge>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]"
                        >
                            The SipHeron <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6]">Blog.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed"
                        >
                            Insights on document verification, blockchain infrastructure, and the future of digital trust.
                        </motion.p>
                    </div>
                </header>

                {/* Featured Post */}
                <section className="px-6 mb-32">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/blog/why-document-authenticity-matters">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group relative p-8 md:p-16 rounded-[3rem] bg-[#111118] border border-[#1E1E2E] hover:border-[#4F6EF7]/40 transition-all duration-500 cursor-pointer overflow-hidden lg:flex items-center gap-16"
                            >
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#4F6EF7]/5 to-transparent pointer-events-none" />

                                <div className="lg:w-3/5 relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <Badge className="bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] text-white px-4 py-1.5 shadow-lg">Featured</Badge>
                                        <span className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">March 15, 2026</span>
                                    </div>

                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 group-hover:text-[#4F6EF7] transition-colors leading-[1.1]">
                                        Why Document Authenticity Matters in 2025
                                    </h2>

                                    <p className="text-[#6B7280] text-lg mb-10 leading-relaxed max-w-2xl">
                                        Fraudulent documents lead to billion-dollar losses. We explore the cost of fake records in a world of advanced AI.
                                        Discover how decentralized nodes are replacing physical seals in the digital era.
                                    </p>

                                    <div className="flex items-center gap-8 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">SV</div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#F8F8FF]">SipHeron Team</span>
                                                <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Company Blog</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                                            <Clock size={16} /> 8 min read
                                        </div>
                                    </div>

                                    <div className="mt-12 flex items-center gap-2 text-[#4F6EF7] font-bold text-sm uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                        Read Full Story <ArrowRight size={18} />
                                    </div>
                                </div>

                                <div className="hidden lg:block lg:w-2/5 relative">
                                    <div className="aspect-square bg-gradient-to-br from-[#1E1E2E] to-[#0A0A0F] rounded-[2rem] border border-[#1E1E2E] relative overflow-hidden flex items-center justify-center">
                                        <ShieldCheck size={120} className="text-[#4F6EF7]/20" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4F6EF710_0%,_transparent_70%)]" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="px-6 mb-40">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl md:text-3xl font-black text-white">Latest Posts</h2>
                            <div className="flex items-center gap-6">
                                <button className="text-xs font-black uppercase tracking-widest text-[#4F6EF7] border-b-2 border-[#4F6EF7] pb-1">All</button>
                                <button className="text-xs font-black uppercase tracking-widest text-[#6B7280] hover:text-[#F8F8FF] transition-colors pb-1 border-b-2 border-transparent">Technical</button>
                                <button className="text-xs font-black uppercase tracking-widest text-[#6B7280] hover:text-[#F8F8FF] transition-colors pb-1 border-b-2 border-transparent">Use Cases</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, i) => (
                                <PostCard
                                    key={i}
                                    {...post}
                                />
                            ))}
                        </div>
                    </div>
                </section >

                {/* Newsletter Strip */}
                < Newsletter />
            </main >

            <Footer />

            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_10%,_#4F6EF705_0%,_transparent_40%)] pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_90%,_#9B5CF605_0%,_transparent_40%)] pointer-events-none -z-10" />

            <style jsx global>{`
                html { scroll-behavior: smooth; }
            `}</style>
        </div >
    );
}
