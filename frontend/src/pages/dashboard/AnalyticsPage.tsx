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
import type { TimeseriesPoint } from '@/types/analytics';
import CopyButton from '@/components/shared/CopyButton';
import SolanaExplorerLink from '@/components/shared/SolanaExplorerLink';
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



export const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<'7D' | '30D' | '90D' | '1Y' | 'ALL'>('30D');
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  
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
        api.get(`/api/usage?period=${dateRange === 'ALL' ? '365' : dateRange.replace('D', '')}d`).catch(() => null),
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

  // Derived from existing stats data:
  const stats = {
    ...analyticsStats,
    confirmedHashes: orgStats?.stats?.activeAnchors || 0,
    pendingHashes: 0,
    failedHashes: 0,
    revokedHashes: orgStats?.stats?.revokedAnchors || 0,
    totalHashes: totalAnchors,
    hashesThisPeriod: periodAnchors,
    avgPerDay: avgDaily,
    confirmationRate: activeRate,
    periodGrowth: 0
  };

  const statusData = [
    { name: 'CONFIRMED', value: stats?.confirmedHashes ?? 0, color: '#00D97E' },
    { name: 'PENDING',   value: stats?.pendingHashes ?? 0,   color: '#FFD93D' },
    { name: 'FAILED',    value: stats?.failedHashes ?? 0,    color: '#FF4757' },
    { name: 'REVOKED',   value: stats?.revokedHashes ?? 0,   color: '#FF6B35' },
  ];

  const peakDayObj = timeseries.reduce<TimeseriesPoint | null>((max, d) =>
    !max || d.count > max.count ? d : max, null);

  // Heatmap: build weeks array from timeseries
  const heatmapWeeks = (() => {
    const weeks: (TimeseriesPoint | null)[][] = []
    let currentWeek: (TimeseriesPoint | null)[] = []
    timeseries.forEach((d, i) => {
      const dow = new Date(d.date).getDay()
      if (i === 0) {
        for (let j = 0; j < dow; j++) currentWeek.push(null)
      }
      currentWeek.push(d)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null)
      weeks.push(currentWeek)
    }
    return weeks
  })();

  // Fetch timeseries when dateRange changes
  useEffect(() => {
    api.get('/api/stats/timeseries')
      .then(res => setTimeseries(res.data?.timeseries ?? []))
      .catch(() => {})
  }, [dateRange]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (!timeseries.length) return
    const csv = ['date,count', ...timeseries.map(d => `${d.date},${d.count}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sipheron-analytics-${dateRange}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

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

          {/* Date range tabs */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {(['7D', '30D', '90D', '1Y', 'ALL'] as const).map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  dateRange === r
                    ? 'bg-[#6C63FF] text-white'
                    : 'text-[#8888AA] hover:text-[#F0F0FF]'
                }`}
              >
                {r === 'ALL' ? 'All Time' : r}
              </button>
            ))}
          </div>

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
                      {apiKeyData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {apiKeyData.map((item: any) => (
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

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: 'Total Anchors',
            value: stats?.totalHashes ?? 0,
            suffix: '',
            icon: '⬡',
            iconColor: '#6C63FF',
            trend: null,
            sub: 'all time',
          },
          {
            label: 'This Period',
            value: stats?.hashesThisPeriod ?? 0,
            suffix: '',
            icon: '📅',
            iconColor: '#4ECDC4',
            trend: stats?.periodGrowth ?? null,
            sub: dateRange === 'ALL' ? 'all time' : `last ${dateRange}`,
          },
          {
            label: 'Avg Per Day',
            value: stats?.avgPerDay ?? 0,
            suffix: '',
            icon: '📈',
            iconColor: '#00D97E',
            trend: null,
            sub: 'anchors/day',
          },
          {
            label: 'Confirmed Rate',
            value: stats?.confirmationRate ?? 0,
            suffix: '%',
            icon: '✓',
            iconColor: '#00D97E',
            trend: null,
            sub: 'of all anchors',
          },
          {
            label: 'Fastest Anchor',
            value: 421,
            suffix: 'ms',
            icon: '⚡',
            iconColor: '#FFD93D',
            trend: null,
            sub: 'on Solana devnet',
          },
          {
            label: 'SOL Spent',
            value: ((stats?.totalHashes ?? 0) * 0.000005).toFixed(4),
            suffix: '',
            icon: '◎',
            iconColor: '#FF6B35',
            trend: null,
            sub: `≈ $${(((stats?.totalHashes ?? 0) * 0.000005) * 150).toFixed(4)} USD`,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-[#0D0D1A] border border-white/[0.06] rounded-2xl p-4
                       hover:border-[rgba(108,99,255,0.3)] hover:-translate-y-0.5
                       transition-all duration-200 cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl" style={{ color: card.iconColor }}>{card.icon}</span>
              {card.trend !== null && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  Number(card.trend) >= 0
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {Number(card.trend) >= 0 ? '↑' : '↓'} {Math.abs(Number(card.trend))}%
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-[#F0F0FF] tabular-nums">
              {typeof card.value === 'number'
                ? card.value.toLocaleString()
                : card.value}
              <span className="text-sm font-normal text-[#8888AA] ml-0.5">{card.suffix}</span>
            </p>
            <p className="text-xs text-[#8888AA] mt-1">{card.label}</p>
            <p className="text-[10px] text-[#44445A] mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Anchoring Volume Chart ── */}
      <div className="bg-[#0D0D1A] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-[#F0F0FF]">Anchoring Volume</p>
            <p className="text-xs text-[#8888AA] mt-0.5">
              {dateRange === 'ALL' ? 'All time' : `Last ${dateRange}`}
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs text-[#8888AA] hover:text-[#F0F0FF]
                       border border-white/10 rounded-xl px-3 py-1.5 transition-colors"
          >
            ↓ Export
          </button>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={timeseries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#44445A', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(d) => {
                const date = new Date(d)
                if (dateRange === '7D') return date.toLocaleDateString('en-US', { weekday: 'short' })
                if (dateRange === '1Y') return date.toLocaleDateString('en-US', { month: 'short' })
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
            />
            <YAxis tick={{ fill: '#44445A', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#13131F',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#F0F0FF',
                fontSize: 12,
              }}
              cursor={{ stroke: 'rgba(108,99,255,0.3)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#6C63FF"
              strokeWidth={2}
              fill="url(#analyticsGrad)"
              activeDot={{ r: 5, fill: '#6C63FF', strokeWidth: 0 }}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Below chart inline stats */}
        <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-white/[0.06]">
          <span className="text-xs text-[#8888AA]">
            Peak: <span className="text-[#F0F0FF] font-medium">{peakDayObj?.count ?? 0} anchors</span>
            {peakDayObj ? ` on ${new Date(peakDayObj.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
          </span>
          <span className="text-xs text-[#8888AA]">
            Avg: <span className="text-[#F0F0FF] font-medium">{stats?.avgPerDay ?? 0}/day</span>
          </span>
          <span className="text-xs text-[#8888AA]">
            Trend: <span className={stats?.periodGrowth && Number(stats.periodGrowth) >= 0 ? 'text-green-400' : 'text-red-400'}>
              {stats?.periodGrowth ? `${Number(stats.periodGrowth) >= 0 ? '↑' : '↓'} ${Math.abs(Number(stats.periodGrowth))}% vs previous period` : 'N/A'}
            </span>
          </span>
        </div>
      </div>

      {/* ── Status Breakdown + Heatmap ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Donut chart — 3 cols */}
        <div className="lg:col-span-3 bg-[#0D0D1A] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-sm font-semibold text-[#F0F0FF] mb-4">Anchor Status Breakdown</p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={600}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#13131F',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#F0F0FF',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {statusData.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs text-[#8888AA]">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[#F0F0FF]">{s.value.toLocaleString()}</span>
                    <span className="text-[10px] text-[#44445A]">
                      {stats?.totalHashes ? ((s.value / stats.totalHashes) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap — 2 cols */}
        <div className="lg:col-span-2 bg-[#0D0D1A] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-sm font-semibold text-[#F0F0FF] mb-4">Weekly Activity</p>
          <div className="overflow-x-auto">
            <div className="flex gap-0.5">
              {/* Day labels */}
              <div className="flex flex-col gap-0.5 mr-1">
                {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                  <div key={i} className="h-[22px] flex items-center">
                    <span className="text-[9px] text-[#44445A] w-6">{d}</span>
                  </div>
                ))}
              </div>
              {/* Heatmap grid — weeks as columns, days as rows */}
              {heatmapWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={day ? `${day.count} anchors on ${day.date}` : ''}
                      className="w-[22px] h-[22px] rounded-sm transition-opacity hover:opacity-80"
                      style={{
                        background: day
                          ? `rgba(108,99,255,${Math.min(0.1 + (day.count / Math.max(...heatmapWeeks.flat().filter(id => id !== null).map(d => d!.count), 1)) * 0.9, 1)})`
                          : 'rgba(255,255,255,0.03)',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-[9px] text-[#44445A]">Less</span>
              {[0.05, 0.2, 0.4, 0.7, 1.0].map(o => (
                <div key={o} className="w-3 h-3 rounded-sm" style={{ background: `rgba(108,99,255,${o})` }} />
              ))}
              <span className="text-[9px] text-[#44445A]">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Blockchain Intelligence Bar ── */}
      <div className="bg-[#0A0A12] border border-[rgba(108,99,255,0.2)] rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[10px] text-[#44445A] uppercase tracking-widest font-bold mb-1">Network</p>
            <p className="text-sm font-bold text-[#F0F0FF] font-mono">◎ Solana Devnet</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[11px] text-[#8888AA] font-mono">
                6ecWPUK8...zAwo
              </p>
              <CopyButton text="6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo" />
              <SolanaExplorerLink address="6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo" />
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            {[
              { label: 'Avg Confirmation', value: '421ms' },
              { label: 'Success Rate', value: `${stats?.confirmationRate ?? '—'}%` },
              { label: 'Total Transactions', value: (stats?.totalHashes ?? 0).toLocaleString() },
            ].map(s => (
              <div key={s.label}>
                <p className="text-[10px] text-[#44445A] uppercase tracking-widest">{s.label}</p>
                <p className="text-lg font-black text-[#F0F0FF] font-mono mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <div className="w-2 h-2 rounded-full bg-[#00D97E] animate-pulse" />
              <span className="text-xs text-[#00D97E] font-medium">Operational</span>
            </div>
            <p className="text-[10px] text-[#44445A] mt-1">
              {stats?.pendingHashes ?? 0} pending confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
