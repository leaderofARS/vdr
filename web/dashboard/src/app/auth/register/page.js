"use client";

/**
 * @file page.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/auth/register/page.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerAdmin } from '@/utils/api';
import { Lock, Mail, ArrowRight, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
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
            await registerAdmin(email, password);
            router.push('/auth/login?registered=true');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Check if your domain is authorized.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-mesh px-4 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-teal-600/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full glass rounded-3xl overflow-hidden shadow-2xl relative z-10"
            >
                <div className="px-8 pt-10 pb-6 text-center border-b border-white/5">
                    <motion.div
                        initial={{ rotate: -10, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6"
                    >
                        <Building2 className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Provision Organization</h2>
                    <p className="text-gray-400 font-medium text-sm">Deploy your institutional VDR node</p>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-[0.2em] ml-1">Admin Identity</label>
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-gray-500 transition-all outline-none"
                                    placeholder="admin@organization.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-[0.2em] ml-1">Master Passphrase</label>
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-gray-500 transition-all outline-none"
                                    placeholder="Min 12 characters secured"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 ml-1">Must contain symbols and numerical entropy.</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="group w-full relative h-[54px] rounded-2xl bg-emerald-600 font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden mt-8"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full duration-700 -translate-x-full transition-transform ease-in-out" />
                            <span className="relative flex items-center justify-center">
                                {loading ? (
                                    <>
                                        <Sparkles className="animate-spin mr-2 h-4 w-4" />
                                        Provisioning...
                                    </>
                                ) : (
                                    <>
                                        Initialize Protocol
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/auth/login" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
                            Already have a VDR identity? <span className="text-emerald-400">Sign in</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
