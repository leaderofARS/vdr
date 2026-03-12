"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/Pagination';
import {
    Network, Key, FolderDot, HardDrive, CheckCircle2, XCircle,
    Terminal, ExternalLink, ShieldCheck, ChevronRight, Building,
    Search, SlidersHorizontal, Calendar, Copy, ChevronLeft,
    Clock, AlertTriangle, Info, ArrowUpRight, ChevronRight as ChevronRightIcon,
    Ban, ShieldAlert, X, TerminalSquare, Rocket, Check, RefreshCw, BarChart2,
    TrendingUp, TrendingDown, Wallet, Activity, Globe, Zap, Download, QrCode
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePendingHashes } from '@/hooks/usePendingHashes';
import PendingBadge from '@/components/ui/PendingBadge';
import {
    PurpleCard, GlowButton, PurpleBadge, MonoHash, PurpleSkeleton,
    CountUp, PurpleTable, PurpleTableRow, PurpleInput, PurpleModal
} from '@/components/ui/PurpleUI';
import BulkAnchorModal from '@/components/ui/BulkAnchorModal';

const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const ComposedChart = dynamic(() => import('recharts').then(m => m.ComposedChart), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });

export default function AnalyticsDashboard() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [hashes, setHashes] = useState([]);
    const [usageData, setUsageData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hashesLoading, setHashesLoading] = useState(true);
    const [usageLoading, setUsageLoading] = useState(true);
    const [lastSync, setLastSync] = useState(new Date());
    const [error, setError] = useState(null);
    const [showWizard, setShowWizard] = useState(false);
    const [checklistDismissed, setChecklistDismissed] = useState(false);
    const [revokeModalRecord, setRevokeModalRecord] = useState(null);
    const [toast, setToast] = useState(null);
    const [qrHash, setQrHash] = useState(null);
    const [qrCopied, setQrCopied] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);

    const verifyUrl = (hash) =>
        `https://app.sipheron.com/verify/${hash}`;

    const qrUrl = (hash) =>
        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verifyUrl(hash))}&bgcolor=000000&color=a855f7&qzone=2`;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const [confirmedToast, setConfirmedToast] = useState(null);

    const { pendingIds, isPolling, startPolling } = usePendingHashes({
        onConfirmed: (id) => {
            setConfirmedToast(`Hash confirmed on Solana ✓`);
            setTimeout(() => setConfirmedToast(null), 4000);
        },
        onRefresh: () => {
            fetchHashes();
            fetchData();
            fetchUsage();
        }
    });

    // Start polling whenever hashes load and any are pending
    useEffect(() => {
        const hasPending = hashes.some(h => h.status === 'PENDING');
        if (hasPending) startPolling();
    }, [hashes, startPolling]);

    const searchParams = useSearchParams();
    const pageFromUrl = parseInt(searchParams.get('page')) || 1;
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const itemsPerPage = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/api/org/stats');
            setStats(data);
            setLastSync(new Date());
            if (data.noOrganization) {
                setShowWizard(true);
            }
        } catch (e) {
            console.error(e);
            setError("Failed to load stats.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchHashes = useCallback(async () => {
        setHashesLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm,
                status: statusFilter === 'all' ? undefined : statusFilter
            };
            const { data } = await api.get('/api/hashes', { params });
            setHashes(data.data);
            setPagination(data.pagination);
        } catch (e) {
            console.error(e);
        } finally {
            setHashesLoading(false);
        }
    }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

    const fetchUsage = useCallback(async () => {
        setUsageLoading(true);
        try {
            const { data } = await api.get('/api/usage?period=7d');
            setUsageData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setUsageLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        fetchUsage();
        const dismissed = localStorage.getItem('sipHeron_onboarding_dismissed');
        if (dismissed === 'true') setChecklistDismissed(true);
        const interval = setInterval(() => fetchData(), 60000);
        return () => clearInterval(interval);
    }, [fetchData, fetchUsage]);

    // Plausible FirstAnchor tracking
    useEffect(() => {
        if (stats?.stats?.totalAnchors > 0) {
            const hasTracked = localStorage.getItem('sipheron_first_anchor_tracked');
            if (!hasTracked) {
                window.plausible?.('FirstAnchor');
                localStorage.setItem('sipheron_first_anchor_tracked', 'true');
            }
        }
    }, [stats?.stats?.totalAnchors]);

    useEffect(() => {
        fetchHashes();
    }, [fetchHashes]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleRevokeSuccess = (hash) => {
        setHashes(prev => prev.map(r => r.hash === hash ? { ...r, status: 'revoked' } : r));
        showToast("Hash successfully revoked on-chain.", "success");
        fetchData();
    };

    const handleDismissChecklist = () => {
        setChecklistDismissed(true);
        localStorage.setItem('sipHeron_onboarding_dismissed', 'true');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        router.push(`?${params.toString()}`, { scroll: false });
        document.getElementById('recent-activity-table')?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (currentPage !== 1) handlePageChange(1);
    }, [searchTerm, statusFilter]);

    const handleExport = async (format = 'csv') => {
        try {
            // Use raw fetch with credentials to trigger file download
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'https://api.sipheron.com'}/api/hashes/export?format=${format}`,
                { credentials: 'include' }
            );

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sipheron-hashes-${Date.now()}.${format === 'json' ? 'json' : 'csv'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export error:', err);
            showToast('Failed to export data', 'error');
        }
    };

    if (!mounted) return null;

    if (showWizard) {
        return <OnboardingWizard onComplete={() => window.location.reload()} />;
    }

    const showChecklist = stats && stats.stats?.totalAnchors === 0 && !checklistDismissed;

    return (
        <div className="space-y-8 pb-20 relative">
            {confirmedToast && (
                <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl bg-green-500/20 border border-green-500/30 text-green-300 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    {confirmedToast}
                </div>
            )}
            <div className="absolute inset-x-0 -top-20 h-64 bg-purple-glow/5 blur-[120px] pointer-events-none" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2">
                        {stats?.org?.name || 'Institutional Console'}
                    </h1>
                    <div className="flex items-center gap-3">
                        <PurpleBadge variant="purple">Console Authority</PurpleBadge>
                        <span className="text-text-muted font-mono text-xs truncate max-w-[200px]">
                            ID: {stats?.org?.id || 'PROVISIONING'}
                        </span>
                        {isPolling && (
                            <div className="flex items-center gap-2 text-xs text-yellow-500/80 font-bold uppercase tracking-widest ml-4">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_var(--yellow-400)]" />
                                Synchronizing Registry...
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="flex flex-col items-end mr-4 hidden lg:flex">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest leading-none mb-1">Last Data Sync</span>
                        <span className="text-xs font-mono text-purple-glow">{lastSync.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex gap-2 mr-2">
                        <GlowButton
                            variant="ghost"
                            onClick={() => setShowBulkModal(true)}
                            className="text-xs"
                        >
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            Bulk Anchor
                        </GlowButton>
                        <GlowButton
                            variant="ghost"
                            onClick={() => handleExport('csv')}
                            className="text-xs"
                            title="Export as CSV"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </GlowButton>
                        <GlowButton
                            variant="ghost"
                            onClick={() => handleExport('json')}
                            className="text-xs"
                            title="Export as JSON"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export JSON
                        </GlowButton>
                    </div>
                    <GlowButton onClick={() => { fetchData(); fetchHashes(); fetchUsage(); }} className="px-4 py-2" variant="ghost">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </GlowButton>
                </motion.div>
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Proofs Anchored"
                    value={stats?.stats?.totalAnchors ?? 0}
                    loading={loading}
                    icon={FolderDot}
                    trend="+14.2%"
                    trendUp={true}
                />
                <MetricCard
                    title="Active API Keys"
                    value={stats?.stats?.activeApiKeys ?? 0}
                    loading={loading}
                    icon={Key}
                    trend="Stable"
                />
                <MetricCard
                    title="SOL Balance"
                    value={stats?.wallet?.balanceSol ?? 0}
                    loading={loading}
                    icon={Wallet}
                    isCurrency={true}
                    trend={stats?.wallet?.status === 'critical' ? 'Refill Required' : 'Healthy'}
                    trendUp={stats?.wallet?.status === 'healthy'}
                />
                <MetricCard
                    title="Network Integrity"
                    value="100"
                    postfix="%"
                    loading={loading}
                    icon={Globe}
                    trend="Operating"
                    trendUp={true}
                />
            </div>

            {/* Registry Throughput Chart — Premium */}
            <PurpleCard className="overflow-hidden p-0">
                {/* Chart Header */}
                <div className="px-6 pt-6 pb-2">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2.5 mb-1">
                                <div className="p-1.5 rounded-lg bg-purple-dim/30">
                                    <Activity className="w-4 h-4 text-purple-vivid" />
                                </div>
                                Registry Throughput
                            </h3>
                            <p className="text-xs text-text-muted">On-chain transaction volume &middot; Last 7 days</p>
                        </div>

                        {/* Stat Pills Row */}
                        {!usageLoading && (
                            <div className="flex flex-wrap gap-3">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center gap-3 bg-success/[0.06] border border-success/20 rounded-xl px-4 py-2.5"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-success/60 uppercase font-bold tracking-[0.15em] leading-none mb-1">Success Rate</span>
                                        <span className="text-xl font-black text-success font-mono leading-none">{usageData.summary?.successRate || '99.9%'}</span>
                                    </div>
                                    <div className="w-px h-8 bg-success/20" />
                                    <CheckCircle2 className="w-5 h-5 text-success/60" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-3 bg-purple-vivid/[0.06] border border-purple-vivid/20 rounded-xl px-4 py-2.5"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-purple-glow/60 uppercase font-bold tracking-[0.15em] leading-none mb-1">Daily Avg</span>
                                        <span className="text-xl font-black text-purple-glow font-mono leading-none">{(usageData.summary?.requestsThisWeek / 7).toFixed(0) || 0}</span>
                                    </div>
                                    <div className="w-px h-8 bg-purple-vivid/20" />
                                    <BarChart2 className="w-5 h-5 text-purple-glow/60" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center gap-3 bg-blue-accent/[0.06] border border-blue-accent/20 rounded-xl px-4 py-2.5"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-blue-accent/60 uppercase font-bold tracking-[0.15em] leading-none mb-1">Total (7d)</span>
                                        <span className="text-xl font-black text-blue-accent font-mono leading-none">{usageData.summary?.requestsThisWeek ?? 0}</span>
                                    </div>
                                    <div className="w-px h-8 bg-blue-accent/20" />
                                    <Zap className="w-5 h-5 text-blue-accent/60" />
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chart Body */}
                <div className="px-2 pb-4">
                    <div className="h-[280px] w-full">
                        {usageLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-purple-vivid/30 border-t-purple-vivid rounded-full animate-spin" />
                                    <span className="text-xs text-text-muted">Loading chart data...</span>
                                </div>
                            </div>
                        ) : (usageData.analytics || []).length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-dim/10 border border-purple-vivid/10 flex items-center justify-center">
                                        <BarChart2 className="w-7 h-7 text-purple-glow/30" />
                                    </div>
                                    <p className="text-sm text-text-muted">No throughput data yet</p>
                                    <p className="text-xs text-text-muted/60">Anchor your first document to see activity</p>
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={usageData.analytics || []} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--purple-vivid)" stopOpacity={0.35} />
                                            <stop offset="60%" stopColor="var(--purple-vivid)" stopOpacity={0.08} />
                                            <stop offset="100%" stopColor="var(--purple-vivid)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--purple-vivid)" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="var(--blue-accent)" stopOpacity={0.7} />
                                        </linearGradient>
                                        <linearGradient id="barGradientMuted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--purple-vivid)" stopOpacity={0.25} />
                                            <stop offset="100%" stopColor="var(--blue-accent)" stopOpacity={0.12} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 6"
                                        vertical={false}
                                        stroke="rgba(255,255,255,0.04)"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'monospace' }}
                                        dy={8}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'monospace' }}
                                        width={40}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: 'rgba(155, 110, 255, 0.15)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const val = payload[0].value;
                                                return (
                                                    <div className="bg-[#0C0C14]/95 backdrop-blur-xl border border-purple-vivid/20 p-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] min-w-[180px]">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-2 h-2 rounded-full bg-purple-vivid shadow-[0_0_8px_var(--purple-vivid)]" />
                                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">{label}</span>
                                                        </div>
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-2xl font-black text-white font-mono">{val}</span>
                                                            <span className="text-xs text-text-muted">transactions</span>
                                                        </div>
                                                        <div className="mt-2 pt-2 border-t border-white/5">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${val > 0 ? 'bg-success' : 'bg-text-muted'}`} />
                                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${val > 0 ? 'text-success' : 'text-text-muted'}`}>
                                                                    {val > 0 ? 'Active' : 'Idle'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="var(--purple-vivid)"
                                        strokeWidth={2}
                                        fill="url(#areaGradient)"
                                        dot={false}
                                        activeDot={{
                                            r: 6,
                                            fill: 'var(--purple-vivid)',
                                            stroke: '#0A0A12',
                                            strokeWidth: 3,
                                            style: { filter: 'drop-shadow(0 0 8px var(--purple-vivid))' }
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
                                        {(usageData.analytics || []).map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index === (usageData.analytics?.length || 0) - 1 ? 'url(#barGradient)' : 'url(#barGradientMuted)'}
                                            />
                                        ))}
                                    </Bar>
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Chart Footer — Legend */}
                <div className="px-6 py-3 border-t border-bg-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-purple-vivid to-blue-accent opacity-80" />
                            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Transactions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-[2px] bg-purple-vivid rounded-full" />
                            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Trend</span>
                        </div>
                    </div>
                    <span className="text-[10px] text-text-muted font-mono">
                        {(usageData.analytics || []).length > 0
                            ? `${usageData.analytics[0]?.date} — ${usageData.analytics[usageData.analytics.length - 1]?.date}`
                            : 'No data range'
                        }
                    </span>
                </div>
            </PurpleCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Registry Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <PurpleInput
                                placeholder="Filter by evidence hash or metadata..."
                                icon={Search}
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="bg-bg-surface/50"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                className="bg-bg-surface border border-bg-border rounded-lg px-4 py-2 text-xs text-text-secondary outline-none focus:ring-2 focus:ring-purple-vivid/50"
                            >
                                <option value="all">Every Status</option>
                                <option value="active">Active Only</option>
                                <option value="revoked">Revoked Only</option>
                            </select>
                        </div>
                    </div>

                    <PurpleCard id="recent-activity-table" className="p-0 border-bg-border/50">
                        <PurpleTable headers={["Evidence Hash Source", "Description", "Anchored At", "Status", "Actions"]}>
                            {hashesLoading ? (
                                <TableSkeleton />
                            ) : hashes.length > 0 ? (
                                hashes.map((record, i) => (
                                    <PurpleTableRow key={i}>
                                        <td className="px-5 py-4">
                                            <MonoHash hash={record.hash} />
                                        </td>
                                        <td className="px-5 py-4 text-text-secondary max-w-[200px] truncate">
                                            {record.metadata || "No metadata provided"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-text-primary text-xs font-medium">
                                                    {new Date(record.registeredAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] text-text-muted font-mono">
                                                    {new Date(record.registeredAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <PendingBadge status={record.status} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <GlowButton
                                                    variant="ghost"
                                                    onClick={() => setQrHash(record.hash)}
                                                    className="!px-3 !py-1.5 min-h-0 text-xs"
                                                    title="Generate QR Code"
                                                >
                                                    <QrCode className="w-3.5 h-3.5" />
                                                </GlowButton>
                                                <Link href={`/dashboard/hashes/${record.hash}`}>
                                                    <motion.button whileHover={{ x: 3 }} className="text-purple-glow hover:text-purple-bright transition-colors">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </motion.button>
                                                </Link>
                                            </div>
                                        </td>
                                    </PurpleTableRow>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-0">
                                        <EmptyState searchTerm={searchTerm} />
                                    </td>
                                </tr>
                            )}
                        </PurpleTable>

                        {/* Pagination */}
                        {!hashesLoading && pagination && (
                            <div className="px-6 py-4 border-t border-bg-border flex items-center justify-between">
                                <span className="text-xs text-text-muted font-mono tracking-tighter">
                                    PAGE {pagination.page} / {pagination.totalPages}
                                </span>
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </PurpleCard>
                </div>

                {/* Sidebar Quick Actions */}
                <div className="space-y-6">
                    <h2 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Quick Deploy</h2>

                    <PurpleCard className="group border-purple-vivid/10 hover:border-purple-vivid/40">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-purple-dim/30 text-purple-glow">
                                <Terminal className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-sm text-text-primary uppercase tracking-tight">CLI Anchor</h4>
                        </div>
                        <div className="bg-black/40 rounded-lg p-3 border border-bg-border relative overflow-hidden mb-4">
                            <code className="text-xs text-purple-glow font-mono whitespace-nowrap">sipheron-vdr anchor ./legal.pdf</code>
                            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-end px-2">
                                <Copy className="w-3.5 h-3.5 text-text-muted cursor-pointer hover:text-white" />
                            </div>
                        </div>
                        <GlowButton variant="ghost" className="w-full text-xs" icon={ExternalLink}>Read Documentation</GlowButton>
                    </PurpleCard>

                    <Link href="/dashboard/keys" className="block">
                        <PurpleCard className="hover:bg-purple-dim/10 group transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-success/10 text-success group-hover:bg-success/20">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Issue API Keys</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                            </div>
                        </PurpleCard>
                    </Link>

                    <Link href="/dashboard/decoder" className="block">
                        <PurpleCard className="hover:bg-purple-dim/10 group transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-accent/10 text-blue-accent group-hover:bg-blue-accent/20">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Verify Assets</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                            </div>
                        </PurpleCard>
                    </Link>
                </div>
            </div>

            {/* Revoke Modal Integration */}
            <AnimatePresence>
                {revokeModalRecord && (
                    <RevokeModal
                        record={revokeModalRecord}
                        onClose={() => setRevokeModalRecord(null)}
                        onSuccess={() => {
                            handleRevokeSuccess(revokeModalRecord.hash);
                            setRevokeModalRecord(null);
                        }}
                        onError={(msg) => showToast(msg, 'error')}
                    />
                )}
            </AnimatePresence>

            <PurpleModal
                isOpen={!!qrHash}
                onClose={() => { setQrHash(null); setQrCopied(false); }}
                title="Verification QR Code"
            >
                {qrHash && (
                    <div className="space-y-6 flex flex-col items-center">
                        <p className="text-[12px] text-text-muted text-center">
                            Share this QR code to let anyone verify this document's authenticity without logging in.
                        </p>

                        {/* QR Code image */}
                        <div className="p-4 bg-black rounded-2xl border border-bg-border">
                            <img
                                src={qrUrl(qrHash)}
                                alt="Verification QR Code"
                                width={220}
                                height={220}
                                className="rounded-xl"
                            />
                        </div>

                        {/* Verification URL */}
                        <div className="w-full space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">
                                Verification Link
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black border border-bg-border rounded-lg px-3 py-2.5 font-mono text-[11px] text-purple-300 truncate">
                                    {verifyUrl(qrHash)}
                                </div>
                                <GlowButton
                                    variant="ghost"
                                    className="!px-3 shrink-0"
                                    onClick={() => {
                                        navigator.clipboard.writeText(verifyUrl(qrHash));
                                        setQrCopied(true);
                                        setTimeout(() => setQrCopied(false), 2000);
                                    }}
                                >
                                    {qrCopied
                                        ? <Check className="w-4 h-4 text-success" />
                                        : <Copy className="w-4 h-4" />
                                    }
                                </GlowButton>
                            </div>
                        </div>

                        {/* Download QR */}
                        <a
                            href={qrUrl(qrHash)}
                            download={`sipheron-qr-${qrHash.slice(0, 12)}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                        >
                            <GlowButton variant="ghost" className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download QR PNG
                            </GlowButton>
                        </a>

                        {/* Hash preview */}
                        <div className="w-full bg-black/40 border border-bg-border rounded-xl p-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Hash</p>
                            <p className="font-mono text-[11px] text-text-muted break-all">{qrHash}</p>
                        </div>
                    </div>
                )}
            </PurpleModal>
            {showBulkModal && (
                <BulkAnchorModal
                    onClose={() => setShowBulkModal(false)}
                    onSuccess={() => {
                        setShowBulkModal(false);
                        fetchHashes();
                        fetchData();
                        fetchUsage();
                        startPolling();
                    }}
                />
            )}
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, trendUp, loading, isCurrency, postfix }) {
    return (
        <PurpleCard className="group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-purple-dim/20 text-purple-vivid group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter ${trendUp ? 'text-success' : 'text-danger'}`}>
                        {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-[0.2em] mb-1">{title}</p>
            <div className="text-3xl font-bold font-mono tracking-tight text-text-primary">
                {loading ? (
                    <PurpleSkeleton className="h-8 w-24" />
                ) : (
                    <>
                        {isCurrency && <span className="text-purple-glow mr-1 text-2xl">◎</span>}
                        <CountUp end={value} />
                        {postfix && <span className="text-text-secondary text-xl ml-1">{postfix}</span>}
                    </>
                )}
            </div>
        </PurpleCard>
    );
}

function TableSkeleton() {
    return Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
            <td className="px-5 py-5"><PurpleSkeleton className="h-4 w-32" /></td>
            <td className="px-5 py-5"><PurpleSkeleton className="h-4 w-48" /></td>
            <td className="px-5 py-5"><PurpleSkeleton className="h-4 w-24" /></td>
            <td className="px-5 py-5"><PurpleSkeleton className="h-6 w-16" /></td>
            <td className="px-5 py-5"><PurpleSkeleton className="h-4 w-8 ml-auto" /></td>
        </tr>
    ));
}

function EmptyState({ searchTerm }) {
    return (
        <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-purple-dim/10 border border-purple-vivid/20 flex items-center justify-center mb-6 relative">
                <FolderDot className="w-10 h-10 text-purple-glow/40" />
                <div className="absolute inset-0 bg-purple-vivid/5 blur-2xl animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2">
                {searchTerm ? `No matches for "${searchTerm}"` : 'Vault is currently empty'}
            </h3>
            <p className="text-text-muted text-sm max-w-sm mb-8">
                {searchTerm ? 'Try adjusting your search filters or clear the input.' : 'No document proofs have been anchored to the registry yet.'}
            </p>
            {!searchTerm && (
                <div className="bg-black/30 border border-bg-border p-4 rounded-xl font-mono text-xs text-purple-glow">
                    sipheron-vdr anchor ./legal-doc.pdf
                </div>
            )}
        </div>
    );
}

function OnboardingWizard({ onComplete }) {
    const [name, setName] = useState('');
    const [pubkey, setPubkey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/organizations', { name, solanaPubkey: pubkey });
            onComplete();
        } catch (err) {
            setError(err.response?.data?.error || "Provisioning failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <PurpleCard className="w-full max-w-lg p-0 border-purple-vivid/30 overflow-hidden" hover={false}>
                <div className="bg-purple-gradient px-8 py-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <Building className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Secure Infrastructure</h2>
                            <p className="text-white/70 text-sm">Provision your institutional node</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <p className="text-text-secondary text-sm leading-relaxed">Map your institutional identity to the Solana decentralized registry to begin anchoring assets with full cryptographic proof.</p>
                    <form onSubmit={handleInit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Project Identifier</label>
                            <PurpleInput required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SipHeron Institutional" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Public Key Identity</label>
                            <PurpleInput required value={pubkey} onChange={(e) => setPubkey(e.target.value)} placeholder="Solana Authority Address" className="font-mono text-purple-vivid" />
                        </div>
                        {error && <div className="text-danger text-[11px] font-bold flex items-center gap-2 mt-2 bg-danger/10 p-3 rounded-lg border border-danger/20"><ShieldAlert className="w-4 h-4" /> {error}</div>}
                        <GlowButton loading={loading} className="w-full py-4 uppercase tracking-widest font-bold text-xs">Initialize Organization</GlowButton>
                    </form>
                </div>
            </PurpleCard>
        </div>
    );
}

function RevokeModal({ record, onClose, onSuccess, onError }) {
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRevoke = async () => {
        if (confirmText !== 'CONFIRM') return;
        setLoading(true);
        try {
            await api.post('/api/hashes/revoke', { hash: record.hash });
            onSuccess();
        } catch (err) {
            onError(err.response?.data?.error || "Revocation failed.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-bg-primary border border-danger/30 rounded-3xl shadow-[0_0_100px_rgba(239,68,68,0.15)] overflow-hidden p-8" >
                <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-6 mx-auto">
                    <ShieldAlert className="w-8 h-8 text-danger" />
                </div>

                <h3 className="text-2xl font-bold text-white text-center mb-2 tracking-tight">Revoke Proof?</h3>
                <p className="text-sm text-text-secondary text-center leading-relaxed mb-8">
                    This cryptographic record will be permanently invalidated on-chain. This operation is <span className="text-danger font-bold">non-reversible</span>.
                </p>

                <div className="bg-black/50 border border-bg-border rounded-xl p-4 mb-8 font-mono text-xs text-purple-vivid break-all leading-relaxed">
                    <span className="text-text-muted mr-2">IDENTITY:</span>
                    {record.hash}
                </div>

                <div className="space-y-4">
                    <PurpleInput
                        placeholder="Type CONFIRM to authorize"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="text-center font-bold uppercase tracking-[0.2em] border-danger/20 focus:ring-danger/50"
                    />
                    <div className="flex gap-3">
                        <GlowButton variant="ghost" onClick={onClose} className="flex-1 py-3 text-xs uppercase tracking-widest font-bold">Cancel</GlowButton>
                        <GlowButton
                            variant="danger"
                            disabled={confirmText !== 'CONFIRM'}
                            loading={loading}
                            onClick={handleRevoke}
                            className="flex-1 py-3 text-xs uppercase tracking-widest font-bold"
                        >
                            Confirm Revoke
                        </GlowButton>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
