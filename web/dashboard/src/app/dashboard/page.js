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
    Ban, ShieldAlert, X, TerminalSquare, Rocket, Check, RefreshCw, BarChart2
} from 'lucide-react';
import dynamic from 'next/dynamic';

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

    // Filter & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

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
            console.error("Failed to load org stats:", e);
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
            console.error("Failed to load hashes:", e);
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
            console.error("Failed to load usage data:", e);
        } finally {
            setUsageLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        fetchUsage();
        const dismissed = localStorage.getItem('sipHeron_onboarding_dismissed');
        if (dismissed === 'true') setChecklistDismissed(true);

        const interval = setInterval(() => fetchData(), 60000); // Auto-refresh metric cards
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
        // Optimistic Update for current hashes list
        setHashes(prev => prev.map(r =>
            r.hash === hash ? { ...r, status: 'revoked' } : r
        ));
        showToast("Hash successfully revoked on-chain.", "success");
        // Re-fetch stats to update active/total counts
        fetchData();
    };

    const handleDismissChecklist = () => {
        setChecklistDismissed(true);
        localStorage.setItem('sipHeron_onboarding_dismissed', 'true');
    };

    // Pagination & URL handling
    const handlePageChange = (page) => {
        setCurrentPage(page);
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        router.push(`?${params.toString()}`, { scroll: false });

        // Smooth scroll to table top
        document.getElementById('recent-activity-table')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Reset page on search/filter changes
    useEffect(() => {
        if (currentPage !== 1) {
            handlePageChange(1);
        }
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        const urlPage = parseInt(searchParams.get('page')) || 1;
        if (urlPage !== currentPage) {
            setCurrentPage(urlPage);
        }
    }, [searchParams]);

    // Deterministic state checks for rendering
    if (!mounted) return null;

    if (showWizard) {
        return <OnboardingWizard onComplete={() => window.location.reload()} />;
    }

    const showChecklist = stats && stats.stats?.totalAnchors === 0 && !checklistDismissed;

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-20 relative">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-xl bg-[#111118] border border-[#1E1E2E] shadow-2xl flex items-center gap-3 min-w-[320px]"
                    >
                        <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-[#10B981]/10' : 'bg-[#F28B82]/10'}`}>
                            {toast.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-[#F28B82]" />
                            )}
                        </div>
                        <span className="text-sm text-white font-medium">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-auto text-[#9AA0A6] hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header section */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-normal text-white mb-1 flex items-center gap-2">
                        {stats?.org?.name ? `Project: ${stats.org.name}` : 'Institutional Overview'}
                        {!loading && <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>}
                    </h1>
                    <div className="text-sm text-[#9AA0A6] font-mono flex items-center gap-2">
                        <span className="opacity-50">Org ID:</span>
                        <span className="text-[#4285F4] truncate max-w-[200px] md:max-w-none">
                            {stats?.org?.id || 'Provisioning...'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-[11px] text-[#9AA0A6] uppercase tracking-widest bg-[#1A1D24] border border-[#2C3038] px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Last Sync: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <button
                        onClick={() => { fetchData(); fetchHashes(); fetchUsage(); }}
                        disabled={loading || hashesLoading}
                        className="p-1.5 rounded-lg bg-[#1A1D24] border border-[#2C3038] text-[#9AA0A6] hover:text-white hover:border-[#3C4043] transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Onboarding Checklist */}
            <AnimatePresence>
                {showChecklist && stats && (
                    <OnboardingChecklist
                        stats={stats}
                        onDismiss={handleDismissChecklist}
                    />
                )}
            </AnimatePresence>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Proofs Anchored" value={stats?.stats?.totalAnchors ?? "—"} loading={loading} icon={FolderDot} trend="+12% this month" />
                <MetricCard title="Active API Keys" value={stats?.stats?.activeApiKeys ?? "—"} loading={loading} icon={Key} />

                {/* Live Wallet Balance Widget */}
                {loading ? (
                    <div className="bg-[#1A1D24] border border-[#2C3038] rounded p-4 h-[104px] animate-pulse relative overflow-hidden">
                        <div className="h-2 w-20 bg-[#2C3038] rounded mb-1.5"></div>
                        <div className="h-8 w-32 bg-[#2C3038] rounded"></div>
                        <div className="h-2 w-24 bg-[#2C3038] rounded mt-2.5"></div>
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#2C3038]"></div>
                    </div>
                ) : (
                    <LiveWalletBalanceCard balanceSol={stats?.wallet?.balanceSol} address={stats?.wallet?.address} status={stats?.wallet?.status} />
                )}

                <div className="bg-[#1A1D24] border border-[#2C3038] rounded p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${stats?.wallet?.status === 'critical' ? 'bg-[#F28B82]' : stats?.wallet?.status === 'warning' ? 'bg-[#FBC02D]' : 'bg-[#10B981]'}`}></div>
                    <div className="text-[#9AA0A6] text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                        <Network className="w-3 h-3 text-[#4285F4]" /> Network Status
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="relative">
                            <div className={`w-2 h-2 rounded-full ${stats?.wallet?.status === 'critical' ? 'bg-[#F28B82]' : 'bg-[#10B981]'}`}></div>
                            <div className={`absolute inset-0 w-2 h-2 rounded-full ${stats?.wallet?.status === 'critical' ? 'bg-[#F28B82]' : 'bg-[#10B981]'} animate-ping opacity-75`}></div>
                        </div>
                        <span className="text-xl font-normal text-white tracking-tight">Solana {stats?.wallet?.network || 'Devnet'}</span>
                    </div>
                    <div className={`text-[11px] font-medium mt-1 ${stats?.wallet?.status === 'critical' ? 'text-[#F28B82]' : 'text-[#10B981]'}`}>
                        {stats?.wallet?.status === 'critical' ? 'Service Degraded' : 'Operational • Healthy'}
                    </div>
                </div>
            </div>

            {/* Usage Sparkline Chart */}
            <div className="bg-[#1A1D24] border border-[#2C3038] rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h3 className="text-white text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                            <BarChart2 className="w-4 h-4 text-[#4285F4]" /> Registry Throughput
                        </h3>
                        <p className="text-[11px] text-[#9AA0A6] mt-1 font-medium">Daily request volume across all registry API endpoints</p>
                    </div>

                    {!usageLoading && usageData && (
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[#9AA0A6] uppercase font-bold tracking-widest">Today</span>
                                <span className="text-sm font-bold text-white leading-tight">{usageData.summary?.requestsToday || 0}</span>
                            </div>
                            <div className="w-px h-6 bg-[#2C3038]"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[#9AA0A6] uppercase font-bold tracking-widest">This Week</span>
                                <span className="text-sm font-bold text-white leading-tight">{usageData.summary?.requestsThisWeek || 0}</span>
                            </div>
                            <div className="w-px h-6 bg-[#2C3038]"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[#9AA0A6] uppercase font-bold tracking-widest">Success Rate</span>
                                <span className={`text-sm font-bold leading-tight ${parseFloat(usageData.summary?.successRate) > 95 ? 'text-[#10B981]' : 'text-[#FBC02D]'}`}>
                                    {usageData.summary?.successRate || '100%'}
                                </span>
                            </div>
                        </div>
                    )}
                    {usageLoading && <div className="w-4 h-4 border-2 border-t-transparent border-[#4285F4] rounded-full animate-spin"></div>}
                </div>
                <div className="h-[120px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usageData.analytics || []}>
                            <XAxis
                                dataKey="date"
                                hide
                            />
                            <Tooltip
                                cursor={{ fill: '#2C3038', opacity: 0.4 }}
                                contentStyle={{ backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: '8px', fontSize: '11px' }}
                                itemStyle={{ color: '#4285F4' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {(usageData.analytics || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === (usageData.analytics?.length || 0) - 1 ? '#4285F4' : '#2C3038'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {/* Search and Filters */}
                    <div className="bg-[#1A1D24] border border-[#2C3038] rounded p-3 flex flex-col md:flex-row gap-3 shadow-sm">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6368] group-focus-within:text-[#4285F4] transition-colors" />
                            <input
                                type="text"
                                placeholder="Filter by hash or metadata..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full bg-[#131418] border border-[#3C4043] rounded px-9 py-2 text-sm text-white focus:outline-none focus:border-[#4285F4] transition-all placeholder:text-[#5F6368]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="relative min-w-[120px]">
                                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9AA0A6] pointer-events-none" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                    className="w-full bg-[#131418] border border-[#3C4043] rounded pl-9 pr-4 py-2 text-xs text-[#E8EAED] outline-none hover:border-[#5F6368] appearance-none"
                                >
                                    <option value="all">Status: All</option>
                                    <option value="active">Active Only</option>
                                    <option value="revoked">Revoked Only</option>
                                    <option value="expired">Expired Only</option>
                                </select>
                            </div>
                            <div className="relative min-w-[120px]">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9AA0A6] pointer-events-none" />
                                <select
                                    value={dateFilter}
                                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                                    className="w-full bg-[#131418] border border-[#3C4043] rounded pl-9 pr-4 py-2 text-xs text-[#E8EAED] outline-none hover:border-[#5F6368] appearance-none"
                                >
                                    <option value="all">Date: All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Registry Table */}
                    <div id="recent-activity-table" className="bg-[#1A1D24] border border-[#2C3038] rounded overflow-hidden flex flex-col min-h-[400px] shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#1D2128] border-b border-[#2C3038]">
                                    <tr className="text-[#9AA0A6] text-xs uppercase tracking-wider font-bold">
                                        <th className="px-5 py-3 font-medium">Hash Source</th>
                                        <th className="px-5 py-3 font-medium">Metadata Description</th>
                                        <th className="px-5 py-3 font-medium">Date Anchored</th>
                                        <th className="px-5 py-3 font-medium border-l border-[#2C3038]">Status</th>
                                        <th className="px-5 py-3 font-medium text-right">Verification & Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2C3038] text-[13px]">
                                    {hashesLoading ? (
                                        <TableSkeleton />
                                    ) : hashes.length > 0 ? (
                                        hashes.map((record, i) => (
                                            <tr key={i} className={`hover:bg-[#20232A] transition-all duration-200 group ${record.status === 'revoked' ? 'opacity-60 grayscale-[0.3]' : ''}`}>
                                                <td className="px-5 py-4">
                                                    <HashCell hash={record.hash} />
                                                </td>
                                                <td className="px-5 py-4 text-[#E8EAED] max-w-[200px]">
                                                    <div className="truncate" title={record.metadata}>
                                                        {record.metadata || <span className="text-[#5F6368] italic">No description</span>}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-[#9AA0A6]">
                                                    <div className="flex flex-col">
                                                        <span>{new Date(record.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        <span className="text-[10px] opacity-60">
                                                            {new Date(record.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 border-l border-[#2C3038]">
                                                    <StatusBadge status={record.status} />
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Link href={`/dashboard/hashes/${record.hash}`} className="text-[#4285F4] hover:text-[#8AB4F8] inline-flex items-center gap-1.5 font-medium text-xs transition-colors">
                                                            Details <ChevronRightIcon className="w-3 h-3" />
                                                        </Link>
                                                        {record.explorerUrl && (
                                                            <a
                                                                href={record.explorerUrl}
                                                                target="_blank" rel="noopener noreferrer"
                                                                className="text-[#5F6368] hover:text-white inline-flex items-center gap-1.5 font-medium text-xs transition-colors"
                                                            >
                                                                Explorer <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-0">
                                                <EmptyState searchTerm={searchTerm} onAction={fetchHashes} />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination UI */}
                        {!hashesLoading && pagination && (
                            <div className="mt-auto px-5 py-4 border-t border-[#2C3038] bg-[#1D2128] flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-xs text-[#9AA0A6] font-medium order-2 md:order-1">
                                    Showing <span className="text-white">{(pagination.page - 1) * pagination.limit + 1}</span>–
                                    <span className="text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of
                                    <span className="text-white"> {pagination.total}</span> documents
                                </div>
                                <div className="order-1 md:order-2 scale-90 md:scale-100">
                                    <Pagination
                                        currentPage={pagination.page}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Panel */}
                <div className="bg-[#1A1D24] border border-[#2C3038] rounded h-fit sticky top-6 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-[#2C3038] bg-[#1D2128]">
                        <h2 className="text-[#E8EAED] text-sm font-bold tracking-wide flex items-center gap-2">
                            <TerminalSquare className="w-4 h-4 text-[#4285F4]" /> Registry Quickstart
                        </h2>
                    </div>
                    <div className="p-3 flex flex-col gap-1.5">
                        <div className="group flex flex-col gap-1 p-4 bg-[#131418] border border-[#2C3038] rounded-lg transition-all hover:border-[#4285F4]/30">
                            <div className="flex items-center justify-between text-[#E8EAED] text-[13px] font-bold">
                                <span>Anchor Document via CLI</span>
                            </div>
                            <p className="text-[11px] text-[#9AA0A6] leading-relaxed mt-1">Submit files to the VDR registry using your workstation identity.</p>
                            <div className="relative mt-3">
                                <code className="text-[11px] text-[#8AB4F8] bg-[#0A0A0A] p-3 rounded-md font-mono break-all select-all block border border-[#2C3038]">
                                    sipheron-vdr anchor ./legal-doc.pdf
                                </code>
                                <button className="absolute right-2 top-2 p-1 text-[#5F6368] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Copy className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <Link href="/dashboard/keys">
                            <div className="group flex items-center justify-between p-4 hover:bg-[#20232A] rounded-lg cursor-pointer transition-all border border-transparent hover:border-[#2C3038]">
                                <div className="flex items-center text-[#E8EAED] text-[13px] font-medium gap-3">
                                    <div className="p-2 rounded-md bg-[#2C3038] group-hover:bg-[#4285F4]/10">
                                        <Key className="w-4 h-4 text-[#9AA0A6] group-hover:text-[#4285F4]" />
                                    </div>
                                    <span>Manage API Keys</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#5F6368] group-hover:text-white transform group-hover:translate-x-1" />
                            </div>
                        </Link>

                        <Link href="/dashboard/decoder">
                            <div className="group flex items-center justify-between p-4 hover:bg-[#20232A] rounded-lg cursor-pointer transition-all border border-transparent hover:border-[#2C3038]">
                                <div className="flex items-center text-[#E8EAED] text-[13px] font-medium gap-3">
                                    <div className="p-2 rounded-md bg-[#2C3038] group-hover:bg-[#10B981]/10">
                                        <ShieldCheck className="w-4 h-4 text-[#9AA0A6] group-hover:text-[#10B981]" />
                                    </div>
                                    <span>Verify Assets</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#5F6368] group-hover:text-white transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Revoke Modal */}
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

/**
 * Live Wallet Balance Widget
 * Direct RPC connection to Solana devnet
 */
function LiveWalletBalanceCard({ balanceSol, address, status }) {
    const getStatusConfig = (val) => {
        if (status === 'warning') return { color: 'bg-[#FBC02D]', label: 'Warning' };
        if (status === 'critical') return { color: 'bg-[#F28B82]', label: 'Critical' };
        return { color: 'bg-[#10B981]', label: 'Healthy' };
    };

    const statusConfig = getStatusConfig(balanceSol);

    return (
        <div className="bg-[#1A1D24] border border-[#2C3038] rounded p-4 flex flex-col justify-between shadow-sm hover:border-[#3C4043] transition-all group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${balanceSol > 0.05 ? 'bg-[#10B981]' : balanceSol > 0.01 ? 'bg-[#FBC02D]' : 'bg-[#F28B82]'}`}></div>

            <div className="flex items-center justify-between">
                <div className="text-[#9AA0A6] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <HardDrive className="w-3.5 h-3.5 group-hover:text-[#4285F4] transition-colors" />
                    Wallet Balance
                </div>
            </div>

            <div className="mt-2 flex flex-col">
                <div className="text-2xl font-normal text-white tracking-tight flex items-baseline gap-1.5">
                    <span className={`text-lg leading-none ${balanceSol > 0.05 ? 'text-[#10B981]' : balanceSol > 0.01 ? 'text-[#FBC02D]' : 'text-[#F28B82]'}`}>◎</span>
                    {balanceSol !== undefined ? balanceSol.toFixed(5) : "0.00000"}
                </div>
                <div className="text-[10px] font-mono text-[#5F6368] flex items-center gap-1.5 mt-1">
                    <span className="opacity-60">Identity:</span>
                    <span className="truncate max-w-[100px]" title={address}>
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not provisioned'}
                    </span>
                </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 border-t border-[#2C3038]/50 pt-2">
                <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.color} shadow-sm shadow-current/20`}></div>
                <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-tighter">
                    {statusConfig.label}
                </div>
            </div>
        </div>
    );
}

function OnboardingChecklist({ stats, onDismiss }) {
    // Define steps logic
    const steps = [
        { id: 1, title: "Create your account", completed: true },
        { id: 2, title: "Install the CLI", desc: "npm install -g sipheron-vdr", sub: "Required for on-chain anchoring", cmd: "npm install -g sipheron-vdr", link: "/docs/cli", completed: !!stats.solanaPubkey },
        { id: 3, title: "Link your account", desc: "sipheron-vdr link", sub: "Authenticate your workstation", cmd: "sipheron-vdr link", completed: stats.activeKeys > 0 },
        { id: 4, title: "Anchor your first document", desc: "sipheron-vdr anchor ./legal.pdf", sub: "Create your first proof on Solana", cmd: "sipheron-vdr anchor ./file.pdf", completed: stats.totalHashes > 0 }
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = (completedCount / steps.length) * 100;

    return (
        <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="overflow-hidden"
        >
            <div className="bg-[#1A1D24] border border-[#2C3038] rounded-xl overflow-hidden relative group/card shadow-2xl">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10B981]"></div>

                {/* Close button */}
                <button
                    onClick={onDismiss}
                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#3C4043] text-[#9AA0A6] hover:text-white transition-all z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    {/* Left: Progress and Title */}
                    <div className="flex-1 max-w-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                                <Rocket className="w-5 h-5 text-[#10B981]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white tracking-tight">Get started with SipHeron VDR</h2>
                                <p className="text-sm text-[#9AA0A6]">Complete these steps to anchor your first document</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                <span className="text-[#10B981]">Setup Progress</span>
                                <span className="text-white">{completedCount}/{steps.length} Steps</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#131418] rounded-full overflow-hidden border border-[#2C3038]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Steps Grid */}
                    <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-4">
                        {steps.map((step) => (
                            <div key={step.id} className={`p-4 rounded-xl border transition-all duration-300 relative ${step.completed ? 'bg-[#10B981]/5 border-[#10B981]/30 opacity-60' : 'bg-[#131418] border-[#2C3038] hover:border-[#10B981]/30 hover:bg-[#20232A]'}`}>
                                <div className="flex gap-4">
                                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 scale-100 ${step.completed ? 'bg-[#10B981] shadow-lg shadow-[#10B981]/20' : 'border-2 border-[#2C3038] bg-transparent'}`}>
                                        {step.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${step.completed ? 'text-[#10B981]' : 'text-white'}`}>{step.title}</span>
                                            {step.sub && <span className="text-[10px] text-[#9AA0A6] uppercase font-bold tracking-wider">{step.sub}</span>}
                                        </div>

                                        {!step.completed && step.cmd && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex-1 bg-[#0A0A0A] border border-[#2C3038] px-2 py-1.5 rounded flex items-center justify-between group/cmd">
                                                    <code className="text-[10px] text-[#10B981] font-mono truncate">{step.cmd}</code>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(step.cmd)}
                                                        className="p-1.5 rounded hover:bg-[#2C3038] text-[#5F6368] hover:text-white transition-colors"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                {step.link && (
                                                    <Link href={step.link}>
                                                        <button className="p-1.5 rounded border border-[#2C3038] hover:border-[#4285F4] text-[#9AA0A6] hover:text-[#4285F4] transition-all" title="View Docs">
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </button>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
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
            onError(err.response?.data?.error || "On-chain revocation failed. Check registry status.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#111118] border border-[#1E1E2E] rounded-2xl shadow-2xl overflow-hidden p-6" >
                <div className="w-12 h-12 rounded-full bg-[#F28B82]/10 border border-[#F28B82]/20 flex items-center justify-center mb-5 mx-auto">
                    <ShieldAlert className="w-6 h-6 text-[#F28B82]" />
                </div>

                <h3 className="text-lg font-bold text-white text-center mb-2">Revoke Document Proof?</h3>
                <p className="text-sm text-[#9AA0A6] text-center leading-relaxed mb-6">
                    This action is permanent and cannot be undone. The hash will be marked as <span className="text-[#F28B82] font-bold">revoked</span> on the Solana blockchain.
                </p>

                <div className="bg-[#0A0A0A] border border-[#1E1E2E] rounded-lg p-3 mb-6 font-mono text-[11px] text-[#4285F4] break-all">
                    <span className="text-[#9AA0A6] opacity-50 mr-2">HASH:</span>
                    {record.hash.slice(0, 16)}...{record.hash.slice(-16)}
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#9AA0A6] uppercase tracking-widest ml-1">Type CONFIRM to proceed</label>
                    <input
                        type="text"
                        placeholder="CONFIRM"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="w-full bg-[#131418] border border-[#1E1E2E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F28B82] uppercase font-bold"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-3 rounded-xl text-sm text-[#9AA0A6] font-bold hover:text-white transition-colors" >
                        CANCEL
                    </button>
                    <button
                        disabled={confirmText !== 'CONFIRM' || loading}
                        onClick={handleRevoke}
                        className="px-4 py-3 rounded-xl bg-[#F28B82] text-white text-sm font-bold hover:bg-[#EE675C] disabled:bg-[#1A1D24] disabled:text-[#3C4043] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-t-white border-white/20 rounded-full animate-spin" /> : "REVOKE PROOF"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, loading }) {
    return (
        <div className="bg-[#1A1D24] border border-[#2C3038] rounded p-4 flex flex-col justify-between shadow-sm hover:border-[#3C4043] transition-all group relative overflow-hidden">
            <div className="text-[#9AA0A6] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 group-hover:text-[#4285F4] transition-colors" /> {title}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                {loading ? (
                    <div className="h-9 w-16 bg-[#2C3038] rounded animate-pulse" />
                ) : (
                    <div className="text-3xl font-normal text-white tracking-tight">{value}</div>
                )}
                {trend && !loading && <span className="text-[10px] text-[#10B981] font-bold">{trend}</span>}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        active: { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', dot: 'bg-[#10B981]', label: 'Active' },
        revoked: { bg: 'bg-[#F28B82]/10', text: 'text-[#F28B82]', dot: 'bg-[#F28B82]', label: 'Revoked' },
        expired: { bg: 'bg-[#FBC02D]/10', text: 'text-[#FBC02D]', dot: 'bg-[#FBC02D]', label: 'Expired' }
    };
    const s = config[status] || config.active;
    return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${s.bg} ${s.text} font-bold text-[10px] uppercase tracking-wider border border-transparent`}>
            <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></div> {s.label}
        </div>
    );
}

function HashCell({ hash }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="flex items-center gap-2 group/hash">
            <Link href={`/dashboard/hashes/${hash}`}>
                <div className="font-mono text-[#4285F4] hover:text-[#8AB4F8] transition-colors cursor-pointer bg-[#131418] px-2 py-1 rounded border border-[#2C3038] hover:border-[#4285F4] shadow-sm transform hover:scale-[1.02] active:scale-95" title="Click for Full Cryptographic Certificate" >
                    {hash.slice(0, 8)}...{hash.slice(-8)}
                </div>
            </Link>
            <button onClick={handleCopy} className="p-1.5 rounded bg-[#2C3038] opacity-0 group-hover/hash:opacity-100 transition-all hover:bg-[#3C4043]" title="Copy Full SHA-256 Hash" >
                {copied ? <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3 text-[#9AA0A6]" />}
            </button>
        </div>
    );
}

function TableSkeleton() {
    return Array.from({ length: 3 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
            <td className="px-5 py-5"><div className="h-4 w-32 bg-[#2C3038] rounded"></div></td>
            <td className="px-5 py-5"><div className="h-4 w-40 bg-[#2C3038] rounded"></div></td>
            <td className="px-5 py-5"><div className="h-4 w-24 bg-[#2C3038] rounded"></div></td>
            <td className="px-5 py-5 border-l border-[#2C3038]"><div className="h-5 w-16 bg-[#2C3038] rounded-full"></div></td>
            <td className="px-5 py-5 text-right"><div className="h-4 w-24 ml-auto bg-[#2C3038] rounded"></div></td>
        </tr>
    ));
}

function EmptyState({ searchTerm, onAction }) {
    return (
        <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-[#2C3038] flex items-center justify-center mb-6 relative">
                <ShieldCheck className="w-8 h-8 text-[#5F6368]" />
                <div className="absolute inset-0 rounded-full border border-[#3C4043] animate-ping scale-150 opacity-20"></div>
            </div>
            <h3 className="text-white text-lg font-medium mb-2">{searchTerm ? 'No matches found' : 'No documents anchored yet'}</h3>
            <p className="text-[#9AA0A6] text-sm max-w-sm mx-auto mb-8">
                {searchTerm ? `No results for "${searchTerm}".` : 'Registry is empty. Use the CLI to anchor your first document proof.'}
            </p>
            {searchTerm ? (
                <button
                    onClick={onAction}
                    className="px-4 py-2 bg-[#131418] border border-[#2C3038] text-white text-xs font-bold rounded-lg hover:bg-[#20232A] transition-all"
                >
                    Clear Filters
                </button>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="bg-[#0A0A0A] border border-[#2C3038] p-4 rounded-lg font-mono text-xs text-[#8AB4F8] select-all">
                        sipheron-vdr anchor ./legal-doc.pdf
                    </div>
                    <Link href="/docs/cli">
                        <button className="inline-flex items-center gap-2 text-[#4285F4] hover:text-[#8AB4F8] text-sm font-bold transition-all group">
                            View CLI Docs <ChevronRightIcon className="w-4 h-4 transform group-hover:translate-x-1" />
                        </button>
                    </Link>
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
            <div className="bg-[#1A1D24] border border-[#2C3038] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#A142F4] to-[#4285F4]"></div>
                <div className="bg-[#1D2128] border-b border-[#2C3038] px-8 py-6 flex items-center gap-4 text-white">
                    <Building className="text-[#4285F4] w-6 h-6" />
                    <h2 className="text-lg font-bold">Provision Organization</h2>
                </div>
                <div className="p-8 space-y-6">
                    <p className="text-[#9AA0A6] text-sm leading-relaxed">Map your institutional identity to the Solana blockchain to begin anchoring assets.</p>
                    <form onSubmit={handleInit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#9AA0A6] uppercase tracking-widest ml-1">Project Identifier</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SipHeron Institutional" className="w-full px-4 py-3 bg-[#131418] border border-[#3C4043] rounded-xl text-sm text-white focus:outline-none focus:border-[#4285F4]" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#9AA0A6] uppercase tracking-widest ml-1">Solana Network Identity</label>
                            <input type="text" required value={pubkey} onChange={(e) => setPubkey(e.target.value)} placeholder="Public Key" className="w-full px-4 py-3 bg-[#131418] border border-[#3C4043] rounded-xl text-sm text-[#4285F4] font-mono focus:outline-none focus:border-[#4285F4]" />
                        </div>
                        {error && <div className="text-[#F28B82] text-xs flex items-center gap-2"><ShieldAlert className="w-3.5 h-3.5" /> {error}</div>}
                        <button disabled={loading} className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#4285F4]/20 disabled:bg-[#3C4043]">{loading ? 'PROVISIONING...' : 'CREATE ORGANIZATION'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
