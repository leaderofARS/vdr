"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navigation } from "./navigation";
import { ChevronRight, Search, BookOpen, ExternalLink, Github } from "lucide-react";

export default function DocsLayout({ children }) {
    const pathname = usePathname();

    // Helper to generate IDs from TOC titles
    const slugify = (text) => text.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');

    // Dynamically find the current page's TOC
    const allLinks = navigation.flatMap(section => section.links);
    const activeLink = allLinks.find(link => link.href === pathname) || allLinks[0];
    const currentToc = activeLink?.toc || ["Overview", "Architecture", "Security", "Next Steps"];

    return (
        <div className="min-h-screen bg-[#000000] text-white flex flex-col relative">
            {/* Background Decorations */}
            <div className="fixed inset-0 bg-mesh opacity-10 pointer-events-none" />
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Hero Header Space (to account for global Navbar) */}
            <div className="h-20 shrink-0" />

            <div className="flex-grow flex max-w-[1600px] mx-auto w-full px-6 lg:px-12 gap-12">
                {/* Sidebar */}
                <aside className="hidden lg:block w-72 shrink-0 border-r border-white/5 py-12 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
                    <div className="mb-10 pr-6">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search docs..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-light"
                            />
                        </div>
                    </div>

                    <nav className="space-y-10 pr-6">
                        {navigation.map((section) => (
                            <div key={section.title}>
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 px-2">
                                    {section.title}
                                </h5>
                                <ul className="space-y-1">
                                    {section.links.map((link) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive
                                                        ? "bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20"
                                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                                        }`}
                                                >
                                                    {link.title}
                                                    {isActive && <motion.div layoutId="active-indicator" className="w-1 h-1 rounded-full bg-blue-500" />}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-12 pt-8 border-t border-white/5 pr-6 space-y-4">
                        <a href="https://github.com/leaderofARS/vdr" target="_blank" className="flex items-center gap-3 text-xs text-gray-500 hover:text-white transition-colors group">
                            <Github className="w-4 h-4" />
                            Github Repository
                            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="flex items-center gap-3 text-xs text-emerald-500/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            v0.9.0-beta Stable
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-grow py-12 min-w-0 scroll-mt-32">
                    <div className="max-w-4xl mx-auto">
                        {children}

                        {/* Footer Navigation */}
                        <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-gray-400 text-sm font-light">
                            <div className="flex flex-col gap-1 items-start">
                                <span className="text-[10px] uppercase tracking-widest text-gray-600 font-black">Last Updated</span>
                                <span>March 05, 2026</span>
                            </div>
                            <div className="flex gap-8">
                                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar (Table of Contents / Secondary Nav) */}
                <aside className="hidden xl:block w-64 shrink-0 py-12 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
                    <div className="pl-6 border-l border-white/5 h-full">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
                            On this page
                        </h5>
                        <ul className="space-y-4 text-xs font-light text-gray-400">
                            {currentToc.map((item, i) => (
                                <li key={i}>
                                    <a
                                        href={`#${slugify(item)}`}
                                        className={`${i === 0 ? "text-blue-400 font-bold border-l-2 border-blue-500" : "hover:text-white"} transition-colors cursor-pointer pl-4 -ml-px block`}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-20 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <BookOpen className="w-5 h-5 text-blue-400 mb-4" />
                            <h6 className="text-sm font-bold text-white mb-2 leading-tight">Need dedicated help?</h6>
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Our institutional onboarding team can help you map your datasets.</p>
                            <Link href="/contact" className="text-[11px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 group">
                                Contact Sales
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
