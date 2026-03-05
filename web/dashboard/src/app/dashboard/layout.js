"use client";

/**
 * @file layout.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/dashboard/layout.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Key, LogOut, ShieldCheck, Settings, ChevronRight, Menu, X, Landmark } from 'lucide-react';
import { logout, isAuthenticated } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function verifySession() {
            const valid = await isAuthenticated();
            if (!cancelled) {
                if (!valid) {
                    router.push('/auth/login');
                }
                document.title = "VDR Dashboard";
                setMounted(true);
            }
        }
        verifySession();
        return () => { cancelled = true; };
    }, [router]);

    if (!mounted) return null;

    const navItems = [
        { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
        { name: 'API Key Management', href: '/dashboard/keys', icon: Key },
        { name: 'Global Explorer', href: '/explorer', icon: ShieldCheck },
        { name: 'Node Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
            {/* Background Mesh */}
            <div className="fixed inset-0 bg-mesh opacity-40 pointer-events-none" />

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="relative z-30 border-r border-white/5 glass flex flex-col transition-all duration-300"
            >
                <div className="p-6 h-20 flex items-center justify-between border-b border-white/5">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold tracking-tight text-lg">SipHeron VDR</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all cursor-pointer group ${isActive
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-lg shadow-blue-600/5'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400 transition-colors'}`} />
                                    {isSidebarOpen && (
                                        <div className="flex flex-1 justify-between items-center whitespace-nowrap overflow-hidden">
                                            <span className="font-bold text-sm">{item.name}</span>
                                            {isActive && <ChevronRight className="w-4 h-4" />}
                                        </div>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-[10px] font-bold">
                            AD
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold truncate">Organization Admin</p>
                                <p className="text-[10px] text-gray-500 truncate">Solana Devnet Node</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            logout();
                            router.push('/auth/login');
                        }}
                        className="flex w-full items-center gap-4 px-4 py-3.5 text-sm font-bold text-red-500/80 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-[-2px] transition-transform" />
                        {isSidebarOpen && <span className="whitespace-nowrap">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
                <header className="h-20 w-full px-8 flex items-center justify-between border-b border-white/5 glass">
                    <div className="flex items-center gap-4">
                        <Landmark className="w-5 h-5 text-gray-500" />
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-sm font-medium text-gray-400">Institutional Dashboard</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Mainnet Ready</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">
                    {children}
                </div>
            </main>
        </div>
    );
}
