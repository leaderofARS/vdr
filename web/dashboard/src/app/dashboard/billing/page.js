"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, Zap, Check, AlertTriangle, Clock,
    ArrowUpRight, Shield, Globe, FileBarChart,
    ExternalLink, X, Info, Gem, CircleDollarSign,
    Lock, Sparkles, Plus, Wallet, TrendingUp, Cpu
} from 'lucide-react';
import {
    PurpleCard, GlowButton, PurpleBadge, PurpleTable,
    PurpleTableRow, PurpleSkeleton, PurpleModal, PurpleInput,
    CountUp
} from '@/components/ui/PurpleUI';

export default function BillingPage() {
    const [stats, setStats] = useState(null);
    const [keysCount, setKeysCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, keysRes] = await Promise.all([
                api.get('/api/org/stats'),
                api.get('/api/keys?limit=1')
            ]);
            setStats(statsRes.data);
            setKeysCount(keysRes.data.pagination?.total || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const showComingSoonToast = (message = "Coming Soon") => {
        setToast(message);
        setTimeout(() => setToast(null), 4000);
    };

    const anchorLimit = 10;
    const apiKeyLimit = 1;
    const totalAnchors = stats?.stats?.totalAnchors || 0;
    const anchorUsagePercent = Math.min((totalAnchors / anchorLimit) * 100, 100);
    const isOverLimit = totalAnchors > anchorLimit;

    return (
        <div className="space-y-10 pb-32 relative">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2 flex items-center gap-4">
                        <Wallet className="w-8 h-8 text-purple-vivid" />
                        Treasury & Subscriptions
                    </h1>
                    <div className="flex items-center gap-3">
                        <PurpleBadge variant="purple">FINANCE ENGINE</PurpleBadge>
                        <span className="text-text-muted text-xs font-mono uppercase tracking-widest">
                            March 2026 Billing Cycle
                        </span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <GlowButton onClick={() => setShowUpgradeModal(true)} icon={Sparkles} className="px-8 py-4">UPGRADE TO PRO</GlowButton>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Plan Intelligence */}
                <PurpleCard className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                        <Gem className="w-48 h-48 text-purple-glow" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div>
                            <PurpleBadge variant="ghost" className="mb-4">ACTIVE AUTHORITY</PurpleBadge>
                            <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Standard</h2>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Fundamental on-chain anchoring for institutional research and testing.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <PlanFeature label="10 Anchors / Month" active />
                            <PlanFeature label="1 Integration Credential" active />
                            <PlanFeature label="Solana Devnet Cluster" active />
                            <PlanFeature label="Mainnet-Beta Pro Access" />
                            <PlanFeature label="Dedicated Event Webhooks" />
                        </div>

                        <GlowButton onClick={() => setShowUpgradeModal(true)} className="w-full py-4 text-xs font-bold uppercase tracking-widest" icon={TrendingUp}>
                            SCALE OPERATIONS
                        </GlowButton>
                    </div>
                </PurpleCard>

                {/* Utilization Telemetry */}
                <PurpleCard className="lg:col-span-2 space-y-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                            <FileBarChart className="w-4 h-4 text-purple-glow" />
                            Quota Utilization
                        </h3>
                        <div className="text-right">
                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Cycle Reset In</p>
                            <p className="text-xs font-mono text-purple-glow uppercase">22 Days 14 Hours</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* Anchor Quota */}
                        <div className="space-y-4">
                            <div className="flex items-end justify-between px-1">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-text-primary uppercase tracking-tight">On-Chain Anchoring</p>
                                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-[0.1em]">Ledger throughput consumption</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xl font-bold font-mono ${isOverLimit ? 'text-danger shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-purple-glow'}`}>
                                        {totalAnchors}
                                    </span>
                                    <span className="text-text-muted text-xs font-mono ml-2">/ {anchorLimit}</span>
                                </div>
                            </div>
                            <div className="h-3 w-full bg-black/40 rounded-full border border-bg-border overflow-hidden p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${anchorUsagePercent}%` }}
                                    className={`h-full rounded-full ${isOverLimit ? 'bg-danger' : 'bg-purple-vivid'} shadow-[0_0_15px_rgba(155,110,255,0.3)]`}
                                />
                            </div>
                            {isOverLimit && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[10px] text-danger font-bold uppercase tracking-widest">
                                    <AlertTriangle className="w-3.5 h-3.5" /> CRITICAL: MONTHLY QUOTA REACHED
                                </motion.div>
                            )}
                        </div>

                        {/* Credential Quota */}
                        <div className="space-y-4">
                            <div className="flex items-end justify-between px-1">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-text-primary uppercase tracking-tight">Security Credentials</p>
                                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-[0.1em]">Provisioned API identities</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold font-mono text-purple-glow">{keysCount}</span>
                                    <span className="text-text-muted text-xs font-mono ml-2">/ {apiKeyLimit}</span>
                                </div>
                            </div>
                            <div className="h-3 w-full bg-black/40 rounded-full border border-bg-border overflow-hidden p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(keysCount / apiKeyLimit) * 100}%` }}
                                    className="h-full rounded-full bg-blue-accent shadow-[0_0_15px_rgba(79,110,247,0.3)]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-bg-border/50 flex flex-wrap gap-4">
                        <div className="px-4 py-3 bg-purple-glow/5 border border-purple-glow/10 rounded-2xl flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-purple-glow" />
                            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-tight">System health optimized</span>
                        </div>
                        <div className="px-4 py-3 bg-blue-accent/5 border border-blue-accent/10 rounded-2xl flex items-center gap-3">
                            <Cpu className="w-4 h-4 text-blue-accent" />
                            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-tight">RPC Nodes synchronized</span>
                        </div>
                    </div>
                </PurpleCard>
            </div>

            {/* Matrix Comparison */}
            <div className="space-y-8">
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Plan Matrix</h3>
                    <p className="text-sm text-text-muted mt-1 uppercase tracking-widest font-bold opacity-60">Architect the right scale for your cryptographic operations</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Standard Tier */}
                    <PurpleCard className="opacity-60 grayscale-[0.5] border-bg-border">
                        <div className="mb-10">
                            <h4 className="text-sm font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Fundamental</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-mono font-bold text-white">$0</span>
                                <span className="text-xs text-text-muted font-bold uppercase tracking-widest">/ Month</span>
                            </div>
                        </div>
                        <div className="space-y-6 flex-1">
                            <MatrixFeature icon={Check} label="10 Anchors / mo" active />
                            <MatrixFeature icon={Check} label="1 Security Key" active />
                            <MatrixFeature icon={Check} label="Devnet Registry" active />
                            <MatrixFeature icon={X} label="Mainnet Ledger" />
                            <MatrixFeature icon={X} label="Live Webhooks" />
                        </div>
                        <GlowButton variant="ghost" disabled className="w-full mt-10 py-4 opacity-50">CURRENT AUTHORITY</GlowButton>
                    </PurpleCard>

                    {/* Pro Tier */}
                    <PurpleCard className="border-purple-vivid/40 bg-purple-vivid/[0.02] shadow-[0_0_40px_rgba(155,110,255,0.1)] relative">
                        <div className="absolute top-0 right-8 -translate-y-1/2">
                            <PurpleBadge variant="purple" pulse className="px-4 py-1 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> PRODUCTION READY
                            </PurpleBadge>
                        </div>
                        <div className="mb-10">
                            <h4 className="text-sm font-bold text-purple-glow uppercase tracking-[0.2em] mb-2">Institutional</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-mono font-bold text-white">$29</span>
                                <span className="text-xs text-text-muted font-bold uppercase tracking-widest">/ Month</span>
                            </div>
                        </div>
                        <div className="space-y-6 flex-1">
                            <MatrixFeature icon={Check} label="Unlimited Anchoring" active emphasis />
                            <MatrixFeature icon={Check} label="30 Security Keys" active emphasis />
                            <MatrixFeature icon={Check} label="Mainnet-Beta Cluster" active emphasis />
                            <MatrixFeature icon={Check} label="Instant Webhooks" active emphasis />
                            <MatrixFeature icon={Check} label="Custom Metadata" active emphasis />
                        </div>
                        <GlowButton onClick={() => setShowUpgradeModal(true)} className="w-full mt-10 py-4" icon={Gem}>DEPLOY PRO STACK</GlowButton>
                    </PurpleCard>

                    {/* Enterprise Tier */}
                    <PurpleCard className="border-blue-accent/30 bg-blue-accent/[0.02]">
                        <div className="mb-10">
                            <h4 className="text-sm font-bold text-blue-accent uppercase tracking-[0.2em] mb-2">Hyper-Scale</h4>
                            <div className="text-3xl font-bold text-white uppercase tracking-tight">Custom</div>
                        </div>
                        <div className="space-y-6 flex-1">
                            <MatrixFeature icon={Check} label="Dedicated RPC Nodes" active emphasis="blue" />
                            <MatrixFeature icon={Check} label="Siph-Shield Support" active emphasis="blue" />
                            <MatrixFeature icon={Check} label="Protocol Governance" active emphasis="blue" />
                            <MatrixFeature icon={Check} label="SLA 99.9% Finality" active emphasis="blue" />
                            <MatrixFeature icon={Check} label="SAML Enforcement" active emphasis="blue" />
                        </div>
                        <GlowButton onClick={() => window.open('mailto:sales@sipheron.io')} variant="ghost" className="w-full mt-10 py-4 border-blue-accent/30 text-blue-accent" icon={ExternalLink}>CONTACT TREASURY</GlowButton>
                    </PurpleCard>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Billing History */}
                <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                    <div className="px-8 py-6 border-b border-bg-border/50 bg-purple-dim/5 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-glow" /> Treasury Signals
                        </h3>
                    </div>
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-purple-dim/10 rounded-2xl flex items-center justify-center mx-auto mb-6 opacity-30">
                            <Activity className="w-8 h-8 text-purple-glow" />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">No historical events</h4>
                        <p className="text-xs text-text-muted max-w-xs mx-auto">Standard Tier organizations do not generate subscription invoices.</p>
                    </div>
                </PurpleCard>

                {/* Secure Payment */}
                <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                    <div className="px-8 py-6 border-b border-bg-border/50 bg-purple-dim/5 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                            <Plus className="w-4 h-4 text-purple-glow" /> Settlement Methods
                        </h3>
                    </div>
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-purple-dim/10 rounded-2xl flex items-center justify-center mx-auto mb-6 opacity-30">
                            <CreditCard className="w-8 h-8 text-purple-glow" />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Locked Ecosystem</h4>
                        <p className="text-xs text-text-muted max-w-xs mx-auto mb-8">Add a settlement method to provision production-grade Mainnet access.</p>
                        <GlowButton variant="ghost" className="text-[10px]" onClick={() => showComingSoonToast()}>ADD PAYMENT INTERFACE</GlowButton>
                    </div>
                </PurpleCard>
            </div>

            <AnimatePresence>
                {showUpgradeModal && (
                    <UpgradeModal onClose={() => setShowUpgradeModal(false)} onAction={showComingSoonToast} />
                )}
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        className="fixed bottom-12 left-1/2 z-[150] px-6 py-4 rounded-2xl bg-bg-surface border border-purple-vivid/20 shadow-2xl flex items-center gap-4 min-w-[320px]"
                    >
                        <div className="p-2 rounded-full bg-purple-vivid/10 text-purple-vivid">
                            <Info className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-text-primary">{toast}</span>
                        <button onClick={() => setToast(null)} className="ml-auto text-text-muted hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PlanFeature({ label, active }) {
    return (
        <div className={`flex items-center gap-3 text-sm ${active ? 'text-text-primary' : 'text-text-muted opacity-40'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-success/10 text-success' : 'bg-bg-border text-text-muted'}`}>
                {active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            </div>
            <span className={active ? 'font-medium' : 'line-through'}>{label}</span>
        </div>
    );
}

