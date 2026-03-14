import React, { useState, useEffect, useCallback } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  RefreshCw,
  Clock,
  Zap,
  Activity,
  BarChart3,
  Layers,
  AlertCircle
} from 'lucide-react';
import { CountUp } from '@/components/shared';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import api from '@/utils/api';
import { toast } from 'sonner';

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  trend?: number;
  trendLabel?: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix = '',
  prefix = '',
  trend,
  trendLabel,
  loading = false,
  icon,
}) => {
  const isPositive = (trend || 0) >= 0;
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (loading) {
    return (
      <div className="bg-sipheron-surface rounded-xl p-4 border border-white/[0.06]">
        <LoadingSkeleton variant="text-line" width="60%" className="mb-2" />
        <LoadingSkeleton variant="text-line" width="40%" className="h-8" />
      </div>
    );
  }

  return (
    <div className="bg-sipheron-surface rounded-xl p-4 border border-white/[0.06] hover:border-sipheron-purple/20 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-sipheron-text-muted mb-1">{title}</div>
          <div className="text-xl font-bold text-sipheron-text-primary">
            {prefix}
            <CountUp end={numericValue} suffix={suffix} decimals={value.toString().includes('.') ? 1 : 0} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs mt-1 ${isPositive ? 'text-sipheron-green' : 'text-sipheron-red'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{trend}%
              {trendLabel && <span className="text-sipheron-text-muted ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-sipheron-purple/10 text-sipheron-purple">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// Format date for display
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format relative time
const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMins < 1) return 'just now';
  if (diffInMins < 60) return `${diffInMins} min ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Truncate hash for display
const truncateHash = (hash: string): string => {
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
};

// Calculate trend from two values
const calculateTrend = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('7');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Data states
  const [orgStats, setOrgStats] = useState<any>(null);
  const [analyticsStats, setAnalyticsStats] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [hashes, setHashes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data
  const fetchData = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel - using correct endpoints
      const [orgStatsRes, analyticsRes, usageRes, hashesRes] = await Promise.all([
        api.get('/api/org/stats').catch(() => null),
        api.get('/analytics/stats').catch(() => null),
        api.get(`/api/usage?period=${dateRange}d`).catch(() => null),
        api.get('/api/hashes?limit=10').catch(() => null)
      ]);

      setOrgStats(orgStatsRes?.data || null);
      setAnalyticsStats(analyticsRes?.data || null);
      setUsageData(usageRes?.data || null);
      
      // Extract hashes from response
      const hashData = hashesRes?.data;
      if (hashData?.data || hashData?.records) {
        setHashes(hashData.data || hashData.records);
      }
      
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to load analytics data');
      if (!isBackground) toast.error('Failed to load analytics data. Please try again.');
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [dateRange]);

  // Fetch data on mount and when date range changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // Calculate stats values
  const totalAnchors = orgStats?.stats?.totalAnchors || analyticsStats?.totalHashes || 0;
  const revokedAnchors = orgStats?.stats?.revokedAnchors || analyticsStats?.revokedHashes || 0;
  const activeAnchors = orgStats?.stats?.activeAnchors || (totalAnchors - revokedAnchors);
  const activeRate = totalAnchors > 0 ? ((activeAnchors / totalAnchors) * 100) : 100;
  
  // Get usage stats
  const totalRequests = usageData?.summary?.totalRequests || 0;
  const successRate = usageData?.summary?.successRate || '0%';
  const avgResponseTime = usageData?.summary?.avgResponseTime || 0;
  
  // Get chart data
  const volumeData = usageData?.chartData?.map((item: any) => ({
    date: formatDate(item.date),
    count: item.success + item.error,
    success: item.success,
    error: item.error,
  })) || [];

  const analyticsData = usageData?.analytics || [];
  const periodAnchors = analyticsData.reduce((sum: number, item: any) => sum + (item.count || 0), 0);
  const avgDaily = analyticsData.length > 0 ? Math.round(periodAnchors / analyticsData.length) : 0;
  const peakDay = analyticsData.length > 0 ? Math.max(...analyticsData.map((item: any) => item.count || 0)) : 0;

  // API endpoints data
  const endpoints = usageData?.endpoints || [];
  const apiKeys = usageData?.apiKeys || [];

  // Calculate trends (mock previous period for now)
  const totalAnchorsTrend = 0;
  const periodAnchorsTrend = 0;
  const avgDailyTrend = 0;
  const peakDayTrend = 0;

  // Export data to JSON
  const exportData = () => {
    const exportObj = {
      summary: {
        'Total Anchors': totalAnchors,
        'Active Anchors': activeAnchors,
        'Revoked Anchors': revokedAnchors,
        'Active Rate': `${activeRate.toFixed(1)}%`,
        'Total API Requests': totalRequests,
        'Success Rate': successRate,
        'Avg Response Time': `${avgResponseTime}ms`,
      },
      dailyBreakdown: analyticsData,
      topEndpoints: endpoints.slice(0, 10),
      apiKeyUsage: apiKeys,
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics data exported successfully');
  };

  // Export documents to CSV
  const exportDocuments = () => {
    if (hashes.length === 0) {
      toast.error('No documents to export');
      return;
    }

    const csv = [
      ['Hash', 'Metadata', 'Status', 'Registered At'].join(','),
      ...hashes.map((doc: any) => [
        doc.hash,
        `"${(doc.metadata || '').replace(/"/g, '""')}"`,
        doc.status || 'active',
        doc.registeredAt || doc.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documents-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Documents exported successfully');
  };

  // Default hourly data
  const hourlyData = [
    { hour: '12am', anchors: 0 },
    { hour: '2am', anchors: 0 },
    { hour: '4am', anchors: 0 },
    { hour: '6am', anchors: 0 },
    { hour: '8am', anchors: 0 },
    { hour: '10am', anchors: 0 },
    { hour: '12pm', anchors: 0 },
    { hour: '2pm', anchors: 0 },
    { hour: '4pm', anchors: 0 },
    { hour: '6pm', anchors: 0 },
    { hour: '8pm', anchors: 0 },
    { hour: '10pm', anchors: 0 },
  ];

  // Funnel data
  const funnelData = [
    { stage: 'Staged', count: totalAnchors + 5, color: '#6C63FF' },
    { stage: 'Anchored', count: totalAnchors, color: '#4ECDC4' },
    { stage: 'Active', count: activeAnchors, color: '#00D97E' },
  ];

  // API key data for pie chart
  const apiKeyData = apiKeys.length > 0 
    ? apiKeys.slice(0, 4).map((key: any, index: number) => ({
        name: key.name || `Key ${index + 1}`,
        value: key.total || 0,
        color: ['#6C63FF', '#4ECDC4', '#FFD93D', '#FF6B35'][index % 4],
      }))
    : [
        { name: 'No Data', value: 100, color: '#44445A' },
      ];

  // Weekly data
  const weeklyData = [
    { day: 'Mon', thisWeek: 0, lastWeek: 0 },
    { day: 'Tue', thisWeek: 0, lastWeek: 0 },
    { day: 'Wed', thisWeek: 0, lastWeek: 0 },
    { day: 'Thu', thisWeek: 0, lastWeek: 0 },
    { day: 'Fri', thisWeek: 0, lastWeek: 0 },
    { day: 'Sat', thisWeek: 0, lastWeek: 0 },
    { day: 'Sun', thisWeek: 0, lastWeek: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">Analytics</h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Deep insights into your document anchoring activity
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              autoRefresh 
                ? 'bg-sipheron-green/10 text-sipheron-green border border-sipheron-green/30' 
                : 'bg-sipheron-surface border border-white/[0.06] text-sipheron-text-secondary'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{autoRefresh ? 'Auto' : 'Manual'}</span>
          </button>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary text-sm focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all disabled:opacity-50"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <button 
            onClick={() => fetchData()}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.03] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button 
            onClick={exportData}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.03] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Last updated indicator */}
      <div className="flex items-center gap-2 text-xs text-sipheron-text-muted">
        <Clock className="w-3 h-3" />
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="Total Anchors" 
          value={totalAnchors} 
          trend={totalAnchorsTrend} 
          trendLabel="vs last period" 
          loading={loading}
          icon={<Layers className="w-4 h-4" />}
        />
        <StatCard 
          title="Period Anchors" 
          value={periodAnchors} 
          trend={periodAnchorsTrend} 
          trendLabel="vs last period" 
          loading={loading}
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <StatCard 
          title="Avg Daily" 
          value={avgDaily} 
          trend={avgDailyTrend} 
          trendLabel="vs last period" 
          loading={loading}
          icon={<Activity className="w-4 h-4" />}
        />
        <StatCard 
          title="Peak Day" 
          value={peakDay} 
          trend={peakDayTrend} 
          trendLabel="vs last period" 
          loading={loading}
          icon={<Zap className="w-4 h-4" />}
        />
        <StatCard 
          title="Active Rate" 
          value={Math.round(activeRate)} 
          suffix="%" 
          loading={loading}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard 
          title="API Requests" 
          value={totalRequests} 
          loading={loading}
          icon={<FileText className="w-4 h-4" />}
        />
      </div>

      {/* Large Line Chart */}
      <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-sipheron-text-primary">
              API Usage Volume
            </h3>
            <p className="text-xs text-sipheron-text-muted">Requests over time</p>
          </div>
          <div className="flex items-center gap-4">
            {volumeData[0]?.success !== undefined && (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-sipheron-green" />
                  <span className="text-xs text-sipheron-text-secondary">Success</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-sipheron-red" />
                  <span className="text-xs text-sipheron-text-secondary">Error</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#6C63FF' }} />
              <span className="text-xs text-sipheron-text-secondary">Total</span>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="h-72">
            <LoadingSkeleton variant="chart" className="h-full" />
          </div>
        ) : volumeData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D97E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D97E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="date"
                  stroke="#44445A"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#44445A"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0D0D1A',
                    border: '1px solid rgba(108,99,255,0.3)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#8888AA' }}
                  itemStyle={{ color: '#F0F0FF' }}
                />
                {volumeData[0]?.success !== undefined && (
                  <Area 
                    type="monotone" 
                    dataKey="success" 
                    stroke="#00D97E" 
                    fillOpacity={1} 
                    fill="url(#colorSuccess)" 
                    strokeWidth={2}
                  />
                )}
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6C63FF" 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-sipheron-text-muted">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No data available for the selected period</p>
            </div>
          </div>
        )}
      </div>

      {/* Three Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Distribution */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Hourly Distribution
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">When you anchor most</p>
          {loading ? (
            <div className="h-48">
              <LoadingSkeleton variant="chart" className="h-full" />
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    stroke="#44445A"
                    fontSize={8}
                    tickLine={false}
                    axisLine={false}
                    interval={2}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: '#0D0D1A',
                      border: '1px solid rgba(108,99,255,0.3)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#8888AA' }}
                    itemStyle={{ color: '#F0F0FF' }}
                  />
                  <Bar dataKey="anchors" fill="#6C63FF" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Status Funnel */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Status Funnel
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">Staged → Anchored → Active</p>
          {loading ? (
            <div className="space-y-3">
              <LoadingSkeleton variant="text-line" className="h-6" />
              <LoadingSkeleton variant="text-line" className="h-6" />
              <LoadingSkeleton variant="text-line" className="h-6" />
            </div>
          ) : (
            <div className="space-y-3">
              {funnelData.map((item, index) => (
                <div key={item.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-sipheron-text-secondary">{item.stage}</span>
                    <span className="text-sipheron-text-primary font-medium">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-6 rounded-md bg-white/[0.03] overflow-hidden relative">
                    <div
                      className="h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2"
                      style={{
                        width: `${funnelData[0].count > 0 ? (item.count / funnelData[0].count) * 100 : 0}%`,
                        background: item.color,
                      }}
                    >
                      <span className="text-[10px] text-white/80">
                        {funnelData[0].count > 0 ? Math.round((item.count / funnelData[0].count) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  {index < funnelData.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className="text-sipheron-text-muted text-xs">↓</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Endpoints */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            API Usage
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">By endpoint</p>
          {loading ? (
            <div className="space-y-3">
              <LoadingSkeleton variant="text-line" className="h-4" />
              <LoadingSkeleton variant="text-line" className="h-4" />
              <LoadingSkeleton variant="text-line" className="h-4" />
              <LoadingSkeleton variant="text-line" className="h-4" />
              <LoadingSkeleton variant="text-line" className="h-4" />
            </div>
          ) : endpoints.length > 0 ? (
            <div className="space-y-3">
              {endpoints.slice(0, 5).map((endpoint: any, index: number) => {
                const colors = ['#6C63FF', '#4ECDC4', '#FFD93D', '#FF6B35', '#44445A'];
                const maxCount = Math.max(...endpoints.map((e: any) => e.total || 0), 1);
                return (
                  <div key={endpoint.endpoint || index}>
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: colors[index % colors.length] }}
                      />
                      <span className="text-sm text-sipheron-text-secondary flex-1 truncate">{endpoint.endpoint}</span>
                      <span className="text-sm text-sipheron-text-primary font-medium">{(endpoint.total || 0).toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden ml-4">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${((endpoint.total || 0) / maxCount) * 100}%`,
                          background: colors[index % colors.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-sipheron-text-muted">
              <p className="text-sm">No endpoint data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Two Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Key Usage */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            API Key Usage Breakdown
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">By API key</p>
          {loading ? (
            <div className="flex items-center gap-8">
              <LoadingSkeleton variant="circle" width={160} height={160} />
              <div className="flex-1 space-y-3">
                <LoadingSkeleton variant="text-line" />
                <LoadingSkeleton variant="text-line" />
                <LoadingSkeleton variant="text-line" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={apiKeyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {apiKeyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {apiKeyData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span className="text-sm text-sipheron-text-secondary flex-1 truncate">{item.name}</span>
                    <span className="text-sm text-sipheron-text-primary font-medium">{item.value}{apiKeys.length > 0 ? '' : '%'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Weekly Trend */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Weekly Trend
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">This week vs last week</p>
          {loading ? (
            <div className="h-48">
              <LoadingSkeleton variant="chart" className="h-full" />
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis
                    dataKey="day"
                    stroke="#44445A"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#44445A"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0D0D1A',
                      border: '1px solid rgba(108,99,255,0.3)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#8888AA' }}
                    itemStyle={{ color: '#F0F0FF' }}
                  />
                  <Legend />
                  <Bar dataKey="thisWeek" name="This Week" fill="#6C63FF" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="lastWeek" name="Last Week" fill="#44445A" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Top Documents Table */}
      <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-sipheron-text-primary">
              Recent Documents
            </h3>
            <p className="text-xs text-sipheron-text-muted">
              Latest anchored documents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={exportDocuments}
              disabled={hashes.length === 0}
              className="text-xs text-sipheron-purple hover:text-sipheron-teal transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/hashes'}
              className="text-xs text-sipheron-purple hover:text-sipheron-teal transition-colors"
            >
              View all →
            </button>
          </div>
        </div>
        {loading ? (
          <div className="p-4">
            <LoadingSkeleton variant="table-row" count={5} />
          </div>
        ) : hashes.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {hashes.slice(0, 5).map((doc: any) => (
              <div key={doc.hash} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${doc.status === 'active' ? 'bg-sipheron-green' : doc.status === 'revoked' ? 'bg-sipheron-red' : 'bg-sipheron-yellow'}`} />
                  <div>
                    <p className="text-sm text-sipheron-text-primary font-mono">{truncateHash(doc.hash)}</p>
                    <p className="text-xs text-sipheron-text-muted">{doc.metadata || 'No metadata'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-sipheron-text-secondary capitalize">{doc.status || 'active'}</p>
                  <p className="text-xs text-sipheron-text-muted">{formatRelativeTime(doc.registeredAt || doc.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sipheron-text-muted">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
