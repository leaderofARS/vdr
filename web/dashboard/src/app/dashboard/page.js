"use client";
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, FileDigit, Building, Users, Activity } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/analytics/stats');
                setStats(data);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Platform Analytics</h1>
                <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <Activity className="w-4 h-4 mr-2" />
                    Live Network Sync
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Hashes Anchored" value={stats?.totalHashes || 0} icon={FileDigit} color="blue" />
                <StatCard title="Active Integrity Rate" value={`${stats?.activeRate || 100}%`} icon={ShieldCheck} color="emerald" />
                <StatCard title="Organizations" value={stats?.totalOrganizations || 0} icon={Building} color="purple" />
                <StatCard title="Admin Accounts" value={stats?.totalUsers || 0} icon={Users} color="orange" />
            </div>

            {/* Charts Array */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 font-sans">Recent Anchor Volume</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.recentRecords?.map((r, i) => ({ name: `Record ${i + 1}`, val: 1 })) || []}>
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="val" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-center items-center text-center">
                    <AlertCircle className="w-16 h-16 text-yellow-500 mb-4 opacity-80" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Revocation Index</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">{stats?.revokedHashes || 0} hashes have been cryptographically revoked by Authoritative Issuers.</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    const colorMap = {
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
                <div className={`p-3 rounded-xl ${colorMap[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
        </div>
    );
}

// Temporary icon stub for ShieldCheck if missing
function ShieldCheck(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
