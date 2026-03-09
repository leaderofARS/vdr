"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    MessageSquare,
    Globe,
    Send,
    CheckCircle2,
    AlertTriangle,
    ChevronDown,
    ArrowRight,
    Shield,
    ExternalLink,
    Github,
    Building2,
    Clock,
    Layout,
    Terminal,
    Package,
    FileText,
    Zap
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';

// --- Components ---

const Badge = ({ children, className = "" }) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${className}`}>
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

export default function ContactPage() {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        subject: 'General Inquiry',
        message: ''
    });

    const subjects = [
        'General Inquiry',
        'Enterprise Sales',
        'Technical Support',
        'Partnership',
        'Grant/Investment'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.name || formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters.';
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required.';
        if (!formData.message || formData.message.length < 20) newErrors.message = 'Message must be at least 20 characters.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setStatus('loading');

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xyzabc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    company: formData.company,
                    message: formData.message,
                    subject: formData.subject
                })
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', company: '', subject: 'General Inquiry', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF] font-sans selection:bg-[#4F6EF7]/30 selection:text-white overflow-x-hidden">
            <LandingNavbar />

            <main className="pt-32 pb-24">
                {/* Section 1: Hero */}
                <section className="px-6 mb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7] mb-6">Support & Sales</Badge>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]"
                        >
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6]">touch.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed"
                        >
                            Whether you're evaluating SipHeron for your institution, need enterprise pricing, or have a technical question — we respond within 24 hours.
                        </motion.p>
                    </div>
                </section>

                {/* Section 2: Contact Layout */}
                <section className="px-6 mb-32">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Left: Contact Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-[#111118] border border-[#1E1E2E] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6]" />

                                <h3 className="text-2xl font-black mb-8">Send a message</h3>

                                <AnimatePresence mode="wait">
                                    {status === 'success' ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="py-12 text-center"
                                        >
                                            <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#10B981]">
                                                <CheckCircle2 size={40} />
                                            </div>
                                            <h4 className="text-2xl font-bold mb-3 text-white">Message received!</h4>
                                            <p className="text-[#6B7280]">We'll respond within 24 hours.</p>
                                            <button
                                                onClick={() => setStatus('idle')}
                                                className="mt-8 text-sm font-bold text-[#4F6EF7] hover:underline"
                                            >
                                                Send another message
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {status === 'error' && (
                                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-sm text-red-500 mb-6">
                                                    <AlertTriangle size={20} className="shrink-0" />
                                                    <p>Something went wrong. Email us directly at <strong>hello@sipheron.com</strong></p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest ml-1">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="Jane Doe"
                                                        className={`w-full bg-[#0A0A0F] border ${errors.name ? 'border-red-500' : 'border-[#1E1E2E]'} rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#4F6EF7] transition-all placeholder:text-[#3C4043]`}
                                                    />
                                                    {errors.name && <p className="text-xs text-red-500 font-bold ml-1">{errors.name}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest ml-1">Work Email *</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="jane@company.com"
                                                        className={`w-full bg-[#0A0A0F] border ${errors.email ? 'border-red-500' : 'border-[#1E1E2E]'} rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#4F6EF7] transition-all placeholder:text-[#3C4043]`}
                                                    />
                                                    {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest ml-1">Organization</label>
                                                    <input
                                                        type="text"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                        placeholder="SipHeron Labs"
                                                        className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#4F6EF7] transition-all placeholder:text-[#3C4043]"
                                                    />
                                                </div>
                                                <div className="space-y-2 relative">
                                                    <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest ml-1">Subject</label>
                                                    <div className="relative">
                                                        <select
                                                            name="subject"
                                                            value={formData.subject}
                                                            onChange={handleChange}
                                                            className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#4F6EF7] transition-all appearance-none cursor-pointer"
                                                        >
                                                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={18} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest ml-1">Message *</label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="How can we help your institution?"
                                                    rows={6}
                                                    className={`w-full bg-[#0A0A0F] border ${errors.message ? 'border-red-500' : 'border-[#1E1E2E]'} rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#4F6EF7] transition-all placeholder:text-[#3C4043] resize-none`}
                                                ></textarea>
                                                {errors.message ? (
                                                    <p className="text-xs text-red-500 font-bold ml-1">{errors.message}</p>
                                                ) : (
                                                    <p className="text-[10px] text-[#3C4043] uppercase tracking-widest font-bold ml-1">Min 20 characters</p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full py-5 bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 group flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                                            >
                                                {status === 'loading' ? (
                                                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Send Message <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right: Contact Info Cards */}
                        <div className="lg:col-span-5 space-y-6">

                            {/* General */}
                            <div className="p-8 rounded-3xl bg-[#111118] border border-[#1E1E2E] group hover:border-[#4F6EF7]/30 transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#4F6EF7]/10 flex items-center justify-center text-[#4F6EF7]">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white">General Inquiry</h4>
                                        <p className="text-xs text-[#6B7280] font-bold uppercase tracking-widest">Responses within 24h</p>
                                    </div>
                                </div>
                                <a href="mailto:hello@sipheron.com" className="text-lg font-medium text-white hover:text-[#4F6EF7] transition-colors break-all">
                                    hello@sipheron.com
                                </a>
                            </div>

                            {/* Enterprise */}
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#111118] to-[#0A0A0F] border border-[#4F6EF7]/20 group hover:border-[#4F6EF7]/50 transition-all relative">
                                <div className="absolute top-4 right-8">
                                    <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7]">Urgent</Badge>
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#4F6EF7]/10 flex items-center justify-center text-[#4F6EF7]">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white">Enterprise Sales</h4>
                                        <p className="text-xs text-[#10B981] font-bold uppercase tracking-widest">Responses within 4h</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <a href="mailto:enterprise@sipheron.com" className="text-lg font-medium text-white hover:text-[#4F6EF7] transition-colors break-all">
                                        enterprise@sipheron.com
                                    </a>
                                    <a
                                        href="mailto:enterprise@sipheron.com?subject=Demo Request"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-[#4F6EF7] hover:underline"
                                    >
                                        Schedule a demo <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>

                            {/* Tech Support */}
                            <div className="p-8 rounded-3xl bg-[#111118] border border-[#1E1E2E] group hover:border-[#4F6EF7]/30 transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                        <Terminal size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white">Technical Support</h4>
                                        <p className="text-xs text-[#6B7280] font-bold uppercase tracking-widest">For developers</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <a href="mailto:support@sipheron.com" className="block text-sm text-[#F8F8FF] hover:text-[#4F6EF7]">support@sipheron.com</a>
                                    <div className="flex gap-4">
                                        <Link href="https://github.com/leaderofARS/solana-vdr/issues" className="text-xs font-bold text-[#6B7280] hover:text-white flex items-center gap-1.5 uppercase tracking-widest">
                                            <Github size={14} /> GitHub Issues
                                        </Link>
                                        <Link href="https://app.sipheron.com/docs" className="text-xs font-bold text-[#6B7280] hover:text-white flex items-center gap-1.5 uppercase tracking-widest">
                                            <FileText size={14} /> Documentation
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Community */}
                            <div className="p-8 rounded-3xl bg-[#111118] border border-[#1E1E2E] group hover:border-[#4F6EF7]/30 transition-all">
                                <h4 className="font-black text-white mb-4">Join our developer community</h4>
                                <div className="flex gap-6">
                                    <Link href="https://github.com/leaderofARS/solana-vdr" className="flex flex-col items-center gap-2 group/icon">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/icon:bg-white/10 transition-colors">
                                            <Github size={18} />
                                        </div>
                                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">GitHub</span>
                                    </Link>
                                    <Link href="https://www.npmjs.com/package/sipheron-vdr" className="flex flex-col items-center gap-2 group/icon">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/icon:bg-white/10 transition-colors">
                                            <Package size={18} />
                                        </div>
                                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">npm</span>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Section 3: FAQ Strip */}
                <section className="px-6">
                    <div className="max-w-7xl mx-auto border-t border-[#1E1E2E] py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                                <Clock size={16} className="text-[#4F6EF7]" /> How quickly do you respond?
                            </h5>
                            <p className="text-sm text-[#6B7280] leading-relaxed">
                                We aim for within 24 hours for general inquiries and within 4 hours for verified enterprise partners.
                            </p>
                        </div>
                        <div>
                            <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                                <Layout size={16} className="text-[#9B5CF6]" /> Do you offer demos?
                            </h5>
                            <p className="text-sm text-[#6B7280] leading-relaxed">
                                Absolutely. Email <strong>enterprise@sipheron.com</strong> and we'll schedule a technical deep-dive for your team.
                            </p>
                        </div>
                        <div>
                            <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                                <Zap size={16} className="text-[#10B981]" /> Is there a free tier?
                            </h5>
                            <p className="text-sm text-[#6B7280] leading-relaxed">
                                Yes. SipHeron is free forever for developers building on Solana devnet. No credit card required.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx global>{`
        html { scroll-behavior: smooth; }
      `}</style>
        </div>
    );
}
