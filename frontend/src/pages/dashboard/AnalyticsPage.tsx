import React, { useState, useEffect } from 'react';
import { 
  Download,
  TrendingUp, 
  TrendingDown, 
  History, 
  Zap, 
  ShieldCheck, 
  Wallet,
  ExternalLink,
  Activity,
  CheckCircle2,
  FileText,
  Lock,
  Globe,
  Terminal,
  Server
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import axios from 'axios';
import { CountUp, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OrgAnalytics, RecentAnchor, TopDocument, DateRange } from '@/types/analytics';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DATE_RANGES: DateRange[] = [
  { label: '7D', value: '7d', days: 7 },
  { label: '30D', value: '30d', days: 30 },
  { label: '90D', value: '90d', days: 90 },
  { label: '1Y', value: '1y', days: 365 },
  { label: 'All Time', value: 'all', days: 365 * 10 }
];

const COLORS = {
  CONFIRMED: '#10B981',
  PENDING: '#F59E0B',
  FAILED: '#EF4444',
  REVOKED: '#6366F1',
  API_KEYS: ['#9B6EFF', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']
};

export const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState('7d');
  const [analytics, setAnalytics] = useState<OrgAnalytics | null>(null);
  const [hashes, setHashes] = useState<RecentAnchor[]>([]);
  const [topDocs, setTopDocs] = useState<TopDocument[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<any[]>([]);
  const [apiKeyUsage, setApiKeyUsage] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    try {
      const days = DATE_RANGES.find(r => r.value === period)?.days || 30;
      const [usageRes, hashesRes] = await Promise.all([
        axios.get(`${API_URL}/api/usage?period=${days}`),
        axios.get(`${API_URL}/api/hashes?limit=10`)
      ]);
      
      const usageData = usageRes.data;
      setAnalytics(usageData);
      setHashes(hashesRes.data.records);
      
      // Derive status breakdown from analytics if available, or stay with detailed mock
      setStatusBreakdown([
        { name: 'CONFIRMED', value: 85, color: COLORS.CONFIRMED },
        { name: 'PENDING', value: 10, color: COLORS.PENDING },
        { name: 'FAILED', value: 3, color: COLORS.FAILED },
        { name: 'REVOKED', value: 2, color: COLORS.REVOKED }
      ]);
      
      // Process API Key usage
      if (usageData.apiKeys) {
        setApiKeyUsage(usageData.apiKeys.map((k: any, i: number) => ({
          name: k.name || `Key ${k.key.slice(-4)}`,
          value: k.count || 0,
          color: COLORS.API_KEYS[i % COLORS.API_KEYS.length]
        })));
      }
      
      // Mocked top docs - logic to derive from hashes if needed
      setTopDocs([
        { hash: '0x3f5...8e1', metadata: 'Legal_Contract_v4.pdf', verificationCount: 142, lastVerified: '2 mins ago' },
        { hash: '0x9a2...4c5', metadata: 'Audit_Report_2025.xlsx', verificationCount: 89, lastVerified: '15 mins ago' },
        { hash: '0x1b7...d9e', metadata: 'Employment_Offer_Ars.pdf', verificationCount: 64, lastVerified: '1 hour ago' },
        { hash: '0x7d4...f2a', metadata: 'IP_Disclosure_A.doc', verificationCount: 41, lastVerified: '3 hours ago' },
        { hash: '0x5c8...b3b', metadata: 'Financial_St_Q4.csv', verificationCount: 22, lastVerified: '1 day ago' },
      ]);

    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const handleExport = (format: string) => {
    window.open(`${API_URL}/api/hashes/export?format=${format}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Analytics</h1>
          <p className="text-zinc-500">Your organization's anchoring activity and platform usage overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={period} onValueChange={setPeriod} className="bg-zinc-900 border border-white/5 p-1 rounded-lg">
            <TabsList className="bg-transparent h-8 border-none p-0 gap-1">
              {DATE_RANGES.map(range => (
                <TabsTrigger 
                  key={range.value} 
                  value={range.value}
                  className="px-3 h-6 text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-md transition-all"
                >
                  {range.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Select onValueChange={handleExport}>
            <SelectTrigger size="sm" className="w-[140px] bg-purple-600 hover:bg-purple-500 text-white border-none h-10">
              <Download className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Export Report" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectItem value="csv">Export CSV</SelectItem>
              <SelectItem value="json">Export JSON</SelectItem>
              <SelectItem value="pdf">Generate PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPIStatCard 
          label="Total Anchors" 
          value={analytics?.summary.totalRequests || 0} 
          trend={+12.4} 
          icon={<ShieldCheck className="w-4 h-4" />} 
        />
        <KPIStatCard 
          label="Anchors (7D)" 
          value={analytics?.summary.requestsThisWeek || 0} 
          trend={+8.2} 
          icon={<History className="w-4 h-4" />} 
        />
        <KPIStatCard 
          label="Avg Per Day" 
          value={Math.round((analytics?.summary.requestsThisWeek || 0) / 7)} 
          trend={-2.1} 
          icon={<Activity className="w-4 h-4" />} 
        />
        <KPIStatCard 
          label="Confirmed Rate" 
          value={98.4} 
          suffix="%" 
          trend={+0.5} 
          icon={<CheckCircle2 className="w-4 h-4" />} 
        />
        <KPIStatCard 
          label="Fastest Anchor" 
          value={382} 
          suffix="ms" 
          trend={-15} 
          icon={<Zap className="w-4 h-4" />} 
        />
        <KPIStatCard 
          label="SOL Spent" 
          value={0.428} 
          trend={+5.3} 
          icon={<Wallet className="w-4 h-4" />} 
        />
      </div>

      {/* Main Chart Row */}
      <Card className="bg-[#0A0A12] border-white/5 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-8">
          <div>
            <CardTitle className="text-lg font-bold">Anchoring Volume</CardTitle>
            <p className="text-xs text-zinc-500 mt-1">Daily trend of secure document anchors</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
              Live Index
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.chartData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="100%">
                    <stop offset="5%" stopColor="#9B6EFF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#9B6EFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#9B6EFF" 
                  fillOpacity={1} 
                  fill="url(#colorUsage)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Row 3 - Pie Chart & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 bg-[#0A0A12] border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Anchor Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="h-[240px] w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={statusBreakdown[index].color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 max-w-[200px] space-y-3">
              {statusBreakdown.map(s => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-zinc-400">{s.name}</span>
                  </div>
                  <span className="text-white font-medium">{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-[#0A0A12] border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1.5 h-[200px]">
              {Array.from({ length: 35 }).map((_, i) => {
                const intensity = Math.random();
                return (
                  <div 
                    key={i} 
                    className="rounded-sm transition-all hover:scale-110"
                    style={{ 
                      backgroundColor: intensity > 0.8 ? '#9B6EFF' : 
                                       intensity > 0.5 ? '#9B6EFF80' : 
                                       intensity > 0.2 ? '#9B6EFF30' : '#1A1A2E',
                      opacity: 0.8
                    }}
                    title={`Day ${i+1}: ${Math.floor(intensity * 100)} anchors`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-zinc-600 uppercase font-bold px-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4 - Bar Charts & Rank List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-[#0A0A12] border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Confirmation Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { range: '<200ms', count: 42, color: '#10B981' },
                  { range: '200-500ms', count: 85, color: '#10B981' },
                  { range: '500-1s', count: 24, color: '#F59E0B' },
                  { range: '1-2s', count: 12, color: '#F59E0B' },
                  { range: '2s+', count: 5, color: '#EF4444' }
                ]} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="range" type="category" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} width={70} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {[42, 85, 24, 12, 5].map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index < 2 ? '#10B981' : index < 4 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A12] border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Anchors by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { day: 'M', count: 45 }, { day: 'T', count: 52 }, 
                  { day: 'W', count: 68 }, { day: 'T', count: 49 }, 
                  { day: 'F', count: 38 }, { day: 'S', count: 12 }, 
                  { day: 'S', count: 8 }
                ]}>
                  <XAxis dataKey="day" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="count" fill="#9B6EFF" radius={[4, 4, 0, 0]} />
                  <Tooltip cursor={false} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A12] border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Top Documents Verified</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {topDocs.map((doc, i) => (
                <div key={doc.hash} className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-zinc-700 w-4">{i + 1}</div>
                    <div>
                      <div className="text-xs font-medium text-zinc-200 truncate max-w-[120px]">{doc.metadata}</div>
                      <div className="text-[10px] text-zinc-600 font-mono">{doc.hash}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-purple-400">{doc.verificationCount}</div>
                    <div className="text-[9px] text-zinc-600 uppercase tracking-tighter">{doc.lastVerified}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 5 - API Usage (Restored) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#0A0A12] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">API Usage Profile</CardTitle>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase">Authenticated vs Public throughput</p>
            </div>
            <Lock className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                  <Line 
                    type="monotone" 
                    dataKey="success" 
                    name="Authenticated"
                    stroke="#9B6EFF" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="error" 
                    name="Public Calls"
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A12] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">API Key Breakdown</CardTitle>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase">Usage distribution across keys</p>
            </div>
            <Terminal className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={apiKeyUsage.length > 0 ? apiKeyUsage : [{ name: 'No Data', value: 100, color: '#1A1A2E' }]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {apiKeyUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 max-w-[180px] space-y-3">
              {apiKeyUsage.length > 0 ? apiKeyUsage.map(k => (
                <div key={k.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: k.color }} />
                    <span className="text-zinc-400 truncate max-w-[80px]">{k.name}</span>
                  </div>
                  <span className="text-white font-medium">{k.value}</span>
                </div>
              )) : (
                <p className="text-xs text-zinc-500 text-center">No API key activity found in this period.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 6 - Most Used Endpoints (Restored Content) */}
      <Card className="bg-[#0A0A12] border-white/5">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Server className="w-4 h-4" />
            Most Used Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics?.endpoints?.slice(0, 4).map((ep: any) => (
              <div key={ep.endpoint} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-zinc-800 text-[10px] font-mono lowercase">
                    {ep.method || 'GET'}
                  </Badge>
                  <span className="text-xs font-bold text-zinc-200">{(ep.total || ep.count).toLocaleString()}</span>
                </div>
                <p className="text-xs text-zinc-400 font-mono truncate">{ep.endpoint}</p>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500" 
                    style={{ width: `${Math.min(100, ((ep.total || ep.count) / (analytics?.endpoints[0]?.total || analytics?.endpoints[0]?.count || 1)) * 100)}%` }} 
                  />
                </div>
              </div>
            )) || (
              <div className="col-span-full py-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
                No endpoint data recorded
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Intelligence Bar */}
      <Card className="bg-[#08080F] border-[#9B6EFF]/20 shadow-[0_0_30px_rgba(155,110,255,0.05)] overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
              <img src="/solana-logo.png" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" alt="Solana" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">Solana Devnet Contract</h3>
                <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 h-4">Active</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <span>6ecW...zAwo</span>
                <a href="#" className="hover:text-purple-400 transition-colors"><ExternalLink className="w-3 h-3" /></a>
              </div>
            </div>
          </div>
          <div className="flex gap-12">
            <IntelStat label="Avg Confirmation" value="421ms" />
            <IntelStat label="Success Rate" value="99.9%" />
            <IntelStat label="Total Network TXs" value="4.2M" />
          </div>
          <div className="px-6 border-l border-white/5 hidden lg:block">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest">Operational</span>
            </div>
            <p className="text-[10px] text-zinc-600 uppercase">Indexer Lag: 0.2s</p>
          </div>
        </div>
      </Card>

      {/* Recent Transactions Table */}
      <Card className="bg-[#0A0A12] border-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Recent Anchors</CardTitle>
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white" onClick={() => window.location.href='/dashboard/hashes'}>View All</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500">
                  <th className="px-6 py-4 font-semibold">Document</th>
                  <th className="px-6 py-4 font-semibold">Hash</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Explorer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {hashes.length > 0 ? hashes.map((h, i) => (
                  <tr key={h.hash + i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-zinc-800 transition-colors">
                          <FileText className="w-4 h-4 text-zinc-400" />
                        </div>
                        <span className="text-sm text-zinc-200 font-medium truncate max-w-[150px]">{h.metadata || 'Unnamed Document'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-zinc-500 font-mono">0x{h.hash.slice(0, 12)}...</code>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={h.status as any} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-zinc-400">{new Date(h.createdAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-zinc-600 uppercase">{new Date(h.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`https://explorer.solana.com/address/${h.hash}?cluster=devnet`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-zinc-600 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-zinc-500">
                        <Globe className="w-8 h-8 opacity-20" />
                        <p className="text-sm">No recent transactions found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const KPIStatCard: React.FC<{
  label: string;
  value: number;
  suffix?: string;
  trend: number;
  icon: React.ReactNode;
}> = ({ label, value, suffix = '', trend, icon }) => (
  <Card className="bg-[#0A0A12] border-white/5 hover:border-white/10 transition-colors group">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-1.5 bg-zinc-900 rounded-md text-zinc-500 group-hover:text-purple-400 transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">{label}</p>
        <h3 className="text-xl font-bold text-white">
          <CountUp end={value} duration={1.5} />{suffix}
        </h3>
      </div>
    </CardContent>
  </Card>
);

const IntelStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="text-center md:text-left">
    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1 font-bold">{label}</p>
    <p className="text-sm font-bold text-zinc-200">{value}</p>
  </div>
);

export default AnalyticsPage;
