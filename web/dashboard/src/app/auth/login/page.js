"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Database, Zap, Github, Terminal, ChevronRight, Loader2, AlertTriangle, Key } from 'lucide-react';
import { login } from '@/utils/api';
import { GlowButton, PurpleInput } from '@/components/ui/PurpleUI';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // For terminal animation
    const [terminalLine, setTerminalLine] = useState(0);
    const terminalLines = [
        "> sipheron-vdr login",
        "Authenticating...",
        "Success: Credentials verified.",
        "> sipheron-vdr anchor ./document.pdf",
        "Calculating SHA-256 hash...",
        "Hash: 8f434346648f6b96df89dda901c5176b...",
        "Anchoring to Solana Devnet...",
        "Success: Transaction confirmed.",
        "Receipt: https://explorer.solana.com/tx/..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTerminalLine((prev) => (prev + 1) % terminalLines.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [terminalLines.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShake(false);

        try {
            await login(email, password);
            window.location.href = 'https://app.sipheron.com/dashboard'; // As specified in the prompt
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
            setShake(true);
            setTimeout(() => setShake(false), 500); // Reset shake
        } finally {
            setLoading(false);
        }
    };

    const handleGithubClick = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex select-none font-sans overflow-hidden pt-12">

            {/* GitHub Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-bg-surface/90 backdrop-blur-md border border-purple-vivid/30 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(155,110,255,0.2)] flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4 text-purple-glow" />
                        <span className="text-sm font-medium text-white">GitHub integration coming soon.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Column (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] lg:w-[50%] xl:w-[55%] p-12 lg:p-16 relative z-10 border-r border-bg-border">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-vivid/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="mt-24 max-w-xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]"
                        >
                            The trust layer<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-glow to-blue-accent">
                                for your documents.
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-xl text-text-muted leading-relaxed font-light"
                        >
                            Anchor document authenticity on Solana. <strong className="text-white font-medium">Immutable. Instant. Verifiable.</strong>
                        </motion.p>
                    </div>

                    {/* Animated Terminal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 bg-black/60 backdrop-blur-md border border-bg-border rounded-xl overflow-hidden shadow-2xl max-w-lg"
                    >
                        <div className="bg-bg-elevated px-4 py-2 border-b border-bg-border flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-danger/80" />
                            <div className="w-3 h-3 rounded-full bg-warning/80" />
                            <div className="w-3 h-3 rounded-full bg-success/80" />
                            <span className="ml-2 text-xs text-text-muted font-mono tracking-widest uppercase">Terminal — sipheron-cli</span>
                        </div>
                        <div className="p-5 font-mono text-sm h-[200px] overflow-hidden flex flex-col justify-end relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none h-10" />
                            <div className="space-y-2 relative z-0">
                                {terminalLines.slice(0, terminalLine + 1).map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={line.startsWith('>') ? 'text-purple-glow' : line.startsWith('Success') ? 'text-success drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-text-muted'}
                                    >
                                        {line}
                                    </motion.div>
                                ))}
                                <motion.div
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-2 h-4 bg-purple-glow"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10">
                    <div className="flex flex-wrap gap-6 mb-8">
                        <div className="flex items-center gap-2 text-sm text-text-muted font-medium bg-white/[0.02] px-4 py-2 rounded-xl border border-bg-border/50">
                            <Database className="w-4 h-4 text-purple-glow" />
                            100% On-Chain
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-muted font-medium bg-white/[0.02] px-4 py-2 rounded-xl border border-bg-border/50">
                            <ShieldCheck className="w-4 h-4 text-purple-glow" />
                            Zero File Upload
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-muted font-medium bg-white/[0.02] px-4 py-2 rounded-xl border border-bg-border/50">
                            <Terminal className="w-4 h-4 text-purple-glow" />
                            Solana Devnet
                        </div>
                    </div>
                    <Link href="/auth/register" className="inline-flex items-center text-purple-glow hover:text-white text-sm font-bold tracking-widest uppercase transition-colors group">
                        Provision new profile <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-purple-vivid" />
                    </Link>
                </div>
            </div>

            {/* Right Column - Form Area */}
            <div className="w-full lg:w-[55%] xl:w-[45%] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-bg-primary">
                {/* Mobile Background Elements */}
                <div className="lg:hidden absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-vivid/10 blur-[100px] rounded-full" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    {/* Form Card */}
                    <motion.div
                        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="bg-bg-surface border border-bg-border rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                    >
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-vivid to-transparent opacity-50" />

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Access Control</h2>
                            <p className="text-sm text-text-muted">Authenticate institutional credentials</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-2xl text-sm flex items-start gap-3 overflow-hidden shadow-inner"
                                >
                                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
                                    <span className="font-bold tracking-tight">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Email Identity</label>
                                <div className="relative group">
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

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Secret Key</label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-[10px] font-bold text-text-muted hover:text-purple-glow transition-colors uppercase tracking-widest"
                                    >
                                        RECOVER ACCESS
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Key className="h-5 w-5 text-text-muted group-focus-within:text-purple-glow transition-colors" />
                                    </div>
                                    <PurpleInput
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="pl-12 pr-12 py-3.5 bg-black/40 text-sm"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-white transition-colors focus:outline-none"
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <GlowButton
                                    type="submit"
                                    disabled={loading}
                                    loading={loading}
                                    className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-2xl"
                                    icon={ShieldCheck}
                                >
                                    AUTHORIZE SESSION
                                </GlowButton>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-bg-border/50 break-words" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold bg-bg-surface text-text-muted relative z-10 w-fit">External Provider</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handleGithubClick}
                                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-bg-border rounded-xl shadow-inner bg-black/20 hover:bg-black/40 text-sm font-bold text-text-secondary hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-purple-vivid/50 group"
                                >
                                    <Github className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" />
                                    Sign In with GitHub
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer link for mobile/desktop right side */}
                    <div className="mt-10 text-center lg:hidden relative z-10">
                        <Link href="/auth/register" className="inline-block text-[11px] font-bold text-text-muted hover:text-purple-glow uppercase tracking-[0.2em] border border-bg-border px-6 py-3 rounded-full bg-bg-surface/50 backdrop-blur-md shadow-lg transition-all">
                            PROVISION NEW PROFILE
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
