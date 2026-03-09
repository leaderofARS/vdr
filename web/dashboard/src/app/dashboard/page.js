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
    TrendingUp, TrendingDown, Wallet, Activity, Globe, Zap
} from 'lucide-react';
import dynamic from 'next/dynamic';
import {
    PurpleCard, GlowButton, PurpleBadge, MonoHash, PurpleSkeleton,
    CountUp, PurpleTable, PurpleTableRow, PurpleInput
} from '@/components/ui/PurpleUI';

const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });

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

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

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

    if (!mounted) return null;

    if (showWizard) {
        return <OnboardingWizard onComplete={() => window.location.reload()} />;
    }

    const showChecklist = stats && stats.stats?.totalAnchors === 0 && !checklistDismissed;

    return (
        <div className="space-y-8 pb-20 relative">
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

            {/* Registry Throughput Chart */}
            <PurpleCard className="overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-vivid" />
                            Registry Throughput
                        </h3>
                        <p className="text-sm text-text-muted">On-chain transaction volume (last 7 days)</p>
                    </div>
                    {!usageLoading && (
                        <div className="flex gap-8">
                            <div className="text-right">
                                <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Success Rate</p>
                                <p className="text-xl font-bold text-success font-mono">{usageData.summary?.successRate || '99.9%'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Daily Avg</p>
                                <p className="text-xl font-bold text-purple-glow font-mono">{(usageData.summary?.requestsThisWeek / 7).toFixed(0) || 0}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usageData.analytics || []}>
                            <XAxis dataKey="date" hide />
                            <Tooltip
                                cursor={{ fill: 'rgba(155, 110, 255, 0.05)' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-bg-surface/90 backdrop-blur-md border border-bg-border p-3 rounded-xl shadow-2xl">
                                                <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-widest">{payload[0].payload.date}</p>
                                                <p className="text-lg font-bold text-purple-glow">{payload[0].value} Requests</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                {(usageData.analytics || []).map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === (usageData.analytics?.length || 0) - 1 ? 'url(#purple-gradient)' : 'var(--bg-border)'}
                                    />
                                ))}
                            </Bar>
                            <defs>
                                <linearGradient id="purple-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--purple-vivid)" />
                                    <stop offset="100%" stopColor="var(--blue-accent)" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
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
                                            <PurpleBadge variant={record.status === 'revoked' ? 'danger' : 'success'} pulse={record.status === 'active'}>
                                                {record.status}
                                            </PurpleBadge>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link href={`/dashboard/hashes/${record.hash}`}>
                                                <motion.button whileHover={{ x: 3 }} className="text-purple-glow hover:text-purple-bright transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </motion.button>
                                            </Link>
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
