"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import Link from 'next/link';
import {
    Building2, Pencil, Copy, CheckCircle2,
    ExternalLink, Users, Key, Hash, ShieldCheck,
    Trash2, UserPlus, ArrowRightLeft, AlertTriangle,
    RefreshCw, Globe, ShieldAlert, X, Check, Calendar, HardDrive, Network, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '@/components/EmptyState';

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
            console.error("Failed to fetch organization data:", err);
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
            console.error("Failed to fetch organization stats:", err);
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
            <div className="max-w-[1200px] mx-auto space-y-8 animate-pulse">
                <div className="h-20 bg-[#1A1D24] rounded-xl border border-[#2C3038]"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-[#1A1D24] rounded-xl border border-[#2C3038]"></div>)}
                </div>
                <div className="h-64 bg-[#1A1D24] rounded-xl border border-[#2C3038]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 pb-20 relative">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-xl bg-[#111118] border border-[#1E1E2E] shadow-2xl flex items-center gap-3 min-w-[320px]"
                    >
                        <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-[#10B981]/10' : 'bg-[#F28B82]/10'}`}>
                            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <AlertTriangle className="w-4 h-4 text-[#F28B82]" />}
                        </div>
                        <span className="text-sm text-white font-medium">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-auto text-[#9AA0A6] hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Section 1: Organization Header */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-8 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4285F4]"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#4285F4]/10 border border-[#4285F4]/20 rounded-xl">
                                <Building2 className="w-8 h-8 text-[#4285F4]" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    {isEditingName ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="bg-[#131418] border border-[#4285F4] rounded-lg px-3 py-1 text-2xl font-bold text-white outline-none"
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleUpdateName}
                                                disabled={saveLoading}
                                                className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                                            >
                                                {saveLoading ? <div className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <Check className="w-4 h-4" />}
                                                Save
                                            </button>
                                            <button
                                                onClick={() => { setIsEditingName(false); setNewName(org.name); }}
                                                className="p-1.5 rounded-lg hover:bg-[#20232A] text-[#9AA0A6] hover:text-white transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 group">
                                            <h1 className="text-3xl font-bold text-white tracking-tight">{org?.name || 'Organization Profile'}</h1>
                                            <button onClick={() => setIsEditingName(true)} className="p-1.5 rounded-md hover:bg-[#20232A] text-[#5F6368] hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="text-sm font-mono text-[#9AA0A6] flex items-center gap-2">
                                        <span className="opacity-50 uppercase tracking-tighter text-[10px] font-bold">PROJECT ID:</span>
                                        {org?.id}
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(org?.id); showToast("Copied Org ID to clipboard"); }}
                                            className="p-1 hover:bg-[#20232A] rounded transition-all text-[#5F6368] hover:text-white"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-[11px] font-bold text-[#9AA0A6] uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Created: {org?.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'Loading...'}
                        </div>
                        <div className="px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div> Verified Identity
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Proofs Anchored"
                    value={stats?.stats?.totalAnchors ?? '—'}
                    loading={statsLoading}
                    icon={Hash}
                    trend="on-chain"
                />
                <StatCard
                    title="Active API Keys"
                    value={stats?.stats?.activeApiKeys ?? '—'}
                    loading={statsLoading}
                    icon={Key}
                />
                <StatCard
                    title="Total Issuers"
                    value={stats?.stats?.issuerCount ?? 1}
                    loading={statsLoading}
                    icon={Users}
                    trend="admin"
                />
                <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 flex flex-col justify-between hover:border-[#2C3038] transition-all group">
                    <div className="text-[#9AA0A6] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Account Status
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <div className="px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] text-xs font-bold uppercase tracking-widest border border-[#10B981]/20">Active</div>
                    </div>
                    <p className="mt-2 text-[10px] text-[#5F6368] leading-tight font-medium">Full on-chain anchoring capabilities enabled</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Wallet Info and Members */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Section 3: Wallet Information */}
                    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#161621] flex items-center justify-between">
                            <h3 className="text-white text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                                <HardDrive className="w-4 h-4 text-[#4285F4]" /> Institutional Wallet Profile
                            </h3>
                            <div className="px-2 py-0.5 rounded-full bg-[#4285F4]/10 border border-[#4285F4]/20 text-[#4285F4] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Globe className="w-3 h-3" /> {stats?.wallet?.network || 'Devnet'}
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest mb-1.5 block">PDA Wallet Address</label>
                                    <div className="flex items-center gap-2 group/addr">
                                        <code className="text-xs text-[#E8EAED] font-mono break-all py-2 px-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg block flex-1">
                                            {org?.walletAddress}
                                        </code>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(org?.walletAddress); showToast("Wallet address copied"); }}
                                                className="p-2 rounded-lg bg-[#20232A] text-[#9AA0A6] hover:text-white transition-all shadow-sm"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <a
                                                href={`https://explorer.solana.com/address/${org?.walletAddress}?cluster=devnet`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="p-2 rounded-lg bg-[#20232A] text-[#9AA0A6] hover:text-white transition-all shadow-sm flex items-center justify-center"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Network className="w-24 h-24 text-white" />
                                </div>
                                <label className="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest mb-1 block">Live Balance</label>
                                <div className="mt-1 flex items-center justify-between">
                                    <div className="text-2xl font-normal text-white tracking-tight flex items-baseline gap-1.5">
                                        {statsLoading ? (
                                            <div className="h-8 w-24 bg-[#1E1E2E] rounded animate-pulse" />
                                        ) : statsError ? (
                                            <div className="text-sm text-[#F28B82] font-medium">Balance check failed</div>
                                        ) : (
                                            <>
                                                <span className={`text-xl leading-none font-light ${stats?.wallet?.balanceSol > 0.05 ? 'text-[#10B981]' : stats?.wallet?.balanceSol > 0.01 ? 'text-[#FBBC04]' : 'text-[#F28B82]'}`}>◎</span>
                                                {stats?.wallet?.balanceSol?.toFixed(5) || "0.00000"}
                                                <span className="text-xs text-[#5F6368] font-bold tracking-widest ml-1 uppercase">SOL</span>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fetchStats(true)}
                                        disabled={statsLoading}
                                        className={`p-2 rounded-lg bg-[#20232A] text-[#5F6368] hover:text-white transition-all ${statsLoading ? 'animate-spin text-[#4285F4]' : ''}`}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Members / Issuers */}
                    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#161621] flex items-center justify-between">
                            <h3 className="text-white text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                                <Users className="w-4 h-4 text-[#FBC02D]" /> Registered Issuers & Admins
                            </h3>
                            <button
                                onClick={() => showToast("Add Issuer functionality Coming Soon.", "info")}
                                className="px-4 py-1.5 bg-[#FBC02D] hover:bg-[#F9A825] text-black text-[11px] font-bold rounded-lg transition-all flex items-center gap-2 active:scale-95"
                            >
                                <UserPlus className="w-3.5 h-3.5" /> ADD ISSUER
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-[#0A0A0F]/50 text-[#5F6368] text-[10px] font-bold uppercase tracking-widest border-b border-[#1E1E2E]">
                                    <tr>
                                        <th className="px-6 py-4">Identity (Address)</th>
                                        <th className="px-6 py-4">Organizational Role</th>
                                        <th className="px-6 py-4">On-chain Since</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E1E2E]">
                                    <tr className="hover:bg-[#1A1D24]/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#4285F4]/20 flex items-center justify-center text-[#4285F4] font-bold text-xs border border-[#4285F4]/30">
                                                    AD
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">You (Organization Admin)</span>
                                                    <span className="text-[11px] text-[#5F6368] font-mono">{org?.walletAddress ? `${org.walletAddress.slice(0, 10)}...${org.walletAddress.slice(-10)}` : '...'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-2.5 py-1 rounded bg-[#4285F4]/10 text-[#4285F4] text-[10px] font-bold uppercase tracking-widest border border-[#4285F4]/20">ADMIN_MASTER</span>
                                        </td>
                                        <td className="px-6 py-5 text-[#9AA0A6] text-xs">
                                            {org?.createdAt ? new Date(org.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold uppercase tracking-widest border border-[#10B981]/20">
                                                Authorized
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="border-t border-[#1E1E2E] bg-[#0A0A0F]/20">
                                <EmptyState
                                    icon={Users}
                                    title="No additional issuers"
                                    subtitle="You are the sole admin of this organization"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Danger Zone */}
                <div className="space-y-8">
                    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#161621] flex items-center justify-between">
                            <h3 className="text-[#F28B82] text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                                <ShieldAlert className="w-4 h-4" /> Danger Zone
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-3 p-4 bg-[#F28B82]/5 border border-[#F28B82]/20 rounded-xl">
                                <h4 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#F28B82]" /> Transfer Admin
                                </h4>
                                <p className="text-[11px] text-[#9AA0A6] leading-relaxed">Cryptographically transfer administrative control of this organization to another Solana identity.</p>
                                <button
                                    onClick={() => showToast("Admin Transfer functionality Coming Soon.", "info")}
                                    className="w-full py-2.5 rounded-lg border border-[#F28B82]/50 text-[#F28B82] hover:bg-[#F28B82] hover:text-white text-[11px] font-bold transition-all uppercase tracking-widest"
                                >
                                    INITIATE TRANSFER
                                </button>
                            </div>

                            <div className="space-y-3 p-4 bg-[#F28B82]/5 border border-[#F28B82]/20 rounded-xl">
                                <h4 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Trash2 className="w-3.5 h-3.5 text-[#F28B82]" /> Close Profile
                                </h4>
                                <p className="text-[11px] text-[#9AA0A6] leading-relaxed">Permanently deactivate this organization profile. This action will invalidate all API keys and historical registry links.</p>
                                <button
                                    onClick={() => showToast("Delete functionality Coming Soon. Contact support.", "info")}
                                    className="w-full py-2.5 rounded-lg bg-[#F28B82]/10 border border-[#F28B82]/30 text-[#F28B82] hover:bg-[#F28B82] hover:text-white text-[11px] font-bold transition-all uppercase tracking-widest"
                                >
                                    DELETE ORGANIZATION
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-[#4285F4]/5 border border-[#4285F4]/20 rounded-2xl">
                        <div className="flex items-start gap-4">
                            <Info className="w-5 h-5 text-[#4285F4] shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <h4 className="text-white text-[13px] font-bold">Role-Based Access</h4>
                                <p className="text-[11px] text-[#9AA0A6] leading-relaxed">Issuers can anchor and revoke documents, while only the Organization Admin (you) can manage API keys and organizational metadata.</p>
                                <Link href="/docs/concepts" className="text-[11px] text-[#4285F4] font-bold hover:underline flex items-center gap-1">
                                    Learn more <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, loading }) {
    return (
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 flex flex-col justify-between hover:border-[#2C3038] transition-all group">
            <div className="text-[#9AA0A6] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-4 h-4 group-hover:text-[#4285F4] transition-colors" /> {title}
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                {loading ? (
                    <div className="h-9 w-16 bg-[#1E1E2E] rounded animate-pulse" />
                ) : (
                    <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
                )}
                {trend && !loading && <span className="text-[11px] text-[#4285F4] font-medium lowercase italic">{trend}</span>}
            </div>
        </div>
    );
}

// LiveBalance component removed as the logic is now integrated into the main page flow with fetchStats

