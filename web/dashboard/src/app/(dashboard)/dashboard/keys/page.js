'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import {
    Key, Plus, Trash2, Copy, Check, Info, AlertTriangle,
    Zap, Search, ChevronLeft, ChevronRight, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
    PurpleCard, GlowButton, PurpleBadge, MonoHash, PurpleSkeleton,
    PurpleInput, PurpleTable, PurpleTableRow, PurpleModal
} from '@/components/ui/PurpleUI';

export default function ApiKeysPage() {
    const [mounted, setMounted] = useState(false);

    // Toast state
    const [toast, setToast] = useState(null);

    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [org, setOrg] = useState(null);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [newKeyData, setNewKeyData] = useState(null);
    const [copied, setCopied] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [orgRes, keysRes] = await Promise.all([
                api.get('/api/org'),
                api.get('/api/keys')
            ]);
            setOrg(orgRes.data);
            const keysData = keysRes.data?.keys || keysRes.data?.data || keysRes.data || [];
            setKeys(keysData);
        } catch (e) {
            console.error(e);
            showToast('Failed to load credentials', 'error');
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, [fetchData]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            const { data } = await api.post('/api/keys', { name: nameInput });
            setNewKeyData(data);
            setKeys(prev => [{
                id: data.id,
                name: nameInput,
                key: data.apiKey,
                createdAt: new Date().toISOString(),
                status: 'active'
            }, ...prev]);
            setNameInput('');
            showToast('Key created successfully');
        } catch (e) {
            showToast('Failed to create key', 'error');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/keys/${id}`);
            setKeys(prev => prev.filter(k => k.id !== id));
            showToast('Credential revoked');
        } catch (e) {
            showToast('Failed to revoke key', 'error');
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        showToast('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) return null;

    return (
        <div className="space-y-8 pb-20 relative">
            {/* Global Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-[150] flex items-center gap-3 px-6 py-4 rounded-2xl bg-bg-surface border border-bg-border shadow-2xl backdrop-blur-xl"
                    >
                        {toast.type === 'error' ? (
                            <XCircle className="w-6 h-6 text-danger" />
                        ) : (
                            <CheckCircle2 className="w-6 h-6 text-success" />
                        )}
                        <p className="font-bold text-sm tracking-wide">{toast.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute inset-x-0 -top-20 h-64 bg-purple-glow/5 blur-[120px] pointer-events-none" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2">
                        API Credentials
                    </h1>
                    <p className="text-text-muted text-sm">Issue secure keys to authenticate your backend infrastructure.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <GlowButton
                        onClick={() => { setNewKeyData(null); setCreateModalOpen(true); }}
                        disabled={!org}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Secret Key
                    </GlowButton>
                </motion.div>
            </div>

            {!org && !loading && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
                    <div>
                        <p className="text-[13px] font-bold text-danger">Organization Profile Required</p>
                        <p className="text-[12px] text-text-muted mt-1">Initialize your organization identity before issuing API credentials.</p>
                    </div>
                </div>
            )}

            <PurpleCard className="p-0 border-bg-border/50">
                <PurpleTable headers={["Endpoint Name", "Access Prefix", "Status", "Created", ""]}>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i}>
                                <td className="px-5 py-5"><PurpleSkeleton className="h-4 w-32" /></td>
                                <td className="px-5 py-5"><PurpleSkeleton className="h-4 w-48" /></td>
                                <td className="px-5 py-5"><PurpleSkeleton className="h-4 w-24" /></td>
                                <td className="px-5 py-5"><PurpleSkeleton className="h-4 w-16" /></td>
                                <td className="px-5 py-5"><PurpleSkeleton className="h-4 w-8 ml-auto" /></td>
                            </tr>
                        ))
                    ) : keys.length > 0 ? (
                        keys.map((row, i) => (
                            <PurpleTableRow key={i}>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 rounded-md bg-purple-vivid/10 text-purple-vivid">
                                            <Zap className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-bold text-sm text-text-primary">{row.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <code className="text-[12px] text-text-muted font-mono bg-black/40 px-2 py-1 rounded border border-bg-border">
                                        {row.key ? `${row.key.slice(0, 12)}••••` : row.apiKey ? `${row.apiKey.slice(0, 12)}••••` : '••••••••'}
                                    </code>
                                </td>
                                <td className="px-5 py-4">
                                    <PurpleBadge variant={row.status === 'active' ? 'success' : 'danger'}>
                                        {row.status}
                                    </PurpleBadge>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-[12px] text-text-muted font-mono">
                                        {new Date(row.createdAt).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-right flex gap-2 justify-end">
                                    <GlowButton
                                        variant="ghost"
                                        onClick={() => handleCopy(row.key || row.apiKey)}
                                        className="!px-3 !py-1.5 min-h-0 text-xs"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </GlowButton>
                                    <GlowButton
                                        variant="danger"
                                        onClick={() => handleDelete(row.id)}
                                        className="!px-3 !py-1.5 min-h-0 text-xs"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </GlowButton>
                                </td>
                            </PurpleTableRow>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-0">
                                <div className="py-24 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-purple-dim/10 border border-purple-vivid/20 flex items-center justify-center mb-6 relative">
                                        <Key className="w-10 h-10 text-purple-glow/40" />
                                        <div className="absolute inset-0 bg-purple-vivid/5 blur-2xl animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No credentials</h3>
                                    <p className="text-text-muted text-sm max-w-sm mb-8">
                                        You haven't issued any API keys for this organization yet.
                                    </p>
                                    <GlowButton variant="ghost" onClick={() => setCreateModalOpen(true)}>
                                        Issue your first key
                                    </GlowButton>
                                </div>
                            </td>
                        </tr>
                    )}
                </PurpleTable>
            </PurpleCard>

            <PurpleModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                title={newKeyData ? "Secret Key Issued" : "Create Secret Key"}
            >
                {!newKeyData ? (
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Key Description</label>
                            <PurpleInput
                                required
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="e.g. Production Cluster"
                            />
                        </div>

                        <div className="p-4 bg-purple-vivid/10 border border-purple-vivid/20 rounded-lg flex gap-3">
                            <Info className="w-5 h-5 text-purple-vivid shrink-0 mt-0.5" />
                            <p className="text-[12px] text-text-secondary leading-relaxed">
                                Secret keys provide full administrative access to your document registry.
                                Keep them secure and never share them in client-side code.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <GlowButton variant="ghost" onClick={() => setCreateModalOpen(false)}>Cancel</GlowButton>
                            <GlowButton type="submit" loading={createLoading}>
                                Generate Key
                            </GlowButton>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-[13px] font-bold text-warning">Save this secret</p>
                                <p className="text-[12px] text-text-secondary mt-1">
                                    For security, this secret will only be shown once. If you lose it, you'll need to revoke the key and create a new one.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Secret Key</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black border border-bg-border rounded-md px-4 py-3 font-mono text-[13px] text-purple-glow break-all">
                                    {newKeyData.apiKey}
                                </div>
                                <GlowButton variant="ghost" className="!px-4" onClick={() => handleCopy(newKeyData.apiKey)}>
                                    {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
                                </GlowButton>
                            </div>
                        </div>

                        <GlowButton className="w-full mt-8" onClick={() => setCreateModalOpen(false)}>
                            I have saved the secret
                        </GlowButton>
                    </div>
                )}
            </PurpleModal>
        </div>
    );
}
