import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Activity, 
  Layers, 
  Cpu, 
  Lock, 
  ExternalLink,
  ChevronRight,
  RefreshCcw,
  CheckCircle2,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { CountUp } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { PublicStats, TimeseriesPoint } from '@/types/analytics';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchData = async () => {
    console.log('Last updated:', lastUpdated);
    try {
      const [statsRes, tsRes] = await Promise.all([
        axios.get(`${API_URL}/api/stats`),
        axios.get(`${API_URL}/api/stats/timeseries`)
      ]);
      setStats(statsRes.data);
      setTimeseries(tsRes.data.timeseries);
      setLastUpdated(new Date());
      setSecondsAgo(0);
    } catch (err) {
      console.error('Failed to fetch public stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    const timer = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08080F] text-white selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Minimal Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#08080F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/sipheron_vdap_logo.png" alt="SipHeron" className="h-8 w-8 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">SipHeron</span>
              <span className="text-[10px] text-purple-400 font-medium tracking-[0.2em] uppercase leading-none">VDR</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" className="text-sm text-zinc-400 hover:text-white">Sign In</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-none">
                Launch Dashboard <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 border-purple-500/20 bg-purple-500/5 text-purple-400 rounded-full">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Live Platform Statistics
            </Badge>
            <h1 className="text-4xl lg:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              Platform Traction &<br />Global Transparency
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg lg:text-xl leading-relaxed">
              Real-time visualization of document anchoring activity on the Solana blockchain. 
              SipHeron VDR provides institutional-grade cryptographic proofs for files of any scale.
            </p>
          </motion.div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatComponent 
            label="Documents Anchored" 
            value={stats?.totalHashes || 0} 
            icon={<ShieldCheck className="w-5 h-5" />}
            gradient="from-purple-400 to-purple-600"
            loading={loading}
          />
          <StatComponent 
            label="Verified Organizations" 
            value={stats?.totalOrganizations || 0} 
            icon={<Globe className="w-5 h-5" />}
            gradient="from-blue-400 to-blue-600"
            loading={loading}
          />
          <StatComponent 
            label="Confirmation Rate" 
            value={stats?.confirmationRate ? parseFloat(stats.confirmationRate) : 0} 
            suffix="%"
            icon={<CheckCircle2 className="w-5 h-5" />}
            gradient="from-emerald-400 to-emerald-600"
            loading={loading}
          />
          <StatComponent 
            label="Avg Speed" 
            value={stats?.avgConfirmationMs || 0} 
            suffix="ms"
            icon={<Zap className="w-5 h-5" />}
            gradient="from-orange-400 to-orange-600"
            loading={loading}
          />
        </div>

        {/* Growth Bar */}
        <AnimatePresence>
          {stats?.monthlyGrowth && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-zinc-100 font-semibold">Traction Trend</h3>
                  <p className="text-zinc-500 text-sm">Last 30 days performance</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Growth</p>
                  <p className="text-2xl font-bold text-emerald-400 flex items-center">
                    +{stats.monthlyGrowth}%
                    <span className="text-xs text- emerald-500/50 ml-1">↑</span>
                  </p>
                </div>
                <div className="h-10 w-px bg-white/5" />
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Curr. Month</p>
                  <p className="text-2xl font-bold text-zinc-100">{stats.hashesThisMonth}</p>
                </div>
              </div>
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-zinc-300">
                View Reports <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chart Section */}
        <Card className="bg-[#0A0A12] border-white/5 shadow-2xl mb-16 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Anchoring Activity</h2>
              <p className="text-zinc-500 text-sm">Volume distribution over the last 30 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500/20 border border-purple-500 rounded-sm" />
                <span>Daily Hashes</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Updated {secondsAgo}s ago</span>
              </div>
            </div>
          </div>
          <CardContent className="p-8">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeseries}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="100%">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={12} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: '#9333ea', strokeWidth: 1 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#9333ea" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <div className="px-8 py-4 bg-white/5 flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] text-zinc-500">
            <span className="uppercase tracking-widest font-semibold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Network Status: Healthy
            </span>
            <span className="uppercase tracking-widest font-semibold">Contract: {stats?.contractAddress}</span>
            <span className="uppercase tracking-widest font-semibold">Network: {stats?.network}</span>
          </div>
        </Card>

        {/* Network Health & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Network Health
            </h3>
            <div className="grid gap-4">
              <HealthItem label="Solana Devnet" status="Operational" />
              <HealthItem label="API Gateway" status="Operational" />
              <HealthItem label="Batch Indexer" status="Operational" />
              <HealthItem label="Audit Logger" status="Operational" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Platform Highlights
            </h3>
            <div className="grid gap-4 text-zinc-400">
              <HighlightItem icon={<Lock className="w-4 h-4" />} title="Immutable Proofs" description="Document hashes verified on the Solana ledger, guaranteed for life." />
              <HighlightItem icon={<Layers className="w-4 h-4" />} title="Batch Processing" description="Register up to 100 documents in a single atomic transaction." />
              <HighlightItem icon={<Cpu className="w-4 h-4" />} title="Advanced Cryptography" description="Using SHA-256 and Ed25519 for military-grade security." />
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-zinc-400" />
              Global Activity Feed
            </h3>
            <Badge variant="outline" className="text-xs border-white/5 opacity-50">Polling every 60s</Badge>
          </div>
          <div className="grid gap-3">
            {stats?.recentAnchors.map((anchor, i) => (
              <motion.div 
                key={anchor.hash + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/30 border border-white/5 rounded-xl hover:bg-zinc-800/40 transition-colors"
              >
                <div className="flex items-center gap-4 mb-2 sm:mb-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    anchor.status === 'CONFIRMED' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-orange-500/20 bg-orange-500/10 text-orange-400'
                  }`}>
                    {anchor.status === 'CONFIRMED' ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4 animate-spin" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-zinc-300">0x{anchor.hash.slice(0, 8)}...{anchor.hash.slice(-8)}</span>
                      <span className="text-xs text-zinc-600">Secure Anchor</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
                      {anchor.organization?.name || 'Anonymous Org'} • {new Date(anchor.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-default border-none">
                    {anchor.status}
                  </Badge>
                  <a 
                    href={`https://explorer.solana.com/address/${anchor.hash}?cluster=devnet`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-600 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technology Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          <TechCard icon="/solana-logo.png" name="Solana" detail="4,000+ Trans/Sec" />
          <TechCard icon="/logos/postgresql.svg" name="PostgreSQL" detail="Relational Persistence" />
          <TechCard icon="/logos/redis.svg" name="Redis" detail="Sub-ms Latency" />
          <TechCard icon="/logos/typescript.svg" name="TypeScript" detail="Type Safety First" />
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 rounded-3xl p-12 lg:p-20 text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(155,110,255,0.1),transparent)] pointer-events-none" />
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">Ready to secure your data?</h2>
            <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
              Start anchoring document proofs today. Join the growing network of organizations trusting SipHeron.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register">
                <Button size="lg" className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg h-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 px-8 py-6 text-lg h-auto">
                  Read the Docs
                </Button>
              </Link>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#08080F] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <Link to="/" className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
              <img src="/sipheron_vdap_logo.png" alt="SipHeron" className="h-6 w-6 grayscale" />
              <span className="font-bold tracking-tight text-sm">SipHeron VDR</span>
            </Link>
            <div className="flex items-center gap-8 text-sm text-zinc-500">
              <a href="#" className="hover:text-white">Status</a>
              <a href="#" className="hover:text-white">Documentation</a>
              <a href="#" className="hover:text-white">Security</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
            <p>© 2026 SipHeron Platform. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-zinc-400">Terms of Service</a>
              <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
              <span>support@sipheron.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StatComponent: React.FC<{
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  gradient: string;
  loading?: boolean;
}> = ({ label, value, suffix = '', icon, gradient }) => (
  <Card className="bg-zinc-900/40 border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/5 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
      </div>
      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">{label}</p>
        <div className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
          <CountUp end={value} duration={2} />{suffix}
        </div>
      </div>
    </CardContent>
  </Card>
);

const HealthItem: React.FC<{ label: string; status: string }> = ({ label, status }) => (
  <div className="flex items-center justify-between p-4 bg-zinc-900/30 border border-white/5 rounded-xl">
    <span className="text-zinc-300 text-sm">{label}</span>
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-emerald-400 text-xs font-semibold uppercase">{status}</span>
    </div>
  </div>
);

const HighlightItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex gap-4 p-4 hover:bg-white/5 transition-colors rounded-xl">
    <div className="shrink-0 mt-1 p-2 bg-white/5 rounded-lg border border-white/5">{icon}</div>
    <div>
      <h4 className="text-zinc-100 font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs leading-relaxed text-zinc-500">{description}</p>
    </div>
  </div>
);

const TechCard: React.FC<{ icon: string; name: string; detail: string }> = ({ icon, name, detail }) => (
  <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-2xl flex flex-col items-center text-center hover:bg-zinc-800/20 transition-all hover:-translate-y-1">
    <div className="w-10 h-10 mb-4 flex items-center justify-center">
      <img src={icon} alt={name} className="max-w-full max-h-full" />
    </div>
    <span className="text-sm font-semibold text-white mb-1">{name}</span>
    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{detail}</span>
  </div>
);

export default StatsPage;
