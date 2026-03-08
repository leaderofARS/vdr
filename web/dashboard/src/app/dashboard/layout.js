"use client";

/**
 * @file layout.js
 * @module web/dashboard/src/app/dashboard/layout.js
 */

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, Key, LogOut, ShieldCheck, Settings, Menu,
    Search, Bell, User, Binary, AlignLeft, Building2,
    CheckCircle2, AlertTriangle, Info, X, Clock, ExternalLink, RefreshCw,
    XCircle, KeyRound, Trash2, Zap, BarChart3, CreditCard
} from 'lucide-react';
import { api, logout, isAuthenticated } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshFailed, setRefreshFailed] = useState(false);

    // TODO: Connect to real backend when /api/notifications is ready
    const pollUnreadCount = async () => {
        try {
            const { data } = await api.get('/api/notifications?unreadOnly=true&limit=1');
            setUnreadCount(data.unreadCount || 0);
            setRefreshFailed(false);
        } catch (e) {
            setRefreshFailed(true);
        }
    };

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/notifications?limit=20');
            setNotifications(data.data || []);
            setUnreadCount(data.unreadCount || 0);
            setRefreshFailed(false);
        } catch (e) {
            setRefreshFailed(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mounted) {
            pollUnreadCount();
            const interval = setInterval(pollUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [mounted]);

    useEffect(() => {
        if (showNotifications) {
            loadNotifications();
        }
    }, [showNotifications]);

    const markAllRead = async () => {
        // Optimistic update
        const previousNotifications = [...notifications];
        const previousUnread = unreadCount;
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);

        try {
            await api.put('/api/notifications/read', { all: true });
        } catch (e) {
            setNotifications(previousNotifications);
            setUnreadCount(previousUnread);
            setRefreshFailed(true);
        }
    };

    const markRead = async (notification) => {
        if (notification.isRead) {
            handleNotificationClick(notification);
            return;
        }

        // Optimistic update
        const previousNotifications = [...notifications];
        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await api.put('/api/notifications/read', { ids: [notification.id] });
            handleNotificationClick(notification);
        } catch (e) {
            setNotifications(previousNotifications);
            setUnreadCount(prev => prev + 1);
            setRefreshFailed(true);
        }
    };

    const deleteNotification = async (e, id) => {
        e.stopPropagation();
        const previousNotifications = [...notifications];
        setNotifications(notifications.filter(n => n.id !== id));

        try {
            await api.delete(`/api/notifications/${id}`);
        } catch (e) {
            setNotifications(previousNotifications);
            setRefreshFailed(true);
        }
    };

    const handleNotificationClick = (n) => {
        const metadata = n.metadata || {};
        switch (n.type) {
            case 'anchor_success':
                if (metadata.hash) router.push(`/dashboard/hashes/${metadata.hash}`);
                break;
            case 'anchor_failed':
                router.push('/dashboard');
                break;
            case 'key_created':
            case 'key_revoked':
                router.push('/dashboard/keys');
                break;
            case 'low_balance':
                router.push('/dashboard/org');
                break;
            default:
                break;
        }
        setShowNotifications(false);
    };

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
        { name: 'Organization', href: '/dashboard/org', icon: Building2 },
        { name: 'API Key Management', href: '/dashboard/keys', icon: Key },
        { name: 'Hash Decoder', href: '/dashboard/decoder', icon: Binary },
        { name: 'Webhooks', href: '/dashboard/webhooks', icon: Zap },
        { name: 'API Usage', href: '/dashboard/usage', icon: BarChart3 },
        { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
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

                    <div className="flex items-center gap-3">
                        <img
                            src="/sipheron_vdap_logo.png"
                            alt="SipHeron Logo"
                            className="w-6 h-6 object-contain"
                        />
                        <span className="text-white font-bold text-sm tracking-tight hidden sm:block">SIPHERON</span>
                        <span className="text-[#9AA0A6] text-sm hidden sm:block mx-1">/</span>
                        <span className="text-white font-medium text-xs hidden sm:block border border-[#3C4043] px-2 py-0.5 rounded bg-[#131418] uppercase tracking-widest">{breadcrumbName}</span>
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
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`hover:text-white relative p-1 rounded-full transition-colors ${showNotifications ? 'bg-[#2C3038] text-white' : ''}`}
                            >
                                <Bell className="w-4 h-4" />
                                {unreadCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        key={unreadCount}
                                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#F28B82] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#1A1D24]"
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </motion.span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-[380px] bg-[#1A1D24] border border-[#2C3038] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                                        >
                                            <div className="px-5 py-3 border-b border-[#2C3038] bg-[#1D2128] flex items-center justify-between">
                                                <h3 className="text-white text-sm font-bold flex items-center gap-2 tracking-wide uppercase">
                                                    Notifications
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    {refreshFailed && (
                                                        <span className="text-[9px] text-[#F28B82] font-medium bg-[#F28B82]/10 px-1.5 py-0.5 rounded border border-[#F28B82]/20 animate-pulse">
                                                            Refresh failed
                                                        </span>
                                                    )}
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={markAllRead}
                                                            className="text-[10px] text-[#4285F4] hover:text-[#8AB4F8] font-bold uppercase tracking-widest"
                                                        >
                                                            Mark all read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto no-scrollbar min-h-[100px] relative">
                                                {loading && notifications.length === 0 ? (
                                                    <div className="py-12 flex flex-col items-center justify-center">
                                                        <RefreshCw className="w-6 h-6 text-[#4285F4] animate-spin mb-2" />
                                                        <p className="text-[11px] text-[#9AA0A6] uppercase tracking-widest">Loading...</p>
                                                    </div>
                                                ) : notifications.length === 0 ? (
                                                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                                                        <Bell className="w-10 h-10 mb-3" />
                                                        <p className="text-sm">No notifications yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-[#2C3038]">
                                                        {notifications.map((n) => (
                                                            <div
                                                                key={n.id}
                                                                onClick={() => markRead(n)}
                                                                className={`p-4 hover:bg-[#20232A] cursor-pointer transition-colors group flex gap-4 relative ${!n.isRead ? 'bg-[#1D2128]' : ''}`}
                                                            >
                                                                <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${n.type === 'anchor_success' ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]' :
                                                                    n.type === 'anchor_failed' ? 'bg-[#F28B82]/10 border-[#F28B82]/20 text-[#F28B82]' :
                                                                        n.type === 'low_balance' ? 'bg-[#FBBC04]/10 border-[#FBBC04]/20 text-[#FBBC04]' :
                                                                            n.type === 'key_revoked' ? 'bg-[#E67C73]/10 border-[#E67C73]/20 text-[#E67C73]' :
                                                                                'bg-[#4285F4]/10 border-[#4285F4]/20 text-[#4285F4]'
                                                                    }`}>
                                                                    {n.type === 'anchor_success' ? <CheckCircle2 className="w-5 h-5" /> :
                                                                        n.type === 'anchor_failed' ? <XCircle className="w-5 h-5" /> :
                                                                            n.type === 'low_balance' ? <AlertTriangle className="w-5 h-5" /> :
                                                                                n.type === 'key_revoked' ? <KeyRound className="w-5 h-5" /> :
                                                                                    <Key className="w-5 h-5" />}
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`text-[13px] font-bold ${!n.isRead ? 'text-white' : 'text-[#E8EAED]'}`}>{n.title}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[10px] text-[#5F6368] font-medium">{formatRelativeTime(n.createdAt)}</span>
                                                                            <button
                                                                                onClick={(e) => deleteNotification(e, n.id)}
                                                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#2C3038] rounded text-[#F28B82] transition-all"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-[12px] text-[#9AA0A6] leading-relaxed line-clamp-2">{n.message}</p>
                                                                    {n.metadata?.txSignature && (
                                                                        <a
                                                                            href={`https://explorer.solana.com/tx/${n.metadata.txSignature}?cluster=devnet`}
                                                                            target="_blank"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="inline-flex items-center gap-1 text-[10px] text-[#4285F4] hover:underline mt-1"
                                                                        >
                                                                            View TX <ExternalLink className="w-2.5 h-2.5" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <button className="w-full py-3 bg-[#1D2128] hover:bg-[#20232A] text-[11px] text-[#9AA0A6] hover:text-white font-bold uppercase tracking-widest border-t border-[#2C3038] transition-colors">
                                                View all activity
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
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
function formatRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}
