import React, { useState } from 'react';
import {
  LineChart,
  Line,
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
} from 'recharts';
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { CountUp } from '@/components/shared';

// Mock data
const volumeData = [
  { date: 'Jan 1', you: 12, sarah: 8, mike: 5 },
  { date: 'Jan 2', you: 18, sarah: 12, mike: 7 },
  { date: 'Jan 3', you: 15, sarah: 10, mike: 9 },
  { date: 'Jan 4', you: 22, sarah: 15, mike: 11 },
  { date: 'Jan 5', you: 28, sarah: 18, mike: 13 },
  { date: 'Jan 6', you: 24, sarah: 20, mike: 15 },
  { date: 'Jan 7', you: 32, sarah: 22, mike: 18 },
  { date: 'Jan 8', you: 29, sarah: 25, mike: 16 },
  { date: 'Jan 9', you: 35, sarah: 28, mike: 20 },
  { date: 'Jan 10', you: 42, sarah: 30, mike: 22 },
  { date: 'Jan 11', you: 38, sarah: 32, mike: 25 },
  { date: 'Jan 12', you: 45, sarah: 35, mike: 28 },
  { date: 'Jan 13', you: 52, sarah: 38, mike: 30 },
  { date: 'Jan 14', you: 48, sarah: 42, mike: 32 },
];

const hourlyData = [
  { hour: '12am', anchors: 5 },
  { hour: '2am', anchors: 3 },
  { hour: '4am', anchors: 2 },
  { hour: '6am', anchors: 8 },
  { hour: '8am', anchors: 25 },
  { hour: '10am', anchors: 45 },
  { hour: '12pm', anchors: 52 },
  { hour: '2pm', anchors: 48 },
  { hour: '4pm', anchors: 38 },
  { hour: '6pm', anchors: 22 },
  { hour: '8pm', anchors: 15 },
  { hour: '10pm', anchors: 8 },
];

const funnelData = [
  { stage: 'Staged', count: 1247, color: '#6C63FF' },
  { stage: 'Anchored', count: 1189, color: '#4ECDC4' },
  { stage: 'Confirmed', count: 1182, color: '#00D97E' },
];

const userData = [
  { name: 'You', count: 487, color: '#6C63FF' },
  { name: 'Sarah Kim', count: 352, color: '#4ECDC4' },
  { name: 'Mike Chen', count: 278, color: '#FFD93D' },
  { name: 'Lisa Wang', count: 156, color: '#FF6B35' },
  { name: 'Others', count: 89, color: '#44445A' },
];

const apiKeyData = [
  { name: 'Production API', value: 65, color: '#6C63FF' },
  { name: 'Development API', value: 25, color: '#4ECDC4' },
  { name: 'Testing API', value: 10, color: '#FFD93D' },
];

const weeklyData = [
  { day: 'Mon', thisWeek: 145, lastWeek: 128 },
  { day: 'Tue', thisWeek: 168, lastWeek: 142 },
  { day: 'Wed', thisWeek: 152, lastWeek: 156 },
  { day: 'Thu', thisWeek: 189, lastWeek: 165 },
  { day: 'Fri', thisWeek: 201, lastWeek: 178 },
  { day: 'Sat', thisWeek: 89, lastWeek: 76 },
  { day: 'Sun', thisWeek: 76, lastWeek: 68 },
];

