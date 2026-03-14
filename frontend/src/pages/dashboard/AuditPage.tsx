/**
 * @file AuditPage.tsx
 * @description Comprehensive audit log page with real-time updates
 * Tracks all organizational activities with advanced filtering and analytics
 */

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Search,
  User,
  Key,
  Users,
  Globe,
  Info,
  Download,
  RotateCcw,
  Activity,
  CheckCircle2,
  XCircle,
  Lock,
  Webhook,
  Hash,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MapPin,
  AlertCircle,
  ShieldAlert,
  FileText
} from 'lucide-react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';


interface AuditLog {
  id: string;
  action: string;
  category: 'hash' | 'key' | 'member' | 'org' | 'webhook' | 'auth' | 'billing';
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  userId?: string;
  user?: {
    name?: string;
    email: string;
  };
}

interface AuditStats {
  total: number;
  last24h: number;
  byCategory: Array<{
    category: string;
    _count: { id: number };
  }>;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  hash: { icon: Hash, color: 'text-purple-400', bgColor: 'bg-purple-400/10 border-purple-400/20', label: 'Document' },
  key: { icon: Key, color: 'text-blue-400', bgColor: 'bg-blue-400/10 border-blue-400/20', label: 'API Key' },
  member: { icon: Users, color: 'text-green-400', bgColor: 'bg-green-400/10 border-green-400/20', label: 'Team' },
  org: { icon: Globe, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10 border-yellow-400/20', label: 'Organization' },
  webhook: { icon: Webhook, color: 'text-orange-400', bgColor: 'bg-orange-400/10 border-orange-400/20', label: 'Webhook' },
  auth: { icon: Lock, color: 'text-gray-400', bgColor: 'bg-gray-400/10 border-gray-400/20', label: 'Auth' },
  billing: { icon: Activity, color: 'text-pink-400', bgColor: 'bg-pink-400/10 border-pink-400/20', label: 'Billing' },
};

const ACTION_LABELS: Record<string, string> = {
  HASH_ANCHORED: 'Document Anchored',
  HASH_STAGED: 'Document Staged',
  HASH_REVOKED: 'Document Revoked',
  HASH_VERIFIED: 'Document Verified',
  HASH_EXPORTED: 'Data Exported',
  KEY_CREATED: 'API Key Created',
  KEY_DELETED: 'API Key Deleted',
  KEY_ROTATED: 'API Key Rotated',
  MEMBER_INVITED: 'Member Invited',
  MEMBER_JOINED: 'Member Joined',
  MEMBER_REMOVED: 'Member Removed',
  MEMBER_ROLE_CHANGED: 'Role Changed',
  INVITE_CANCELLED: 'Invite Cancelled',
  WEBHOOK_CREATED: 'Webhook Created',
  WEBHOOK_DELETED: 'Webhook Deleted',
  WEBHOOK_TESTED: 'Webhook Tested',
  LOGIN: 'User Login',
  LOGOUT: 'User Logout',
  PASSWORD_RESET: 'Password Reset',
  MFA_ENABLED: '2FA Enabled',
  MFA_DISABLED: '2FA Disabled',
  BILLING_UPDATED: 'Billing Updated',
  SUBSCRIPTION_CHANGED: 'Plan Changed',
  ORG_SETTINGS_UPDATED: 'Settings Updated',
};

const ACTION_ICONS: Record<string, React.ElementType> = {
  HASH_ANCHORED: CheckCircle2,
  HASH_STAGED: Clock,
  HASH_REVOKED: XCircle,
  KEY_CREATED: Key,
  KEY_DELETED: Key,
  MEMBER_INVITED: Users,
  MEMBER_JOINED: Users,
  MEMBER_REMOVED: Users,
  LOGIN: Lock,
  LOGOUT: Lock,
  WEBHOOK_CREATED: Webhook,
  WEBHOOK_DELETED: Webhook,
};

function formatTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}



