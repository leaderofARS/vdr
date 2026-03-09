"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hash, Calendar, ShieldCheck, ShieldAlert,
    ExternalLink, Copy, CheckCircle2, AlertTriangle,
    ArrowLeft, Printer, FileText, HardDrive,
    Key, Info, Ban, Rocket, Check, X,
    Download, Clock, Share2, Activity, Globe, RefreshCw
} from 'lucide-react';
import {
    PurpleCard, GlowButton, PurpleBadge, MonoHash,
    PurpleSkeleton, PurpleModal, PurpleInput
} from '@/components/ui/PurpleUI';

export default function HashDetailsPage() {
    const { hash } = useParams();
    const router = useRouter();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchRecord = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/api/hashes/${hash}`);
            setRecord(data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                setError("Record not found");
            } else {
                setError("Failed to load details. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }, [hash]);

    useEffect(() => {
        fetchRecord();
    }, [fetchRecord]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text);
        showToast(`Copied ${label} to clipboard`);
    };

    const handleRevokeSuccess = () => {
        setRecord(prev => ({ ...prev, status: 'revoked', revokedAt: new Date().toISOString() }));
        showToast("Hash successfully revoked on-chain.", "success");
        setShowRevokeModal(false);
    };

    const handleDownloadCertificate = () => {
        const printWindow = window.open('', '_blank');
        const dateStr = new Date(record.registeredAt).toLocaleString();

        const certificateHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>SipHeron VDR - Proof Certificate</title>
                <style>
                    body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
                    .cert-container { max-width: 800px; margin: 0 auto; border: 12px solid #4C3D8F; padding: 40px; position: relative; }
                    .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-weight: 800; font-size: 24px; color: #4C3D8F; display: flex; align-items: center; justify-content: center; gap: 10px; }
                    .title { font-size: 32px; font-weight: 700; margin: 20px 0; text-transform: uppercase; letter-spacing: 2px; }
                    .field { margin-bottom: 20px; }
                    .label { font-size: 10px; font-weight: 800; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
                    .value { font-family: monospace; font-size: 14px; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #eee; }
                    .metadata { white-space: pre-wrap; margin-top: 10px; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; border-top: 2px solid #eee; padding-top: 20px; }
                    .stamp { position: absolute; bottom: 80px; right: 40px; width: 120px; height: 120px; border: 4px solid #10B981; border-radius: 50%; color: #10B981; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; transform: rotate(-15deg); opacity: 0.8; text-transform: uppercase; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="cert-container">
                    <div class="header">
                        <div class="logo">SipHeron VDR</div>
                        <div class="title">Proof Certificate</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Cryptographic Hash (SHA-256)</div>
                        <div class="value">${record.hash}</div>
                    </div>

                    <div class="field">
                        <div class="label">Date Anchored (Blockchain Timestamp)</div>
                        <div class="value">${dateStr}</div>
                    </div>

                    <div class="field">
                        <div class="label">Transaction Signature</div>
                        <div class="value">${record.txSignature || '—'}</div>
                    </div>

                    <div class="field">
                        <div class="label">Registry Account (PDA)</div>
                        <div class="value">${record.pdaAddress}</div>
                    </div>

                    <div class="field">
                        <div class="label">Owner / Institutional Wallet</div>
                        <div class="value">${record.owner}</div>
                    </div>

                    <div class="field">
                        <div class="label">Metadata Payload</div>
                        <div class="value metadata">${record.metadata || 'No metadata provided'}</div>
                    </div>

                    <div class="stamp">Verified<br>SipHeron</div>

                    <div class="footer">
                        This document serves as proof of existence on the Solana Devnet blockchain.<br>
                        Verified on Solana Devnet. Certificate generated by SipHeron VDR.
                    </div>
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(certificateHtml);
        printWindow.document.close();
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="w-24 h-4 bg-bg-surface rounded-full" />
                <div className="h-40 bg-bg-surface rounded-3xl" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-96 bg-bg-surface rounded-3xl" />
                    <div className="space-y-8">
                        <div className="h-64 bg-bg-surface rounded-3xl" />
                        <div className="h-32 bg-bg-surface rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-24 h-24 bg-danger/10 border border-danger/20 rounded-full flex items-center justify-center">
                    <ShieldAlert className="w-12 h-12 text-danger" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2">
                        {error === "Record not found" ? "Identity Not Found" : "Connection Error"}
                    </h1>
                    <p className="text-text-muted max-w-sm mx-auto">
                        {error === "Record not found" ? "The requested hash does not exist in your organization's decentralized registry." : error}
                    </p>
                </div>
                <GlowButton onClick={() => router.push('/dashboard')} icon={ArrowLeft}>BACK TO CONSOLE</GlowButton>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-32 relative">
            {/* Ambient Background */}
            <div className="absolute inset-x-0 -top-40 h-[600px] bg-purple-glow/10 blur-[150px] pointer-events-none opacity-50" />

            <div className="flex flex-col gap-8">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="group w-fit flex items-center gap-2 text-text-muted hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Registry
                </button>

                <div className="relative">
                    <PurpleCard className="p-8 lg:p-12 overflow-hidden border-purple-vivid/20">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Hash className="w-48 h-48 text-purple-glow" />
                        </div>

                        <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                            <div className="space-y-6 max-w-4xl">
                                <div className="flex flex-wrap items-center gap-4">
                                    <PurpleBadge variant={record.status === 'revoked' ? 'danger' : 'success'} pulse={record.status === 'active'}>
                                        {record.status === 'active' ? 'Active On-Chain' : 'Revoked Proof'}
                                    </PurpleBadge>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-bg-border">
                                        <Globe className="w-3.5 h-3.5 text-purple-glow" />
                                        Solana Devnet Cluster
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl lg:text-4xl font-mono font-bold text-text-primary break-all leading-tight tracking-tight">
                                        {record.hash}
                                    </h1>
                                    <div className="flex items-center gap-4 mt-4">
                                        <button
                                            onClick={() => handleCopy(record.hash, 'Hash')}
                                            className="px-4 py-2 rounded-xl bg-purple-dim/30 border border-purple-vivid/20 text-purple-glow hover:bg-purple-dim/50 transition-all flex items-center gap-2 text-xs font-bold"
                                        >
                                            <Copy className="w-4 h-4" /> COPY HASH
                                        </button>
                                        <div className="hidden sm:block h-4 w-px bg-bg-border" />
                                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                                            SHA-256 Digest Standard
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0">
                                {record.explorerUrl && (
                                    <a href={record.explorerUrl} target="_blank" rel="noopener noreferrer">
                                        <GlowButton className="w-full justify-center px-8" icon={ExternalLink}>SOLANA EXPLORER</GlowButton>
                                    </a>
                                )}
                                <GlowButton variant="ghost" onClick={handleDownloadCertificate} className="w-full justify-center" icon={Download}>DOWNLOAD PROOF</GlowButton>
                            </div>
                        </div>
                    </PurpleCard>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Security Intel */}
                    <PurpleCard className="p-0 overflow-hidden">
                        <div className="px-8 py-6 border-b border-bg-border/50 flex items-center justify-between bg-purple-dim/5">
                            <h3 className="text-sm font-bold text-text-primary flex items-center gap-3 uppercase tracking-wider">
                                <Activity className="w-4 h-4 text-purple-vivid" />
                                Cryptographic Ledger Data
                            </h3>
                            <PurpleBadge variant="purple">VERIFIED ON-CHAIN</PurpleBadge>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <DetailBox label="Initial Issuer (PDA Owner)" value={record.owner} isMono link={`https://explorer.solana.com/address/${record.owner}?cluster=devnet`} />
                                <DetailBox label="Anchor Timestamp" value={new Date(record.registeredAt).toLocaleString()} icon={Calendar} />
                                <DetailBox label="On-chain Expiry" value={record.expiry ? new Date(record.expiry).toLocaleDateString() : 'Perpetual Storage'} icon={Ban} />
                                <DetailBox label="Registry Identity (PDA)" value={record.pdaAddress} isMono link={record.pdaExplorerUrl} />
                            </div>

                            <div className="mt-12 pt-10 border-t border-bg-border/50">
                                <DetailBox
                                    label="On-chain Transaction Signature"
                                    value={record.txSignature || 'PENDING FINALITY'}
                                    isMono
                                    link={record.explorerUrl}
                                    fullWidth
                                />
                            </div>

                            {record.status === 'revoked' && record.revokedAt && (
                                <div className="mt-10 pt-10 border-t border-danger/20">
                                    <DetailBox
                                        label="Revocation Event Timestamp"
                                        value={new Date(record.revokedAt).toLocaleString()}
                                        icon={ShieldAlert}
                                        emphasis="danger"
                                    />
                                </div>
                            )}

                            <div className="mt-12 pt-10 border-t border-bg-border/50">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 block">Associated Metadata Payload</label>
                                <div className="bg-black/40 border border-bg-border rounded-2xl p-6 font-mono text-sm text-text-secondary leading-relaxed bg-grid-white/[0.02]">
                                    {record.metadata || "// No secondary metadata provided for this record"}
                                </div>
                            </div>
                        </div>
                    </PurpleCard>
                </div>

                <div className="space-y-8">
                    {/* Verification Action */}
                    <PurpleCard className="border-purple-vivid/30 bg-purple-vivid/[0.02]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-dim/40 rounded-xl text-purple-glow">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-sm text-text-primary uppercase tracking-tight">Asset Verification</h4>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed mb-6">
                            Execute a cryptographic check against a local asset to verify its integrity
                            against this immutable on-chain record.
                        </p>

                        <div className="space-y-4">
                            <div className="bg-black/60 rounded-2xl p-4 border border-bg-border relative group">
                                <code className="text-[11px] text-purple-glow font-mono leading-relaxed block overflow-x-auto pb-2">
                                    sipheron-vdr verify ./path/to/asset
                                </code>
                                <button
                                    onClick={() => handleCopy(`sipheron-vdr verify -h ${record.hash}`, 'CLI Command')}
                                    className="absolute right-3 top-3 p-2 bg-purple-dim/50 rounded-lg text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-purple-glow/5 border border-purple-glow/10 rounded-xl">
                                <Info className="w-4 h-4 text-purple-glow shrink-0" />
                                <span className="text-[10px] text-text-secondary leading-tight">SHA-256 collision-resistant verification protocol enabled.</span>
                            </div>
                        </div>
                    </PurpleCard>

                    {/* Revocation Zone */}
                    {record.status === 'active' && (
                        <PurpleCard className="border-danger/20 hover:border-danger/40 transition-colors">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-danger/10 rounded-2xl text-danger">
                                    <Ban className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-white uppercase tracking-tight">Revoke Proof</h4>
                                    <p className="text-[10px] text-text-muted">Broadcast permanent invalidation</p>
                                </div>
                            </div>
                            <GlowButton variant="danger" onClick={() => setShowRevokeModal(true)} className="w-full py-4 text-xs font-bold uppercase tracking-widest">
                                INITIATE ON-CHAIN REVOKE
                            </GlowButton>
                            <p className="text-[9px] text-center text-text-muted mt-3 italic grayscale opacity-60">This operation consumes network throughput (gas fees).</p>
                        </PurpleCard>
                    )}

                    {/* Infrastructure Info */}
                    <div className="p-6 bg-purple-glow/[0.02] border border-bg-border rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-purple-glow" />
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary">Network Finality</h4>
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed">
                            Once anchored, document proofs remain immutable on the Solana ledger.
                            Revocation marks the record as invalid but the history remains for auditing.
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showRevokeModal && (
                    <RevokeModal
                        record={record}
                        onClose={() => setShowRevokeModal(false)}
                        onSuccess={handleRevokeSuccess}
                        onError={(msg) => showToast(msg, 'error')}
                    />
                )}
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl bg-bg-surface border border-purple-vivid/20 shadow-2xl flex items-center gap-4 min-w-[300px]"
                    >
                        <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-bold text-text-primary">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-auto p-1 text-text-muted hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DetailBox({ label, value, isMono, link, icon: Icon, fullWidth, emphasis }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={fullWidth ? "col-span-full space-y-3" : "space-y-3"}>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1 block">{label}</label>
            <div className="flex items-center gap-3 group">
                <div className={`flex-1 py-4 px-5 bg-black/40 border ${emphasis === 'danger' ? 'border-danger/30' : 'border-bg-border'} rounded-2xl flex items-center gap-4 min-w-0 transition-all hover:bg-black/60`}>
                    {Icon && <Icon className={`w-4 h-4 shrink-0 ${emphasis === 'danger' ? 'text-danger' : 'text-purple-glow'}`} />}
                    <span className={`text-[13px] break-all truncate ${isMono ? 'font-mono text-purple-glow' : 'text-text-primary font-medium'} ${emphasis === 'danger' ? 'text-danger' : ''}`}>
                        {value}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-3 bg-bg-surface border border-bg-border rounded-2xl text-text-muted hover:text-white hover:border-purple-vivid/40 transition-all"
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {link && (
                        <a
                            href={link}
                            target="_blank" rel="noopener noreferrer"
                            className="p-3 bg-bg-surface border border-bg-border rounded-2xl text-text-muted hover:text-white hover:border-purple-vivid/40 transition-all"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

function RevokeModal({ record, onClose, onSuccess, onError }) {
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRevoke = async () => {
        if (confirmText !== 'CONFIRM') return;
        setLoading(true);
        try {
            await api.post('/api/hashes/revoke', { hash: record.hash });
            onSuccess();
        } catch (err) {
            onError(err.response?.data?.error || "On-chain revocation failed.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <PurpleModal isOpen={true} onClose={onClose} title="Permanent Invalidations">
            <div className="space-y-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
                        <ShieldAlert className="w-8 h-8 text-danger" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Revoke Proof Authority?</h3>
                        <p className="text-xs text-text-muted max-w-sm mt-1">This operation is cryptographically signed and irreversible. The record will be permanently marked as invalid on-chain.</p>
                    </div>
                </div>

                <div className="bg-black/50 border border-bg-border rounded-2xl p-5 font-mono text-xs text-danger break-all relative">
                    <span className="text-[10px] text-text-muted absolute -top-2 left-4 bg-bg-surface px-2 uppercase font-bold tracking-widest">Target Hash Digest</span>
                    {record.hash}
                </div>

                <div className="space-y-4 pt-4 border-t border-bg-border">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Type CONFIRM to execute</label>
                        <PurpleInput
                            placeholder="CONFIRM"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="text-center font-bold border-danger/20"
                        />
                    </div>
                    <div className="flex gap-3">
                        <GlowButton variant="ghost" onClick={onClose} className="flex-1">CANCEL</GlowButton>
                        <GlowButton
                            variant="danger"
                            disabled={confirmText !== 'CONFIRM'}
                            loading={loading}
                            onClick={handleRevoke}
                            className="flex-1"
                        >
                            REVOKE RECORD
                        </GlowButton>
                    </div>
                </div>
            </div>
        </PurpleModal>
    );
}
