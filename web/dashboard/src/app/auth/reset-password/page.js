"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowButton, PurpleInput, PurpleCard, PurpleSkeleton } from '@/components/ui/PurpleUI';

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
        if (!token) return setError('Cryptographic token invalid. Request a new one.');
        if (pwd.new !== pwd.confirm) return setError('Secrets do not match.');
        if (strength < 4) return setError('Entropy too weak. Requires 8+ chars, UC, digit, and special char.');

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
            setError(err.response?.data?.error || 'Key rotation failed. Token may be compromised.');
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
                <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-success/10 border border-success/20 mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-12 h-12 text-success relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Main Key Rotated</h3>
                <p className="text-sm text-text-muted">Re-routing session to authentication portal...</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
            </AnimatePresence>

            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">New Core Entropy</label>
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-text-muted group-focus-within:text-purple-glow transition-colors" />
                        </div>
                        <PurpleInput
                            type="password"
                            required
                            className="pl-12 pr-4 py-3.5 bg-black/40 text-sm"
                            placeholder="••••••••••••"
                            value={pwd.new}
                            onChange={(e) => setPwd({ ...pwd, new: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                    {/* Strength visualizer */}
                    <div className="flex gap-1.5 h-1 mt-3 px-1">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`flex-1 rounded-full transition-all duration-500 shadow-inner ${strength >= i ? (strength > 2 ? 'bg-success' : 'bg-warning') : 'bg-black/60'}`} />
                        ))}
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Verify Generation</label>
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <ShieldCheck className="h-5 w-5 text-text-muted group-focus-within:text-purple-glow transition-colors" />
                        </div>
                        <PurpleInput
                            type="password"
                            required
                            className="pl-12 pr-4 py-3.5 bg-black/40 text-sm"
                            placeholder="••••••••••••"
                            value={pwd.confirm}
                            onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <GlowButton
                    type="submit"
                    disabled={loading || !token}
                    loading={loading}
                    className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-2xl"
                    icon={RotateCcw}
                >
                    COMMIT ROTATION
                </GlowButton>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen relative flex items-center justify-center bg-bg-primary px-4 overflow-hidden select-none font-sans">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-vivid/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-accent/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[420px] relative z-10"
            >
                <PurpleCard className="overflow-hidden shadow-2xl relative p-0">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-vivid to-transparent opacity-50" />

                    <div className="px-8 pt-12 pb-6 text-center border-b border-bg-border/50">
                        <motion.div
                            className="inline-flex items-center justify-center p-4 rounded-3xl bg-purple-vivid/10 border border-purple-vivid/20 mb-6 shadow-inner relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-vivid/20 to-transparent" />
                            <ShieldCheck className="w-8 h-8 text-purple-glow relative z-10" />
                        </motion.div>
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2 whitespace-nowrap">Rotate Master Key</h2>
                        <p className="text-text-muted text-sm px-4">Generate new institutional secret</p>
                    </div>

                    <div className="p-8 pt-6">
                        <Suspense fallback={
                            <div className="flex flex-col space-y-4 py-8">
                                <PurpleSkeleton className="h-[72px] rounded-2xl" />
                                <PurpleSkeleton className="h-[72px] rounded-2xl" />
                                <PurpleSkeleton className="h-[54px] rounded-2xl mt-4" />
                            </div>
                        }>
                            <ResetPasswordFormSnippet />
                        </Suspense>
                    </div>
                </PurpleCard>
            </motion.div>
        </div>
    );
}
