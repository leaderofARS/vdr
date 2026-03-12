'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import {
    Key, Plus, Trash2, Copy, Check, Info, AlertTriangle,
    Zap, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PurpleCard, GlowButton, PurpleBadge, PurpleSkeleton,
    PurpleInput, PurpleTable, PurpleTableRow, PurpleModal
} from '@/components/ui/PurpleUI';

export default function ApiKeysPage() {
    const [mounted, setMounted] = useState(false);
    const [toast, setToast] = useState(null);
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [org, setOrg] = useState(null);
    const [myRole, setMyRole] = useState('member');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [scopeInput, setScopeInput] = useState('write');
    const [createLoading, setCreateLoading] = useState(false);
    const [newKeyData, setNewKeyData] = useState(null);
    const [copied, setCopied] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [revealModalOpen, setRevealModalOpen] = useState(false);
    const [revealKeyInput, setRevealKeyInput] = useState('');
    const [revealCopied, setRevealCopied] = useState(false);
    const [sessionKeys, setSessionKeys] = useState({}); // id -> rawKey, lost on page refresh

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // FIX 1: Remove toast from dependency array — was causing infinite loop
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [orgRes, keysRes, roleRes] = await Promise.allSettled([
                api.get('/api/org'),
                api.get('/api/keys'),
                api.get('/api/members/me/role')
            ]);

            if (orgRes.status === 'fulfilled') setOrg(orgRes.value.data);
            if (roleRes.status === 'fulfilled') setMyRole(roleRes.value.data.role || 'member');

            if (keysRes.status === 'fulfilled') {
                // Backend returns pagination wrapper: { data: [...], total, page, limit }
                const body = keysRes.value.data;
                const arr = Array.isArray(body) ? body
                    : Array.isArray(body?.data) ? body.data
                        : Array.isArray(body?.keys) ? body.keys
                            : [];
                setKeys(arr);
            } else {
                console.error('Keys fetch failed:', keysRes.reason);
                showToast('Failed to load API keys', 'error');
            }
        } catch (e) {
            console.error('fetchData error:', e);
            showToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    }, []); // FIX: empty deps — only run once on mount

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, [fetchData]);

    // FIX 2: Use onClick instead of form onSubmit — no <form> tag
    const handleCreate = async () => {
        if (!nameInput.trim()) {
            showToast('Please enter a key name', 'error');
            return;
        }
        setCreateLoading(true);
        try {
            const { data } = await api.post('/api/keys', {
                name: nameInput.trim(),
                scope: scopeInput  // FIX: always send scope explicitly
            });

            // data = { success, apiKey, id, message }
            setNewKeyData(data);

            // Add to session keys for persistence in this view
            setSessionKeys(prev => ({ ...prev, [data.id]: data.apiKey }));

            // Add to list — backend doesn't return the raw key in list view
            // so we store it temporarily for display only
            setKeys(prev => [{
                id: data.id,
                name: nameInput.trim(),
                status: 'active',
                createdAt: new Date().toISOString(),
                lastUsedAt: null,
                _newKey: data.apiKey  // temporary — only shown once
            }, ...prev]);

            setNameInput('');
            setScopeInput('write');
            showToast('API key created successfully');
        } catch (e) {
            console.error('Create key error:', e.response?.data || e.message);
            const msg = e.response?.data?.error || 'Failed to create key';
            showToast(msg, 'error');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleRevealCopy = () => {
        if (!revealKeyInput.trim()) return;
        navigator.clipboard.writeText(revealKeyInput.trim());
        setRevealCopied(true);
        showToast('Key copied to clipboard');
        setTimeout(() => setRevealCopied(false), 2000);
    };

    // FIX 3: Delete — confirm before deleting, handle errors properly
    const handleDelete = async (id) => {
        if (deleteConfirmId !== id) {
            setDeleteConfirmId(id);
            setTimeout(() => setDeleteConfirmId(null), 3000);
            return;
        }
        setDeleteConfirmId(null);
        try {
            await api.delete(`/api/keys/${id}`);
            setKeys(prev => prev.filter(k => k.id !== id));
            showToast('API key revoked');
        } catch (e) {
            console.error('Delete key error:', e.response?.data || e.message);
            const msg = e.response?.data?.error || 'Failed to revoke key';
            showToast(msg, 'error');
        }
    };

    const handleCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        showToast('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) return null;

    return (
        <div className="space-y-8 pb-20 relative">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-[150] flex items-center gap-3 px-6 py-4 rounded-2xl bg-bg-surface border border-bg-border shadow-2xl backdrop-blur-xl"
                    >
                        {toast.type === 'error'
                            ? <XCircle className="w-6 h-6 text-danger" />
                            : <CheckCircle2 className="w-6 h-6 text-success" />
                        }
                        <p className="font-bold text-sm tracking-wide">{toast.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute inset-x-0 -top-20 h-64 bg-purple-glow/5 blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2">
                        API Credentials
                    </h1>
                    <p className="text-text-muted text-sm">Issue secure keys to authenticate your backend infrastructure.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <GlowButton
                        onClick={() => { setNewKeyData(null); setCreateModalOpen(true); }}
                        disabled={!org || (myRole !== 'admin' && myRole !== 'owner')}
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
                        <p className="text-[12px] text-text-muted mt-1">
                            Initialize your organization identity before issuing API credentials.
                        </p>
                    </div>
                </div>
            )}

            {/* Keys Table */}
            <PurpleCard className="p-0 border-bg-border/50">
                <PurpleTable headers={["Key Name", "Prefix", "Scope", "Status", "Created", ""]}>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i}>
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <td key={j} className="px-5 py-5">
                                        <PurpleSkeleton className="h-4 w-24" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : keys.length > 0 ? (
                        keys.map((row) => (
                            <PurpleTableRow key={row.id}>
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
                                        {/* Backend only returns raw key at creation time */}
                                        {row._newKey || sessionKeys[row.id]
                                            ? `${(row._newKey || sessionKeys[row.id]).slice(0, 12)}••••`
                                            : '••••••••••••'}
                                    </code>
                                </td>
                                <td className="px-5 py-4">
                                    <PurpleBadge variant="ghost">
                                        {row.scope || 'write'}
                                    </PurpleBadge>
                                </td>
                                <td className="px-5 py-4">
                                    <PurpleBadge variant={row.status === 'active' ? 'success' : 'danger'}>
                                        {row.status}
                                    </PurpleBadge>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-[12px] text-text-muted font-mono">
                                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        {/* Copy button — opens paste-your-key modal */}
                                        <GlowButton
                                            variant="ghost"
                                            onClick={() => { setRevealKeyInput(''); setRevealCopied(false); setRevealModalOpen(true); }}
                                            className="!px-3 !py-1.5 min-h-0 text-xs"
                                            title="Copy key"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </GlowButton>

                                        {/* If key was just created this session, show direct copy */}
                                        {(row._newKey || sessionKeys[row.id]) && (
                                            <GlowButton
                                                variant="ghost"
                                                onClick={() => handleCopy(row._newKey || sessionKeys[row.id])}
                                                className="!px-3 !py-1.5 min-h-0 text-xs text-success"
                                                title="Copy new key"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </GlowButton>
                                        )}
                                        {(myRole === 'admin' || myRole === 'owner') && (
                                            <GlowButton
                                                variant={deleteConfirmId === row.id ? 'danger' : 'ghost'}
                                                onClick={() => handleDelete(row.id)}
                                                className="!px-3 !py-1.5 min-h-0 text-xs"
                                                title={deleteConfirmId === row.id ? 'Click again to confirm' : 'Revoke key'}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                {deleteConfirmId === row.id && (
                                                    <span className="ml-1 text-[10px]">Confirm?</span>
                                                )}
                                            </GlowButton>
                                        )}
                                    </div>
                                </td>
                            </PurpleTableRow>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-0">
                                <div className="py-24 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-purple-dim/10 border border-purple-vivid/20 flex items-center justify-center mb-6 relative">
                                        <Key className="w-10 h-10 text-purple-glow/40" />
                                        <div className="absolute inset-0 bg-purple-vivid/5 blur-2xl animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No credentials yet</h3>
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

            {/* Create Modal */}
            <PurpleModal
                isOpen={createModalOpen}
                onClose={() => { setCreateModalOpen(false); setNewKeyData(null); setNameInput(''); }}
                title={newKeyData ? "Secret Key Issued" : "Create Secret Key"}
            >
                {!newKeyData ? (
                    // FIX: NO <form> tag — use div + onClick
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">
                                Key Name
                            </label>
                            <PurpleInput
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="e.g. Production Cluster"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">
                                Scope
                            </label>
                            <select
                                value={scopeInput}
                                onChange={(e) => setScopeInput(e.target.value)}
                                className="w-full bg-bg-surface border border-bg-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-purple-vivid"
                            >
                                <option value="read">Read — GET requests only</option>
                                <option value="write">Write — GET + POST/PUT (default)</option>
                                <option value="admin">Admin — Full access including DELETE</option>
                            </select>
                        </div>

                        <div className="p-4 bg-purple-vivid/10 border border-purple-vivid/20 rounded-lg flex gap-3">
                            <div className="mt-0.5">
                                <Info className="w-5 h-5 text-purple-vivid shrink-0" />
                            </div>
                            <p className="text-[12px] text-text-secondary leading-relaxed">
                                Secret keys authenticate your backend systems. Never expose them in client-side code.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <GlowButton
                                variant="ghost"
                                onClick={() => { setCreateModalOpen(false); setNameInput(''); }}
                            >
                                Cancel
                            </GlowButton>
                            <GlowButton
                                onClick={handleCreate}
                                loading={createLoading}
                                disabled={!nameInput.trim() || createLoading}
                            >
                                Generate Key
                            </GlowButton>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg flex gap-3">
                            <div className="mt-0.5">
                                <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] font-bold text-warning">Save this key now</p>
                                <p className="text-[12px] text-text-secondary mt-1">
                                    This is the only time the full key will be shown. Store it securely.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">
                                Secret Key
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black border border-bg-border rounded-md px-4 py-3 font-mono text-[13px] text-purple-glow break-all select-all">
                                    {newKeyData.apiKey}
                                </div>
                                <GlowButton
                                    variant="ghost"
                                    className="!px-4"
                                    onClick={() => handleCopy(newKeyData.apiKey)}
                                >
                                    {copied
                                        ? <Check className="w-5 h-5 text-success" />
                                        : <Copy className="w-5 h-5" />
                                    }
                                </GlowButton>
                            </div>
                        </div>

                        <GlowButton
                            className="w-full mt-8"
                            onClick={() => { setCreateModalOpen(false); setNewKeyData(null); }}
                        >
                            I have saved the key
                        </GlowButton>
                    </div>
                )}
            </PurpleModal>

            {/* Reveal / Paste Key Modal */}
            <PurpleModal
                isOpen={revealModalOpen}
                onClose={() => { setRevealModalOpen(false); setRevealKeyInput(''); setRevealCopied(false); }}
                title="Copy API Key"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-purple-vivid/10 border border-purple-vivid/20 rounded-lg flex gap-3">
                        <div className="mt-0.5">
                            <Info className="w-5 h-5 text-purple-vivid shrink-0" />
                        </div>
                        <p className="text-[12px] text-text-secondary leading-relaxed">
                            API keys are not stored in plain text for security. Paste your key below to copy it to clipboard, or retrieve it from where you saved it originally.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">
                            Paste Your Key
                        </label>
                        <div className="flex gap-2">
                            <PurpleInput
                                value={revealKeyInput}
                                onChange={(e) => setRevealKeyInput(e.target.value)}
                                placeholder="svdr_••••••••••••••••"
                                type="password"
                            />
                            <GlowButton
                                variant="ghost"
                                className="!px-4 shrink-0"
                                onClick={handleRevealCopy}
                                disabled={!revealKeyInput.trim()}
                            >
                                {revealCopied
                                    ? <Check className="w-5 h-5 text-success" />
                                    : <Copy className="w-5 h-5" />
                                }
                            </GlowButton>
                        </div>
                    </div>

                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg flex gap-3">
                        <div className="mt-0.5">
                            <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-warning">Lost your key?</p>
                            <p className="text-[12px] text-text-secondary mt-1">
                                If you no longer have access to your key, revoke it and create a new one. Rate limits reset every 15 minutes.
                            </p>
                        </div>
                    </div>

                    <GlowButton
                        className="w-full"
                        onClick={() => { setRevealModalOpen(false); setRevealKeyInput(''); }}
                    >
                        Done
                    </GlowButton>
                </div>
            </PurpleModal>
        </div>
    );
}
