"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, Zap, Check, AlertTriangle, Clock,
    ArrowUpRight, Shield, Globe, FileBarChart,
    ExternalLink, X, Info, Gem, CircleDollarSign,
    Lock, Sparkles, Plus
} from 'lucide-react';

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
                api.get('/api/keys?limit=1') // We just need the total
            ]);
            setStats(statsRes.data);
            setKeysCount(keysRes.data.pagination?.total || 0);
        } catch (error) {
            console.error('Failed to fetch billing data:', error);
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

    const getUsageColor = (percent) => {
        if (percent >= 90) return 'bg-[#F28B82]';
        if (percent >= 70) return 'bg-[#FBC02D]';
        return 'bg-[#10B981]';
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#4285F4]/10 border border-[#4285F4]/20">
                            <CreditCard className="w-6 h-6 text-[#4285F4]" />
                        </div>
                        Billing & Subscription
                    </h1>
                    <p className="text-[#9AA0A6] text-sm mt-1">
                        Manage your organization's plan, usage limits, and payment methods
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Plan Card */}
                <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-[#9AA0A6] uppercase tracking-widest">Current Plan</span>
                            <span className="px-2 py-0.5 bg-[#2C3038] text-white text-[10px] font-bold rounded uppercase tracking-tighter">Free Tier</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">Standard</h2>
                        <p className="text-[#9AA0A6] text-sm mb-6">Ideal for testing and prototypes</p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-2 text-sm text-[#E8EAED]">
                                <Check className="w-4 h-4 text-[#10B981]" /> 10 anchors per month
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#E8EAED]">
                                <Check className="w-4 h-4 text-[#10B981]" /> 1 active API key
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#E8EAED]">
                                <Check className="w-4 h-4 text-[#10B981]" /> Solana Devnet access
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full py-3 bg-gradient-to-r from-[#4285F4] to-[#A06EE1] hover:shadow-[0_0_20px_rgba(66,133,244,0.3)] text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                    >
                        Upgrade to Pro <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>

                {/* Usage Meter Section */}
                <div className="lg:col-span-2 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <FileBarChart className="w-4 h-4 text-[#4285F4]" /> Current Usage
                            </h3>
                            <p className="text-[11px] text-[#9AA0A6] font-medium mt-0.5">March 1 — March 31, 2026</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-[#9AA0A6] uppercase font-bold tracking-tighter">Next Reset</p>
                            <p className="text-xs text-white font-medium">April 1, 2026</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Anchor Usage */}
                        <div className="space-y-3">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm font-bold text-[#E8EAED]">On-Chain Proof Anchors</p>
                                    <p className="text-[11px] text-[#9AA0A6]">Standard registry anchors for verified records</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-bold ${isOverLimit ? 'text-[#F28B82]' : 'text-white'}`}>
                                        {totalAnchors}
                                    </span>
                                    <span className="text-[#5F6368] text-sm"> / {anchorLimit}</span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-[#1A1D24] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${anchorUsagePercent}%` }}
                                    className={`h-full ${getUsageColor(anchorUsagePercent)}`}
                                />
                            </div>
                            {isOverLimit && (
                                <div className="flex items-center gap-1.5 text-[10px] text-[#F28B82] font-bold uppercase tracking-wider">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Monthly limit exceeded
                                </div>
                            )}
                        </div>

                        {/* API Key Usage */}
                        <div className="space-y-3">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm font-bold text-[#E8EAED]">Active API Keys</p>
                                    <p className="text-[11px] text-[#9AA0A6]">Provisioned production integration keys</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-white">{keysCount}</span>
                                    <span className="text-[#5F6368] text-sm"> / {apiKeyLimit}</span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-[#1A1D24] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(keysCount / apiKeyLimit) * 100}%` }}
                                    className="h-full bg-[#4285F4]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Comparison */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Available Plans</h3>
                    <p className="text-[#9AA0A6] text-sm">Choose the right tier for your data integrity requirements</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Free Plan */}
                    <div className="bg-[#111118] border border-[#2C3038] opacity-60 rounded-2xl p-6 relative overflow-hidden">
                        <div className="mb-6">
                            <h4 className="text-white font-bold">Standard</h4>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-2xl font-bold text-white">$0</span>
                                <span className="text-[#9AA0A6] text-xs">/month</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 text-xs text-[#9AA0A6]">
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> 10 anchors / month</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> 1 API key</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Devnet cluster access</li>
                            <li className="flex items-center gap-2 opacity-30"><X className="w-3.5 h-3.5" /> Mainnet-Beta support</li>
                            <li className="flex items-center gap-2 opacity-30"><X className="w-3.5 h-3.5" /> Webhook notifications</li>
                        </ul>
                        <button disabled className="w-full py-2 bg-[#1A1D24] text-[#5F6368] rounded-lg font-bold text-xs border border-[#2C3038]">
                            Current Plan
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-[#111118] border-2 border-[#4285F4] rounded-2xl p-6 relative shadow-[0_0_30px_rgba(66,133,244,0.1)]">
                        <div className="absolute top-0 right-0 bg-[#4285F4] text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">
                            Most Popular
                        </div>
                        <div className="mb-6">
                            <h4 className="text-white font-bold flex items-center gap-2">Pro <Sparkles className="w-3.5 h-3.5 text-[#FBC02D]" /></h4>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-2xl font-bold text-white">$29</span>
                                <span className="text-[#9AA0A6] text-xs">/month</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 text-xs text-[#E8EAED]">
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4285F4]" /> <b>Unlimited</b> anchors</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4285F4]" /> 10 API keys</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4285F4]" /> Mainnet-Beta cluster</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4285F4]" /> Webhook notifications</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4285F4]" /> Bulk data exports</li>
                        </ul>
                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="w-full py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-lg font-bold text-xs transition-colors shadow-lg shadow-[#4285F4]/20"
                        >
                            Upgrade to Pro
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-[#111118] border border-[#A06EE1] rounded-2xl p-6">
                        <div className="mb-6">
                            <h4 className="text-white font-bold">Enterprise</h4>
                            <div className="mt-2">
                                <span className="text-2xl font-bold text-white">Custom</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 text-xs text-[#E8EAED]">
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#A06EE1]" /> <b>Dedicated</b> RPC node</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#A06EE1]" /> Unlimited API keys</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#A06EE1]" /> Protocol Governance</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#A06EE1]" /> 99.9% Siph-Shield SLA</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#A06EE1]" /> SSO / SAML Enforcement</li>
                        </ul>
                        <button
                            onClick={() => window.open('mailto:sales@sipheron.io')}
                            className="w-full py-2 bg-transparent hover:bg-[#A06EE1]/10 text-[#A06EE1] border border-[#A06EE1] rounded-lg font-bold text-xs transition-colors"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 shadow-xl">
                    <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#4285F4]" /> Payment Methods
                    </h3>
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-12 h-12 bg-[#1A1D24] rounded-full flex items-center justify-center mb-4">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <p className="text-sm">No payment method on file</p>
                        <button
                            onClick={() => showComingSoonToast("Payment gateway integration starting soon.")}
                            className="text-[11px] text-[#4285F4] font-bold uppercase mt-4 hover:underline"
                        >
                            Add Payment Method →
                        </button>
                    </div>
                </div>

                {/* Billing History */}
                <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 shadow-xl">
                    <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#4285F4]" /> Billing History
                    </h3>
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-12 h-12 bg-[#1A1D24] rounded-full flex items-center justify-center mb-4">
                            <FileBarChart className="w-6 h-6" />
                        </div>
                        <p className="text-sm">No billing history available</p>
                        <p className="text-[10px] uppercase mt-2">You are currently on the free Standard plan</p>
                    </div>
                </div>
            </div>

            {/* Upgrade Modal */}
            <AnimatePresence>
                {showUpgradeModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUpgradeModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#111118] border border-[#1E1E2E] rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 rounded-xl bg-[#4285F4]/10 border border-[#4285F4]/20">
                                        <Sparkles className="w-6 h-6 text-[#4285F4]" />
                                    </div>
                                    <button onClick={() => setShowUpgradeModal(false)} className="text-[#5F6368] hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Upgrade to SipHeron Pro</h3>
                                    <p className="text-sm text-[#9AA0A6]">Unlock professional features and production-grade on-chain monitoring.</p>
                                </div>

                                <div className="bg-[#1A1D24] rounded-xl p-4 space-y-3 border border-[#2C3038]">
                                    {[
                                        "Unlimited document and digest anchors",
                                        "Solana Mainnet-Beta registry access",
                                        "Dedicated webhook event pipelines",
                                        "Advanced analytics & CSV audit export",
                                        "Multi-user organization management"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-[#E8EAED]">
                                            <div className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-[#10B981]" />
                                            </div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => showComingSoonToast("Mainnet billing coming soon. You'll be notified when Pro is available.")}
                                        className="w-full py-4 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#4285F4]/30"
                                    >
                                        Continue to Checkout →
                                    </button>
                                    <p className="text-[10px] text-[#5F6368] text-center mt-4">
                                        By upgrading, you agree to SipHeron's Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-[120] px-6 py-3 rounded-xl bg-[#111118] border border-[#1E1E2E] shadow-2xl flex items-center gap-3 min-w-[320px]"
                    >
                        <div className="p-1.5 rounded-full bg-[#4285F4]/10">
                            <Info className="w-4 h-4 text-[#4285F4]" />
                        </div>
                        <span className="text-sm text-white font-medium">{toast}</span>
                        <button onClick={() => setToast(null)} className="ml-auto text-[#5F6368] hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
