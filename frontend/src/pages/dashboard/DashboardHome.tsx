import type { FC } from 'react';
import {
  Hash,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Activity,
  ExternalLink,
  Copy,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { CountUp, StatusBadge } from '@/components/shared';

// Mock data for charts
const activityData = [
  { date: 'Jan 1', anchors: 45 },
  { date: 'Jan 2', anchors: 52 },
  { date: 'Jan 3', anchors: 38 },
  { date: 'Jan 4', anchors: 65 },
  { date: 'Jan 5', anchors: 48 },
  { date: 'Jan 6', anchors: 72 },
  { date: 'Jan 7', anchors: 58 },
  { date: 'Jan 8', anchors: 81 },
  { date: 'Jan 9', anchors: 63 },
  { date: 'Jan 10', anchors: 95 },
  { date: 'Jan 11', anchors: 77 },
  { date: 'Jan 12', anchors: 89 },
  { date: 'Jan 13', anchors: 102 },
  { date: 'Jan 14', anchors: 84 },
];

const statusData = [
  { name: 'Confirmed', value: 847, color: '#00D97E' },
  { name: 'Pending', value: 23, color: '#FFD93D' },
  { name: 'Failed', value: 5, color: '#FF4757' },
  { name: 'Revoked', value: 12, color: '#FF6B35' },
];

const apiUsageData = [
  { day: 'Mon', calls: 284 },
  { day: 'Tue', calls: 356 },
  { day: 'Wed', calls: 298 },
  { day: 'Thu', calls: 412 },
  { day: 'Fri', calls: 378 },
  { day: 'Sat', calls: 156 },
  { day: 'Sun', calls: 142 },
];

const anchorTimeData = [
  { range: '<200ms', count: 523, color: '#00D97E' },
  { range: '200-500ms', count: 284, color: '#4ECDC4' },
  { range: '500ms-1s', count: 67, color: '#FFD93D' },
  { range: '>1s', count: 13, color: '#FF6B35' },
];

const recentHashes = [
  { id: 1, name: 'contract.pdf', hash: 'a3f4b2c1...d8e9f0a1', status: 'CONFIRMED' as const, user: 'John Doe', date: '2 min ago', tx: '3xK9mP...' },
  { id: 2, name: 'invoice_q4.pdf', hash: 'd8e9f0a1...b2c3d4e5', status: 'CONFIRMED' as const, user: 'Sarah Kim', date: '15 min ago', tx: '5yL0nQ...' },
  { id: 3, name: 'nda_template.docx', hash: 'b2c3d4e5...f6a7b8c9', status: 'PENDING' as const, user: 'Mike Chen', date: '32 min ago', tx: '7zP2rS...' },
  { id: 4, name: 'audit_report.pdf', hash: 'f6a7b8c9...d0e1f2a3', status: 'CONFIRMED' as const, user: 'John Doe', date: '1 hour ago', tx: '9xT4vU...' },
  { id: 5, name: 'compliance_check.pdf', hash: 'd0e1f2a3...b4c5d6e7', status: 'CONFIRMED' as const, user: 'Lisa Wang', date: '2 hours ago', tx: '1wR6yZ...' },
];

const activityFeed = [
  { id: 1, type: 'confirmed', message: 'Hash confirmed', time: '2s ago', color: 'bg-sipheron-green' },
  { id: 2, type: 'staged', message: 'New hash staged', time: '14s ago', color: 'bg-sipheron-purple' },
  { id: 3, type: 'api', message: 'API key used', time: '1m ago', color: 'bg-sipheron-teal' },
  { id: 4, type: 'pending', message: 'Hash pending', time: '3m ago', color: 'bg-sipheron-gold' },
  { id: 5, type: 'confirmed', message: 'Hash confirmed', time: '5m ago', color: 'bg-sipheron-green' },
  { id: 6, type: 'team', message: 'Team member invited', time: '12m ago', color: 'bg-blue-500' },
];

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  trend: number;
  trendLabel: string;
  icon: React.ElementType;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix = '',
  trend,
  trendLabel,
  icon: Icon,
  iconColor,
}) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06] card-hover">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}
          style={{ background: `${iconColor.replace('text-', '').replace('sipheron-', '#')}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: `var(--${iconColor.replace('text-', '')})` }} />
        </div>
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
      </div>
      <div className="text-2xl font-bold text-sipheron-text-primary mb-1">
        <CountUp end={value} suffix={suffix} />
      </div>
      <div className="text-xs text-sipheron-text-muted">{title}</div>
      <div className="text-[10px] text-sipheron-text-muted/50 mt-1">{trendLabel}</div>
    </div>
  );
};

export const DashboardHome: FC = () => {
  return (
    <div className="space-y-6">
      {/* Greeting + Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">
            Good morning, John 👋
          </h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Your organization has anchored <span className="text-sipheron-purple font-medium">127</span> documents this month.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-sipheron-purple/10 border border-sipheron-purple/20 text-sipheron-purple text-sm hover:bg-sipheron-purple/20 transition-colors">
            + Anchor Document
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors">
            ↑ Bulk Anchor
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors">
            ✓ Verify Hash
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors">
            ⬇ Export
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Hashes"
          value={12847}
          trend={12}
          trendLabel="vs last month"
          icon={Hash}
          iconColor="text-sipheron-purple"
        />
        <StatCard
          title="This Month"
          value={127}
          trend={8}
          trendLabel="vs last month"
          icon={Activity}
          iconColor="text-sipheron-teal"
        />
        <StatCard
          title="Pending Confirmation"
          value={23}
          trend={-5}
          trendLabel="vs last hour"
          icon={Clock}
          iconColor="text-sipheron-gold"
        />
        <StatCard
          title="Team Members"
          value={8}
          trend={0}
          trendLabel="No change"
          icon={Users}
          iconColor="text-blue-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-sipheron-text-primary">
                Anchoring Activity
              </h3>
              <p className="text-xs text-sipheron-text-muted">Last 30 days</p>
            </div>
            <button className="text-xs text-sipheron-purple hover:text-sipheron-teal transition-colors">
              Export →
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorAnchors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
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
                <Area
                  type="monotone"
                  dataKey="anchors"
                  stroke="#6C63FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAnchors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Hash Status Breakdown
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">Current distribution</p>
          <div className="h-48 relative">
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
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-sipheron-text-primary">887</span>
              <span className="text-xs text-sipheron-text-muted">Total</span>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-xs text-sipheron-text-secondary">{item.name}</span>
                <span className="text-xs text-sipheron-text-muted ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Usage */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            API Usage
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">Last 7 days</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apiUsageData}>
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
                  formatter={(value: number) => [`${value} calls`, 'API Calls']}
                />
                <Bar
                  dataKey="calls"
                  fill="#6C63FF"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anchor Time Distribution */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Anchor Time Distribution
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">Confirmation speed</p>
          <div className="space-y-3">
            {anchorTimeData.map((item) => (
              <div key={item.range}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-sipheron-text-secondary">{item.range}</span>
                  <span className="text-sipheron-text-muted">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.count / 523) * 100}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Hashes Table */}
        <div className="lg:col-span-3 bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-sipheron-text-primary">
              Recent Hashes
            </h3>
            <button className="text-xs text-sipheron-purple hover:text-sipheron-teal transition-colors">
              View all →
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
                    Anchored by
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
                {recentHashes.map((hash) => (
                  <tr
                    key={hash.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-sipheron-text-primary">{hash.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs text-sipheron-teal">{hash.hash}</code>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={hash.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-sipheron-text-secondary">{hash.user}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-sipheron-text-muted">{hash.date}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-2 bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-sipheron-text-primary">
              Live Activity
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-sipheron-green animate-pulse" />
              <span className="text-xs text-sipheron-text-muted">Live</span>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
            {activityFeed.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-sipheron-text-secondary flex-1">
                  {item.message}
                </span>
                <span className="text-xs text-sipheron-text-muted">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blockchain Stats Bar */}
      <div className="bg-sipheron-base rounded-xl p-4 border border-white/[0.06]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-sipheron-text-muted">Connected to:</span>
              <span className="text-xs text-sipheron-teal font-mono">Solana Devnet</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-sipheron-text-muted">Contract:</span>
              <code className="text-xs text-sipheron-purple font-mono">6ecWPUK8...zAwo</code>
              <button className="text-sipheron-text-muted hover:text-sipheron-text-primary">
                <Copy className="w-3 h-3" />
              </button>
              <a
                href="https://explorer.solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sipheron-purple hover:text-sipheron-teal"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-sipheron-text-muted">Last Block:</span>
              <span className="text-xs text-sipheron-text-primary font-mono">284,847,291</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-sipheron-text-muted">Avg Confirmation:</span>
              <span className="text-xs text-sipheron-green font-mono">421ms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sipheron-green" />
              <span className="text-xs text-sipheron-text-muted">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
