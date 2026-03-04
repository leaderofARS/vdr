"use client";

/**
 * @file page.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/verify/page.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */


import { useState } from "react";
import Navbar from "@/components/Navbar";
import FileUploader from "@/components/FileUploader";
import axios from "axios";
import { Loader2, ShieldCheck, ShieldAlert, FileSearch, Globe, Activity, Landmark, ExternalLink as ExternalIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Verify() {
    const [hash, setHash] = useState(null);
    const [status, setStatus] = useState("idle"); // idle, verifying, success, error, tampered
    const [result, setResult] = useState(null);

    const handleHashComputed = async (computedHash) => {
        setHash(computedHash);
        if (!computedHash) {
            setStatus("idle");
            setResult(null);
            return;
        }

        setStatus("verifying");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const res = await axios.post(`${apiUrl}/verify`, { hash: computedHash });

            const data = res.data;

            if (data.verified) {
                setResult(data);
                setStatus("success");
            } else {
                setResult(null);
                setStatus("tampered");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-mesh opacity-30 pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-8 relative z-10">
                <div className="w-full max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-accent mb-6">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Secure Protocol Verification</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight mb-4">
                            Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Integrity</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto font-medium">
                            Authenticate your data against the immutable human-history ledger on Solana.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[48px] p-10 sm:p-12 relative overflow-hidden"
                    >
                        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                            <Landmark className="w-5 h-5 text-blue-500" />
                            Select Asset for Analysis
                        </h2>

                        <FileUploader onHashComputed={handleHashComputed} />

                        <AnimatePresence mode="wait">
                            {status === "verifying" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-12 flex flex-col items-center justify-center text-gray-400 py-12"
                                >
                                    <div className="relative">
                                        <Loader2 className="w-20 h-20 animate-spin text-blue-500 opacity-20" />
                                        <Activity className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" />
                                    </div>
                                    <p className="text-xl font-black mt-6 tracking-tight text-white">Querying Solana Registry...</p>
                                    <p className="text-sm font-medium text-gray-500 mt-2 italic">Computing SHA-256 Protocol Seeds</p>
                                </motion.div>
                            )}

                            {status === "success" && result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-12 space-y-8"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
                                            <ShieldCheck className="w-12 h-12 text-emerald-400" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Verified Authentic</h3>
                                        <p className="text-emerald-400/80 font-bold uppercase tracking-widest text-[10px]">On-Chain Match Confirmed</p>
                                    </div>

                                    <div className="glass rounded-3xl p-8 border border-emerald-500/20 shadow-inner">
                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                                            <div className="space-y-1">
                                                <dt className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Issuer Identity</dt>
                                                <dd className="font-mono text-gray-200 break-all">{result.owner}</dd>
                                            </div>
                                            <div className="space-y-1">
                                                <dt className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Temporal Anchor</dt>
                                                <dd className="font-bold text-white">{new Date(result.timestamp * 1000).toLocaleString()}</dd>
                                            </div>
                                            <div className="space-y-1">
                                                <dt className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Provenance Record</dt>
                                                <dd className="font-mono text-blue-400 flex items-center gap-2">
                                                    {result.pdaAddress.slice(0, 16)}...
                                                    <a href={`https://explorer.solana.com/address/${result.pdaAddress}?cluster=devnet`} target="_blank">
                                                        <ExternalIcon className="w-3 h-3" />
                                                    </a>
                                                </dd>
                                            </div>
                                            <div className="space-y-1">
                                                <dt className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Registry Metadata</dt>
                                                <dd className="font-medium text-gray-300 italic">{result.metadata || "No metadata provisioned"}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </motion.div>
                            )}

                            {status === "tampered" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-12 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-24 h-24 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-red-500/20">
                                        <ShieldAlert className="w-12 h-12 text-red-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Verification Failed</h3>
                                    <p className="text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                                        This file's unique signature does not match any record in the SipHeron registry.
                                        The data may have been <span className="text-red-400 font-bold">modified</span> or was never anchored on-chain.
                                    </p>
                                </motion.div>
                            )}

                            {status === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-12 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-20 h-20 rounded-[32px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                                        <FileSearch className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Node Connection Failure</h3>
                                    <p className="text-gray-400 font-medium">Unable to synchronize with the institutional API.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-12 flex justify-center pt-8 border-t border-white/5">
                            <Link href="/explorer" className="text-xs font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                                Query Global Explorer <ExternalIcon className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
