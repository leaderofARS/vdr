"use client";

/**
 * @file page.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/explorer/page.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */


import { useState } from "react";
import { Search, Hash, Clock, User, ExternalLink, ShieldCheck, Globe, Activity, Fingerprint } from "lucide-react";
import axios from "axios";
import { api } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Explorer() {
    const [searchQuery, setSearchQuery] = useState("");
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery || searchQuery.length < 32) {
            setError("Identification sequence too short. Enter a valid SHA-256 hash.");
            return;
        }

        setLoading(true);
        setError("");
        setRecord(null);

        try {
            // Use authenticated API helper to include JWT/Org context
            const { data } = await api.get(`/record/${searchQuery}`);
            setRecord(data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError("Cryptographic record not found in your institutional registry.");
            } else if (err.response?.status === 403) {
                setError("Access Denied: This record belongs to another organization.");
            } else {
                setError("Protocol Link Failure: Unable to reach the registry node.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-mesh opacity-30 pointer-events-none" />
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-20 pt-32 w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-accent mb-6">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Global Ledger Access</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                        Registry <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Explorer</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                        Resolve any SipHeron cryptographic proof directly from the Solana cluster.
                        Verify ownership, provenance, and integrity in real-time.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-[40px] p-2 mb-16 border border-white/10 shadow-2xl max-w-4xl mx-auto relative group"
                >
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                        <div className="flex-grow relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Fingerprint className="h-6 w-6 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-16 pr-6 py-6 border-none rounded-[32px] bg-transparent text-white placeholder-gray-600 focus:outline-none focus:ring-0 sm:text-lg font-mono"
                                placeholder="0x... or full 64-character SHA-256 hash"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-6 rounded-[32px] text-lg font-black text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {loading ? "Resolving..." : "Lookup Proof"}
                        </button>
                    </form>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute -bottom-10 left-8 text-red-400 text-sm font-bold"
                        >
                            {error}
                        </motion.p>
                    )}
                </motion.div>

                {/* Results Data */}
                <AnimatePresence>
                    {record && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass rounded-[48px] overflow-hidden border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] max-w-5xl mx-auto"
                        >
                            <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">Record Verified</h3>
                                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">On-Chain Consensus reached</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 font-mono text-xs">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    <span>Block Hash Validated</span>
                                </div>
                            </div>

                            <div className="px-10 py-10">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-3">
                                        <dt className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Hash className="w-3.5 h-3.5" /> Cryptographic Identity
                                        </dt>
                                        <dd className="text-sm font-mono break-all font-bold text-gray-200 bg-white/5 p-4 rounded-2xl border border-white/5">
                                            {record.hash}
                                        </dd>
                                    </div>

                                    <div className="space-y-3">
                                        <dt className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" /> Authorized Entity
                                        </dt>
                                        <dd className="text-sm font-mono break-all font-bold text-gray-200 bg-white/5 p-4 rounded-2xl border border-white/5">
                                            {record.owner}
                                        </dd>
                                    </div>

                                    <div className="space-y-3">
                                        <dt className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" /> Temporal Anchor
                                        </dt>
                                        <dd className="text-lg font-bold text-white flex flex-col gap-1">
                                            {new Date(record.timestamp * 1000).toLocaleString()}
                                            <span className="text-[10px] text-gray-500 font-mono">UNIX: {record.timestamp}</span>
                                        </dd>
                                    </div>

                                    <div className="space-y-3">
                                        <dt className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            Provenance Link
                                        </dt>
                                        <dd className="flex items-center gap-4">
                                            <code className="text-xs font-mono text-blue-400 bg-blue-400/5 px-4 py-2 rounded-xl border border-blue-400/10">
                                                {record.pdaAddress.slice(0, 12)}...{record.pdaAddress.slice(-8)}
                                            </code>
                                            <a
                                                href={`https://explorer.solana.com/address/${record.pdaAddress}?cluster=devnet`}
                                                target="_blank"
                                                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </dd>
                                    </div>

                                    {record.metadata && (
                                        <div className="md:col-span-2 space-y-3">
                                            <dt className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Associated Metadata</dt>
                                            <dd className="text-sm text-gray-400 font-medium bg-white/5 p-6 rounded-3xl border border-white/5">
                                                {record.metadata}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
