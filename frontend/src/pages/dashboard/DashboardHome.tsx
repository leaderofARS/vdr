import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Hash,
  TrendingUp,
  TrendingDown,
  Activity,
  ExternalLink,
  Copy,
  RefreshCw,
  Plus,
  Download,
  ChevronRight,
  Wallet,
  Globe,
  QrCode,
} from 'lucide-react';
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
  ComposedChart,
} from 'recharts';
import api from '@/utils/api';
import { usePendingHashes } from '@/hooks/usePendingHashes';
import { CountUp, StatusBadge } from '@/components/shared';
import { useAuth } from '@/contexts/AuthContext';

// Types
interface OrgStats {
  org: {
    id: string;
    name: string;
    createdAt: string;
    walletAddress: string;
    pdaAddress: string;
  };
  stats: {
    totalAnchors: number;
    activeAnchors: number;
    revokedAnchors: number;
    activeApiKeys: number;
    totalApiKeys: number;
  };
  wallet: {
    address: string;
    balanceSol: number;
    balanceLamports: number;
    status: string;
    network: string;
  };
  user: {
    email: string;
    role: string;
  };
  recentActivity: Array<{
    hash: string;
    metadata: string;
    status: string;
    registeredAt: string;
    txSignature: string;
  }>;
}

interface HashRecord {
  hash: string;
  metadata: string;
  status: string;
  registeredAt: string;
  owner: string;
  txSignature: string;
  explorerUrl: string;
}

interface UsageData {
  analytics: Array<{ date: string; count: number }>;
  summary: {
    totalRequests: number;
    successRate: string;
    avgResponseTime: number;
    requestsThisWeek: number;
  };
}

// Map backend status to StatusBadge type
const mapStatus = (status: string): import('@/components/shared').StatusType => {
  const normalized = status?.toLowerCase();
  if (normalized === 'confirmed' || normalized === 'active') return 'CONFIRMED';
  if (normalized === 'pending') return 'PENDING';
  if (normalized === 'failed') return 'FAILED';
  if (normalized === 'revoked') return 'REVOKED';
  return 'CONFIRMED';
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ElementType;
  iconColor: string;
  loading?: boolean;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix = '',
  trend,
  trendLabel,
  icon: Icon,
  iconColor,
  loading,
  isCurrency,
}) => {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06] card-hover">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}
          style={{ background: 'rgba(108, 99, 255, 0.1)' }}
        >
          <Icon className="w-5 h-5 text-sipheron-purple" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs ${
              isPositive ? 'text-sipheron-green' : 'text-sipheron-red'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-sipheron-text-primary mb-1">
        {loading ? (
          <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
        ) : (
          <>
            {isCurrency && <span className="text-sipheron-purple mr-1 text-xl">◎</span>}
            <CountUp end={value} suffix={suffix} />
          </>
        )}
      </div>
      <div className="text-xs text-sipheron-text-muted">{title}</div>
      {trendLabel && <div className="text-[10px] text-sipheron-text-muted/50 mt-1">{trendLabel}</div>}
    </div>
  );
};

