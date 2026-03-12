"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import {
    LayoutDashboard, Key, LogOut, ShieldCheck, Settings, Menu,
    Search, Bell, User, Binary, AlignLeft, Building2,
    CheckCircle2, AlertTriangle, Info, X, Clock, ExternalLink, RefreshCw,
    XCircle, KeyRound, Trash2, Zap, BarChart3, CreditCard, ChevronLeft, ChevronRight,
    Sun, Moon, Wallet, Users
} from 'lucide-react';
import { api, logout, isAuthenticated } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle, PurpleBadge, GlowButton } from '@/components/ui/PurpleUI';

// Sidebar Particle Background (CSS only)
const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
            <div
                key={i}
                className="absolute w-1 h-1 bg-purple-glow rounded-full animate-float-up"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${5 + Math.random() * 5}s`,
                }}
            />
        ))}
        <style jsx>{`
            @keyframes float-up {
                0% { transform: translateY(0); opacity: 0; }
                20% { opacity: 1; }
                100% { transform: translateY(-100px); opacity: 0; }
            }
            .animate-float-up {
                animation: float-up infinite linear;
            }
        `}</style>
    </div>
);

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
    const [contextData, setContextData] = useState(null);

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
        const prevN = [...notifications];
        const prevU = unreadCount;
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        try {
            await api.put('/api/notifications/read', { all: true });
        } catch (e) {
            setNotifications(prevN);
            setUnreadCount(prevU);
            setRefreshFailed(true);
        }
    };

    const markRead = async (notification) => {
        if (notification.isRead) {
            handleNotificationClick(notification);
            return;
        }
        const prevN = [...notifications];
        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
        setUnreadCount(p => Math.max(0, p - 1));
        try {
            await api.put('/api/notifications/read', { ids: [notification.id] });
            handleNotificationClick(notification);
        } catch (e) {
            setNotifications(prevN);
            setUnreadCount(p => p + 1);
            setRefreshFailed(true);
        }
    };

    const deleteNotification = async (e, id) => {
        e.stopPropagation();
        const prevN = [...notifications];
        setNotifications(notifications.filter(n => n.id !== id));
        try {
            await api.delete(`/api/notifications/${id}`);
        } catch (e) {
            setNotifications(prevN);
            setRefreshFailed(true);
        }
    };

    const handleNotificationClick = (n) => {
        const metadata = n.metadata || {};
        switch (n.type) {
            case 'anchor_success':
                if (metadata.hash) router.push(`/dashboard/hashes/${metadata.hash}`);
                break;
            case 'anchor_failed': router.push('/dashboard'); break;
            case 'key_created':
            case 'key_revoked': router.push('/dashboard/keys'); break;
            case 'low_balance': router.push('/dashboard/org'); break;
            default: break;
        }
        setShowNotifications(false);
    };

    useEffect(() => {
        let sc = false;
        async function v() {
            const ok = await isAuthenticated();
            if (!sc) {
                if (!ok) {
                    router.push('/auth/login');
                } else {
                    document.title = "SipHeron Console";
                    setMounted(true);
                    try {
                        const { data } = await api.get('/api/org/stats');
                        if (!sc) setContextData(data);
                    } catch (e) { console.error(e); }
                }
            }
        }
        v();
        return () => { sc = true; };
    }, [router]);

    if (!mounted) return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 ambient-radial opacity-50" />
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10"
            >
                <RefreshCw className="w-12 h-12 text-purple-vivid animate-spin mb-4" />
                <p className="text-purple-glow font-mono tracking-widest uppercase text-xs">Initializing Console...</p>
            </motion.div>
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
        { name: 'Team', href: '/dashboard/team', icon: Users },
    ];

    const breadcrumbName = navItems.find(item => item.href === pathname)?.name || 'Dashboard';

    return (
        <div className="h-screen flex flex-col bg-bg-primary text-text-primary font-sans overflow-hidden">
            <Script
                defer
                data-domain="app.sipheron.com"
                src="https://plausible.io/js/script.js"
                strategy="afterInteractive"
            />
            <div className="absolute inset-0 ambient-grid pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-64 ambient-radial pointer-events-none" />

            {/* Glass Header */}
            <header className="h-16 bg-bg-primary/80 backdrop-blur-md border-b border-bg-border flex items-center justify-between px-6 z-30 relative shrink-0">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-text-secondary hover:text-purple-glow transition-all"
                    >
                        <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }}>
                            <AlignLeft className="w-5 h-5" />
                        </motion.div>
                    </button>

                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center justify-center p-0.5"
                        >
                            <img src="/sipheron_vdap_logo.png" alt="SipHeron Logo" className="w-8 h-8 object-contain filter drop-shadow-[0_0_10px_rgba(155,110,255,0.5)]" />
                        </motion.div>
                        <span className="font-bold text-lg tracking-tight hidden sm:block bg-gradient-to-r from-purple-glow to-blue-accent bg-clip-text text-transparent">SIPHERON</span>
                        <span className="text-bg-border text-sm hidden sm:block mx-1">|</span>
                        <span className="text-text-secondary font-medium text-xs hidden sm:block uppercase tracking-widest">{breadcrumbName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block w-72 lg:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-purple-vivid transition-colors" />
                        <input
                            type="text"
                            placeholder="Search console..."
                            className="w-full bg-bg-surface border border-bg-border rounded-xl px-10 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-vivid/50 focus:border-purple-vivid transition-all duration-300"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-full transition-all ${showNotifications ? 'bg-purple-dim text-purple-glow' : 'text-text-secondary hover:text-purple-glow hover:bg-bg-elevated'}`}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-purple-vivid rounded-full border-2 border-bg-primary animate-pulse" />
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-[400px] bg-bg-surface/95 backdrop-blur-xl border border-bg-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="px-5 py-4 border-b border-bg-border bg-bg-elevated/50 flex items-center justify-between">
                                                <h3 className="text-text-primary text-sm font-bold uppercase tracking-wider">Activity</h3>
                                                {unreadCount > 0 && (
                                                    <button onClick={markAllRead} className="text-[10px] text-purple-glow hover:text-purple-bright font-bold uppercase tracking-widest transition-colors">Mark all read</button>
                                                )}
                                            </div>

                                            <div className="max-h-[450px] overflow-y-auto custom-scrollbar min-h-[100px]">
                                                {loading && notifications.length === 0 ? (
                                                    <div className="py-12 flex flex-col items-center justify-center gap-2">
                                                        <RefreshCw className="w-6 h-6 text-purple-vivid animate-spin" />
                                                        <p className="text-[10px] text-text-muted uppercase font-mono">Fetching...</p>
                                                    </div>
                                                ) : notifications.length === 0 ? (
                                                    <div className="py-20 flex flex-col items-center justify-center opacity-20 text-center">
                                                        <Bell className="w-12 h-12 mb-4" />
                                                        <p className="text-sm font-medium">All caught up</p>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-bg-border/50">
                                                        {notifications.map((n) => (
                                                            <div
                                                                key={n.id}
                                                                onClick={() => markRead(n)}
                                                                className={`p-4 hover:bg-purple-dim/10 cursor-pointer transition-all group flex gap-4 ${!n.isRead ? 'border-l-4 border-purple-vivid' : 'border-l-4 border-transparent'}`}
                                                            >
                                                                <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${n.type === 'anchor_success' ? 'bg-success/10 border-success/20 text-success' :
                                                                    n.type === 'anchor_failed' ? 'bg-danger/10 border-danger/20 text-danger' :
                                                                        n.type === 'low_balance' ? 'bg-warning/10 border-warning/20 text-warning' :
                                                                            'bg-purple-vivid/10 border-purple-vivid/20 text-purple-glow'
                                                                    }`}>
                                                                    {n.type === 'anchor_success' ? <CheckCircle2 className="w-5 h-5" /> :
                                                                        n.type === 'anchor_failed' ? <XCircle className="w-5 h-5" /> :
                                                                            n.type === 'low_balance' ? <AlertTriangle className="w-5 h-5" /> :
                                                                                <Zap className="w-5 h-5" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className={`text-sm font-bold truncate ${!n.isRead ? 'text-text-primary' : 'text-text-secondary'}`}>{n.title}</span>
                                                                        <span className="text-[10px] text-text-muted font-mono">{formatRelativeTime(n.createdAt)}</span>
                                                                    </div>
                                                                    <p className="text-xs text-text-secondary leading-normal line-clamp-2">{n.message}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <button className="w-full py-4 bg-bg-elevated/50 hover:bg-bg-elevated text-[11px] text-purple-glow font-bold uppercase tracking-widest border-t border-bg-border transition-colors">
                                                View Console Logs
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative group">
                            <button
                                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-mid to-blue-accent p-[2px] shadow-lg transition-transform hover:scale-105 active:scale-95"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <div className="w-full h-full rounded-[14px] bg-bg-primary flex items-center justify-center overflow-hidden">
                                    <User className="w-5 h-5 text-purple-glow" />
                                </div>
                            </button>
                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                        className="absolute right-0 mt-3 w-56 bg-bg-surface border border-bg-border rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-bg-border mb-1">
                                            <p className="text-xs text-text-muted mb-1 uppercase tracking-widest font-bold">Authenticated as</p>
                                            <p className="text-sm font-bold text-text-primary truncate">{contextData?.user?.email || 'Administrator'}</p>
                                        </div>
                                        <button
                                            onClick={() => { setShowProfileMenu(false); router.push('/dashboard/settings'); }}
                                            className="w-full px-4 py-3 text-sm text-text-secondary hover:bg-purple-dim/20 hover:text-purple-glow flex items-center gap-3 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" /> Account Settings
                                        </button>
                                        <button
                                            onClick={() => { logout(); router.push('/auth/login'); }}
                                            className="w-full px-4 py-3 text-sm text-danger hover:bg-danger/10 flex items-center gap-3 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out from Console
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Modern Sidebar */}
                <aside
                    className={`bg-bg-primary/50 backdrop-blur-sm border-r border-bg-border transition-all duration-300 flex flex-col relative z-20 ${isSidebarOpen ? 'w-72' : 'w-20'} hidden md:flex overflow-hidden`}
                >
                    <Particles />

                    <div className="flex-1 py-6 overflow-y-auto no-scrollbar relative z-10 px-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className={`flex items-center gap-4 px-4 py-3 text-sm cursor-pointer rounded-xl transition-all relative group ${isActive
                                            ? 'bg-purple-dim/40 text-purple-glow font-bold border-l-4 border-purple-vivid'
                                            : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                                            }`}>
                                        <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-purple-vivid' : 'text-text-muted'}`} />
                                        <AnimatePresence>
                                            {isSidebarOpen && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="truncate"
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute inset-0 bg-purple-vivid/5 rounded-xl pointer-events-none"
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Sidebar Footer - Wallet Info */}
                    <div className="p-4 relative z-10 border-t border-bg-border/50 bg-bg-primary/80 backdrop-blur-md">
                        <div className={`flex flex-col gap-2 rounded-2xl bg-bg-surface p-3 border border-bg-border transition-all ${!isSidebarOpen && 'items-center px-1'}`}>
                            {isSidebarOpen ? (
                                <>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">
                                            {contextData?.user?.role || 'Authority Role'}
                                        </span>
                                        <div className="flex items-center gap-1.5 bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                                            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                                            <span className="text-[9px] text-success font-bold uppercase">
                                                {contextData?.wallet?.network || 'DEVNET'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 p-2.5 bg-bg-elevated rounded-lg border border-bg-border/50 overflow-hidden">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3.5 h-3.5 text-blue-accent shrink-0" />
                                            <span className="text-[11px] font-bold text-text-primary truncate">
                                                {contextData?.org?.name || 'SipHeron Console'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-3.5 h-3.5 text-purple-vivid shrink-0" />
                                            <span className="text-[10px] text-text-secondary truncate">
                                                {contextData?.user?.email || 'Loading...'}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-1 text-purple-vivid group relative">
                                    <Wallet className="w-6 h-6" />
                                    <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-bg-surface border border-bg-border text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono whitespace-nowrap">
                                        {contextData?.user?.role || 'Authority'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-transparent relative z-10 custom-scrollbar">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="p-8 max-w-[1600px] mx-auto min-h-full"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2d2b55; }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}

function formatRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}
