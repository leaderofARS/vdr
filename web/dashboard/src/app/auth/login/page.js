"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Database, Zap, Github, Terminal, ChevronRight, Loader2 } from 'lucide-react';
import { login } from '@/utils/api';

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
        <div className="min-h-screen bg-[#0A0A0F] text-white flex select-none font-sans overflow-hidden">

            {/* GitHub Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#111118]/90 backdrop-blur-md border border-[#4285F4]/30 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(66,133,244,0.2)] flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4 text-[#4285F4]" />
                        <span className="text-sm font-medium text-white">GitHub integration coming soon.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Column (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] lg:w-[50%] xl:w-[55%] p-12 lg:p-16 relative z-10 border-r border-[#1E1E2E]">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4285F4]/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-[#4285F4]/10 flex items-center justify-center p-1 border border-[#4285F4]/20 group-hover:bg-[#4285F4]/20 transition-all">
                            <Image src="/sipheron_vdap_logo.png" alt="SipHeron" width={28} height={28} className="object-contain" priority />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">SipHeron</span>
                    </Link>

                    <div className="mt-24 max-w-xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]"
                        >
                            The trust layer<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] to-[#8AB4F8]">
                                for your documents.
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-xl text-[#9AA0A6] leading-relaxed font-light"
                        >
                            Anchor document authenticity on Solana. <strong className="text-white font-medium">Immutable. Instant. Verifiable.</strong>
                        </motion.p>
                    </div>

                    {/* Animated Terminal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 bg-[#111118]/80 backdrop-blur-sm border border-[#2C3038] rounded-xl overflow-hidden shadow-2xl max-w-lg"
                    >
                        <div className="bg-[#1A1D24] px-4 py-2 border-b border-[#2C3038] flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                            <span className="ml-2 text-xs text-[#9AA0A6] font-mono">Terminal — sipheron-cli</span>
                        </div>
                        <div className="p-5 font-mono text-sm h-[200px] overflow-hidden flex flex-col justify-end">
                            <div className="space-y-2">
                                {terminalLines.slice(0, terminalLine + 1).map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={line.startsWith('>') ? 'text-[#4285F4]' : line.startsWith('Success') ? 'text-[#10B981]' : 'text-[#9AA0A6]'}
                                    >
                                        {line}
                                    </motion.div>
                                ))}
                                <motion.div
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-2 h-4 bg-[#4285F4]"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10">
                    <div className="flex flex-wrap gap-6 mb-8">
                        <div className="flex items-center gap-2 text-sm text-[#9AA0A6] font-medium">
                            <Database className="w-4 h-4 text-[#4285F4]" />
                            100% On-Chain
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#9AA0A6] font-medium">
                            <ShieldCheck className="w-4 h-4 text-[#4285F4]" />
                            Zero File Upload
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#9AA0A6] font-medium">
                            <Terminal className="w-4 h-4 text-[#4285F4]" />
                            Solana Devnet
                        </div>
                    </div>
                    <Link href="/auth/register" className="inline-flex items-center text-[#4285F4] hover:text-[#8AB4F8] font-semibold transition-colors group">
                        Don't have an account? Get started free <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Right Column - Form Area */}
            <div className="w-full lg:w-[55%] xl:w-[45%] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[#0A0A0F]">
                {/* Mobile Background Elements */}
                <div className="lg:hidden absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#4285F4]/10 blur-[100px] rounded-full" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-[#4285F4]/10 flex items-center justify-center p-1 border border-[#4285F4]/20">
                            <Image src="/sipheron_vdap_logo.png" alt="SipHeron" width={28} height={28} className="object-contain" priority />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">SipHeron</span>
                    </div>

                    {/* Form Card */}
                    <motion.div
                        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-8 shadow-2xl relative overflow-hidden"
                    >
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4285F4] to-transparent opacity-50" />

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                            <p className="text-sm text-[#9AA0A6]">Sign in to your SipHeron account</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="bg-[#F28B82]/10 border border-[#F28B82]/20 text-[#F28B82] p-3.5 rounded-xl text-sm flex items-start gap-3 overflow-hidden"
                                >
                                    <div className="mt-0.5 min-w-[16px]">⚠️</div>
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#9AA0A6] uppercase tracking-wider">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-[#5F6368] group-focus-within:text-[#4285F4] transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-3 bg-[#1A1D24] border border-[#2C3038] rounded-xl focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] text-white placeholder-[#5F6368] transition-all outline-none sm:text-sm"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-[#9AA0A6] uppercase tracking-wider">Password</label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-[11px] font-semibold text-[#4285F4] hover:text-[#8AB4F8] transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-[#5F6368] group-focus-within:text-[#4285F4] transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full pl-11 pr-12 py-3 bg-[#1A1D24] border border-[#2C3038] rounded-xl focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] text-white placeholder-[#5F6368] transition-all outline-none sm:text-sm"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5F6368] hover:text-[#9AA0A6] transition-colors focus:outline-none"
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[#4285F4] to-[#3367D6] hover:from-[#3367D6] hover:to-[#2A56C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] focus:ring-offset-[#111118] disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#2C3038]" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#111118] text-[#5F6368]">or</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handleGithubClick}
                                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#2C3038] rounded-xl shadow-sm bg-transparent hover:bg-[#1A1D24] text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] focus:ring-offset-[#111118]"
                                >
                                    <Github className="w-5 h-5" />
                                    Continue with GitHub
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer link for mobile/desktop right side */}
                    <div className="mt-8 text-center lg:hidden">
                        <p className="text-sm text-[#9AA0A6]">
                            New to SipHeron?{' '}
                            <Link href="/auth/register" className="font-semibold text-[#4285F4] hover:text-[#8AB4F8] transition-colors">
                                Create a free account &rarr;
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
