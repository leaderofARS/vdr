"use client";

import { useState } from 'react';
import { api } from '@/utils/api';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setSuccess(data.message || 'If that email exists, a reset link has been sent. Please check your inbox.');
        } catch (err) {
            setError(err.response?.data?.error || 'Unable to process request. Please try again later.');
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
                className="max-w-md w-full glass rounded-3xl overflow-hidden shadow-2xl relative z-10"
            >
                <div className="px-8 pt-10 pb-6 text-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6"
                    >
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    </motion.div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">SipHeron VDR</h2>
                    <p className="text-gray-400 font-medium whitespace-nowrap">Institutional Credential Recovery</p>
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
                                <span>{error}</span>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 bg-green-500/10 text-green-400 p-4 rounded-xl text-sm border border-green-500/20 flex items-start gap-3"
                            >
                                <span>{success}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Registered Institutional Email</label>
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

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="group w-full relative h-[54px] rounded-2xl bg-blue-600 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all mt-4 overflow-hidden"
                            >
                                <span className="relative flex items-center justify-center">
                                    {loading ? 'Processing...' : 'Send Recovery Link'}
                                    {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </motion.button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Return to access portal
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col items-center">
                        <Link href="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Back to login &rarr;
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
