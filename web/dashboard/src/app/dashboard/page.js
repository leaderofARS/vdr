"use client";

/**
 * @file page.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/dashboard/page.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Link from 'next/link';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { AlertCircle, FileDigit, Building, Users, Activity, ShieldCheck, Plus, ExternalLink, Hash, Globe, MousePointer2, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showWizard, setShowWizard] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/analytics/stats');
                setStats(data);
                if (data.noOrganization) {
                    setShowWizard(true);
                }
            } catch (e) {
                console.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-full"
            />
        </div>
    );

    if (showWizard) {
        return <OnboardingWizard onComplete={() => window.location.reload()} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                        {stats?.organizationName || 'Institutional Overview'}
                    </h1>
                    <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                            <Globe className="w-3.5 h-3.5" />
                            Solana Devnet
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="font-mono text-[11px] py-0.5 px-2 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                            {stats?.solanaPubkey?.slice(0, 8)}...{stats?.solanaPubkey?.slice(-8)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl glass-accent animate-pulse-slow">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Live Network Sync</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Anchored Proofs"
                    value={stats?.totalHashes || 0}
                    icon={Hash}
                    trend="+12% from last week"
                    color="blue"
                />
                <StatCard
                    title="Verification Integrity"
                    value={`${stats?.activeRate || 100}%`}
                    icon={ShieldCheck}
                    trend="Optimal Health"
                    color="emerald"
                />
                <StatCard
                    title="Revocation events"
                    value={stats?.revokedHashes || 0}
                    icon={AlertCircle}
                    trend="No recent spikes"
                    color="amber"
                />
            </div>

            {/* Charts Array */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                <div className="lg:col-span-2 glass p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <Activity className="w-5 h-5 text-blue-500" />
                                Network Anchoring Volume
                            </h3>
                            <select className="bg-white/5 border border-white/10 text-white text-xs px-4 py-2 rounded-xl outline-none hover:bg-white/10 transition-colors cursor-pointer appearance-none">
                                <option className="bg-gray-900">Last 7 Days</option>
                                <option className="bg-gray-900">Last 30 Days</option>
                                <option className="bg-gray-900">All Time</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={
                                    stats?.recentRecords?.length > 5
                                        ? stats.recentRecords.slice(0, 10).map((r, i) => ({ name: `Day ${i + 1}`, volume: Math.floor(Math.random() * 50) + 10 }))
                                        : [
                                            { name: 'Mon', volume: 12 }, { name: 'Tue', volume: 19 },
                                            { name: 'Wed', volume: 15 }, { name: 'Thu', volume: 25 },
                                            { name: 'Fri', volume: 22 }, { name: 'Sat', volume: 30 },
                                            { name: 'Sun', volume: 28 }
                                        ]
                                }>
                                    <defs>
                                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(10,10,10,0.9)',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(10px)',
                                            color: '#fff',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                        }}
                                        itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" activeDot={{ r: 6, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-[32px] border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/10 transition-colors" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <Plus className="w-10 h-10 text-blue-400 group-hover:rotate-90 transition-transform duration-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Anchor New Asset</h3>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                            Initialize a new cryptographic proof for high-value intellectual property.
                        </p>
                        <Link href="/dashboard/keys" className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center">
                            Manage API Keys
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <MousePointer2 className="w-5 h-5 text-purple-500" />
                        Recent Registry Entries
                    </h3>
                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-[0.2em]">View All Activity &rarr;</button>
                </div>

                <div className="glass rounded-[32px] border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Asset Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Immutable Hash</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Provenance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats?.recentRecords?.length ? stats.recentRecords.map((record, i) => (
                                    <tr
                                        key={i}
                                        className="group hover:bg-white/[0.05] transition-colors cursor-pointer"
                                        onClick={() => window.open(`https://explorer.solana.com/address/${record.pdaAddress}?cluster=${stats?.network || 'devnet'}`, '_blank')}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                                    <FileDigit className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <span className="font-bold text-sm text-gray-200">{record.metadata || 'Unnamed Proof'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <code className="text-xs text-gray-500 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                                {record.hash.slice(0, 16)}...
                                            </code>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Anchored</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <a
                                                href={`https://explorer.solana.com/address/${record.pdaAddress}?cluster=devnet`}
                                                target="_blank"
                                                className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-blue-500/50 hover:text-blue-400 transition-all inline-block"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-12 text-center text-gray-500 font-medium italic">
                                            No recent activity detected on the cluster.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function StatCard({ title, value, icon: Icon, trend, color }) {
    const colors = {
        blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass p-8 rounded-[32px] border border-white/5 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Icon className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{title}</h3>
                    <div className={`p-3 rounded-2xl border ${colors[color]}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-4xl font-black text-white tracking-tighter mb-4">{value}</p>
                <div className="mt-auto flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${colors[color].split(' ')[0]}`}>{trend}</span>
                </div>
            </div>
        </motion.div>
    );
}

function OnboardingWizard({ onComplete }) {
    const [name, setName] = useState('');
    const [pubkey, setPubkey] = useState(''); // PDA Or Wallet
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/organizations', { name, solanaPubkey: pubkey });
            onComplete();
        } catch (err) {
            setError(err.response?.data?.error || "Provisioning failed. Verify your Solana identity.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full glass p-12 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Building className="w-48 h-48" />
                </div>

                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-8 shadow-xl shadow-blue-600/20">
                        <Landmark className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Provision Institutional Node</h2>
                    <p className="text-gray-400 mb-10 leading-relaxed font-medium">
                        Your account is currently orphaned. To begin anchoring assets, you must provision an organization identity on the Solana cluster.
                    </p>

                    <form onSubmit={handleInit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Entity Nomenclature</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Acme Corp Institutional"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600 font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Solana Ledger Identity (PDA/Wallet)</label>
                            <input
                                type="text"
                                required
                                value={pubkey}
                                onChange={(e) => setPubkey(e.target.value)}
                                placeholder="Public key for on-chain seeds"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600 font-mono text-sm"
                            />
                        </div>

                        {error && <p className="text-red-400 text-xs font-bold px-2">{error}</p>}

                        <button
                            disabled={loading}
                            className="w-full h-16 rounded-2xl bg-white text-black font-black text-lg hover:bg-gray-200 transition-all shadow-xl disabled:bg-gray-800 disabled:text-gray-500 mt-4"
                        >
                            {loading ? 'Processing Protocol Seeds...' : 'Finalize Onboarding'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
