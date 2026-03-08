"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    LayoutDashboard,
    Terminal,
    Cpu,
    FileCode,
    Binary,
    Scale,
    GraduationCap,
    Building2,
    ShieldCheck,
    BookOpen,
    Zap,
    FileText,
    Github,
    Package,
    ExternalLink,
    ChevronDown,
    Menu,
    X,
    ArrowRight
} from 'lucide-react';

const PRODUCT_LINKS = [
    { title: "Dashboard", subtitle: "Manage your registry on-chain", icon: LayoutDashboard, href: "https://app.sipheron.com" },
    { title: "CLI Tool", subtitle: "Automate from your terminal", icon: Terminal, href: "https://app.sipheron.com/docs/cli" },
    { title: "REST API", subtitle: "Full documentation and SDKs", icon: Cpu, href: "https://app.sipheron.com/docs/api" },
    { title: "Smart Contract", subtitle: "Direct on-chain interaction", icon: FileCode, href: "https://app.sipheron.com/docs/contract" },
    { title: "Hash Decoder", subtitle: "Resolve any proof manually", icon: Binary, href: "https://app.sipheron.com/dashboard/decoder" },
];

const USE_CASES_LINKS = [
    { title: "Legal & Compliance", subtitle: "Auditable document trails", icon: Scale, href: "https://app.sipheron.com/docs/use-cases/legal" },
    { title: "Academic Credentials", subtitle: "Instant degree verification", icon: GraduationCap, href: "https://app.sipheron.com/docs/use-cases/academic" },
    { title: "Enterprise Control", subtitle: "Document lifecycle management", icon: Building2, href: "https://app.sipheron.com/docs/use-cases/enterprise" },
    { title: "Government & Healthcare", subtitle: "High-security registries", icon: ShieldCheck, href: "#", comingSoon: true },
];

const DOCS_LINKS = [
    { title: "Getting Started", subtitle: "Get up and running in minutes", icon: BookOpen, href: "https://app.sipheron.com/docs" },
    { title: "Quickstart Guide", subtitle: "Example implementations", icon: Zap, href: "https://app.sipheron.com/docs/quickstart" },
    { title: "API Reference", subtitle: "Detailed endpoint documentation", icon: FileText, href: "https://app.sipheron.com/docs/api" },
    { title: "CLI Reference", subtitle: "Command-line interface manual", icon: Terminal, href: "https://app.sipheron.com/docs/cli" },
    { title: "Core Concepts", subtitle: "Hashing, PDAs, and Solana", icon: FileCode, href: "https://app.sipheron.com/docs/concepts" },
];

const DEVELOPER_LINKS = [
    { title: "npm Package", subtitle: "Install direct into your app", icon: Package, href: "https://www.npmjs.com/package/sipheron-vdr" },
    { title: "GitHub", subtitle: "Protocol and client libraries", icon: Github, href: "https://github.com/leaderofARS/vdr" },
    { title: "Solana Explorer", subtitle: "Verify the contract live", icon: ExternalLink, href: "https://explorer.solana.com/address/6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo?cluster=devnet" },
    { title: "Changelog", subtitle: "Track version updates", icon: FileText, href: "/changelog" },
];

