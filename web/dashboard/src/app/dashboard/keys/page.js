"use client";

/**
 * @file page.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/dashboard/keys/page.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { KeyRound, Plus, Copy, Check, ShieldCheck, Trash2, Cpu, Activity, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApiKeysPage() {
    const [keys, setKeys] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [copied, setCopied] = useState(null);
    const [org, setOrg] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user's primary organization
                const { data: orgs } = await api.get('/organizations/my');
                if (orgs && orgs.length > 0) {
                    setOrg(orgs[0]);
                }

                // Fetch existing keys
                const { data: apiKeys } = await api.get('/auth/api-keys');
                setKeys(apiKeys || []);
            } catch (e) {
                console.error("Infrastructure synchronization failed:", e);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, []);

    const generateKey = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/api-key', {
                name,
                organizationId: org?.id
            });

            // Add the new key to the list
            setKeys([{
                id: data.id,
                name,
                key: data.key,
                createdAt: new Date().toISOString(),
                organization: org ? { name: org.name } : null
            }, ...keys]);

            setName('');
        } catch (e) {
            alert('Security Protocol Error: Failed to generate cryptographic key.');
        } finally {
            setLoading(false);
        }
    };

    const deleteKey = async (id) => {
        if (!confirm('Are you sure you want to revoke this infrastructure token? This action is irreversible.')) return;

        try {
            await api.delete(`/auth/api-key/${id}`);
            setKeys(keys.filter(k => k.id !== id));
        } catch (e) {
            alert('Failed to revoke key. Please try again.');
        }
    };

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopied(idx);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-10 pb-20"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-3 flex items-center gap-4">
                        <Cpu className="w-8 h-8 text-blue-500" />
                        API Infrastructure
                    </h1>
                    <p className="text-gray-400 font-medium max-w-xl">
                        Provision secure access tokens for automated batch processing and CLI providers.
                        Keys are cryptographically unique to your institutional node.
                    </p>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl glass-accent">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">AES-256 Hardened</span>
                </div>
            </div>

            <div className="glass rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-white/5 bg-white/[0.02]">
                    <form onSubmit={generateKey} className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="flex-1 space-y-3 w-full">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Key Nomenclature</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600 font-bold"
                                    placeholder="e.g. Production Registry Node"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !org}
                            className="w-full md:w-auto h-[60px] px-8 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? 'Generating Entropy...' : (
                                <>
                                    <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                                    Generate Secret Token
                                </>
                            )}
                        </button>
                    </form>
                    {!org && !fetching && (
                        <p className="mt-4 text-xs font-bold text-amber-400/80 bg-amber-400/5 p-3 rounded-xl border border-amber-400/10 inline-block">
                            ⚠️ You must provision an Organization before generating infrastructure keys.
                        </p>
                    )}
                </div>

                <div className="p-8 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {keys.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-10 h-10 text-gray-700" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Vault Empty</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">No active API keys found for this institutional context. Roll a new key to begin integration.</p>
                            </motion.div>
                        ) : (
                            keys.map((k, idx) => (
                                <motion.div
                                    key={k.id || idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center justify-between p-6 glass rounded-2xl border border-white/5 group hover:border-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                            <KeyRound className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{k.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex flex-col gap-1">
                                                    <code className="text-[11px] text-gray-400 font-mono bg-black/40 px-3 py-1 rounded-md border border-white/5">
                                                        {k.key ? `${k.key.slice(0, 12)}••••••••••••${k.key.slice(-4)}` : '••••••••••••••••'}
                                                    </code>
                                                    {k.organization && (
                                                        <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest ml-1">
                                                            Institutional Context: {k.organization.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(k.key, idx)}
                                                    className="p-1.5 text-gray-500 hover:text-white transition-colors"
                                                >
                                                    {copied === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Created</p>
                                            <p className="text-xs font-bold text-gray-300">{new Date(k.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="h-8 w-[1px] bg-white/5 hidden sm:block" />
                                        <button
                                            onClick={() => deleteKey(k.id)}
                                            className="p-3 rounded-xl hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Documentation CTA */}
            <div className="glass p-8 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">Integration Guide</h4>
                        <p className="text-gray-500 text-sm font-medium">Learn how to authorize your CLI or backend with these tokens.</p>
                    </div>
                </div>
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all">
                    View API Docs &rarr;
                </button>
            </div>
        </motion.div>
    );
}