function MatrixFeature({ icon: Icon, label, active, emphasis }) {
    const colorClass = emphasis === 'blue' ? 'text-blue-accent' : emphasis ? 'text-purple-glow' : 'text-text-muted';
    return (
        <div className={`flex items-center gap-4 text-xs ${active ? 'text-text-secondary' : 'text-text-muted opacity-30'}`}>
            <Icon className={`w-4 h-4 shrink-0 ${active ? (emphasis === 'blue' ? 'text-blue-accent' : 'text-purple-glow') : ''}`} />
            <span className={active ? 'font-bold tracking-tight' : ''}>{label}</span>
        </div>
    );
}

function UpgradeModal({ onClose, onAction }) {
    return (
        <PurpleModal isOpen={true} onClose={onClose} title="Institutional Upgrade">
            <div className="space-y-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-purple-vivid/10 border border-purple-vivid/20 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-purple-vivid/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Sparkles className="w-10 h-10 text-purple-vivid relative z-10" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">SipHeron Pro Dynamics</h3>
                        <p className="text-sm text-text-muted mt-2">Scale your cryptographic footprint to the global Solana Mainnet ecosystem.</p>
                    </div>
                </div>

                <div className="bg-black/40 border border-bg-border rounded-3xl p-6 space-y-4">
                    {[
                        "Zero monthly anchoring limitations",
                        "High-throughput Mainnet clusters",
                        "Immutable event log webhooks",
                        "Advanced multi-organizational telemetry",
                        "Siph-Shield cryptographic insurance"
                    ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-text-primary font-medium">
                            <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-success" />
                            </div>
                            {feat}
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <GlowButton onClick={() => onAction("Mainnet bridge is being finalized. You'll be notified via institutional email.")} className="w-full py-5 text-sm font-bold uppercase tracking-widest shadow-2xl" icon={ArrowUpRight}>
                        INITIATE DEPLOYMENT
                    </GlowButton>
                    <p className="text-[10px] text-center text-text-muted uppercase font-bold tracking-[0.2em] opacity-60">Settle in USDC, SOL, or Terminal Currency</p>
                </div>
            </div>
        </PurpleModal>
    );
}
