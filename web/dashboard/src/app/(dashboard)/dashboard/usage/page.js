"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Download, Search, SlidersHorizontal,
    Calendar, ArrowUpRight, CheckCircle2, XCircle,
    Clock, Activity, Key, Globe, ChevronRight,
    ArrowRight, Filter, AlertCircle, RefreshCw,
    FileJson, Table, Zap, TrendingUp, TrendingDown
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Pagination from '@/components/Pagination';
import {
    PurpleCard, GlowButton, PurpleBadge, PurpleTable,
    PurpleTableRow, PurpleSkeleton, CountUp
} from '@/components/ui/PurpleUI';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });

export default function UsageDashboard() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [period, setPeriod] = useState('7d');
    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [endpoints, setEndpoints] = useState([]);
    const [apiKeys, setApiKeys] = useState([]);
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [logsLoading, setLogsLoading] = useState(true);
    const [filterKey, setFilterKey] = useState('all');
    const [filterEndpoint, setFilterEndpoint] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [lastSync, setLastSync] = useState(new Date());

    const fetchUsageData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/api/usage?period=${period}`);
            setSummary(data.summary);
            setChartData(data.chartData || []);
            setEndpoints(data.endpoints || []);
            setApiKeys(data.apiKeys || []);
            setLastSync(new Date());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [period]);

    const fetchLogs = useCallback(async (page = 1) => {
        setLogsLoading(true);
        try {
            const params = {
                page,
                limit: 50,
                apiKeyId: filterKey !== 'all' ? filterKey : undefined,
                endpoint: filterEndpoint !== 'all' ? filterEndpoint : undefined,
                status: filterStatus !== 'all' ? filterStatus : undefined
            };
            const { data } = await api.get('/api/usage/logs', { params });
            setLogs(data.data || []);
            setPagination(data.pagination);
        } catch (error) {
            console.error(error);
        } finally {
            setLogsLoading(false);
        }
    }, [filterKey, filterEndpoint, filterStatus]);

    useEffect(() => {
        fetchUsageData();
    }, [fetchUsageData]);

    useEffect(() => {
        fetchLogs(1);
    }, [fetchLogs]);

    const handleExportCSV = () => {
        const headers = ['Timestamp', 'Key', 'Endpoint', 'Method', 'Status', 'Duration (ms)'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + logs.map(log => [
                log.timestamp || log.createdAt || '',
                log.keyName,
                log.endpoint,
                log.method,
                log.statusCode,
                log.durationMs
            ].join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `api_usage_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!mounted) return null;

    return (
        <div className="space-y-8 pb-32 relative">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2 flex items-center gap-4">
                        <Activity className="w-8 h-8 text-purple-vivid" />
                        Infrastructure Intelligence
                    </h1>
                    <div className="flex items-center gap-3">
                        <PurpleBadge variant="purple">REAL-TIME MONITORING</PurpleBadge>
                        <span className="text-text-muted text-xs font-mono uppercase tracking-widest">
                            Synched {lastSync.toLocaleTimeString()}
                        </span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-wrap items-center gap-3">
                    <div className="bg-bg-surface/50 border border-bg-border rounded-2xl p-1 flex items-center shadow-lg">
                        {['7d', '30d', '90d'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all ${period === p ? 'bg-purple-vivid text-white shadow-lg shadow-purple-vivid/20' : 'text-text-muted hover:text-white'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <GlowButton variant="ghost" onClick={handleExportCSV} icon={Download} className="px-6 py-3">EXPORT LEDGER</GlowButton>
                </motion.div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <UsageMetricCard title="System Throughput" value={summary?.totalRequests || 0} icon={Zap} trend="+12.4%" trendUp active />
                <UsageMetricCard title="Success Reliability" value={summary?.successRate || '0%'} icon={CheckCircle2} suffix="" trend="Optimal" trendUp />
                <UsageMetricCard title="Network Latency" value={summary?.avgResponseTime || 0} suffix="ms" icon={Clock} trend="-4ms" trendUp />
                <UsageMetricCard title="Active Endpoints" value={endpoints.length} icon={Globe} trend="Stable" />
            </div>

            {/* Main Chart */}
            <PurpleCard className="p-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-3 uppercase tracking-tight">
                            <TrendingUp className="w-5 h-5 text-purple-glow" />
                            Request Volume Analysis
                        </h3>
                        <p className="text-xs text-text-muted mt-1">Institutional traffic distribution across clusters</p>
                    </div>
                    {!loading && (
                        <div className="flex gap-8">
                            <div className="text-right">
                                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Peak Utilization</p>
                                <p className="text-xl font-bold text-text-primary font-mono">{Math.max(...chartData.map(d => d.success + d.error), 0)} REQ</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="h-[350px] w-full">
                    {loading ? (
                        <PurpleSkeleton className="w-full h-full rounded-2xl" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'rgba(155, 110, 255, 0.03)' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-bg-surface/90 border border-purple-vivid/20 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
                                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">{payload[0].payload.date}</p>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between gap-6">
                                                            <span className="text-xs text-success flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-success" /> Valid Requests
                                                            </span>
                                                            <span className="text-sm font-bold text-white">{payload[0].value}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-6">
                                                            <span className="text-xs text-danger flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-danger" /> Errors
                                                            </span>
                                                            <span className="text-sm font-bold text-white">{payload[1].value}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="success" stackId="a" fill="url(#purple-vivid-gradient)" radius={[0, 0, 0, 0]} barSize={24} />
                                <Bar dataKey="error" stackId="a" fill="rgba(239, 68, 68, 0.2)" radius={[6, 6, 0, 0]} barSize={24} />
                                <defs>
                                    <linearGradient id="purple-vivid-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--purple-vivid)" />
                                        <stop offset="100%" stopColor="var(--purple-mid)" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </PurpleCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance by Endpoint */}
                <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                    <div className="px-8 py-6 border-b border-bg-border/50 bg-purple-dim/5 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                            <Globe className="w-4 h-4 text-purple-glow" /> Cluster Performance
                        </h3>
                    </div>
                    <PurpleTable headers={["Endpoint Path", "Method", "Volume", "Latency"]}>
                        {loading ? <UsageTableSkeleton cols={4} /> : endpoints.map((ep, i) => (
                            <PurpleTableRow key={i}>
                                <td className="px-8 py-5">
                                    <code className="text-xs text-purple-glow bg-purple-glow/5 px-2 py-1 rounded border border-purple-glow/10">{ep.endpoint}</code>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${ep.method === 'POST' ? 'bg-success/10 text-success' : 'bg-purple-vivid/10 text-purple-vivid'}`}>
                                        {ep.method}
                                    </span>
                                </td>
                                <td className="px-8 py-5 font-bold text-text-primary text-sm">{ep.total}</td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <Clock className="w-3.5 h-3.5" /> {ep.avgDuration}ms
                                    </div>
                                </td>
                            </PurpleTableRow>
                        ))}
                    </PurpleTable>
                </PurpleCard>

                {/* API Key Intelligence */}
                <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                    <div className="px-8 py-6 border-b border-bg-border/50 bg-purple-dim/5 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                            <Key className="w-4 h-4 text-purple-glow" /> Credential Dynamics
                        </h3>
                    </div>
                    <PurpleTable headers={["Credential Identity", "Utilization", "Last Global Signal", "Status"]}>
                        {loading ? <UsageTableSkeleton cols={4} /> : apiKeys.map((key, i) => (
                            <PurpleTableRow key={i} className="cursor-pointer" onClick={() => setFilterKey(key.id || key.name)}>
                                <td className="px-8 py-5">
                                    <div className="text-sm font-bold text-text-primary">{key.name}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-sm font-mono text-purple-glow">{key.total} reqs</span>
                                </td>
                                <td className="px-8 py-5 text-xs text-text-muted">
                                    {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : '—'}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <PurpleBadge variant="success" pulse>ACTIVE</PurpleBadge>
                                </td>
                            </PurpleTableRow>
                        ))}
                    </PurpleTable>
                </PurpleCard>
            </div>

            {/* Live Stream Table */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-vivid/10 text-purple-vivid rounded-xl">
                            <FileJson className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Telemetry Stream</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3 bg-bg-surface/50 border border-bg-border rounded-2xl px-4 py-2">
                            <Filter className="w-4 h-4 text-text-muted" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent border-none text-xs font-bold uppercase tracking-widest text-text-secondary focus:ring-0 outline-none"
                            >
                                <option value="all">ALL SIGNALS</option>
                                <option value="200">200 SUCCESS</option>
                                <option value="400">4XX ERRORS</option>
                                <option value="500">5XX FAILURES</option>
                            </select>
                        </div>
                        <GlowButton variant="ghost" onClick={() => { setFilterKey('all'); setFilterStatus('all'); }} icon={RefreshCw} className="p-3" />
                    </div>
                </div>

                <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                    <PurpleTable headers={["Timestamp (UTC)", "Origin Key", "Request Context", "Result", "Duration"]}>
                        {logsLoading ? <UsageTableSkeleton cols={5} rows={10} /> : logs.length > 0 ? logs.map((log, i) => (
                            <PurpleTableRow key={i}>
                                <td className="px-8 py-4 text-[11px] font-mono text-text-muted">
                                    {(() => {
                                        const raw = log.timestamp || log.createdAt;
                                        if (!raw) return '—';
                                        const d = new Date(raw);
                                        if (isNaN(d.getTime())) return '—';
                                        return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC' }).toUpperCase();
                                    })()}
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2">
                                        <Key className="w-3 h-3 text-purple-glow" />
                                        <span className="text-xs font-bold text-text-secondary">{log.keyName}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex flex-col gap-1">
                                        <code className="text-[11px] text-text-primary font-bold">{log.endpoint}</code>
                                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{log.method}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <PurpleBadge
                                        variant={log.statusCode < 300 ? 'success' : 'danger'}
                                        pulse={log.statusCode >= 500}
                                        className="text-[10px]"
                                    >
                                        {log.statusCode} {log.statusCode < 300 ? 'OK' : 'FAIL'}
                                    </PurpleBadge>
                                </td>
                                <td className="px-8 py-4 text-right text-xs font-mono text-purple-glow">
                                    {log.durationMs}ms
                                </td>
                            </PurpleTableRow>
                        )) : (
                            <tr>
                                <td colSpan="5" className="py-32 text-center">
                                    <div className="w-20 h-20 bg-purple-dim/10 border border-purple-vivid/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Activity className="w-10 h-10 text-purple-glow/20" />
                                    </div>
                                    <h4 className="text-xl font-bold text-text-primary mb-2 tracking-tight">No telemetry signals found</h4>
                                    <p className="text-sm text-text-muted max-w-sm mx-auto">Adjust your filters or synchronization period to see historical usage logs.</p>
                                </td>
                            </tr>
                        )}
                    </PurpleTable>

                    {!logsLoading && pagination.totalPages > 1 && (
                        <div className="px-8 py-6 border-t border-bg-border/50 flex items-center justify-between bg-purple-dim/5">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                                Page {pagination.page} / {pagination.totalPages}
                            </span>
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={(p) => fetchLogs(p)}
                            />
                        </div>
                    )}
                </PurpleCard>
            </div>
        </div>
    );
}

function UsageMetricCard({ title, value, icon: Icon, trend, trendUp, loading, suffix = '', active }) {
    return (
        <PurpleCard className={`group relative overflow-hidden transition-all hover:bg-white/[0.02] ${active ? 'border-purple-vivid/40 shadow-[0_0_30px_rgba(155,110,255,0.05)]' : ''}`}>
            {active && <div className="absolute top-0 right-0 w-32 h-32 bg-purple-vivid/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />}

            <div className="flex items-center justify-between mb-8">
                <div className={`p-3 rounded-2xl ${active ? 'bg-purple-vivid/10 text-purple-vivid' : 'bg-purple-dim/20 text-purple-glow'} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${trendUp ? 'text-success' : 'text-danger'}`}>
                        {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {trend}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">{title}</p>
                <div className="text-3xl font-bold text-text-primary tracking-tight font-mono">
                    {loading ? (
                        <PurpleSkeleton className="h-9 w-24" />
                    ) : (
                        <>
                            <CountUp end={typeof value === 'string' ? parseFloat(value) : value} />
                            {suffix || (typeof value === 'string' && value.includes('%') ? '%' : '')}
                        </>
                    )}
                </div>
            </div>
        </PurpleCard>
    );
}

function UsageTableSkeleton({ cols, rows = 5 }) {
    return Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
            {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="px-8 py-5">
                    <PurpleSkeleton className={`h-4 ${j === 0 ? 'w-32' : 'w-16'}`} />
                </td>
            ))}
        </tr>
    ));
}
