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
import { ShieldCheck, Monitor, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/utils/api';

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
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold">Invalid Request</h1>
                <p className="text-gray-400">No authorization code provided.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pt-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass border border-white/5 rounded-3xl p-8 md:p-12 text-center"
            >
                {status === 'confirming' && (
                    <>
                        <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center mx-auto mb-8">
                            <Monitor className="w-10 h-10 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Authorize CLI Access</h1>
                        <p className="text-gray-400 text-lg mb-8">
                            A CLI device is requesting access to your SipHeron VDR organization.
                            Please verify that the code on your terminal matches the one below.
                        </p>

                        <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/5">
                            <span className="text-5xl font-mono tracking-[0.5em] text-white font-bold pl-[0.5em]">
                                {code}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAuthorize}
                                disabled={loading}
                                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-2 group"
                            >
                                {loading ? 'Authorizing...' : 'Confirm & Authorize'}
                                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">CLI Authorized!</h1>
                        <p className="text-gray-400 text-lg mb-8">
                            Your terminal has been successfully linked to <span className="text-white font-bold">{orgName}</span>.
                            You can now close this window and return to your terminal.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-bold"
                        >
                            Return to Dashboard
                        </button>
                    </motion.div>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-8">
                            <XCircle className="w-12 h-12 text-red-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Authorization Failed</h1>
                        <p className="text-red-400 text-lg mb-8">{error}</p>
                        <button
                            onClick={() => setStatus('confirming')}
                            className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
}

export default function CliAuthorizePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-[60vh]">Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
