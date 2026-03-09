"use client";

/**
 * @file page.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/app/dashboard/auth/cli-authorize/page.js
 * @description Next.js App Router pages and layouts.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Monitor, ArrowRight, CheckCircle2, XCircle, Terminal, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/utils/api';
import { PurpleCard, GlowButton, PurpleSkeleton } from '@/components/ui/PurpleUI';

function AuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get('code');
    const [status, setStatus] = useState('confirming'); // confirming, success, error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orgName, setOrgName] = useState('');

    const handleAuthorize = async () => {
        setLoading(true);
        try {
            const res = await api.post('/auth/cli/authorize', { code });
            if (res.data.success) {
                setStatus('success');
                setOrgName(res.data.organizationName);
            }
        } catch (err) {
            console.error('Authorization failed', err);
            setError(err.response?.data?.error || 'Failed to authorize CLI session');
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    if (!code) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <PurpleCard className="max-w-md text-center p-12 border-danger/20 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-3xl bg-danger/10 flex items-center justify-center mb-6 border border-danger/20">
                        <XCircle className="w-10 h-10 text-danger" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Invalid Request</h1>
                    <p className="text-sm text-text-muted">No authorization code provided in the URI parameters.</p>
                </PurpleCard>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pt-16 pb-32 px-4 relative">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-vivid/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <PurpleCard className="p-8 md:p-12 text-center relative overflow-hidden group">
                    {/* Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-vivid to-transparent opacity-50" />

                    {status === 'confirming' && (
                        <>
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                <Terminal className="w-64 h-64 text-purple-glow" />
                            </div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-3xl bg-purple-vivid/10 border border-purple-vivid/20 flex items-center justify-center mb-8 relative overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-vivid/20 to-transparent" />
                                    <Monitor className="w-10 h-10 text-purple-vivid relative z-10" />
                                </div>
                                <h1 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary tracking-tight">
                                    Authorize Developer terminal
                                </h1>
                                <p className="text-text-muted text-sm leading-relaxed mb-10 max-w-sm">
                                    A programmatic environment is requesting institutional access to <strong className="text-white font-medium">SipHeron VDR</strong>. Verify the operational code below matches your prompt.
                                </p>

                                <div className="bg-black/60 rounded-3xl p-8 mb-12 border border-bg-border/50 shadow-inner w-full sm:w-auto relative overflow-hidden group/code">
                                    <div className="absolute inset-0 bg-purple-vivid/5 opacity-0 group-hover/code:opacity-100 transition-opacity" />
                                    <span className="text-5xl font-mono tracking-[0.5em] text-purple-glow font-bold pl-[0.5em] relative z-10 drop-shadow-[0_0_15px_rgba(183,148,255,0.3)]">
                                        {code}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                                    <GlowButton
                                        variant="ghost"
                                        onClick={() => router.push('/dashboard')}
                                        className="px-10 py-4 text-xs font-bold uppercase tracking-widest sm:w-auto w-full"
                                    >
                                        REJECT ACCESS
                                    </GlowButton>
                                    <GlowButton
                                        onClick={handleAuthorize}
                                        loading={loading}
                                        className="px-10 py-4 text-xs font-bold uppercase tracking-widest shadow-2xl sm:w-auto w-full"
                                        icon={ShieldCheck}
                                    >
                                        AUTHORIZE TERMINAL
                                    </GlowButton>
                                </div>

                                <div className="mt-8 flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest border border-bg-border/50 px-4 py-2 rounded-full bg-bg-surface/50">
                                    <ShieldAlert className="w-3.5 h-3.5 text-purple-glow" /> Protocol security enforced
                                </div>
                            </div>
                        </>
                    )}

                    {status === 'success' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-3xl bg-success/10 border border-success/20 flex items-center justify-center mb-8 relative overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent" />
                                <CheckCircle2 className="w-12 h-12 text-success relative z-10" />
                            </div>
                            <h1 className="text-3xl font-bold mb-3 text-white tracking-tight">Identity Authorized</h1>
                            <p className="text-text-muted text-sm leading-relaxed mb-10 max-w-sm">
                                Your terminal session has been cryptographically linked to <strong className="text-purple-glow font-bold">{orgName}</strong>. You may now return to your command line interface.
                            </p>
                            <GlowButton
                                onClick={() => router.push('/dashboard')}
                                className="px-10 py-4 text-xs font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(155,110,255,0.2)]"
                                icon={ArrowRight}
                            >
                                CONTINUE TO DASHBOARD
                            </GlowButton>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-3xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-8 relative overflow-hidden shadow-2xl group/error">
                                <div className="absolute inset-0 bg-danger/10 blur-xl opacity-0 group-hover/error:opacity-100 transition-opacity" />
                                <AlertTriangle className="w-12 h-12 text-danger relative z-10" />
                            </div>
                            <h1 className="text-3xl font-bold mb-3 text-white tracking-tight">Handshake Failed</h1>
                            <p className="text-danger text-sm font-medium mb-10 bg-danger/10 border border-danger/20 px-6 py-3 rounded-2xl max-w-sm break-words">
                                {error}
                            </p>
                            <GlowButton
                                onClick={() => setStatus('confirming')}
                                variant="ghost"
                                className="px-10 py-4 text-xs font-bold uppercase tracking-widest border-bg-border hover:border-purple-vivid/30"
                            >
                                RETRY HANDSHAKE
                            </GlowButton>
                        </motion.div>
                    )}
                </PurpleCard>
            </motion.div>
        </div>
    );
}

export default function CliAuthorizePage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4">
                <PurpleSkeleton className="w-full h-96 rounded-[2rem]" />
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
}
