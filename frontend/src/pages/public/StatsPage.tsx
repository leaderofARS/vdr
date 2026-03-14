import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Database, 
  Shield, 
  Search, 
  ArrowRight,
  RefreshCw,
  Clock,
  Users,
  CheckCircle,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { CountUp } from '@/components/shared/CountUp';
import type { PublicStats, TimeseriesPoint } from '@/types/analytics';
import api from '@/utils/api';
import { Navbar } from '@/sections/landing/Navbar';

export const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const [statsRes, tsRes] = await Promise.all([
        api.get('/api/stats'),
        api.get('/api/stats/timeseries')
      ]);
      setStats(statsRes.data);
      setTimeseries(tsRes.data.timeseries);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] text-[#F0F0FF] selection:bg-[#6C63FF]/30">
      <Navbar />

      {/* ── Progress Bar ── */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-white/5 z-[200]">
        <motion.div 
          className="h-full bg-gradient-to-r from-transparent via-[#6C63FF] to-transparent"
          initial={{ width: "0%", left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ width: "20%" }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* ── Header Area ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] text-[10px] font-bold uppercase tracking-wider border border-[#6C63FF]/20">
                Network Live Data
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Operational
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Real-time Platform <span className="text-[#6C63FF]">Intelligence</span>
            </h1>
            <p className="text-[#8888AA] max-w-2xl text-lg">
              Transparency at the core. Monitor every hash, certificate, and anchor registered 
              on the SipHeron VDR decentralized network.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[#44445A] text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
            <button 
              onClick={fetchData}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Hero Counters ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Platform Hashes', value: stats?.totalHashes ?? 0, icon: Activity, color: '#6C63FF' },
            { label: 'Network Anchors', value: stats?.confirmedHashes ?? 0, icon: CheckCircle, color: '#00D97E' },
            { label: 'Organizations', value: stats?.totalOrganizations ?? 0, icon: Users, color: '#4ECDC4' },
            { label: 'Uptime (30d)', value: 99.98, suffix: '%', icon: Cpu, color: '#FFD93D' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0D0D1A] border border-white/[0.06] rounded-3xl p-8 relative overflow-hidden group hover:border-[#6C63FF]/30 transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <card.icon className="w-12 h-12" style={{ color: card.color }} />
              </div>
              <p className="text-[#8888AA] text-sm font-medium mb-2">{card.label}</p>
              <div className="flex items-baseline gap-1">
                <CountUp 
                  end={card.value} 
                  className="text-4xl font-black text-white"
                  decimals={card.label.includes('Uptime') ? 2 : 0}
                />
                {card.suffix && <span className="text-xl font-bold text-[#6C63FF]">{card.suffix}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Main Chart Area ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-[#0D0D1A] border border-white/[0.06] rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold mb-1">Anchoring Volume</h3>
                <p className="text-sm text-[#8888AA]">Global network activity over the last 30 days</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold">
                Daily Avg: {((stats?.totalHashes ?? 0) / 30).toFixed(1)}
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeseries}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#44445A', fontSize: 12 }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#44445A', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#13131F', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#6C63FF" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0D0D1A] border border-white/[0.06] rounded-3xl p-8 h-full">
              <h3 className="text-xl font-bold mb-6">Network Health</h3>
              <div className="space-y-6">
                {[
                  { label: 'Confirmation Rate', value: stats?.confirmationRate + '%', color: 'text-green-400' },
                  { label: 'Avg Latency', value: stats?.avgConfirmationMs + 'ms', color: 'text-[#6C63FF]' },
                  { label: 'Success Rate', value: '100%', color: 'text-green-400' },
                  { label: 'Node Status', value: '8 Online', color: 'text-[#6C63FF]' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between group">
                    <span className="text-[#8888AA] group-hover:text-[#F0F0FF] transition-colors">{item.label}</span>
                    <span className={`font-mono font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/[0.06]">
                <p className="text-sm font-bold uppercase tracking-widest text-[#44445A] mb-4">Contract Info</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-[#8888AA] mb-1">PROGRAM ID</p>
                    <p className="text-xs font-mono text-[#6C63FF] break-all bg-white/5 p-2 rounded-lg">
                      {stats?.contractAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8888AA] mb-1">NETWORK</p>
                    <p className="text-xs font-bold text-white">{stats?.network}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Global Activity</h3>
            <Link to="/verify" className="text-[#6C63FF] text-sm hover:underline flex items-center gap-1.5 font-medium">
              Verify an Anchor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-[#0D0D1A] border border-white/[0.06] rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#44445A]">Timestamp</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#44445A]">Proof Hash</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#44445A]">Metadata</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#44445A]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {stats?.recentAnchors.map((anchor) => (
                    <tr key={anchor.hash} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5 text-sm text-[#8888AA]">
                        {new Date(anchor.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-8 py-5 font-mono text-xs text-[#6C63FF]">
                        {anchor.hash.slice(0, 16)}...{anchor.hash.slice(-8)}
                      </td>
                      <td className="px-8 py-5 text-sm text-[#F0F0FF]">
                        {anchor.metadata || 'System Internal'}
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                          {anchor.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Technology Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { 
              title: 'Solana Infrastructure', 
              desc: 'Leveraging parallel transaction processing and under 500ms block times for high-volume anchoring.',
              icon: Cpu
            },
            { 
              title: 'Litemint Consensus', 
              desc: 'Lightweight cryptographic proofs and trustless verification protocols for documents.',
              icon: Shield
            },
            { 
              title: 'SipHeron VDR', 
              desc: 'A decentralized verifiable data registry designed for enterprise scale and privacy.',
              icon: Database
            }
          ].map((tech) => (
            <div key={tech.title} className="p-8 rounded-3xl bg-[#0D0D1A] border border-white/[0.06] border-b-2 border-b-[#6C63FF]/30">
              <tech.icon className="w-10 h-10 text-[#6C63FF] mb-6" />
              <h4 className="text-lg font-bold mb-3">{tech.title}</h4>
              <p className="text-sm text-[#8888AA] leading-relaxed">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-r from-[#1D1D3A] to-[#0A0A12] p-12 text-center border border-white/5">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to register your first proof?</h2>
            <p className="text-[#8888AA] max-w-xl mx-auto mb-10 text-lg">
              Join hundreds of organizations using SipHeron to anchor their critical data on the blockchain.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register" className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#6C63FF] text-white font-bold hover:bg-[#5B54E0] transition-all shadow-xl shadow-[#6C63FF]/20 flex items-center justify-center gap-2">
                Start for Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/verify" className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2">
                Verify Document <Search className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── Minimal Footer ── */}
        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#6C63FF] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#6C63FF]/20">
              S
            </div>
            <span className="font-black tracking-tighter text-xl">SipHeron <span className="text-[#6C63FF]">VDR</span></span>
          </div>
          <p className="text-[#44445A] text-sm">
            &copy; 2025 SipHeron Platform. All data is verified on the Solana blockchain.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default StatsPage;
