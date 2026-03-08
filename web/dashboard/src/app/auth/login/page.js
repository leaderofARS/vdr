"use client";

/**
 * @file page.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/auth/login/page.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/utils/api';
import { Lock, Mail, ArrowRight, ShieldCheck, Github } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Check your institutional credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-mesh px-4 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full glass rounded-3xl overflow-hidden shadow-2xl relative z-10"
            >
                <div className="px-8 pt-10 pb-6 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 mb-6"
                    >
                        <img src="/sipheron_vdap_logo.png" alt="SipHeron" className="w-10 h-10 object-contain" />
                    </motion.div>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase">SIPHERON</h2>
                    <p className="text-gray-400 font-medium">Institutional Access Portal</p>
                </div>

                <div className="p-8 pt-2">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20 flex items-start gap-3"
                            >
                                <div className="mt-0.5 min-w-[18px]">⚠️</div>
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">SipHeron ID (Email)</label>
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all outline-none"
                                    placeholder="admin@enterprise.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Master Key</label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-[10px] font-bold text-blue-400/80 hover:text-blue-400 uppercase tracking-wider transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all outline-none"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="group w-full relative h-[54px] rounded-2xl bg-blue-600 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden mt-8"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full duration-700 -translate-x-full transition-transform ease-in-out" />
                            <span className="relative flex items-center justify-center">
                                {loading ? 'Authorizing...' : 'Enter Registry'}
                                {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </motion.button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <Link href="/auth/register" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Provision a new organization &rarr;
                        </Link>

                        <div className="flex items-center gap-3 mt-2">
                            <div className="h-[1px] w-8 bg-white/10" />
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Trusted by open source</span>
                            <div className="h-[1px] w-8 bg-white/10" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