export const DashboardHome: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [hashes, setHashes] = useState<HashRecord[]>([]);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hashesLoading, setHashesLoading] = useState(true);
  const [usageLoading, setUsageLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  const [showWizard, setShowWizard] = useState(false);
  const [qrHash, setQrHash] = useState<string | null>(null);
  const [qrCopied, setQrCopied] = useState(false);

  // Fetch org stats
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/api/org/stats');
      setStats(data);
      if (data.noOrganization) {
        setShowWizard(true);
      }
      setLastSync(new Date());
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recent hashes
  const fetchHashes = useCallback(async () => {
    setHashesLoading(true);
    try {
      const { data } = await api.get('/api/hashes', {
        params: { page: 1, limit: 10 },
      });
      setHashes(data.data || []);
    } catch (error) {
      console.error('Failed to fetch hashes:', error);
    } finally {
      setHashesLoading(false);
    }
  }, []);

  // Fetch usage data
  const fetchUsage = useCallback(async () => {
    setUsageLoading(true);
    try {
      const { data } = await api.get('/api/usage?period=7d');
      setUsageData(data);
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    } finally {
      setUsageLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchStats();
    fetchHashes();
    fetchUsage();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchUsage();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchStats, fetchHashes, fetchUsage]);

  // Polling for pending hashes
  const { isPolling, startPolling } = usePendingHashes({
    onConfirmed: () => {
      toast.success('Hash confirmed on Solana!');
      fetchHashes();
      fetchStats();
    },
    onRefresh: () => {
      fetchHashes();
      fetchStats();
    },
  });

  // Start polling when there are pending hashes
  useEffect(() => {
    const hasPending = hashes.some((h) => h.status === 'PENDING');
    if (hasPending) startPolling();
  }, [hashes, startPolling]);

  const handleExport = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://api.sipheron.com'}/api/hashes/export?format=${format}`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sipheron-hashes-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export data');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setHashesLoading(true);
    setUsageLoading(true);
    fetchStats();
    fetchHashes();
    fetchUsage();
    toast.success('Dashboard refreshed');
  };

  // Calculate status breakdown for pie chart
  const statusData = stats
    ? [
        { name: 'Active', value: stats.stats.activeAnchors, color: '#00D97E' },
        { name: 'Revoked', value: stats.stats.revokedAnchors, color: '#FF4757' },
      ]
    : [];

  // Get greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // QR Code URL
  const verifyUrl = (hash: string) => `https://app.sipheron.com/verify/${hash}`;
  const qrUrl = (hash: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      verifyUrl(hash)
    )}&bgcolor=000000&color=a855f7&qzone=2`;

  if (showWizard) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-sipheron-purple/10 flex items-center justify-center">
            <Globe className="w-10 h-10 text-sipheron-purple" />
          </div>
          <h2 className="text-2xl font-bold text-sipheron-text-primary mb-2">
            Welcome to SipHeron VDR
          </h2>
          <p className="text-sipheron-text-muted mb-6 max-w-md">
            Your organization needs to be set up. Contact your administrator or create a new organization to get started.
          </p>
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="btn-primary"
          >
            Set Up Organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sync indicator */}
      {isPolling && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-lg bg-sipheron-gold/10 border border-sipheron-gold/20 text-sipheron-gold text-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sipheron-gold animate-pulse" />
          Synchronizing...
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">
            {greeting}, {user?.name || user?.email?.split('@')[0] || 'User'} 👋
          </h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            {stats ? (
              <>
                Your organization has anchored{' '}
                <span className="text-sipheron-purple font-medium">
                  {stats.stats.totalAnchors}
                </span>{' '}
                documents.
              </>
            ) : (
              'Loading your dashboard...'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/dashboard/hashes')}
            className="px-3 py-1.5 rounded-lg bg-sipheron-purple/10 border border-sipheron-purple/20 text-sipheron-purple text-sm hover:bg-sipheron-purple/20 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Anchor Document
          </button>
          <button
            onClick={() => navigate('/dashboard/bulk-verify')}
            className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors"
          >
            Bulk Verify
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Hashes"
          value={stats?.stats.totalAnchors ?? 0}
          trend={12}
          trendLabel="vs last month"
          icon={Hash}
          iconColor="text-sipheron-purple"
          loading={loading}
        />
        <StatCard
          title="Active API Keys"
          value={stats?.stats.activeApiKeys ?? 0}
          icon={Activity}
          iconColor="text-sipheron-teal"
          loading={loading}
        />
        <StatCard
          title="SOL Balance"
          value={stats?.wallet?.balanceSol ?? 0}
          isCurrency
          icon={Wallet}
          iconColor="text-sipheron-gold"
          loading={loading}
        />
        <StatCard
          title="Network Status"
          value={100}
          suffix="%"
          icon={Globe}
          iconColor="text-sipheron-green"
          loading={loading}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-sipheron-text-primary">
                Registry Throughput
              </h3>
              <p className="text-xs text-sipheron-text-muted">Last 7 days</p>
            </div>
            {!usageLoading && usageData?.summary && (
              <div className="flex gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-sipheron-text-muted uppercase">Success Rate</div>
                  <div className="text-lg font-bold text-sipheron-green">{usageData.summary.successRate}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-sipheron-text-muted uppercase">Daily Avg</div>
                  <div className="text-lg font-bold text-sipheron-purple">
                    {Math.round((usageData.summary.requestsThisWeek || 0) / 7)}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="h-64">
            {usageLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin" />
              </div>
            ) : usageData?.analytics?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sipheron-text-muted">
                No data yet. Anchor your first document!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={usageData?.analytics || []}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis
                    dataKey="date"
                    stroke="#44445A"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis stroke="#44445A" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#0D0D1A',
                      border: '1px solid rgba(108,99,255,0.3)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#8888AA' }}
                    itemStyle={{ color: '#F0F0FF' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#6C63FF"
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                  />
                  <Bar dataKey="count" fill="#6C63FF" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Hash Status Breakdown
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">Current distribution</p>
          <div className="h-48 relative">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-sipheron-text-primary">
                {stats?.stats.totalAnchors ?? 0}
              </span>
              <span className="text-xs text-sipheron-text-muted">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-sipheron-text-secondary">{item.name}</span>
                <span className="text-xs text-sipheron-text-muted ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary">Recent Hashes</h3>
          <button
            onClick={() => navigate('/dashboard/hashes')}
            className="text-xs text-sipheron-purple hover:text-sipheron-teal transition-colors flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Document
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Hash
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Date
                </th>
                <th className="text-right text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {hashesLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><div className="h-4 w-24 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-32 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-white/10 rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : hashes.length > 0 ? (
                hashes.slice(0, 5).map((hash) => (
                  <tr
                    key={hash.hash}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-sipheron-text-primary">
                        {hash.metadata || 'Untitled'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs text-sipheron-teal">
                        {hash.hash.slice(0, 16)}...
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={mapStatus(hash.status)} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-sipheron-text-muted">
                        {new Date(hash.registeredAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setQrHash(hash.hash)}
                          className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
                          title="Generate QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        {hash.explorerUrl && (
                          <a
                            href={hash.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sipheron-purple/10 flex items-center justify-center">
                      <Hash className="w-8 h-8 text-sipheron-purple" />
                    </div>
                    <p className="text-sipheron-text-muted text-sm">No hashes yet</p>
                    <p className="text-sipheron-text-muted/50 text-xs mt-1">
                      Anchor your first document to get started
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blockchain Stats Bar */}
      <div className="bg-sipheron-base rounded-xl p-4 border border-white/[0.06]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-sipheron-text-muted">Network:</span>
              <span className="text-xs text-sipheron-teal font-mono capitalize">
                {stats?.wallet?.network || 'devnet'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-sipheron-text-muted">Wallet:</span>
              <code className="text-xs text-sipheron-purple font-mono">
                {stats?.wallet?.address
                  ? `${stats.wallet.address.slice(0, 8)}...${stats.wallet.address.slice(-8)}`
                  : '—'}
              </code>
              {stats?.wallet?.address && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(stats.wallet.address);
                    toast.success('Address copied');
                  }}
                  className="text-sipheron-text-muted hover:text-sipheron-text-primary"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-sipheron-text-muted">Last Sync:</span>
              <span className="text-xs text-sipheron-text-primary font-mono">
                {lastSync.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sipheron-green" />
              <span className="text-xs text-sipheron-text-muted">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrHash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-sipheron-surface rounded-2xl p-6 max-w-sm w-full border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-sipheron-text-primary">
                Verification QR Code
              </h3>
              <button
                onClick={() => setQrHash(null)}
                className="text-sipheron-text-muted hover:text-sipheron-text-primary"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-xl">
                <img src={qrUrl(qrHash)} alt="QR Code" width={200} height={200} />
              </div>
              <p className="text-xs text-sipheron-text-muted text-center">
                Scan to verify this document on SipHeron VDR
              </p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(verifyUrl(qrHash));
                    setQrCopied(true);
                    setTimeout(() => setQrCopied(false), 2000);
                    toast.success('Link copied');
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/[0.05] text-sipheron-text-primary text-sm hover:bg-white/[0.1] transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {qrCopied ? 'Copied!' : 'Copy Link'}
                </button>
                <a
                  href={qrUrl(qrHash)}
                  download={`sipheron-qr-${qrHash.slice(0, 8)}.png`}
                  className="flex-1 px-4 py-2 rounded-lg bg-sipheron-purple/10 text-sipheron-purple text-sm hover:bg-sipheron-purple/20 transition-colors text-center"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
