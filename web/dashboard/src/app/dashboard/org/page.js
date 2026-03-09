"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import Link from 'next/link';
import {
    Building2, Pencil, Copy, CheckCircle2,
    ExternalLink, Users, Key, Hash, ShieldCheck,
    Trash2, UserPlus, ArrowRightLeft, AlertTriangle,
    RefreshCw, Globe, ShieldAlert, X, Check, Calendar, HardDrive, Network, Info,
    UserCircle, Shield, Briefcase, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PurpleCard, GlowButton, PurpleBadge, PurpleTable,
    PurpleTableRow, PurpleSkeleton, PurpleInput,
    CountUp
} from '@/components/ui/PurpleUI';

export default function OrganizationProfile() {
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchOrgData = useCallback(async () => {
        try {
            const { data } = await api.get('/api/org');
            setOrg(data);
            setNewName(data.name);
        } catch (err) {
            showToast("Failed to load organization profile.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async (isManual = false) => {
        if (isManual) setStatsLoading(true);
        try {
            const { data } = await api.get('/api/org/stats');
            setStats(data);
            setStatsError(false);
        } catch (err) {
            setStatsError(true);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrgData();
        fetchStats();
    }, [fetchOrgData, fetchStats]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleUpdateName = async () => {
        if (!newName || newName === org.name) {
            setIsEditingName(false);
            return;
        }
        setSaveLoading(true);
        try {
            await api.put('/api/org', { name: newName });
            setOrg({ ...org, name: newName });
            setIsEditingName(false);
            showToast("Organization name updated successfully.");
        } catch (err) {
            showToast("Failed to update organization name.", "error");
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <PurpleSkeleton className="h-40 w-full rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <PurpleSkeleton key={i} className="h-32 rounded-3xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <PurpleSkeleton className="lg:col-span-2 h-96 rounded-3xl" />
                    <PurpleSkeleton className="h-96 rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-32 relative">
            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <PurpleCard className="p-8 lg:p-12 overflow-hidden border-purple-vivid/20 relative group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                        <Building2 className="w-64 h-64 text-purple-glow" />
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            <div className="w-24 h-24 rounded-3xl bg-purple-vivid/10 border border-purple-vivid/20 flex items-center justify-center shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-vivid/20 to-transparent" />
                                <Building2 className="w-10 h-10 text-purple-vivid relative z-10" />
                            </div>

                            <div className="space-y-4">
                                {isEditingName ? (
                                    <div className="flex items-center gap-3">
                                        <PurpleInput
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="text-2xl font-bold py-2 h-auto"
                                            autoFocus
                                        />
                                        <GlowButton onClick={handleUpdateName} loading={saveLoading} icon={Check} className="p-3" />
                                        <button onClick={() => { setIsEditingName(false); setNewName(org.name); }} className="p-3 bg-danger/10 text-danger rounded-2xl hover:bg-danger/20 transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 group/name">
                                        <h1 className="text-4xl font-bold font-mono text-text-primary tracking-tight">{org?.name}</h1>
                                        <button onClick={() => setIsEditingName(true)} className="p-2 rounded-xl bg-purple-dim/30 text-text-muted hover:text-white transition-all opacity-0 group-hover/name:opacity-100">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex flex-wrap items-center gap-4">
                                    <PurpleBadge variant="purple" className="flex items-center gap-2">
                                        <Shield className="w-3.5 h-3.5" /> INSTITUTIONAL NODE
                                    </PurpleBadge>
                                    <div className="text-xs font-mono text-text-muted flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-bg-border shadow-inner">
                                        <span className="opacity-40 font-bold tracking-widest uppercase text-[9px]">ID:</span>
                                        {org?.id}
                                        <button onClick={() => { navigator.clipboard.writeText(org?.id); showToast("Org ID Copied"); }} className="hover:text-purple-glow transition-colors">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 justify-center">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] bg-bg-surface/50 px-4 py-2 rounded-2xl border border-bg-border/50">
                                <Calendar className="w-4 h-4 text-purple-glow" /> Anchored: {org?.createdAt ? new Date(org.createdAt).toLocaleDateString() : '—'}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-success/5 border border-success/20 rounded-2xl text-success text-[10px] font-bold uppercase tracking-widest">
                                <Activity className="w-4 h-4" /> Real-time Telemetry Enabled
                            </div>
                        </div>
                    </div>
                </PurpleCard>
            </motion.div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <OrgStatCard title="Institutional Proofs" value={stats?.stats?.totalAnchors ?? 0} icon={Hash} loading={statsLoading} />
                <OrgStatCard title="Active Credentials" value={stats?.stats?.activeApiKeys ?? 0} icon={Key} loading={statsLoading} />
                <OrgStatCard title="Authorized Issuers" value={stats?.stats?.issuerCount ?? 1} icon={Users} loading={statsLoading} />
                <OrgStatCard title="Account Integrity" value="OPTIMAL" icon={ShieldCheck} isStatus />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Infrastructure Details */}
                <div className="lg:col-span-2 space-y-8">
                    <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                        <div className="px-8 py-6 border-b border-bg-border/50 bg-purple-dim/5 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-3">
                                <HardDrive className="w-4 h-4 text-purple-glow" />
                                On-Chain Identity Profile
                            </h3>
                            <PurpleBadge variant="purple" className="flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5" /> {stats?.wallet?.network || 'DEVNET CLUSTER'}
                            </PurpleBadge>
                        </div>
                        <div className="p-8 space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Programmable Derived Account (PDA) Address</label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                    <div className="flex-1 bg-black/50 border border-bg-border rounded-2xl px-6 py-4 font-mono text-sm text-purple-glow break-all shadow-inner flex items-center">
                                        {org?.walletAddress}
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => { navigator.clipboard.writeText(org?.walletAddress); showToast("Address Copied"); }} className="p-4 bg-bg-surface border border-bg-border rounded-2xl text-text-muted hover:text-white transition-all shadow-lg hover:border-purple-vivid/40">
                                            <Copy className="w-5 h-5" />
                                        </button>
                                        <a href={`https://explorer.solana.com/address/${org?.walletAddress}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="p-4 bg-bg-surface border border-bg-border rounded-2xl text-text-muted hover:text-white transition-all shadow-lg hover:border-purple-vivid/40">
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-purple-glow/[0.02] border border-bg-border/50 rounded-3xl p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <Network className="w-24 h-24 text-white" />
                                    </div>
                                    <div className="flex items-center justify-between mb-6">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Institutional Balance</label>
                                        <GlowButton variant="ghost" onClick={() => fetchStats(true)} className="p-2 rounded-xl" icon={RefreshCw} />
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-mono font-bold text-text-primary tracking-tighter">
                                            {statsLoading ? "—" : stats?.wallet?.balanceSol?.toFixed(5) || "0.00000"}
                                        </span>
                                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">SOL</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${stats?.wallet?.balanceSol > 0.05 ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">System Liquidity Optimal</span>
                                    </div>
                                </div>

                                <div className="bg-purple-vivid/[0.02] border border-bg-border/50 rounded-3xl p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <Briefcase className="w-24 h-24 text-white" />
                                    </div>
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-6 block">Account Authority</label>
                                    <p className="text-sm font-bold text-text-primary mb-2">Institutional Admin Tier</p>
                                    <p className="text-xs text-text-muted leading-relaxed uppercase tracking-tighter font-medium">Standard Quota Active on Devnet Cluster</p>
                                </div>
                            </div>
                        </div>
                    </PurpleCard>

                    {/* Team Section */}
                    <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                        <div className="px-8 py-6 border-b border-bg-border/50 bg-purple-dim/5 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-3">
                                <Users className="w-4 h-4 text-purple-glow" /> Authorized Governance Members
                            </h3>
                            <GlowButton onClick={() => showToast("Expansion modules locked in Standard Tier.", "info")} icon={UserPlus} variant="ghost" className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                                PROVISION MEMBER
                            </GlowButton>
                        </div>
                        <PurpleTable headers={["Strategic Identity", "Infrastructure Role", "Authorized Since", "Signal"]}>
                            <PurpleTableRow>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-purple-vivid/10 border border-purple-vivid/20 flex items-center justify-center text-purple-vivid font-bold text-xs shadow-inner">
                                            <UserCircle className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-primary">Master Administrator (You)</span>
                                            <span className="text-[11px] font-mono text-text-muted truncate max-w-[150px]">{org?.walletAddress}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <PurpleBadge variant="purple" className="text-[10px] tracking-widest">SYSTEM_FOUNDER</PurpleBadge>
                                </td>
                                <td className="px-8 py-6 text-xs text-text-muted font-mono">
                                    {org?.createdAt ? new Date(org.createdAt).toLocaleDateString().toUpperCase() : '—'}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <PurpleBadge variant="success" pulse>AUTHORIZED</PurpleBadge>
                                </td>
                            </PurpleTableRow>
                        </PurpleTable>
                    </PurpleCard>
                </div>

                {/* Cyber Security Zone */}
                <div className="space-y-8">
                    <PurpleCard className="border-danger/20 bg-danger/[0.01]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-danger/10 text-danger rounded-xl">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-danger uppercase tracking-[0.2em]">Institutional Danger Zone</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-black/40 border border-danger/10 rounded-3xl space-y-4 group">
                                <div className="flex items-center gap-3">
                                    <ArrowRightLeft className="w-4 h-4 text-danger opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">Transfer Governance</h4>
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed">Cryptographically transfer root administrative control. This operation is irreversible.</p>
                                <GlowButton variant="danger" ghost onClick={() => showToast("Governance modules locked.", "info")} className="w-full py-3 text-[9px] font-bold uppercase tracking-[0.2em] !bg-transparent border-danger/30 hover:!bg-danger/10">
                                    INITIATE HANDOVERS
                                </GlowButton>
                            </div>

                            <div className="p-6 bg-black/40 border border-danger/10 rounded-3xl space-y-4 group">
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-4 h-4 text-danger opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">Dissolve Organization</h4>
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed">Permanently purge all organizational telemetry. Historical anchors will remain immutable on-chain.</p>
                                <GlowButton variant="danger" ghost onClick={() => showToast("Purge protocol unavailable.", "info")} className="w-full py-3 text-[9px] font-bold uppercase tracking-[0.2em] !bg-transparent border-danger/30 hover:!bg-danger/10">
                                    PURGE PROFILE
                                </GlowButton>
                            </div>
                        </div>
                    </PurpleCard>

                    <PurpleCard className="bg-purple-vivid/[0.03] border-purple-vivid/30">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-purple-dim/30 rounded-xl text-purple-glow shrink-0">
                                <Info className="w-5 h-5" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-text-primary uppercase tracking-tight">Security Protocol</h4>
                                <p className="text-[11px] text-text-secondary leading-relaxed font-medium">
                                    Strategic IAM (Identity and Access Management) ensures that only verified institutional wallets
                                    can execute on-chain anchors and revocation events.
                                </p>
                                <Link href="/docs/concepts" className="inline-flex items-center gap-2 text-[10px] font-bold text-purple-glow uppercase tracking-widest hover:underline group">
                                    In-depth Analysis <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </PurpleCard>
                </div>
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        className="fixed bottom-12 left-1/2 z-[150] px-6 py-4 rounded-2xl bg-bg-surface border border-purple-vivid/20 shadow-2xl flex items-center gap-4 min-w-[320px]"
                    >
                        <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-bold text-text-primary">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-auto text-text-muted hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function OrgStatCard({ title, value, icon: Icon, loading, isStatus }) {
    return (
        <PurpleCard className="group relative overflow-hidden flex flex-col justify-between h-32 py-6 px-8 transition-all hover:bg-white/[0.02]">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{title}</span>
                <div className="p-2 bg-purple-dim/20 rounded-xl text-purple-glow group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div>
                {loading ? (
                    <PurpleSkeleton className="h-8 w-20" />
                ) : (
                    <div className={`text-2xl font-bold font-mono tracking-tighter ${isStatus ? 'text-success' : 'text-text-primary'}`}>
                        {typeof value === 'number' ? <CountUp end={value} /> : value}
                    </div>
                )}
            </div>
        </PurpleCard>
    );
}
