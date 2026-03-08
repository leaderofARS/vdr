"use client";

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Link from 'next/link';
import { Network, Key, FolderDot, HardDrive, CheckCircle2, XCircle, Terminal, ExternalLink, ShieldCheck, ChevronRight, Building } from 'lucide-react';

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
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-t-2 border-b-2 border-[#4285F4] rounded-full animate-spin" />
        </div>
    );

    if (showWizard) {
        return <OnboardingWizard onComplete={() => window.location.reload()} />;
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-2xl font-normal text-white mb-1">
                        {stats?.organizationName ? `Project: ${stats.organizationName}` : 'Project Overview'}
                    </h1>
                    <div className="text-sm text-[#9AA0A6] font-mono">
                        Org ID: {stats?.solanaPubkey || 'Not provisioned'}
                    </div>
                </div>
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Proofs Anchored"
                    value={stats?.totalHashes || 0}
                    icon={FolderDot}
                />
                <MetricCard
                    title="Active API Keys"
                    value={stats?.activeKeys || 0}
                    icon={Key}
                />
                <MetricCard
                    title="Wallet Balance (SOL)"
                    value={stats?.balance || "0.00"}
                    icon={HardDrive}
                />
                <div className="bg-[#1A1D24] border border-[#2C3038] rounded p-4 flex flex-col justify-between">
                    <div className="text-[#9AA0A6] text-[11px] font-medium uppercase tracking-wider flex items-center gap-2">
                        <Network className="w-3.5 h-3.5" />
                        Network Status
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                        <span className="text-xl font-normal text-white">Devnet</span>
                    </div>
                    <div className="text-[11px] text-[#9AA0A6] mt-1">Operational</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 bg-[#1A1D24] border border-[#2C3038] rounded">
                    <div className="px-5 py-3 border-b border-[#2C3038] flex items-center justify-between">
                        <h2 className="text-[#E8EAED] text-sm font-medium">Recent Activity</h2>
                        <button className="text-[#4285F4] text-xs font-medium hover:underline">VIEW ALL</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#1D2128] border-b border-[#2C3038]">
                                <tr className="text-[#9AA0A6] text-xs uppercase">
                                    <th className="px-5 py-2.5 font-medium">Hash</th>
                                    <th className="px-5 py-2.5 font-medium">Metadata</th>
                                    <th className="px-5 py-2.5 font-medium">Date Anchored</th>
                                    <th className="px-5 py-2.5 font-medium border-l border-[#2C3038]">Status</th>
                                    <th className="px-5 py-2.5 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2C3038] text-[13px]">
                                {stats?.recentRecords?.length ? stats.recentRecords.map((record, i) => (
                                    <tr key={i} className="hover:bg-[#20232A] transition-colors">
                                        <td className="px-5 py-3 font-mono text-[#4285F4]">
                                            {record.hash.slice(0, 16)}...
                                        </td>
                                        <td className="px-5 py-3 text-[#E8EAED]">
                                            {record.metadata || 'Unnamed Proof'}
                                        </td>
                                        <td className="px-5 py-3 text-[#9AA0A6]">
                                            {new Date(record.timestamp * 1000).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 border-l border-[#2C3038]">
                                            {record.isRevoked ? (
                                                <span className="inline-flex items-center gap-1.5 text-[#F28B82] text-xs">
                                                    <div className="w-2 h-2 rounded-full bg-[#F28B82]"></div> Revoked
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-[#10B981] text-xs">
                                                    <div className="w-2 h-2 rounded-full bg-[#10B981]"></div> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <a
                                                href={`https://explorer.solana.com/address/${record.pdaAddress}?cluster=devnet`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="text-[#9AA0A6] hover:text-white inline-flex items-center gap-1 text-xs"
                                                title="View on Solana Explorer"
                                            >
                                                Explorer <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-8 text-center text-[#9AA0A6] text-sm">
                                            No recent transactions found in the registry.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-[#1A1D24] border border-[#2C3038] rounded h-fit">
                    <div className="px-5 py-3 border-b border-[#2C3038]">
                        <h2 className="text-[#E8EAED] text-sm font-medium">Quick Actions</h2>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                        <div className="group flex flex-col gap-1 p-3 hover:bg-[#20232A] rounded transition-colors">
                            <div className="flex items-center text-[#E8EAED] text-[13px] font-medium gap-2">
                                <Terminal className="w-4 h-4 text-[#9AA0A6]" />
                                Anchor New File
                            </div>
                            <code className="text-[11px] text-[#9AA0A6] bg-[#131418] p-2 rounded mt-2 border border-[#2C3038] font-mono break-all select-all block">
                                sipheron-vdr register ./document.pdf
                            </code>
                        </div>

                        <Link href="/dashboard/keys">
                            <div className="group flex items-center justify-between p-3 hover:bg-[#20232A] rounded cursor-pointer transition-colors">
                                <div className="flex items-center text-[#E8EAED] text-[13px] font-medium gap-2">
                                    <Key className="w-4 h-4 text-[#9AA0A6]" />
                                    Generate API Key
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#9AA0A6]" />
                            </div>
                        </Link>

                        <Link href="/dashboard/decoder">
                            <div className="group flex items-center justify-between p-3 hover:bg-[#20232A] rounded cursor-pointer transition-colors">
                                <div className="flex items-center text-[#E8EAED] text-[13px] font-medium gap-2">
                                    <ShieldCheck className="w-4 h-4 text-[#9AA0A6]" />
                                    Verify a File
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#9AA0A6]" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon }) {
    return (
        <div className="bg-[#1A1D24] border border-[#2C3038] rounded p-4 flex flex-col justify-between">
            <div className="text-[#9AA0A6] text-[11px] font-medium uppercase tracking-wider flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" />
                {title}
            </div>
            <div className="mt-2 text-2xl font-normal text-white">
                {value}
            </div>
        </div>
    );
}

function OnboardingWizard({ onComplete }) {
    const [name, setName] = useState('');
    const [pubkey, setPubkey] = useState('');
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
        <div className="flex flex-col items-center mt-12">
            <div className="bg-[#1A1D24] border border-[#2C3038] rounded w-full max-w-lg overflow-hidden shadow-lg">
                <div className="bg-[#1D2128] border-b border-[#2C3038] px-6 py-4 flex items-center gap-3">
                    <Building className="text-[#4285F4] w-5 h-5" />
                    <h2 className="text-[#E8EAED] text-sm font-medium tracking-wide">Provision Organization</h2>
                </div>

                <div className="p-6">
                    <p className="text-[#9AA0A6] text-xs mb-6 leading-relaxed">
                        To begin anchoring assets, you must provision an organization identity on the Solana cluster. This maps your dashboard account to an on-chain PDA.
                    </p>

                    <form onSubmit={handleInit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-[#9AA0A6] uppercase tracking-wider">Project Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Acme Corp Institutional"
                                className="w-full px-3 py-2 bg-[#131418] border border-[#3C4043] rounded text-sm text-white focus:outline-none focus:border-[#4285F4] transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-[#9AA0A6] uppercase tracking-wider">Solana Identity (PDA/Wallet)</label>
                            <input
                                type="text"
                                required
                                value={pubkey}
                                onChange={(e) => setPubkey(e.target.value)}
                                placeholder="Public key for on-chain seeds"
                                className="w-full px-3 py-2 bg-[#131418] border border-[#3C4043] rounded text-sm text-[#4285F4] font-mono focus:outline-none focus:border-[#4285F4] transition-colors"
                            />
                        </div>

                        {error && <div className="text-[#F28B82] text-xs font-medium py-1">{error}</div>}

                        <div className="pt-2">
                            <button
                                disabled={loading}
                                className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white text-sm font-medium py-2 rounded transition-colors disabled:bg-[#3C4043] disabled:text-[#9AA0A6]"
                            >
                                {loading ? 'Provisioning...' : 'CREATE ORGANIZATION'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
