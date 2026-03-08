"use client";

/**
 * @file layout.js
 * @module web/dashboard/src/app/dashboard/layout.js
 */

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Key, LogOut, ShieldCheck, Settings, Menu, Search, Bell, User, Binary, AlignLeft } from 'lucide-react';
import { logout, isAuthenticated } from '@/utils/api';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function verifySession() {
            const valid = await isAuthenticated();
            if (!cancelled) {
                if (!valid) {
                    router.push('/auth/login');
                } else {
                    document.title = "VDR Console";
                    setMounted(true);
                }
            }
        }
        verifySession();
        return () => { cancelled = true; };
    }, [router]);

    if (!mounted) return (
        <div className="min-h-screen bg-[#131418] flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-t-2 border-b-2 border-[#4285F4] rounded-full animate-spin" />
        </div>
    );

    const navItems = [
        { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
        { name: 'API Key Management', href: '/dashboard/keys', icon: Key },
        { name: 'Hash Decoder', href: '/dashboard/decoder', icon: Binary },
        { name: 'Global Explorer', href: '/explorer', icon: ShieldCheck },
        { name: 'Node Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const breadcrumbName = navItems.find(item => item.href === pathname)?.name || 'Dashboard';

    return (
        <div className="h-screen flex flex-col bg-[#1A1D24] text-[#E8EAED] font-sans overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="h-12 bg-[#1A1D24] border-b border-[#2C3038] flex items-center justify-between px-4 z-20 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-[#9AA0A6] hover:text-white"
                    >
                        <AlignLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#4285F4]" />
                        <span className="text-white font-medium text-sm tracking-wide hidden sm:block">SipHeron Cloud</span>
                        <span className="text-[#9AA0A6] text-sm hidden sm:block mx-1">\</span>
                        <span className="text-white font-medium text-sm hidden sm:block">{breadcrumbName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block w-72 lg:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A6]" />
                        <input
                            type="text"
                            placeholder="Search resources, docs..."
                            className="w-full bg-[#131418] border border-[#3C4043] rounded px-9 py-1 text-sm text-white focus:outline-none focus:border-[#4285F4] transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-4 text-[#9AA0A6]">
                        <button className="hover:text-white relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#4285F4] rounded-full"></span>
                        </button>
                        <div className="relative">
                            <button className="hover:text-white flex items-center" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                <div className="w-7 h-7 rounded-full bg-[#4285F4] text-white flex items-center justify-center text-xs font-bold">
                                    AD
                                </div>
                            </button>
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#20232A] border border-[#3C4043] rounded shadow-lg z-50 py-1">
                                    <button
                                        onClick={() => {
                                            logout();
                                            router.push('/auth/login');
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-[#E8EAED] hover:bg-[#2C3038] flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <aside
                    className={`bg-[#1A1D24] border-r border-[#2C3038] transition-all duration-200 flex flex-col flex-shrink-0 z-10 ${isSidebarOpen ? 'w-64' : 'w-14'
                        } hidden md:flex`}
                >
                    <div className="flex-1 py-3 overflow-y-auto no-scrollbar">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer whitespace-nowrap ${isActive
                                            ? 'bg-[#3C4043] bg-opacity-30 text-[#4285F4] font-medium'
                                            : 'text-[#9AA0A6] hover:bg-[#20232A] hover:text-[#E8EAED]'
                                        }`}>
                                        <item.icon className="w-4 h-4 flex-shrink-0" />
                                        {isSidebarOpen && <span>{item.name}</span>}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Bottom Project Info */}
                    <div className="border-t border-[#2C3038] p-3">
                        <div className="flex flex-col overflow-hidden whitespace-nowrap">
                            <span className="text-xs font-medium text-[#E8EAED] truncate">Organization Admin</span>
                            <span className="text-[10px] text-[#9AA0A6] truncate">Net: Devnet Cluster</span>
                        </div>
                    </div>
                </aside>

                {/* Content View */}
                <main className="flex-1 overflow-y-auto bg-[#131418] p-6 text-[#E8EAED]">
                    {children}
                </main>
            </div>
        </div>
    );
}