const NavItem = ({ title, links, isDirect = false, href = "#" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    if (isDirect) {
        return (
            <Link
                href={href}
                className="text-sm font-medium text-[#6B7280] hover:text-[#F8F8FF] transition-colors py-2"
            >
                {title}
            </Link>
        );
    }

    return (
        <div
            className="relative group h-full flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] group-hover:text-[#F8F8FF] transition-colors outline-none">
                {title}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-80 z-50 pointer-events-auto"
                    >
                        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl overflow-hidden shadow-2xl p-2">
                            <div className="flex flex-col gap-1">
                                {links.map((link, idx) => {
                                    const Content = (
                                        <div className={`p-3 rounded-lg flex items-start gap-4 transition-all ${link.comingSoon ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-white/[0.04]'}`}>
                                            <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[#4F6EF7] group-hover:text-[#F8F8FF] shrink-0">
                                                <link.icon size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-[#F8F8FF]">{link.title}</span>
                                                    {link.comingSoon && (
                                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded text-[#6B7280]">Soon</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[#6B7280] mt-1 line-clamp-1">{link.subtitle}</p>
                                            </div>
                                        </div>
                                    );

                                    return link.comingSoon ? (
                                        <div key={idx} className="cursor-default">{Content}</div>
                                    ) : (
                                        <Link key={idx} href={link.href} className="group/item">
                                            {Content}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MobileAccordion = ({ title, links, isDirect = false, href = "#", closeMenu }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (isDirect) {
        return (
            <Link
                href={href}
                className="text-lg font-bold text-[#F8F8FF] py-3 border-b border-[#1E1E2E] block"
                onClick={closeMenu}
            >
                {title}
            </Link>
        );
    }

    return (
        <div className="border-b border-[#1E1E2E]">
            <button
                className="w-full flex items-center justify-between text-lg font-bold text-[#F8F8FF] py-4 outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <ChevronDown size={20} className={`text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 pl-4 flex flex-col gap-4">
                            {links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.comingSoon ? '#' : link.href}
                                    className={`flex flex-col ${link.comingSoon ? 'pointer-events-none opacity-50' : ''}`}
                                    onClick={() => !link.comingSoon && closeMenu()}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#F8F8FF]">{link.title}</span>
                                        {link.comingSoon && (
                                            <span className="text-[8px] font-bold uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded text-[#6B7280]">Soon</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[#6B7280]">{link.subtitle}</p>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const LandingNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [mobileMenuOpen]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled
                ? 'bg-[#0A0A0F]/80 backdrop-blur-xl border-[#1E1E2E] py-4'
                : 'bg-transparent border-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                        <img
                            src="/sipheron_vdap_logo.png"
                            alt="SipHeron VDR Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-[#F8F8FF] leading-none tracking-tighter">SIPHERON</span>
                    </div>
                </Link>

                {/* Center: Nav links */}
                <div className="hidden lg:flex items-center gap-8 h-full">
                    <NavItem title="Product" links={PRODUCT_LINKS} />
                    <NavItem title="Use Cases" links={USE_CASES_LINKS} />
                    <NavItem title="Docs" links={DOCS_LINKS} />
                    <NavItem title="Developers" links={DEVELOPER_LINKS} />
                    <NavItem title="Pricing" isDirect href="/pricing" />
                </div>

                {/* Right: CTAs */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link href="https://app.sipheron.com/auth/login">
                        <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#F8F8FF] hover:bg-white/5 transition-colors">
                            Sign In
                        </button>
                    </Link>
                    <Link href="https://app.sipheron.com/auth/register">
                        <button className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-br from-[#4F6EF7] to-[#9B5CF6] hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-1.5">
                            Get Started Free <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-[#F8F8FF] p-2 hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0A0A0F] border-l border-[#1E1E2E] shadow-2xl z-[120] lg:hidden flex flex-col"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-[#1E1E2E]">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#4F6EF7] to-[#9B5CF6] rounded-lg" />
                                    <span className="font-bold text-lg text-[#F8F8FF]">SipHeron</span>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-[#6B7280] hover:text-[#F8F8FF] transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                <MobileAccordion title="Product" links={PRODUCT_LINKS} closeMenu={() => setMobileMenuOpen(false)} />
                                <MobileAccordion title="Use Cases" links={USE_CASES_LINKS} closeMenu={() => setMobileMenuOpen(false)} />
                                <MobileAccordion title="Docs" links={DOCS_LINKS} closeMenu={() => setMobileMenuOpen(false)} />
                                <MobileAccordion title="Developers" links={DEVELOPER_LINKS} closeMenu={() => setMobileMenuOpen(false)} />
                                <MobileAccordion title="Pricing" isDirect href="/pricing" closeMenu={() => setMobileMenuOpen(false)} />
                            </div>

                            <div className="p-6 border-t border-[#1E1E2E] flex flex-col gap-4">
                                <Link href="https://app.sipheron.com/auth/login" className="w-full">
                                    <button className="w-full py-3 rounded-xl border border-[#1E1E2E] text-[#F8F8FF] font-bold hover:bg-white/5">
                                        Sign In
                                    </button>
                                </Link>
                                <Link href="https://app.sipheron.com/auth/register" className="w-full">
                                    <button className="w-full py-3 rounded-xl bg-gradient-to-br from-[#4F6EF7] to-[#9B5CF6] text-white font-bold shadow-lg flex items-center justify-center gap-2">
                                        Get Started Free <ArrowRight size={18} />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default LandingNavbar;
