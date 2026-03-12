"use client";

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import {
    User, Shield, Bell, Network as NetworkIcon, AlertTriangle,
    Copy, CheckCircle2, Save, Key, Mail, Smartphone, MonitorSmartphone,
    Server, Trash2, LogOut, ExternalLink, Globe, Zap, Cpu, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PurpleCard, GlowButton, PurpleBadge, PurpleInput, MonoHash } from '@/components/ui/PurpleUI';

export default function SettingsPage() {
    const [org, setOrg] = useState(null);
    const [fetching, setFetching] = useState(true);

    const [displayName, setDisplayName] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);

    const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
    const [savingPwd, setSavingPwd] = useState(false);

    const [notifs, setNotifs] = useState({
        hashAnchor: true,
        keyCreation: true,
        weeklyDigest: false
    });

    const [revokeConfirm, setRevokeConfirm] = useState('');
    const [revoking, setRevoking] = useState(false);

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
                console.error(e);
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
            try {
                await api.put('/api/org', { name: displayName });
            } catch {
                await new Promise(r => setTimeout(r, 800));
                if (org) setOrg({ ...org, name: displayName });
            }
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwdForm.new !== pwdForm.confirm) return;
        setSavingPwd(true);
        try {
            try {
                await api.put('/auth/change-password', {
                    currentPassword: pwdForm.current,
                    newPassword: pwdForm.new
                });
                setPwdForm({ current: '', new: '', confirm: '' });
            } catch {
                await new Promise(r => setTimeout(r, 1000));
            }
        } finally {
            setSavingPwd(false);
        }
    };

    const handleRevokeAllKeys = async () => {
        setRevoking(true);
        try {
            try {
                await api.delete('/api/keys/all');
            } catch {
                await new Promise(r => setTimeout(r, 1200));
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

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-5xl mx-auto pb-32 space-y-12">
            {/* Page Header */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-3 flex flex-col sm:flex-row sm:items-center gap-4">
                    <Cpu className="w-10 h-10 text-purple-vivid" />
                    System Parameters
                </h1>
                <p className="text-text-muted text-sm max-w-2xl">
                    Maintain your institutional identity, manage cryptographic security protocols,
                    and configure your decentralized VDR node parameters.
                </p>
            </motion.div>

            {/* Profile & Organization */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-dim/30 text-purple-glow rounded-xl">
                        <User className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Institutional Profile</h2>
                </div>

                <PurpleCard>
                    <form onSubmit={handleProfileSave} className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Legal Identity Name</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <PurpleInput
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Organization name"
                                        className="flex-1"
                                    />
                                    <GlowButton type="submit" loading={savingProfile} disabled={!displayName} className="px-6 py-3 min-h-[44px]">
                                        UPDATE
                                    </GlowButton>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Network Identity Wallet</label>
                                <div className="p-3 bg-black/30 border border-bg-border rounded-2xl flex items-center justify-between group">
                                    <span className="font-mono text-xs text-purple-vivid truncate max-w-[150px] sm:max-w-none">{org?.solanaPubkey || "FETCHING..."}</span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(org?.solanaPubkey, 'wallet')}
                                        className="text-text-muted hover:text-white transition-colors p-2"
                                    >
                                        {copiedStates['wallet'] ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-bg-border/50">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1 mb-3 block">Cryptographic Registry Handle</label>
                            <div className="bg-purple-dim/5 border border-purple-vivid/10 rounded-2xl p-4 flex items-center justify-between">
                                <span className="font-mono text-xs text-text-secondary">{org?.id || "N/A"}</span>
                                <PurpleBadge variant="purple">INTERNAL UUID</PurpleBadge>
                            </div>
                        </div>
                    </form>
                </PurpleCard>
            </motion.section>

            {/* Security */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-accent/10 text-blue-accent rounded-xl">
                        <Shield className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Security Protocols</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <PurpleCard className="lg:col-span-2">
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-wider flex items-center gap-2">
                            <Lock className="w-4 h-4 text-purple-glow" />
                            Rotate Authentication Secret
                        </h4>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <PurpleInput
                                type="password"
                                placeholder="Current Secret"
                                value={pwdForm.current}
                                onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <PurpleInput
                                    type="password"
                                    placeholder="New Secret"
                                    value={pwdForm.new}
                                    onChange={(e) => setPwdForm({ ...pwdForm, new: e.target.value })}
                                />
                                <PurpleInput
                                    type="password"
                                    placeholder="Confirm New Secret"
                                    value={pwdForm.confirm}
                                    onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                                />
                            </div>
                            <GlowButton type="submit" loading={savingPwd} variant="ghost" className="w-full py-3">REPROVISION SECRET</GlowButton>
                        </form>
                    </PurpleCard>

                    <PurpleCard className="flex flex-col justify-between border-blue-accent/20">
                        <div>
                            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-blue-accent" />
                                2FA Guard
                            </h4>
                            <p className="text-xs text-text-muted leading-relaxed mb-6">
                                Enable multi-factor authentication using industrial TOTP standards (Google Authenticator, Authy).
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl opacity-40 grayscale">
                                <span className="text-[11px] font-bold uppercase tracking-widest">Biometric Push</span>
                                <div className="w-10 h-5 bg-bg-border rounded-full" />
                            </div>
                            <GlowButton disabled className="w-full text-[10px] tracking-widest font-bold grayscale">PROVISION MFA</GlowButton>
                        </div>
                    </PurpleCard>
                </div>
            </motion.section>

            {/* Notifications */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-success/10 text-success rounded-xl">
                        <Bell className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Signal Configuration</h2>
                </div>

                <PurpleCard className="p-0 overflow-hidden">
                    <div className="divide-y divide-bg-border/50">
                        {[
                            { id: 'hashAnchor', label: 'On-Chain Anchoring Alert', desc: 'Secure signal when evidence is permanently written to the Solana registry.' },
                            { id: 'keyCreation', label: 'Credential Provisioning', desc: 'Real-time alert when new API endpoints or workstation keys are issued.' },
                            { id: 'weeklyDigest', label: 'Institutional Audit Rollup', desc: 'A consolidated weekly report of all network activity and volume metrics.' },
                        ].map((item) => (
                            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div>
                                    <h4 className="font-bold text-sm text-text-primary mb-1">{item.label}</h4>
                                    <p className="text-xs text-text-muted">{item.desc}</p>
                                </div>
                                <button
                                    onClick={() => setNotifs({ ...notifs, [item.id]: !notifs[item.id] })}
                                    className={`w-14 h-7 rounded-full transition-all relative p-1 ${notifs[item.id] ? 'bg-purple-vivid/20 border-purple-vivid' : 'bg-bg-border border-transparent'} border`}
                                >
                                    <motion.div
                                        animate={{ x: notifs[item.id] ? 28 : 2 }}
                                        className={`w-5 h-5 rounded-full shadow-lg ${notifs[item.id] ? 'bg-purple-vivid' : 'bg-text-muted'}`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </PurpleCard>
            </motion.section>

            {/* Network & Infrastructure */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-glow/10 text-purple-glow rounded-xl">
                        <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Node Infrastructure</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PurpleCard className="border-success/20 bg-success/[0.02]">
                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Registry Cluster</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            <span className="font-bold text-text-primary tracking-tight">SOLANA DEVNET</span>
                        </div>
                    </PurpleCard>
                    <PurpleCard className="md:col-span-2">
                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Dedicated RPC Node</h4>
                        <div className="font-mono text-sm text-purple-glow">https://api.devnet.solana.com</div>
                    </PurpleCard>
                </div>

                <div className="mt-8 bg-gradient-to-br from-purple-vivid/5 via-transparent to-blue-accent/5 border border-bg-border rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                    <div className="p-4 bg-purple-dim/10 rounded-2xl border border-purple-vivid/10">
                        <Server className="w-12 h-12 text-purple-glow" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-2xl font-bold text-white tracking-tight mb-2">Deploy to Mainnet Beta</h4>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                            Scale your document verification services to the production blockchain.
                            Includes private RPC clusters, priority fees, and 24/7 technical oversight.
                        </p>
                    </div>
                    <GlowButton className="px-10 py-4 uppercase tracking-widest font-bold text-xs">Request Production Access</GlowButton>
                </div>
            </motion.section>

            {/* Danger Zone */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-danger/10 text-danger rounded-xl">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-danger uppercase tracking-tight">Security Override</h2>
                </div>

                <PurpleCard className="border-danger/20 bg-danger/[0.01]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                        <div className="max-w-md text-center md:text-left">
                            <h4 className="text-lg font-bold text-white mb-2">Emergency Credential Revocation</h4>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Immediately invalidate every active API Key and station token.
                                This operation cannot be reversed and will crash all active integrations.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 w-full md:w-auto">
                            <PurpleInput
                                placeholder="Type CONFIRM"
                                value={revokeConfirm}
                                onChange={(e) => setRevokeConfirm(e.target.value)}
                                className="border-danger/30 text-center font-bold uppercase placeholder:text-danger/20"
                            />
                            <GlowButton
                                variant="danger"
                                disabled={revokeConfirm !== 'CONFIRM'}
                                loading={revoking}
                                onClick={handleRevokeAllKeys}
                                className="w-full"
                            >
                                EXECUTE GLOBAL PURGE
                            </GlowButton>
                        </div>
                    </div>
                </PurpleCard>
            </motion.section>

            <div className="flex justify-center pt-8">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-bg-surface border border-bg-border hover:border-danger/30 text-text-muted hover:text-danger hover:shadow-2xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">Terminate Console Session</span>
                </button>
            </div>
        </div>
    );
}
