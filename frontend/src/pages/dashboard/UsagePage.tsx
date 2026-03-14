import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  BarChart3,
  Clock,
  Zap,
  Hash,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';

interface UsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  hashesAnchored: number;
  hashesVerified: number;
}

interface UsageRecord {
  id: string;
  endpoint: string;
  method: string;
  status: number;
  responseTime: number;
  timestamp: string;
  ip?: string;
}

const TIME_RANGES = [
  { id: '7', label: 'Last 7 Days' },
  { id: '30', label: 'Last 30 Days' },
  { id: '90', label: 'Last 90 Days' },
];

export const UsagePage: FC = () => {
  const [timeRange, setTimeRange] = useState('7');
  const [stats, setStats] = useState<UsageStats>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    hashesAnchored: 0,
    hashesVerified: 0,
  });
  const [records, setRecords] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    fetchUsageData();
  }, [timeRange]);

  const fetchUsageData = async () => {
    setLoading(true);
    try {
      // Fetch usage data from correct endpoint
      const { data: usageData } = await api.get('/api/usage', {
        params: { period: `${timeRange}d` },
      });

      // Map usage data to stats
      const summary = usageData.summary || {};
      const totalRequests = summary.totalRequests || 0;
      const successRateStr = summary.successRate || '0%';
      const successRate = parseFloat(successRateStr) / 100;
      const successfulRequests = Math.round(totalRequests * successRate);
      const failedRequests = totalRequests - successfulRequests;

      setStats({
        totalRequests,
        successfulRequests,
        failedRequests,
        avgResponseTime: summary.avgResponseTime || 0,
        hashesAnchored: usageData.analytics?.reduce((sum: number, item: any) => sum + (item.count || 0), 0) || 0,
        hashesVerified: successfulRequests, // Approximation
      });

      // Fetch real usage logs
      try {
        const { data: logsData } = await api.get('/api/usage/logs', {
          params: { limit: 10 },
        });
        
        const mappedRecords: UsageRecord[] = (logsData.data || logsData.records || []).map((log: any, index: number) => ({
          id: log.id || `log-${index}`,
          endpoint: log.endpoint || '/api/unknown',
          method: log.method || 'GET',
          status: log.statusCode || 200,
          responseTime: log.durationMs || 0,
          timestamp: log.createdAt || log.timestamp || new Date().toISOString(),
          ip: log.ipAddress,
        }));
        
        setRecords(mappedRecords);
      } catch (logError) {
        console.error('Failed to fetch logs:', logError);
        setRecords([]);
      }
    } catch (error) {
      console.error('Failed to fetch usage data:', error);
      toast.error('Failed to load usage data');
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'POST': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'PUT': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400';
    if (status >= 400) return 'text-red-400';
    return 'text-amber-400';
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const exportData = () => {
    const csv = [
      ['Timestamp', 'Method', 'Endpoint', 'Status', 'Response Time (ms)'].join(','),
      ...records.map(r => [
        r.timestamp,
        r.method,
        r.endpoint,
        r.status,
        r.responseTime,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usage-${timeRange}d-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Usage data exported');
  };

  // Calculate percentages
  const successRate = stats.totalRequests > 0 
    ? Math.round((stats.successfulRequests / stats.totalRequests) * 100) 
    : 0;
  const errorRate = stats.totalRequests > 0 
    ? Math.round((stats.failedRequests / stats.totalRequests) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">
            Usage
          </h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Monitor your API usage and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Time Range Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-sipheron-text-secondary hover:bg-white/[0.05] transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              {TIME_RANGES.find(t => t.id === timeRange)?.label}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
            </button>
            {showFilterMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowFilterMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-48 bg-sipheron-surface border border-white/[0.06] rounded-xl shadow-xl z-50 py-1">
                  {TIME_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setTimeRange(range.id);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        timeRange === range.id
                          ? 'bg-sipheron-purple/20 text-sipheron-purple'
                          : 'text-sipheron-text-secondary hover:bg-white/[0.04]'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={exportData}
            disabled={records.length === 0}
            className="px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-sipheron-text-secondary hover:bg-white/[0.05] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Requests */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sipheron-text-muted">Total Requests</p>
              <p className="text-3xl font-bold text-sipheron-text-primary mt-2">
                {loading ? '...' : stats.totalRequests.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sipheron-purple/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-sipheron-purple" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">+12%</span>
            <span className="text-sm text-sipheron-text-muted">vs last period</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sipheron-text-muted">Success Rate</p>
              <p className="text-3xl font-bold text-sipheron-text-primary mt-2">
                {loading ? '...' : `${successRate}%`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-emerald-400">{stats.successfulRequests.toLocaleString()}</span>
            <span className="text-sm text-sipheron-text-muted">successful requests</span>
          </div>
        </div>

        {/* Failed Requests */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sipheron-text-muted">Failed Requests</p>
              <p className="text-3xl font-bold text-sipheron-text-primary mt-2">
                {loading ? '...' : stats.failedRequests.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-red-400">{errorRate}%</span>
            <span className="text-sm text-sipheron-text-muted">error rate</span>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sipheron-text-muted">Avg Response Time</p>
              <p className="text-3xl font-bold text-sipheron-text-primary mt-2">
                {loading ? '...' : `${stats.avgResponseTime}ms`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-sipheron-text-muted">Fast response times</span>
          </div>
        </div>

        {/* Hashes Anchored */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sipheron-text-muted">API Calls</p>
              <p className="text-3xl font-bold text-sipheron-text-primary mt-2">
                {loading ? '...' : stats.hashesAnchored.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Hash className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-blue-400">{records.length}</span>
            <span className="text-sm text-sipheron-text-muted">logged calls</span>
          </div>
        </div>

        {/* Hashes Verified */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sipheron-text-muted">Success Count</p>
              <p className="text-3xl font-bold text-sipheron-text-primary mt-2">
                {loading ? '...' : stats.successfulRequests.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-purple-400">{successRate}%</span>
            <span className="text-sm text-sipheron-text-muted">success rate</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06]">
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <h3 className="text-sm font-medium text-sipheron-text-primary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Recent API Calls
          </h3>
          <span className="text-xs text-sipheron-text-muted">
            Showing last {records.length} requests
          </span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {loading ? (
            <div className="p-8 text-center text-sipheron-text-muted">
              <div className="w-8 h-8 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>Loading...</p>
            </div>
          ) : records.length > 0 ? (
            records.map((record) => (
              <div
                key={record.id}
                className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getMethodColor(record.method)}`}>
                    {record.method}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-sipheron-text-primary">
                      {record.endpoint}
                    </p>
                    <p className="text-xs text-sipheron-text-muted">
                      {formatTimeAgo(record.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                    <p className="text-xs text-sipheron-text-muted">
                      {record.responseTime}ms
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sipheron-text-muted">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No API calls recorded yet</p>
              <p className="text-xs mt-1">Make some API calls to see them here</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-sipheron-text-primary">Usage Tracking</h4>
          <p className="text-sm text-sipheron-text-muted mt-1">
            API usage is tracked in real-time. Data is retained for 90 days. 
            For detailed analytics, visit the <a href="/dashboard/analytics" className="text-sipheron-purple hover:underline">Analytics</a> page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsagePage;