export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    action: '',
    search: '',
    from: '',
    to: ''
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [newEntries, setNewEntries] = useState(0);

  const fetchLogs = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const query = new URLSearchParams({ page: String(page), limit: '50' });
      if (filters.category) query.set('category', filters.category);
      if (filters.action) query.set('action', filters.action);
      if (filters.from) query.set('from', filters.from);
      if (filters.to) query.set('to', filters.to);

      // Fetch logs
      const logsResponse = await api.get(`/api/audit?${query}`).catch((err) => {
        if (err?.response?.status === 403) {
          setIsAdmin(false);
          throw new Error('Admin access required to view audit logs');
        }
        throw err;
      });

      setIsAdmin(true);
      const responseData = logsResponse.data;
      const newLogs = responseData.logs || responseData.data || [];
      
      // Check for new entries in live mode
      if (silent && liveMode && logs.length > 0) {
        const currentIds = new Set(logs.map(l => l.id));
        const freshCount = newLogs.filter((l: AuditLog) => !currentIds.has(l.id)).length;
        if (freshCount > 0) setNewEntries(prev => prev + freshCount);
      }
      
      setLogs(newLogs);
      setTotal(responseData.total || 0);
      setPages(responseData.pages || 1);

      // Fetch stats separately - don't fail if this errors
      try {
        const statsResponse = await api.get('/api/audit/stats');
        setStats(statsResponse.data);
      } catch (statsErr) {
        console.log('Stats fetch failed:', statsErr);
        // Don't fail the whole request if stats fail
        setStats({ total: responseData.total || 0, last24h: 0, byCategory: [] });
      }

    } catch (err: any) {
      console.error('Audit fetch error:', err);
      const errorMessage = err?.response?.data?.error || err.message || 'Failed to fetch audit logs';
      setError(errorMessage);
      if (!silent) toast.error(errorMessage);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [page, filters, liveMode, logs.length]);

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Real-time polling
  useEffect(() => {
    if (!liveMode || isAdmin === false) return;
    const interval = setInterval(() => fetchLogs(true), 10000);
    return () => clearInterval(interval);
  }, [liveMode, fetchLogs, isAdmin]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ category: '', action: '', search: '', from: '', to: '' });
    setPage(1);
  };

  const loadNewEntries = () => {
    setNewEntries(0);
    fetchLogs();
  };

  const exportLogs = () => {
    if (logs.length === 0) {
      toast.error('No logs to export');
      return;
    }

    const data = logs.map(log => ({
      Timestamp: log.createdAt,
      Action: ACTION_LABELS[log.action] || log.action,
      Category: log.category,
      User: log.user?.email || 'System',
      IP: log.ipAddress || 'N/A',
      Metadata: JSON.stringify(log.metadata)
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Audit logs exported');
  };

  const filteredLogs = logs.filter(log => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      (ACTION_LABELS[log.action] || log.action).toLowerCase().includes(searchLower) ||
      log.user?.email?.toLowerCase().includes(searchLower) ||
      log.category?.toLowerCase().includes(searchLower) ||
      JSON.stringify(log.metadata).toLowerCase().includes(searchLower)
    );
  });

  // Calculate category counts from actual logs if stats not available
  const categoryCounts = stats?.byCategory || [];
  const totalEvents = stats?.total || total || 0;
  const last24hEvents = stats?.last24h || 0;

  // If not admin, show access denied
  if (isAdmin === false) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-sipheron-text-primary flex items-center gap-3">
              <ClipboardList className="w-7 h-7 text-sipheron-purple" />
              Audit Trail
            </h1>
            <p className="text-sm text-sipheron-text-muted mt-1">
              Comprehensive log of all organizational activities and cryptographic operations.
            </p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-sipheron-text-primary mb-2">Admin Access Required</h3>
          <p className="text-sipheron-text-muted max-w-md mx-auto">
            The audit trail is only accessible to organization administrators. 
            Contact your organization admin if you need access to audit logs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sipheron-text-primary flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-sipheron-purple" />
            Audit Trail
          </h1>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Comprehensive log of all organizational activities and cryptographic operations.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Mode Toggle */}
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
              liveMode
                ? 'bg-sipheron-green/10 border-sipheron-green/30 text-sipheron-green'
                : 'bg-white/[0.03] border-white/[0.06] text-sipheron-text-muted'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${liveMode ? 'bg-sipheron-green animate-pulse' : 'bg-sipheron-text-muted'}`} />
            {liveMode ? 'Live' : 'Paused'}
          </button>

          <div className="text-right">
            <p className="text-2xl font-mono font-bold text-sipheron-text-primary">
              {loading ? '...' : totalEvents.toLocaleString()}
            </p>
            <p className="text-xs text-sipheron-text-muted uppercase tracking-wider">Total Events</p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* New Entries Banner */}
      <AnimatePresence>
        {newEntries > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-sipheron-purple/10 border border-sipheron-purple/30 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-sipheron-purple animate-spin" />
              <span className="text-sm text-sipheron-text-primary">
                {newEntries} new {newEntries === 1 ? 'event' : 'events'} detected
              </span>
            </div>
            <Button
              onClick={loadNewEntries}
              size="sm"
              className="bg-sipheron-purple hover:bg-sipheron-purple/90 text-white"
            >
              Load Now
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-sipheron-surface border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-sipheron-purple/10 rounded-xl">
            <Activity className="w-5 h-5 text-sipheron-purple" />
          </div>
          <div>
            <p className="text-xl font-bold text-sipheron-text-primary font-mono">{loading ? '...' : last24hEvents}</p>
            <p className="text-xs text-sipheron-text-muted">Last 24h</p>
          </div>
        </div>

        {categoryCounts.slice(0, 3).map((cat: any) => {
          const config = CATEGORY_CONFIG[cat.category] || CATEGORY_CONFIG.auth;
          const Icon = config.icon;
          return (
            <div key={cat.category} className="bg-sipheron-surface border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${config.bgColor}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-sipheron-text-primary font-mono">
                  {cat._count?.id || cat._count || 0}
                </p>
                <p className="text-xs text-sipheron-text-muted">{config.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-sipheron-surface border border-white/[0.06] rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sipheron-text-muted" />
              <Input
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 bg-white/[0.03] border-white/[0.06]"
              />
            </div>
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-sipheron-text-primary focus:border-sipheron-purple focus:ring-1 focus:ring-sipheron-purple/20"
          >
            <option value="">All Categories</option>
            <option value="hash">Document</option>
            <option value="key">API Key</option>
            <option value="member">Team</option>
            <option value="org">Organization</option>
            <option value="webhook">Webhook</option>
            <option value="auth">Auth</option>
            <option value="billing">Billing</option>
          </select>

          {/* Action */}
          <select
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-sipheron-text-primary focus:border-sipheron-purple focus:ring-1 focus:ring-sipheron-purple/20"
          >
            <option value="">All Actions</option>
            {Object.entries(ACTION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Date From */}
          <input
            type="date"
            value={filters.from}
            onChange={(e) => handleFilterChange('from', e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-sipheron-text-primary focus:border-sipheron-purple focus:ring-1 focus:ring-sipheron-purple/20"
          />

          {/* Reset & Export */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="flex-1 border-white/[0.06] text-sipheron-text-muted"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={exportLogs}
              disabled={logs.length === 0}
              className="flex-1 border-white/[0.06] text-sipheron-text-muted"
              size="sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-sipheron-surface border border-white/[0.06] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <RefreshCw className="w-8 h-8 text-sipheron-purple animate-spin" />
            <p className="text-sm text-sipheron-text-muted">Loading audit trail...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-400/60" />
            </div>
            <h3 className="text-lg font-semibold text-sipheron-text-primary mb-1">Unable to load audit logs</h3>
            <p className="text-sm text-sipheron-text-muted">{error}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-sipheron-purple/10 border border-sipheron-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-sipheron-purple/40" />
            </div>
            <h3 className="text-lg font-semibold text-sipheron-text-primary mb-1">No events found</h3>
            <p className="text-sm text-sipheron-text-muted max-w-md mx-auto">
              {logs.length === 0 
                ? "No audit events have been recorded yet. Activities like anchoring documents, creating API keys, or inviting team members will appear here."
                : "Try adjusting your filters or search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filteredLogs.map((log, index) => {
              const config = CATEGORY_CONFIG[log.category] || CATEGORY_CONFIG.auth;
              const Icon = ACTION_ICONS[log.action] || config.icon;
              const isExpanded = expanded === log.id;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`p-4 hover:bg-white/[0.02] cursor-pointer transition-all ${isExpanded ? 'bg-sipheron-purple/[0.02]' : ''}`}
                  onClick={() => setExpanded(isExpanded ? null : log.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2.5 rounded-xl border shrink-0 ${config.bgColor}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-sipheron-text-primary">
                          {ACTION_LABELS[log.action] || log.action}
                        </h4>
                        <Badge variant="secondary" className={`text-[10px] ${config.bgColor} ${config.color} border-0`}>
                          {config.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sipheron-text-muted">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.user?.name || log.user?.email || 'System'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(log.createdAt)}
                        </span>
                        {log.ipAddress && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {log.ipAddress}
                          </span>
                        )}
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 space-y-3">
                              {/* Metadata */}
                              {log.metadata && Object.keys(log.metadata).length > 0 && (
                                <div className="p-3 bg-black/40 rounded-lg border border-white/[0.06]">
                                  <p className="text-[10px] text-sipheron-text-muted uppercase tracking-wider mb-2">Metadata</p>
                                  <pre className="text-xs font-mono text-sipheron-teal/80 whitespace-pre-wrap overflow-x-auto">
                                    {JSON.stringify(log.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {/* Technical Details */}
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                                  <p className="text-sipheron-text-muted mb-1">Event ID</p>
                                  <p className="font-mono text-sipheron-text-primary truncate">{log.id}</p>
                                </div>
                                <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                                  <p className="text-sipheron-text-muted mb-1">User Agent</p>
                                  <p className="font-mono text-sipheron-text-primary truncate">{log.userAgent || 'N/A'}</p>
                                </div>
                                <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                                  <p className="text-sipheron-text-muted mb-1">Timestamp</p>
                                  <p className="font-mono text-sipheron-text-primary">{new Date(log.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                                  <p className="text-sipheron-text-muted mb-1">Category</p>
                                  <p className="font-mono text-sipheron-text-primary capitalize">{log.category}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Expand Indicator */}
                    <div className="text-sipheron-text-muted">
                      {isExpanded ? <ChevronLeft className="w-4 h-4 rotate-90" /> : <ChevronLeft className="w-4 h-4 -rotate-90" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pages > 1 && (
          <div className="p-4 border-t border-white/[0.06] flex items-center justify-between">
            <p className="text-sm text-sipheron-text-muted">
              Showing {logs.length} of {total} events
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-white/[0.06]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-sipheron-text-muted px-2">
                Page {page} of {pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="border-white/[0.06]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditPage;