const topDocuments = [
  { name: 'contract.pdf', hash: 'a3f4b2c1...', views: 245, lastVerified: '2 min ago', status: 'Active' },
  { name: 'invoice_q4.pdf', hash: 'd8e9f0a1...', views: 189, lastVerified: '15 min ago', status: 'Active' },
  { name: 'nda_template.docx', hash: 'b2c3d4e5...', views: 156, lastVerified: '1 hour ago', status: 'Active' },
  { name: 'audit_report.pdf', hash: 'f6a7b8c9...', views: 134, lastVerified: '2 hours ago', status: 'Active' },
  { name: 'compliance_check.pdf', hash: 'd0e1f2a3...', views: 98, lastVerified: '3 hours ago', status: 'Active' },
];

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  trend?: number;
  trendLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix = '',
  prefix = '',
  trend,
  trendLabel,
}) => {
  const isPositive = (trend || 0) >= 0;
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  return (
    <div className="bg-sipheron-surface rounded-xl p-4 border border-white/[0.06]">
      <div className="text-xs text-sipheron-text-muted mb-1">{title}</div>
      <div className="text-xl font-bold text-sipheron-text-primary">
        {prefix}
        <CountUp end={numericValue} suffix={suffix} decimals={value.toString().includes('.') ? 3 : 0} />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs mt-1 ${isPositive ? 'text-sipheron-green' : 'text-sipheron-red'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{trend}%
          {trendLabel && <span className="text-sipheron-text-muted ml-1">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

export const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');

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
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary text-sm focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="custom">Custom range</option>
          </select>
          <button className="px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.03] transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Custom</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.03] transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Anchors" value={12847} trend={12} trendLabel="vs last period" />
        <StatCard title="Monthly Anchors" value={127} trend={8} trendLabel="vs last month" />
        <StatCard title="Avg Daily" value={4.2} trend={5} trendLabel="vs last period" />
        <StatCard title="Peak Day" value={52} trend={15} trendLabel="vs last period" />
        <StatCard title="Fastest Confirmation" value={127} suffix="ms" />
        <StatCard title="Total Tx Fees" value={0.012847} prefix="◎ " />
      </div>

      {/* Large Line Chart */}
      <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-sipheron-text-primary">
              Anchoring Volume Over Time
            </h3>
            <p className="text-xs text-sipheron-text-muted">Multi-user comparison</p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { name: 'You', color: '#6C63FF' },
              { name: 'Sarah', color: '#4ECDC4' },
              { name: 'Mike', color: '#FFD93D' },
            ].map((user) => (
              <div key={user.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: user.color }} />
                <span className="text-xs text-sipheron-text-secondary">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeData}>
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
              <Line type="monotone" dataKey="you" stroke="#6C63FF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sarah" stroke="#4ECDC4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mike" stroke="#FFD93D" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Three Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Distribution */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Hourly Distribution
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">When you anchor most</p>
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
        </div>

        {/* Status Funnel */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Status Funnel
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">Staged → Anchored → Confirmed</p>
          <div className="space-y-3">
            {funnelData.map((item) => (
              <div key={item.stage}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-sipheron-text-secondary">{item.stage}</span>
                  <span className="text-sipheron-text-primary font-medium">{item.count}</span>
                </div>
                <div className="h-6 rounded-md bg-white/[0.03] overflow-hidden relative">
                  <div
                    className="h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2"
                    style={{
                      width: `${(item.count / funnelData[0].count) * 100}%`,
                      background: item.color,
                    }}
                  >
                    <span className="text-[10px] text-white/80">
                      {Math.round((item.count / funnelData[0].count) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Top Anchoring Users
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">By document count</p>
          <div className="space-y-3">
            {userData.map((user) => (
              <div key={user.name} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: user.color }}
                />
                <span className="text-sm text-sipheron-text-secondary flex-1">{user.name}</span>
                <span className="text-sm text-sipheron-text-primary font-medium">{user.count}</span>
              </div>
            ))}
          </div>
          {/* Mini bar chart */}
          <div className="mt-4 space-y-1">
            {userData.map((user) => (
              <div key={user.name} className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(user.count / userData[0].count) * 100}%`,
                    background: user.color,
                  }}
                />
              </div>
            ))}
          </div>
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
                  <span className="text-sm text-sipheron-text-secondary flex-1">{item.name}</span>
                  <span className="text-sm text-sipheron-text-primary font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary mb-2">
            Weekly Trend
          </h3>
          <p className="text-xs text-sipheron-text-muted mb-6">This week vs last week</p>
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
        </div>
      </div>

      {/* Top Documents Table */}
      <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-sipheron-text-primary">
              Top Documents by Verification Views
            </h3>
            <p className="text-xs text-sipheron-text-muted">
              Most verified documents by external parties
            </p>
          </div>
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
                  Verifications
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Last Verified
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {topDocuments.map((doc) => (
                <tr
                  key={doc.name}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm text-sipheron-text-primary">{doc.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-sipheron-teal">{doc.hash}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-sipheron-text-primary">{doc.views}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-sipheron-text-muted">{doc.lastVerified}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-sipheron-green/10 text-sipheron-green border border-sipheron-green/20">
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
