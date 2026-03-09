"use client";

import { useState } from 'react';
import { api } from '@/utils/api';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft, Key, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowButton, PurpleInput, PurpleCard } from '@/components/ui/PurpleUI';

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
            setSuccess(data.message || 'If that identity exists, a cryptographic reset link has been transmitted. Unseal your inbox.');
        } catch (err) {
            setError(err.response?.data?.error || 'Protocol request rejected. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-bg-primary px-4 overflow-hidden select-none font-sans">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-vivid/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-accent/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[420px] relative z-10"
            >
                <PurpleCard className="overflow-hidden shadow-2xl relative p-0">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-vivid to-transparent opacity-50" />

                    <div className="px-8 pt-12 pb-6 text-center border-b border-bg-border/50">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center justify-center p-4 rounded-3xl bg-purple-vivid/10 border border-purple-vivid/20 mb-6 shadow-inner relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-vivid/20 to-transparent" />
                            <LockKeyhole className="w-8 h-8 text-purple-glow relative z-10" />
                        </motion.div>
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Access Recovery</h2>
                        <p className="text-text-muted text-sm px-4">Initialize cryptographic key regeneration protocol</p>
                    </div>

                    <div className="p-8 pt-6">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="bg-danger/10 text-danger p-4 rounded-2xl text-sm border border-danger/20 flex items-start gap-3 shadow-inner"
                                >
                                    <span className="font-bold tracking-tight">{error}</span>
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="bg-success/10 text-success p-4 rounded-2xl text-sm border border-success/20 flex items-start gap-3 shadow-inner"
                                >
                                    <span className="font-bold tracking-tight">{success}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!success ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Registered Alias Identity</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-text-muted group-focus-within:text-purple-glow transition-colors" />
                                        </div>
                                        <PurpleInput
                                            type="email"
                                            required
                                            className="pl-12 py-3.5 bg-black/40 text-sm"
                                            placeholder="admin@institution.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <GlowButton
                                        type="submit"
                                        disabled={loading}
                                        loading={loading}
                                        className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-2xl"
                                        icon={ArrowRight}
                                    >
                                        TRANSMIT RECOVERY LINK
                                    </GlowButton>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-purple-glow hover:text-white uppercase tracking-widest transition-colors py-3 px-6 rounded-full border border-bg-border bg-black/40 hover:bg-black/80">
                                    <ArrowLeft className="w-4 h-4" /> RETURN TO GATEWAY
                                </Link>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-bg-border/50 flex flex-col items-center">
                            <Link href="/auth/login" className="text-[10px] font-bold text-text-muted hover:text-purple-glow uppercase tracking-[0.2em] transition-colors">
                                ABORT & RETURN &rarr;
                            </Link>
                        </div>
                    </div>
                </PurpleCard>
            </motion.div>
        </div>
    );
}
