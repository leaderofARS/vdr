"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Lock, Building2, User, Eye, EyeOff, ShieldCheck,
    CreditCard, Terminal, CheckCircle2, Copy, Chrome, Check, Shield, AlertCircle, ChevronRight, Loader2, Target
} from 'lucide-react';
import { api } from '@/utils/api';
import { GlowButton, PurpleInput, PurpleCard, PurpleBadge } from '@/components/ui/PurpleUI';

export default function RegisterPage() {
    const router = useRouter();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [orgName, setOrgName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shake, setShake] = useState(false);
    const [copied, setCopied] = useState(false);

    // active animated step
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Install', 'Link', 'Anchor', 'Verify'];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [steps.length]);

    // Password strength logic
    const getPasswordStrength = (pwd) => {
        if (!pwd || pwd.length < 12) return { score: 1, label: "Weak", color: "bg-danger", text: "text-danger" };

        let hasUpperCase = /[A-Z]/.test(pwd);
        let hasNumber = /\d/.test(pwd);
        let hasSpecial = /[^A-Za-z0-9]/.test(pwd);

        if (hasUpperCase && hasNumber && hasSpecial) return { score: 4, label: "Very Strong", color: "bg-purple-glow", text: "text-purple-glow" };
        if (hasUpperCase && hasNumber) return { score: 3, label: "Strong", color: "bg-success", text: "text-success" };
        return { score: 2, label: "Fair", color: "bg-warning", text: "text-warning" };
    };

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShake(false);

        if (password !== confirmPassword) {
            setError('Cryptographic secrets do not match');
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        if (!agreeTerms) {
            setError('You must accept the protocol governance terms');
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
                organizationName: orgName
            });
            window.plausible?.('Signup', { props: { method: 'email' } });
            setIsSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Initialization failed. Please verify parameters.');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText('npm install -g sipheron-vdr');
        window.plausible?.('CLICopy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex select-none font-sans overflow-hidden pt-12">

            {/* Left Column (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] lg:w-[50%] xl:w-[55%] p-12 lg:p-16 relative z-10 border-r border-bg-border">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-vivid/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="mt-24 max-w-xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]"
                        >
                            Start anchoring documents <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-glow to-blue-accent">
                                in minutes.
                            </span>
                        </motion.h1>

                        {/* Feature Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-10 space-y-4"
                        >
                            <div className="flex items-center gap-4 text-sm font-bold text-text-muted uppercase tracking-widest bg-white/[0.02] px-6 py-4 rounded-2xl border border-bg-border/50">
                                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-success" />
                                </div>
                                Fundamental Tier Free on Devnet
                            </div>
                            <div className="flex items-center gap-4 text-sm font-bold text-text-muted uppercase tracking-widest bg-white/[0.02] px-6 py-4 rounded-2xl border border-bg-border/50">
                                <div className="w-8 h-8 rounded-full bg-purple-vivid/10 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-purple-vivid" />
                                </div>
                                No Settlement Method Required
                            </div>
                            <div className="flex items-center gap-4 text-sm font-bold text-text-muted uppercase tracking-widest bg-white/[0.02] px-6 py-4 rounded-2xl border border-bg-border/50">
                                <div className="w-8 h-8 rounded-full bg-blue-accent/10 flex items-center justify-center">
                                    <Terminal className="w-4 h-4 text-blue-accent" />
                                </div>
                                Command Interface Ready in 2 Minutes
                            </div>
                        </motion.div>
                    </div>

                    {/* Animated Step Counter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-16 max-w-lg"
                    >
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-bg-border -z-10" />
                            {steps.map((step, idx) => (
                                <div key={step} className="flex flex-col items-center gap-3 bg-bg-primary">
                                    <motion.div
                                        animate={{
                                            backgroundColor: activeStep === idx ? '#9B6EFF' : '#151525',
                                            borderColor: activeStep === idx ? '#9B6EFF' : '#1E1E3A',
                                            scale: activeStep === idx ? 1.1 : 1
                                        }}
                                        className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-colors duration-300 ${activeStep === idx ? 'shadow-[0_0_15px_rgba(155,110,255,0.4)]' : ''}`}
                                    >
                                        <span className={`text-sm font-bold ${activeStep === idx ? 'text-white' : 'text-text-muted'}`}>
                                            {idx + 1}
                                        </span>
                                    </motion.div>
                                    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 ${activeStep === idx ? 'text-purple-glow' : 'text-text-muted'}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10 pt-8">
                    <Link href="/auth/login" className="inline-flex items-center text-text-muted hover:text-white font-bold text-sm tracking-widest uppercase transition-colors group">
                        Return to Authentication <span className="text-purple-glow ml-2 group-hover:text-purple-vivid transition-colors flex items-center"><ChevronRight className="w-4 h-4 group-hover:translate-x-1" /></span>
                    </Link>
                </div>
            </div>

            {/* Right Column - Form Area */}
            <div className="w-full lg:w-[55%] xl:w-[45%] flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-bg-primary">
                {/* Mobile Background Elements */}
                <div className="lg:hidden absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-vivid/10 blur-[100px] rounded-full" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-[440px] relative z-10 py-10"
                >
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-bg-surface border border-bg-border rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                            >
                                {/* Top Accent Line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-vivid to-transparent opacity-50" />

                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Provision Identity</h2>
                                    <p className="text-sm text-text-muted">Initialize your cryptographic foundation</p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-2xl text-sm flex items-start gap-3 overflow-hidden shadow-inner"
                                        >
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
                                            <span className="font-bold tracking-tight">{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.form
                                    animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                                    transition={{ duration: 0.4 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Administrator Alias</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-text-muted group-focus-within:text-purple-glow transition-colors" />
                                            </div>
                                            <PurpleInput
                                                type="text"
                                                required
                                                className="pl-12 py-3.5 bg-black/40 text-sm"
                                                placeholder="Satoshi Nakamoto"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Transmission Email</label>
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

                                    {/* Organization Name */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 ml-1">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Institutional Designation</label>
                                            <div className="group/tooltip relative flex items-center">
                                                <Target className="w-3.5 h-3.5 text-text-muted cursor-help" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-purple-dim border border-purple-vivid/30 text-[10px] font-bold uppercase tracking-widest text-purple-glow rounded-xl shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all text-center">
                                                    Cryptographic Registry Index
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Building2 className="h-5 w-5 text-text-muted group-focus-within:text-purple-glow transition-colors" />
                                            </div>
                                            <PurpleInput
                                                type="text"
                                                required
                                                className="pl-12 py-3.5 bg-black/40 text-sm"
                                                placeholder="Cipher Dynamics LLC"
                                                value={orgName}
                                                onChange={(e) => setOrgName(e.target.value)}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5 pt-1">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Secret Key Generation</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-text-muted group-focus-within:text-purple-glow transition-colors" />
                                            </div>
                                            <PurpleInput
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="pl-12 pr-12 py-3.5 bg-black/40 text-sm"
                                                placeholder="Min 12 Character Entropy"
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

                                        {/* Strength Indicator */}
                                        {password.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="pt-2 px-1"
                                            >
                                                <div className="flex gap-1.5 mb-2">
                                                    {[1, 2, 3, 4].map((level) => (
                                                        <div key={level} className="h-1 flex-1 rounded-full bg-black/60 overflow-hidden shadow-inner">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: strength.score >= level ? '100%' : '0%' }}
                                                                transition={{ duration: 0.3 }}
                                                                className={`h-full ${strength.color}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className={`text-[9px] font-bold uppercase tracking-[0.2em] text-right ${strength.text}`}>
                                                    Entropy Level: {strength.label}
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Verify Secret Key</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <ShieldCheck className="h-5 w-5 text-text-muted group-focus-within:text-purple-glow transition-colors" />
                                            </div>
                                            <PurpleInput
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="pl-12 pr-4 py-3.5 bg-black/40 text-sm"
                                                placeholder="Confirm Entropy"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <div className="pt-3 flex items-start gap-3">
                                        <div className="relative flex items-center pt-0.5">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={agreeTerms}
                                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-5 h-5 border-2 border-bg-border rounded-lg bg-black/40 peer-checked:bg-purple-vivid peer-checked:border-purple-vivid transition-all flex items-center justify-center cursor-pointer shadow-inner peer-checked:shadow-[0_0_10px_rgba(155,110,255,0.4)]" onClick={() => setAgreeTerms(!agreeTerms)}>
                                                <Check className={`w-3.5 h-3.5 text-white ${agreeTerms ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} transition-all`} />
                                            </div>
                                        </div>
                                        <label htmlFor="terms" className="text-[11px] font-bold text-text-muted cursor-pointer leading-tight uppercase tracking-tight mt-0.5">
                                            I acknowledge the <Link href="/terms" className="text-purple-glow hover:text-white transition-colors">Governance Protocol</Link> and <Link href="/privacy" className="text-purple-glow hover:text-white transition-colors">Data Ethics</Link> mandates
                                        </label>
                                    </div>

                                    <div className="pt-4">
                                        <GlowButton
                                            type="submit"
                                            disabled={loading}
                                            loading={loading}
                                            className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-2xl"
                                        >
                                            INITIALIZE DATOSPHERE
                                        </GlowButton>
                                    </div>
                                </motion.form>

                                <div className="mt-8 text-center lg:hidden relative z-10">
                                    <Link href="/auth/login" className="inline-block text-[11px] font-bold text-text-muted hover:text-purple-glow uppercase tracking-[0.2em] border border-bg-border px-6 py-3 rounded-full bg-bg-surface/50 backdrop-blur-md shadow-lg transition-all">
                                        RESTORE SESSION
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            // SUCCESS SCREEN
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-bg-surface border border-bg-border rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center backdrop-blur-xl"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success via-purple-vivid to-success opacity-50" />

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                    className="w-24 h-24 bg-success/10 border border-success/20 text-success rounded-3xl flex items-center justify-center mx-auto mb-8 relative shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                >
                                    <div className="absolute inset-0 bg-success/20 animate-ping rounded-3xl" style={{ animationDuration: '3s' }} />
                                    <CheckCircle2 className="w-12 h-12 relative z-10" />
                                </motion.div>

                                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Identity Provisioned</h2>
                                <p className="text-sm text-text-muted mb-8 leading-relaxed">
                                    Strategic clearance granted for <span className="text-purple-glow font-bold">{name || orgName || 'Operator'}</span>. The ledger is prepared.
                                </p>

                                <div className="bg-black/60 border border-bg-border/50 rounded-2xl p-6 text-left mb-10 relative group shadow-inner">
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Terminal className="w-3.5 h-3.5 text-purple-glow" /> Execute Environment Setup:
                                    </p>
                                    <div className="flex items-center justify-between bg-bg-surface p-3.5 rounded-xl border border-bg-border group-hover:border-purple-vivid/30 transition-colors">
                                        <code className="text-purple-glow text-sm font-mono tracking-tight">npm install -g sipheron-vdr</code>
                                        <button
                                            onClick={handleCopy}
                                            className="text-text-muted hover:text-white transition-colors p-2 bg-purple-dim/10 rounded-lg"
                                            title="Copy command"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <GlowButton
                                    onClick={() => window.location.href = 'https://app.sipheron.com/dashboard'}
                                    className="w-full py-4 text-xs font-bold uppercase tracking-widest"
                                    icon={ChevronRight}
                                >
                                    ENTER DASHBOARD PROTOCOL
                                </GlowButton>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
