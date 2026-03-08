"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Download, Search, SlidersHorizontal,
    Calendar, ArrowUpRight, CheckCircle2, XCircle,
    Clock, Activity, Key, Globe, ChevronRight,
    ArrowRight, Filter, AlertCircle, RefreshCw,
    FileJson, Table
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import Pagination from '@/components/Pagination';

export default function UsageDashboard() {
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
            console.error('Failed to fetch usage data:', error);
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
            console.error('Failed to fetch logs:', error);
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
        // Mock export functionality
        const headers = ['Timestamp', 'Key', 'Endpoint', 'Method', 'Status', 'Duration (ms)'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + logs.map(log => [
                log.timestamp,
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

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#4285F4]/10 border border-[#4285F4]/20">
                            <BarChart3 className="w-6 h-6 text-[#4285F4]" />
                        </div>
                        API Usage & Analytics
                    </h1>
                    <p className="text-[#9AA0A6] text-sm mt-1 flex items-center gap-2">
                        Comprehensive performance tracking and request logs • Last Sync: {lastSync.toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-[#1A1D24] border border-[#2C3038] rounded-lg p-1 flex items-center">
                        {['7d', '30d', '90d'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${period === p ? 'bg-[#3C4043] text-[#4285F4]' : 'text-[#9AA0A6] hover:text-white'}`}
                            >
                                {p === '7d' ? 'Last 7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1A1D24] border border-[#2C3038] hover:border-[#4285F4] text-white rounded-lg font-bold text-sm transition-all"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Requests" value={summary?.totalRequests || '0'} icon={Activity} loading={loading} />
                <MetricCard title="Success Rate" value={summary?.successRate || '0%'} icon={CheckCircle2} color={parseFloat(summary?.successRate) > 95 ? 'text-[#10B981]' : 'text-[#FBC02D]'} loading={loading} />
                <MetricCard title="Avg Latency" value={`${summary?.avgResponseTime || 0}ms`} icon={Clock} loading={loading} />
                <MetricCard title="Top Endpoint" value={summary?.mostUsedEndpoint || 'N/A'} icon={Globe} loading={loading} isSmall />
            </div>

            {/* Main Chart */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#4285F4]" /> Requests Over Time
                    </h3>
                </div>
                <div className="h-[300px] w-full">
                    {loading ? (
                        <div className="w-full h-full bg-[#1A1D24] animate-pulse rounded-lg" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#5F6368"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#5F6368"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: '#1A1D24', opacity: 0.5 }}
                                />
                                <Bar dataKey="success" stackId="a" fill="#4285F4" radius={[0, 0, 0, 0]} barSize={20} />
                                <Bar dataKey="error" stackId="a" fill="#F28B82" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Requests by Endpoint */}
                <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#161621]">
                        <h3 className="text-white text-xs font-bold uppercase tracking-widest">Performance by Endpoint</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                            <thead className="text-[#9AA0A6] text-[10px] uppercase font-bold tracking-tighter border-b border-[#1E1E2E]">
                                <tr>
                                    <th className="px-6 py-3">Endpoint</th>
                                    <th className="px-6 py-3">Method</th>
                                    <th className="px-6 py-3">Calls</th>
                                    <th className="px-6 py-3">Avg Latency</th>
                                    <th className="px-6 py-3 text-right">Success</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E1E2E]">
                                {loading ? <TableSkeleton cols={5} rows={4} /> : endpoints.map((ep, i) => (
                                    <tr key={i} className="hover:bg-[#161621] transition-all group">
                                        <td className="px-6 py-4 font-mono text-[#4285F4]">{ep.endpoint}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ep.method === 'POST' ? 'bg-[#10B981]/10 text-[#10B981]' : ep.method === 'GET' ? 'bg-[#4285F4]/10 text-[#4285F4]' : 'bg-[#2C3038] text-[#9AA0A6]'}`}>
                                                {ep.method}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">{ep.total}</td>
                                        <td className="px-6 py-4 text-[#9AA0A6]">{ep.avgDuration}ms</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold ${parseFloat(ep.successRate) > 95 ? 'text-[#10B981]' : 'text-[#FBC02D]'}`}>
                                                {ep.successRate}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* API Key Usage */}
                <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#161621]">
                        <h3 className="text-white text-xs font-bold uppercase tracking-widest">Usage by API Key</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                            <thead className="text-[#9AA0A6] text-[10px] uppercase font-bold tracking-tighter border-b border-[#1E1E2E]">
                                <tr>
                                    <th className="px-6 py-3">Security Key</th>
                                    <th className="px-6 py-3">Total Calls</th>
                                    <th className="px-6 py-3">Last Active</th>
                                    <th className="px-6 py-3 text-right">Success</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E1E2E]">
                                {loading ? <TableSkeleton cols={4} rows={4} /> : apiKeys.map((key, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => setFilterKey(key.id || key.name)}
                                        className="hover:bg-[#161621] transition-all group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="p-1.5 rounded bg-[#2C3038] text-[#9AA0A6]">
                                                <Key className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-white font-medium">{key.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-white">{key.total}</td>
                                        <td className="px-6 py-4 text-[#9AA0A6]">{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-[#10B981]">{key.successRate}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Request Logs */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#161621] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <FileJson className="w-4 h-4 text-[#4285F4]" /> Live Request Stream
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5F6368]" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-[#0A0A0F] border border-[#2C3038] rounded-lg pl-9 pr-6 py-1.5 text-[11px] text-[#E8EAED] outline-none hover:border-[#3C4043] appearance-none"
                            >
                                <option value="all">Status: All</option>
                                <option value="200">200 OK</option>
                                <option value="400">4xx Errors</option>
                                <option value="500">5xx Errors</option>
                            </select>
                        </div>
                        <button
                            onClick={() => { setFilterKey('all'); setFilterEndpoint('all'); setFilterStatus('all'); }}
                            className="p-1.5 text-[#5F6368] hover:text-white transition-colors"
                            title="Reset Filters"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px]">
                        <thead className="text-[#9AA0A6] text-[10px] uppercase font-bold tracking-tighter border-b border-[#1E1E2E]">
                            <tr>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">API Key</th>
                                <th className="px-6 py-3">Endpoint</th>
                                <th className="px-6 py-3">Method</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E1E2E]">
                            {logsLoading ? <TableSkeleton cols={6} rows={5} /> : logs.length > 0 ? logs.map((log, i) => (
                                <tr key={i} className="hover:bg-[#161621] transition-all group">
                                    <td className="px-6 py-4 text-[#5F6368] font-mono text-[11px]">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Key className="w-3 h-3 text-[#9AA0A6]" />
                                            <span className="text-[#E8EAED]">{log.keyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-mono">{log.endpoint}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[#9AA0A6] font-bold text-[11px]">{log.method}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${log.statusCode < 300 ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F28B82]/10 text-[#F28B82]'}`}>
                                            {log.statusCode} {log.statusCode < 300 ? 'OK' : 'Error'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-[#9AA0A6]">{log.durationMs}ms</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center opacity-40">
                                        <Search className="w-10 h-10 mx-auto mb-4" />
                                        <p className="text-sm">No usage logs found matching criteria</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {!logsLoading && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-[#1E1E2E] bg-[#161621] flex items-center justify-between">
                        <p className="text-[11px] text-[#5F6368]">
                            Showing <span className="text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-white">{pagination.total}</span> entries
                        </p>
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(p) => fetchLogs(p)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, loading, color = 'text-white', isSmall = false }) {
    return (
        <div className="bg-[#1A1D24] border border-[#2C3038] rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-[#3C4043] transition-all group relative overflow-hidden">
            <div className="text-[#9AA0A6] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 group-hover:text-[#4285F4] transition-colors" /> {title}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
                {loading ? (
                    <div className="h-8 w-24 bg-[#2C3038] rounded animate-pulse" />
                ) : (
                    <div className={`${isSmall ? 'text-lg font-mono truncate max-w-full' : 'text-2xl font-normal'} ${color} tracking-tight`}>
                        {value}
                    </div>
                )}
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const success = payload[0].value;
        const error = payload[1].value;
        const total = success + error;
        return (
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-3 shadow-2xl min-w-[160px]">
                <p className="text-[10px] text-[#9AA0A6] font-bold uppercase tracking-widest mb-2">{label}</p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] text-[#4285F4] flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#4285F4]"></div> Success
                        </span>
                        <span className="text-[11px] text-white font-bold">{success}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] text-[#F28B82] flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#F28B82]"></div> Error
                        </span>
                        <span className="text-[11px] text-white font-bold">{error}</span>
                    </div>
                    <div className="pt-1.5 border-t border-[#1E1E2E] mt-1.5 flex items-center justify-between">
                        <span className="text-[10px] text-[#9AA0A6] uppercase font-bold">Total</span>
                        <span className="text-[11px] text-white font-bold">{total}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

function TableSkeleton({ cols, rows }) {
    return Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
            {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="px-6 py-4">
                    <div className={`h-4 bg-[#1E1E2E] rounded ${j === 0 ? 'w-32' : 'w-16'}`} />
                </td>
            ))}
        </tr>
    ));
}
