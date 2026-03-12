'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/utils/api';
import { 
    ClipboardList, Filter, Search, ChevronDown, 
    Calendar, User as UserIcon, Shield, Key as KeyIcon, 
    Zap, Users, Activity, Globe, Info, Download,
    RotateCcw
} from 'lucide-react';
import { 
    PurpleCard, GlowButton, PurpleBadge, 
    PurpleTable, PurpleTableRow, PurpleSkeleton 
} from '@/components/ui/PurpleUI';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_COLORS = {
    hash: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    key: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    member: 'text-green-400 bg-green-400/10 border-green-400/20',
    org: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    webhook: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    auth: 'text-gray-400 bg-gray-400/10 border-gray-400/20'
};

const ACTION_LABELS = {
    HASH_ANCHORED: 'Hash Anchored',
    HASH_STAGED: 'Hash Staged',
    HASH_REVOKED: 'Hash Revoked',
    HASH_EXPORTED: 'Data Exported',
    KEY_CREATED: 'API Key Created',
    KEY_DELETED: 'API Key Deleted',
    MEMBER_INVITED: 'Member Invited',
    MEMBER_JOINED: 'Member Joined',
    MEMBER_REMOVED: 'Member Removed',
    MEMBER_ROLE_CHANGED: 'Role Changed',
    INVITE_CANCELLED: 'Invite Cancelled',
    WEBHOOK_CREATED: 'Webhook Created',
    WEBHOOK_DELETED: 'Webhook Deleted',
    LOGIN: 'Login',
    PASSWORD_RESET: 'Password Reset'
};

const CATEGORY_ICONS = {
    hash: Shield,
    key: KeyIcon,
    member: Users,
    org: Globe,
    webhook: Zap,
    auth: UserIcon
};

function formatTimeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AuditPage() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ category: '', action: '', from: '', to: '' });
    const [expanded, setExpanded] = useState(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ page, limit: 50 });
            if (filters.category) query.set('category', filters.category);
            if (filters.action) query.set('action', filters.action);
            if (filters.from) query.set('from', filters.from);
            if (filters.to) query.set('to', filters.to);

            const [logsRes, statsRes] = await Promise.allSettled([
                api.get(`/api/audit?${query}`),
                api.get('/api/audit/stats')
            ]);

            if (logsRes.status === 'fulfilled') {
                setLogs(logsRes.value.data.logs || []);
                setTotal(logsRes.value.data.total || 0);
                setPages(logsRes.value.data.pages || 1);
            }
            if (statsRes.status === 'fulfilled') {
                setStats(statsRes.value.data);
            }
        } catch (err) {
            console.error('Failed to fetch audit logs:', err);
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const resetFilters = () => {
        setFilters({ category: '', action: '', from: '', to: '' });
        setPage(1);
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2 flex items-center gap-4">
                        <ClipboardList className="w-8 h-8 text-purple-vivid" />
                        Institutional Audit Trail
                    </h1>
                    <p className="text-sm text-text-muted max-w-lg">
                        Tamper-proof record of all cryptographic maneuvers and administrative adjustments.
                    </p>
                </motion.div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-3xl font-mono font-bold text-text-primary tracking-tight">
                            {total.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Total Lifecycle Events</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <PurpleCard className="p-5 flex items-center gap-4 bg-purple-dim/5">
                    <div className="p-3 bg-purple-vivid/10 text-purple-vivid rounded-2xl">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-text-primary font-mono">{stats?.last24h || 0}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Activity (24H)</p>
                    </div>
                </PurpleCard>

                {stats?.byCategory?.slice(0, 3).map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.category] || Info;
                    return (
                        <PurpleCard key={cat.category} className="p-5 flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.auth}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-text-primary font-mono">{cat._count.id}</p>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none mt-1">
                                    {cat.category} Operations
                                </p>
                            </div>
                        </PurpleCard>
                    );
                })}
            </div>

            {/* Filters Bar */}
            <div className="bg-bg-surface/50 border border-bg-border rounded-2xl p-4 lg:p-6 backdrop-blur-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Context</label>
                        <select
                            value={filters.category}
                            onChange={e => handleFilterChange('category', e.target.value)}
                            className="w-full bg-black/40 border border-bg-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-purple-vivid transition-all"
                        >
                            <option value="">All Categories</option>
                            <option value="hash">Hash Management</option>
                            <option value="key">API Security</option>
                            <option value="member">Personnel</option>
                            <option value="org">Institutional</option>
                            <option value="webhook">Automations</option>
                            <option value="auth">Authentication</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Operation Type</label>
                        <select
                            value={filters.action}
                            onChange={e => handleFilterChange('action', e.target.value)}
                            className="w-full bg-black/40 border border-bg-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-purple-vivid transition-all"
                        >
                            <option value="">All Procedures</option>
                            {Object.entries(ACTION_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Temporal From</label>
                        <input
                            type="date"
                            value={filters.from}
                            onChange={e => handleFilterChange('from', e.target.value)}
                            className="w-full bg-black/40 border border-bg-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-purple-vivid transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Temporal To</label>
                        <input
                            type="date"
                            value={filters.to}
                            onChange={e => handleFilterChange('to', e.target.value)}
                            className="w-full bg-black/40 border border-bg-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-purple-vivid transition-all"
                        />
                    </div>

                    <div className="flex items-end">
                        <GlowButton 
                            variant="ghost" 
                            onClick={resetFilters} 
                            icon={RotateCcw} 
                            className="w-full h-[38px] text-[10px] uppercase font-bold tracking-widest"
                        >
                            Reset Sync
                        </GlowButton>
                    </div>
                </div>
            </div>

            {/* Audit Log Timeline */}
            <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <RotateCcw className="w-8 h-8 text-purple-vivid animate-spin" />
                        <p className="text-[10px] text-purple-glow font-bold uppercase tracking-[0.2em]">Synchronizing Audit Trail...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="w-20 h-20 bg-purple-dim/10 border border-purple-vivid/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Info className="w-10 h-10 text-purple-glow/20" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Zero Signals Found</h3>
                        <p className="text-text-muted text-sm max-w-sm mx-auto">No events matching your filters were identified in the organization's history.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-bg-border/30">
                        {logs.map((log) => {
                            const Icon = CATEGORY_ICONS[log.category] || Info;
                            const isExpanded = expanded === log.id;
                            
                            return (
                                <div 
                                    key={log.id}
                                    className={`px-6 lg:px-8 py-5 hover:bg-white/[0.02] cursor-pointer transition-all ${isExpanded ? 'bg-purple-vivid/[0.03]' : ''}`}
                                    onClick={() => setExpanded(isExpanded ? null : log.id)}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={`p-2.5 rounded-xl border shrink-0 transition-transform ${isExpanded ? 'scale-110' : ''} ${CATEGORY_COLORS[log.category] || CATEGORY_COLORS.auth}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <h4 className="text-sm font-bold text-text-primary leading-none">
                                                    {ACTION_LABELS[log.action] || log.action}
                                                </h4>
                                                <PurpleBadge variant="ghost" className="text-[9px] py-0 px-2 tracking-tighter uppercase font-bold">
                                                    {log.category}
                                                </PurpleBadge>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                                                    <UserIcon className="w-3 h-3" />
                                                    <span className="font-medium">{log.user?.name || log.user?.email || 'System Operation'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="font-mono">{formatTimeAgo(log.createdAt)}</span>
                                                </div>
                                                {log.ipAddress && (
                                                    <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                                                        <Globe className="w-3 h-3" />
                                                        <span className="font-mono">{log.ipAddress}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-5 space-y-4">
                                                            <div className="p-4 bg-black/40 border border-bg-border rounded-2xl">
                                                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3">Payload Details</p>
                                                                <pre className="text-xs font-mono text-purple-glow/80 whitespace-pre-wrap leading-relaxed">
                                                                    {JSON.stringify(log.metadata, null, 2)}
                                                                </pre>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[10px] text-text-muted font-bold uppercase tracking-tight">
                                                                <span>ID: {log.id}</span>
                                                                <span className="hidden sm:inline">|</span>
                                                                <span className="truncate max-w-[300px]">Agent: {log.userAgent}</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className={`shrink-0 mt-1 text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180 text-purple-vivid' : ''}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && pages > 1 && (
                    <div className="px-8 py-6 border-t border-bg-border/50 flex items-center justify-between bg-purple-dim/5">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                            Surface {page} of {pages} · {total} entries found
                        </span>
                        <div className="flex gap-3">
                            <GlowButton 
                                variant="ghost"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 text-[10px]"
                            >
                                BACK
                            </GlowButton>
                            <GlowButton 
                                variant="ghost"
                                disabled={page === pages}
                                onClick={() => setPage(p => Math.min(pages, p + 1))}
                                className="px-4 py-2 text-[10px]"
                            >
                                NEXT
                            </GlowButton>
                        </div>
                    </div>
                )}
            </PurpleCard>
        </div>
    );
}
