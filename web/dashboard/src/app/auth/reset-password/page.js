"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function ResetPasswordFormSnippet() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [pwd, setPwd] = useState({ new: '', confirm: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const getStrength = (p) => {
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[@$!%*?&]/.test(p)) score++;
        return score;
    };

    const strength = getStrength(pwd.new);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return setError('Reset link is invalid. Please request a new one.');
        if (pwd.new !== pwd.confirm) return setError('Passwords do not match.');
        if (strength < 4) return setError('Password is too weak. Must include 8 chars, uppercase, digit, and special char.');

        setLoading(true);
        setError('');

        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: pwd.new
            });
            setSuccess(true);
            setTimeout(() => router.push('/auth/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.error || 'Credential reset failed. Token may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Master Key Reset Successfully</h3>
                <p className="text-gray-400">Redirecting you to the access portal...</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20 flex items-start gap-2"
                    >
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">New Master Key</label>
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-500"
                            placeholder="••••••••••••"
                            value={pwd.new}
                            onChange={(e) => setPwd({ ...pwd, new: e.target.value })}
                        />
                    </div>
                    {/* Strength visualizer */}
                    <div className="flex gap-1 h-1.5 mt-2 px-1">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${strength >= i ? (strength > 2 ? 'bg-green-500' : 'bg-yellow-500') : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Confirm Master Key</label>
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-500"
                            placeholder="••••••••••••"
                            value={pwd.confirm}
                            onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !token}
                className="group w-full relative h-[54px] rounded-2xl bg-blue-600 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-8 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full duration-700 -translate-x-full transition-transform ease-in-out" />
                <span className="relative flex items-center justify-center">
                    {loading ? 'Rotating Keys...' : 'Update Master Key'}
                    {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </span>
            </motion.button>
        </form>
    );
}

export default function ResetPasswordPage() {
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
                <div className="px-8 pt-10 pb-6 text-center border-b border-white/5">
                    <motion.div
                        className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4"
                    >
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    </motion.div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1 whitespace-nowrap">Rotate Master Key</h2>
                    <p className="text-gray-400 font-medium">Reset your institutional password</p>
                </div>

                <div className="p-8">
                    <Suspense fallback={<div className="text-center text-gray-400">Loading reset context...</div>}>
                        <ResetPasswordFormSnippet />
                    </Suspense>
                </div>
            </motion.div>
        </div>
    );
}
