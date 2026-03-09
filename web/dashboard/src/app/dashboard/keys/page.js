"use client";

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { Key, Plus, Trash2, CheckCircle2, AlertCircle, Copy, X, ShieldCheck, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PurpleCard, GlowButton, PurpleBadge, PurpleTable,
    PurpleTableRow, PurpleInput, PurpleModal, MonoHash, PurpleSkeleton
} from '@/components/ui/PurpleUI';

export default function ApiKeysPage() {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [org, setOrg] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [newKeyData, setNewKeyData] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: orgData } = await api.get('/api/org');
                if (orgData) setOrg(orgData);

                const { data: apiKeysResponse } = await api.get('/api/keys');
                setKeys(apiKeysResponse?.keys || apiKeysResponse?.data || apiKeysResponse || []);
            } catch (e) {
                console.error("Failed to load keys");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateKey = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/api/keys', {
                name: nameInput,
            });
            setNewKeyData(data);
            setKeys([{
                id: data.id,
                name: nameInput,
                key: data.apiKey,
                createdAt: new Date().toISOString(),
                status: 'active'
            }, ...keys]);
            setNameInput('');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const deleteKey = async (id) => {
        if (!confirm('Are you sure you want to revoke this key?')) return;
        try {
            await api.delete(`/api/keys/${id}`);
            setKeys(keys.filter(k => k.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2">
                        API Credentials
                    </h1>
                    <p className="text-sm text-text-muted max-w-xl">
                        Issue cryptographically secure keys to authenticate your backend infrastructure,
                        automated CLI nodes, and enterprise integrations.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <GlowButton
                        onClick={() => { setNewKeyData(null); setShowCreateModal(true); }}
                        disabled={!org || fetching}
                        icon={Plus}
                        className="px-6"
                    >
                        NEW ENDPOINT KEY
                    </GlowButton>
                </motion.div>
            </div>

            {!org && !fetching && (
                <PurpleCard className="border-danger/30 bg-danger/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-danger/10 text-danger rounded-2xl">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-danger">Provider Identity Required</h4>
                            <p className="text-sm text-danger/70">You must initialize your organization identity on the dashboard before issuing production API credentials.</p>
                        </div>
                    </div>
                </PurpleCard>
            )}

            {/* Keys Table */}
            <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                <PurpleTable headers={["Endpoint Name", "Issued At", "Access Prefix", "Status", "Control"]}>
                    {fetching ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4"><PurpleSkeleton className="h-4 w-32" /></td>
                                <td className="px-6 py-4"><PurpleSkeleton className="h-4 w-40" /></td>
                                <td className="px-6 py-4"><PurpleSkeleton className="h-4 w-24" /></td>
                                <td className="px-6 py-4"><PurpleSkeleton className="h-6 w-16" /></td>
                                <td className="px-6 py-4"><PurpleSkeleton className="h-8 w-8 ml-auto" /></td>
                            </tr>
                        ))
                    ) : keys.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="p-0">
                                <div className="py-24 text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-purple-dim/10 border border-purple-vivid/20 flex items-center justify-center mb-6 mx-auto relative group">
                                        <Key className="w-10 h-10 text-purple-glow/40 group-hover:text-purple-glow transition-colors" />
                                        <div className="absolute inset-0 bg-purple-vivid/5 blur-2xl group-hover:bg-purple-vivid/10 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No active credentials</h3>
                                    <p className="text-text-muted text-sm max-w-sm mx-auto mb-8">
                                        Your organization has not issued any API keys yet. Create one to begin authenticating with the VDR network.
                                    </p>
                                    <GlowButton variant="ghost" onClick={() => setShowCreateModal(true)} icon={Plus}>ISSUE FIRST KEY</GlowButton>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        keys.map((k) => (
                            <PurpleTableRow key={k.id}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-dim/20 text-purple-vivid">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-sm text-text-primary">{k.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-text-muted font-mono">
                                    {new Date(k.createdAt).toUTCString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-mono text-xs text-purple-glow bg-purple-glow/5 px-2 py-1 rounded border border-purple-glow/10 inline-block">
                                        {k.key ? `${k.key.slice(0, 12)}••••••••` : k.apiKey ? `${k.apiKey.slice(0, 12)}••••••••` : '••••••••••••'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <PurpleBadge variant={k.status === 'active' ? 'success' : 'danger'} pulse={k.status === 'active'}>
                                        {k.status}
                                    </PurpleBadge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {k.status === 'active' && (
                                        <motion.button
                                            whileHover={{ scale: 1.1, color: '#EF4444' }}
                                            onClick={() => deleteKey(k.id)}
                                            className="text-text-muted p-2 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </motion.button>
                                    )}
                                </td>
                            </PurpleTableRow>
                        ))
                    )}
                </PurpleTable>
            </PurpleCard>

            {/* Modal */}
            <PurpleModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title={newKeyData ? "Credential Issued Successfully" : "Provision API Credential"}
            >
                {!newKeyData ? (
                    <form onSubmit={handleCreateKey} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Key Description</label>
                            <PurpleInput
                                required
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="e.g. Production Cluster A"
                                icon={Zap}
                            />
                        </div>
                        <div className="p-4 bg-purple-dim/10 rounded-2xl border border-purple-vivid/10 flex items-start gap-3">
                            <Info className="w-5 h-5 text-purple-glow shrink-0 mt-0.5" />
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                                API keys provide full administrative access to your organization's document registry.
                                Exercise caution and use restricted keys for specialized environments.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <GlowButton variant="ghost" type="button" onClick={() => setShowCreateModal(false)}>CANCEL</GlowButton>
                            <GlowButton type="submit" loading={loading} className="px-8">GENERATE KEY</GlowButton>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-warning shrink-0 mt-1" />
                            <div>
                                <h4 className="text-sm font-bold text-warning uppercase tracking-tight">Security Warning</h4>
                                <p className="text-[11px] text-warning/80 leading-relaxed">
                                    This secret will be permanently hidden after closing this window.
                                    Failure to store this key will result in loss of access to this endpoint.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Access Token</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black/40 border border-bg-border rounded-xl px-4 py-3 font-mono text-sm text-purple-glow break-all">
                                    {newKeyData.apiKey}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(newKeyData.apiKey)}
                                    className="p-3 bg-purple-vivid text-white rounded-xl hover:bg-purple-bright transition-colors shadow-lg shadow-purple-vivid/20"
                                >
                                    {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        <GlowButton variant="ghost" onClick={() => setShowCreateModal(false)} className="w-full py-4 text-xs font-bold uppercase tracking-widest">
                            I HAVE STORED THE SECRET SECURELY
                        </GlowButton>
                    </div>
                )}
            </PurpleModal>
        </div>
    );
}
