"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    X,
    ChevronDown,
    Shield,
    Zap,
    Star,
    Globe,
    Lock,
    ArrowRight,
    Menu,
    Terminal,
    Cpu,
    FileCode,
    Binary,
    Scale,
    GraduationCap,
    Building2,
    ShieldCheck,
    BookOpen,
    FileText,
    Github,
    Package,
    ExternalLink,
    ChevronRight,
    Plus
} from 'lucide-react';


// --- Components ---

const Badge = ({ children, className = "" }) => (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${className}`}>
        {children}
    </span>
);

const PriceCard = ({ title, price, period, description, features, cta, ctaHref, popular = false, annual = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative p-8 rounded-3xl border transition-all duration-500 flex flex-col h-full ${popular
                ? 'bg-gradient-to-b from-[#111118] to-[#0A0A0F] border-[#4F6EF7]/40 shadow-[0_20px_50px_rgba(79,110,247,0.1)] scale-105 z-10'
                : 'bg-[#111118] border-[#1E1E2E] hover:border-[#4F6EF7]/20'
                }`}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] text-white px-4 py-1.5 shadow-lg">
                        Most Popular
                    </Badge>
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black text-white">{typeof price === 'number' ? `$${annual ? Math.round(price * 0.8) : price}` : price}</span>
                    {typeof price === 'number' && (
                        <span className="text-[#6B7280] text-sm font-medium">/{period}</span>
                    )}
                </div>
                <p className="text-[#6B7280] text-sm leading-relaxed">{description}</p>
            </div>

            <div className="space-y-4 mb-10 flex-1">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className={`mt-1 p-0.5 rounded-full ${feature.included ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-white/5 text-[#6B7280]'}`}>
                            {feature.included ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                        </div>
                        <span className={`text-sm ${feature.included ? 'text-[#F8F8FF]' : 'text-[#6B7280]'}`}>
                            {feature.text}
                        </span>
                    </div>
                ))}
            </div>

            <Link href={ctaHref} className="w-full">
                <button
                    onClick={() => {
                        window.plausible?.('PricingCTA', { props: { plan: title.toLowerCase() } });
                    }}
                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 ${popular
                        ? 'bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] text-white shadow-lg shadow-blue-500/20 hover:opacity-90 active:scale-[0.98]'
                        : 'bg-white/5 text-white border border-[#1E1E2E] hover:bg-white/10 active:scale-[0.98]'
                        }`}>
                    {cta}
                </button>
            </Link>
        </motion.div>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[#1E1E2E]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-6 text-left outline-none group"
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-[#4F6EF7]' : 'text-[#F8F8FF] group-hover:text-white'}`}>
                    {question}
                </span>
                <div className={`p-2 rounded-lg transition-all duration-300 ${isOpen ? 'bg-[#4F6EF7]/10 text-[#4F6EF7] rotate-45' : 'bg-white/5 text-[#6B7280]'}`}>
                    <Plus size={20} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-8 text-[#6B7280] leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
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

export default function PricingPage() {
    const [annual, setAnnual] = useState(false);

    const tiers = [
        {
            title: "Free",
            price: 0,
            period: "month",
            description: "Perfect for exploring the SipHeron VDR protocol.",
            cta: "Get Started Free",
            ctaHref: "https://app.sipheron.com/auth/register",
            features: [
                { text: "10 document anchors per month", included: true },
                { text: "1 API key", included: true },
                { text: "Dashboard access", included: true },
                { text: "CLI access", included: true },
                { text: "Community support", included: true },
                { text: "Devnet only", included: true },
                { text: "Webhook notifications", included: false },
                { text: "Mainnet anchoring", included: false }
            ]
        },
        {
            title: "Pro",
            price: 29,
            period: "month",
            description: "For creators and teams who need reliability and scale.",
            cta: "Start Pro Trial",
            ctaHref: "https://app.sipheron.com/auth/register",
            popular: true,
            features: [
                { text: "Unlimited anchors", included: true },
                { text: "10 API keys", included: true },
                { text: "Priority support (48hr)", included: true },
                { text: "Organization management", included: true },
                { text: "Webhook notifications", included: true },
                { text: "Audit export (CSV/PDF)", included: true },
                { text: "Devnet + Mainnet", included: true },
                { text: "Custom SLA", included: false }
            ]
        },
        {
            title: "Enterprise",
            price: "Custom",
            description: "Institutional-grade document management and SSO.",
            cta: "Contact Sales",
            ctaHref: "/contact",
            features: [
                { text: "Everything in Pro", included: true },
                { text: "Dedicated RPC endpoint", included: true },
                { text: "Custom SLA (99.9% uptime)", included: true },
                { text: "On-premise deployment", included: true },
                { text: "SSO / SAML integration", included: true },
                { text: "Custom contract & invoicing", included: true },
                { text: "Dedicated account manager", included: true },
                { text: "Smart contract audit report", included: true }
            ]
        }
    ];

    const comparison = [
        { feature: "Monthly Anchors", free: "10", pro: "Unlimited", enterprise: "Unlimited" },
        { feature: "API Keys", free: "1", pro: "10", enterprise: "Unlimited" },
        { feature: "Networks", free: "Devnet", pro: "Devnet + Mainnet", enterprise: "Devnet + Mainnet" },
        { feature: "Dashboard", free: true, pro: true, enterprise: true },
        { feature: "CLI Access", free: true, pro: true, enterprise: true },
        { feature: "Webhooks", free: false, pro: true, enterprise: true },
        { feature: "Audit Export", free: false, pro: true, enterprise: true },
        { feature: "Custom RPC", free: false, pro: false, enterprise: true },
        { feature: "SLA", free: false, pro: false, enterprise: "99.9%" },
        { feature: "SSO/SAML", free: false, pro: false, enterprise: true },
        { feature: "Support", free: "Community", pro: "Priority", enterprise: "Dedicated" },
    ];

    const faqs = [
        {
            question: "What counts as an anchor?",
            answer: "Each unique file hash registered on-chain counts as one anchor. If you update a document and re-anchor it, that counts as a new anchor."
        },
        {
            question: "Is the free tier really free?",
            answer: "Yes, forever on devnet. We want developers to build and test without friction. Mainnet anchoring requires a Pro or Enterprise subscription."
        },
        {
            question: "What happens if I exceed my anchor limit?",
            answer: "On the Free tier, anchoring will be paused until your next billing cycle. On Pro and Enterprise, limits are either unlimited or defined by your custom contract."
        },
        {
            question: "Can I switch plans?",
            answer: "Yes, you can upgrade or downgrade your plan at any time through the organization settings page. billing will be prorated automatically."
        },
        {
            question: "Is my data private?",
            answer: "Absolutely. SipHeron is designed with privacy-first principles. Your files never leave your machine; only the SHA-256 hash is transmitted to the blockchain."
        },
        {
            question: "What blockchain is this built on?",
            answer: "SipHeron VDR is built on Solana. It provides the high throughput, low latency, and permanent finality required for institutional document registries."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 14-day money-back guarantee on all Pro annual subscriptions if you are not satisfied with the service."
        },
        {
            question: "When is mainnet available?",
            answer: "Mainnet is launching Q3 2026. Pro and Enterprise tier users will receive early access before the public launch."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF] font-sans selection:bg-[#4F6EF7]/30 selection:text-white">


            <main className="pt-32 pb-24">
                {/* Section 1: Hero */}
                <section className="px-6 mb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7] mb-6">
                                Simple, transparent pricing
                            </Badge>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]"
                        >
                            Pay for what you anchor.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6]">Nothing more.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-[#6B7280] mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            Start free on devnet. Scale to mainnet when you're ready.<br className="hidden md:block" /> No hidden fees, no lock-in, just pure immutable truth.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex items-center justify-center gap-4"
                        >
                            <span className={`text-sm font-bold ${!annual ? 'text-white' : 'text-[#6B7280]'}`}>Monthly</span>
                            <button
                                onClick={() => setAnnual(!annual)}
                                className="w-14 h-7 bg-[#1E1E2E] rounded-full p-1 relative flex items-center transition-all duration-300"
                            >
                                <div className={`w-5 h-5 bg-gradient-to-br from-[#4F6EF7] to-[#9B5CF6] rounded-full shadow-lg transition-transform duration-300 ${annual ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${annual ? 'text-white' : 'text-[#6B7280]'}`}>Annual</span>
                                <Badge className="bg-[#10B981]/10 text-[#10B981]">Save 20%</Badge>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Section 2: Pricing Cards */}
                <section className="px-6 mb-32">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {tiers.map((tier, i) => (
                            <PriceCard
                                key={tier.title}
                                {...tier}
                                annual={annual}
                            />
                        ))}
                    </div>
                </section>

                {/* Section 3: Comparison Table */}
                <section className="px-6 mb-40 overflow-x-auto">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-black text-center mb-16">Compare features</h2>
                        <div className="bg-[#111118] border border-[#1E1E2E] rounded-3xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#1E1E2E]">
                                        <th className="p-6 text-sm font-bold text-[#6B7280] uppercase tracking-widest">Feature</th>
                                        <th className="p-6 text-sm font-bold text-white uppercase tracking-widest text-center">Free</th>
                                        <th className="p-6 text-sm font-bold text-[#4F6EF7] uppercase tracking-widest text-center">Pro</th>
                                        <th className="p-6 text-sm font-bold text-[#9B5CF6] uppercase tracking-widest text-center">Enterprise</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E1E2E]">
                                    {comparison.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6 text-sm font-medium text-[#F8F8FF]">{row.feature}</td>
                                            <td className="p-6 text-sm text-center">
                                                {typeof row.free === 'boolean' ? (
                                                    row.free ? <Check size={18} className="mx-auto text-[#10B981]" /> : <X size={18} className="mx-auto text-[#6B7280]" />
                                                ) : (
                                                    <span className="text-[#6B7280] uppercase text-[11px] font-bold tracking-widest">{row.free}</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-sm text-center">
                                                {typeof row.pro === 'boolean' ? (
                                                    row.pro ? <Check size={18} className="mx-auto text-[#10B981]" /> : <X size={18} className="mx-auto text-[#6B7280]" />
                                                ) : (
                                                    <span className="text-[#F8F8FF] uppercase text-[11px] font-bold tracking-widest">{row.pro}</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-sm text-center">
                                                {typeof row.enterprise === 'boolean' ? (
                                                    row.enterprise ? <Check size={18} className="mx-auto text-[#10B981]" /> : <X size={18} className="mx-auto text-[#6B7280]" />
                                                ) : (
                                                    <span className="text-[#F8F8FF] uppercase text-[11px] font-bold tracking-widest">{row.enterprise}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Section 4: FAQ */}
                <section className="px-6 mb-40">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl font-black text-center mb-16">Frequently asked questions</h2>
                        <div className="space-y-2">
                            {faqs.map((faq, i) => (
                                <FAQItem key={i} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 5: Bottom CTA */}
                <section className="px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative p-12 md:p-24 rounded-[3rem] overflow-hidden text-center">
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4F6EF7]/20 via-[#111118] to-[#9B5CF6]/20 z-0" />
                            <div className="absolute inset-0 border border-white/10 rounded-[3rem] z-0" />

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Start anchoring documents today.</h2>
                                <p className="text-[#6B7280] text-lg mb-12 max-w-xl mx-auto">
                                    Free forever on devnet. No credit card required. Experience institutional provenance on the world's most performant network.
                                </p>
                                <Link href="https://app.sipheron.com/auth/register">
                                    <button className="px-10 py-5 rounded-2xl bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] text-white font-bold text-lg shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto uppercase tracking-widest">
                                        Get Started Free <ArrowRight size={22} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Global Background Elements */}
            <div className="fixed top-0 left-0 w-full h-[100vh] bg-[radial-gradient(circle_at_20%_20%,_#4F6EF708_0%,_transparent_50%)] pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-0 w-full h-[100vh] bg-[radial-gradient(circle_at_80%_80%,_#9B5CF608_0%,_transparent_50%)] pointer-events-none -z-10" />

            <style jsx global>{`
        html { scroll-behavior: smooth; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
}
