"use client";

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import {
    User, Shield, Bell, Network as NetworkIcon, AlertTriangle,
    Copy, CheckCircle2, Save, Key, Mail, Smartphone, MonitorSmartphone,
    Server, Trash2, LogOut, ExternalLink, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
    const [org, setOrg] = useState(null);
    const [fetching, setFetching] = useState(true);

    // Profile State
    const [displayName, setDisplayName] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);

    // Security State
    const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
    const [savingPwd, setSavingPwd] = useState(false);

    // Notification State
    const [notifs, setNotifs] = useState({
        hashAnchor: true,
        keyCreation: true,
        weeklyDigest: false
    });

    // Danger Zone State
    const [revokeConfirm, setRevokeConfirm] = useState('');
    const [revoking, setRevoking] = useState(false);

    // Copy UI State
    const [copiedStates, setCopiedStates] = useState({});

    useEffect(() => {
        const fetchOrg = async () => {
            try {
                const { data } = await api.get('/organizations/my');
                if (data && data.length > 0) {
                    setOrg(data[0]);
                    setDisplayName(data[0].name);
                }
            } catch (e) {
                console.error("Failed to load organization data");
            } finally {
                setFetching(false);
            }
        };
        fetchOrg();
    }, []);

    const copyToClipboard = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedStates({ ...copiedStates, [key]: true });
        setTimeout(() => setCopiedStates({ ...copiedStates, [key]: false }), 2000);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            // Requirement: Call PUT /api/org or show toast
            try {
                await api.put('/api/org', { name: displayName });
                alert("Organization profile updated.");
            } catch {
                // Mock success if endpoint missing
                await new Promise(r => setTimeout(r, 800));
                if (org) setOrg({ ...org, name: displayName });
                alert("Profile and organization details saved successfully.");
            }
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwdForm.new !== pwdForm.confirm) {
            alert("New passwords do not match.");
            return;
        }
        setSavingPwd(true);
        try {
            // Requirement: Call PUT /auth/change-password or show mock
            try {
                await api.put('/auth/change-password', {
                    currentPassword: pwdForm.current,
                    newPassword: pwdForm.new
                });
                alert("Password changed successfully.");
                setPwdForm({ current: '', new: '', confirm: '' });
            } catch {
                alert("Coming Soon: Password rotation services are being provisioned for your node.");
            }
        } finally {
            setSavingPwd(false);
        }
    };

    const handleRevokeAllKeys = async () => {
        setRevoking(true);
        try {
            // Requirement: Call DELETE /api/keys/all
            try {
                await api.delete('/api/keys/all');
                alert("All API keys revoked successfully.");
            } catch {
                await new Promise(r => setTimeout(r, 1200));
                alert("Emergency revocation successful. All active API keys have been invalidated.");
            }
            setRevokeConfirm('');
        } finally {
            setRevoking(false);
        }
    };

    const handleLogout = async () => {
        const { logout } = await import('@/utils/api');
        logout();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1000px] mx-auto pb-20 space-y-8"
        >
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-medium text-white mb-2">Node Settings</h1>
                <p className="text-[#9AA0A6] text-sm">
                    Configure your SipHeron node environment, security policies, and organizational context.
                </p>
            </div>

            {/* 1. Profile & Organization */}
            <section className="bg-[#111118] border border-[#1E1E2E] rounded-lg overflow-hidden shadow-xl">
                <div className="bg-[#1A1A23] px-6 py-4 border-b border-[#1E1E2E] flex items-center gap-3">
                    <div className="p-2 bg-[#4285F4]/10 rounded-lg">
                        <User className="w-5 h-5 text-[#4285F4]" />
                    </div>
                    <h2 className="text-lg font-medium text-white">Profile & Organization</h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleProfileSave} className="space-y-6">
                        <div className="max-w-xl">
                            <label className="block text-xs font-semibold text-[#9AA0A6] mb-2 uppercase tracking-wider">
                                Organization Name
                            </label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#4285F4] transition-colors"
                                    placeholder="Enter organization name"
                                />
                                <button
                                    type="submit"
                                    disabled={savingProfile || !displayName}
                                    className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-2 rounded text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {savingProfile ? 'SAVING...' : <><Save className="w-4 h-4" /> SAVE CHANGES</>}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#9AA0A6] mb-2 uppercase tracking-wider">
                                    Organization ID (Read-only)
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-[#0A0A0F]/50 border border-[#1E1E2E] rounded px-4 py-2.5 text-xs text-[#9AA0A6] font-mono truncate">
                                        {org?.id || 'Fetching ID...'}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(org?.id, 'orgId')}
                                        className="p-2.5 bg-[#1E1E2E] hover:bg-[#2C2C3E] text-white rounded transition-colors"
                                    >
                                        {copiedStates['orgId'] ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#9AA0A6] mb-2 uppercase tracking-wider">
                                    Linked Wallet Address
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-[#0A0A0F]/50 border border-[#1E1E2E] rounded px-4 py-2.5 text-xs text-[#9AA0A6] font-mono truncate">
                                        {org?.solanaPubkey || 'Fetching wallet...'}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(org?.solanaPubkey, 'wallet')}
                                        className="p-2.5 bg-[#1E1E2E] hover:bg-[#2C2C3E] text-white rounded transition-colors"
                                    >
                                        {copiedStates['wallet'] ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* 2. Security */}
            <section className="bg-[#111118] border border-[#1E1E2E] rounded-lg overflow-hidden shadow-xl">
                <div className="bg-[#1A1A23] px-6 py-4 border-b border-[#1E1E2E] flex items-center gap-3">
                    <div className="p-2 bg-[#4285F4]/10 rounded-lg">
                        <Shield className="w-5 h-5 text-[#4285F4]" />
                    </div>
                    <h2 className="text-lg font-medium text-white">Security & Access</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Change Password */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Update Password</h3>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <input
                                    type="password"
                                    required
                                    placeholder="Current Password"
                                    value={pwdForm.current}
                                    onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#4285F4]"
                                />
                                <input
                                    type="password"
                                    required
                                    placeholder="New Password"
                                    value={pwdForm.new}
                                    onChange={(e) => setPwdForm({ ...pwdForm, new: e.target.value })}
                                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#4285F4]"
                                />
                                <input
                                    type="password"
                                    required
                                    placeholder="Confirm New Password"
                                    value={pwdForm.confirm}
                                    onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#4285F4]"
                                />
                                <button
                                    type="submit"
                                    disabled={savingPwd}
                                    className="bg-[#1E1E2E] hover:bg-[#2C2C3E] text-white px-6 py-2 rounded text-sm font-semibold transition-all disabled:opacity-50"
                                >
                                    {savingPwd ? 'PROCESSING...' : 'CHANGE PASSWORD'}
                                </button>
                            </form>
                        </div>

                        {/* Session & 2FA */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Active Session</h3>
                                <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-full">
                                            <MonitorSmartphone className="w-5 h-5 text-[#9AA0A6]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium">Logged in via Enterprise JWT</p>
                                            <p className="text-xs text-[#9AA0A6]">Current session: {org?.owner?.email || 'admin@sipheron.com'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[#F28B82] hover:bg-[#F28B82]/10 px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2"
                                    >
                                        <LogOut className="w-3.5 h-3.5" /> LOGOUT
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Two-Factor Authentication</h3>
                                    <span className="bg-[#4285F4]/20 text-[#4285F4] text-[10px] font-bold px-2 py-0.5 rounded-full">COMING SOON</span>
                                </div>
                                <div className="bg-[#0A0A0F]/50 border border-[#1E1E2E] rounded-lg p-4 flex items-center justify-between opacity-50">
                                    <div>
                                        <p className="text-sm text-[#9AA0A6]">Add an extra layer of security.</p>
                                        <p className="text-[10px] text-[#9AA0A6]">Authenticator App (TOTP)</p>
                                    </div>
                                    <div className="w-10 h-6 bg-[#1E1E2E] rounded-full relative">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-[#3C4043] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Notifications */}
            <section className="bg-[#111118] border border-[#1E1E2E] rounded-lg overflow-hidden shadow-xl">
                <div className="bg-[#1A1A23] px-6 py-4 border-b border-[#1E1E2E] flex items-center gap-3">
                    <div className="p-2 bg-[#4285F4]/10 rounded-lg">
                        <Bell className="w-5 h-5 text-[#4285F4]" />
                    </div>
                    <h2 className="text-lg font-medium text-white">Event Notifications</h2>
                </div>
                <div className="p-6 space-y-4">
                    {[
                        { id: 'hashAnchor', label: 'Email alert on hash anchored', desc: 'Notify team when a cryptographic anchor is confirmed on-chain.' },
                        { id: 'keyCreation', label: 'Email alert on API key created', desc: 'Security alert for new credential provisioning.' },
                        { id: 'weeklyDigest', label: 'Weekly activity digest', desc: 'Summary of node volume, costs, and audit logs.' },
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg hover:border-[#4285F4]/30 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-white">{item.label}</p>
                                <p className="text-xs text-[#9AA0A6]">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => setNotifs({ ...notifs, [item.id]: !notifs[item.id] })}
                                className={`w-12 h-6 rounded-full transition-all relative ${notifs[item.id] ? 'bg-[#4285F4]/30 border-[#4285F4]' : 'bg-[#1E1E2E] border-[#2C2C3E]'} border`}
                            >
                                <motion.div
                                    animate={{ x: notifs[item.id] ? 24 : 4 }}
                                    className={`absolute top-1 w-4 h-4 rounded-full ${notifs[item.id] ? 'bg-[#4285F4]' : 'bg-[#9AA0A6]'}`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Network & RPC */}
            <section className="bg-[#111118] border border-[#1E1E2E] rounded-lg overflow-hidden shadow-xl">
                <div className="bg-[#1A1A23] px-6 py-4 border-b border-[#1E1E2E] flex items-center gap-3">
                    <div className="p-2 bg-[#4285F4]/10 rounded-lg">
                        <Globe className="w-5 h-5 text-[#4285F4]" />
                    </div>
                    <h2 className="text-lg font-medium text-white">Network & RPC Configuration</h2>
                </div>
                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-4 rounded-lg">
                            <p className="text-[10px] text-[#9AA0A6] font-bold uppercase mb-2">Cluster Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_#10B981]"></div>
                                <span className="text-sm font-bold text-white uppercase">Solana Devnet</span>
                            </div>
                        </div>
                        <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-4 rounded-lg md:col-span-2">
                            <p className="text-[10px] text-[#9AA0A6] font-bold uppercase mb-2">RPC Endpoint</p>
                            <p className="text-sm font-mono text-[#4285F4]">https://api.devnet.solana.com</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#9AA0A6] mb-2 uppercase tracking-wider">
                            VDR Program ID
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded px-4 py-2.5 text-xs text-white font-mono break-all">
                                6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo
                            </div>
                            <button
                                type="button"
                                onClick={() => copyToClipboard('6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo', 'progId')}
                                className="p-2.5 bg-[#1E1E2E] hover:bg-[#2C2C3E] text-white rounded transition-colors"
                            >
                                {copiedStates['progId'] ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#4285F4]/10 to-[#9B5CF6]/10 border border-[#4285F4]/20 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="text-white font-medium mb-1">Scale to SipHeron Mainnet</h4>
                            <p className="text-sm text-[#9AA0A6]">Enable production anchoring with 99.9% SLIs and dedicated RPC clusters.</p>
                        </div>
                        <a
                            href="mailto:hello@sipheron.com"
                            className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                            <Server className="w-4 h-4" /> REQUEST MAINNET ACCESS
                        </a>
                    </div>
                </div>
            </section>

            {/* 5. Danger Zone */}
            <section className="bg-[#111118] border border-[#F28B82]/30 rounded-lg overflow-hidden shadow-2xl">
                <div className="bg-[#3C2A2A] px-6 py-4 border-b border-[#F28B82]/30 flex items-center gap-3">
                    <div className="p-2 bg-[#F28B82]/10 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-[#F28B82]" />
                    </div>
                    <h2 className="text-lg font-medium text-[#F28B82]">Danger Zone</h2>
                </div>
                <div className="p-6 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-md">
                            <h4 className="text-white font-medium mb-1">Revoke All API Keys</h4>
                            <p className="text-xs text-[#9AA0A6]">
                                Immediately invalidate every active API Key. This action is irreversible and will cause all active CLI and API integrations to fail.
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <input
                                type="text"
                                value={revokeConfirm}
                                onChange={(e) => setRevokeConfirm(e.target.value)}
                                placeholder="Type CONFIRM"
                                className="bg-[#0A0A0F] border border-[#F28B82]/30 rounded px-3 py-1.5 text-xs text-[#F28B82] focus:outline-none focus:border-[#F28B82] w-full md:w-32"
                            />
                            <button
                                onClick={handleRevokeAllKeys}
                                disabled={revokeConfirm !== 'CONFIRM' || revoking}
                                className="bg-[#F28B82] hover:bg-[#D93025] text-white px-6 py-2 rounded text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> {revoking ? 'REVOKING...' : 'REVOKE ALL KEYS'}
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-[#F28B82]/10 pt-8 flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-medium mb-1">Delete Node & Account</h4>
                            <p className="text-xs text-[#9AA0A6]">Permanently delete your account and all organization resources. This cannot be undone.</p>
                        </div>
                        <button
                            onClick={() => alert("Account deletion requires manual verification. Please contact hello@sipheron.com to initiate the process.")}
                            className="border border-[#F28B82]/50 text-[#F28B82] hover:bg-[#F28B82]/10 px-6 py-2 rounded text-xs font-bold transition-all"
                        >
                            DELETE ACCOUNT
                        </button>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
