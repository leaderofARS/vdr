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
    Download, Clock
} from 'lucide-react';

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
            console.error("Failed to fetch hash record:", err);
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
                    .cert-container { max-width: 800px; margin: 0 auto; border: 12px solid #4285F4; padding: 40px; position: relative; }
                    .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-weight: 800; font-size: 24px; color: #4285F4; display: flex; align-items: center; justify-content: center; gap: 10px; }
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
            <div className="max-w-[1200px] mx-auto space-y-8 animate-pulse">
                <div className="w-24 h-4 bg-[#1A1D24] rounded"></div>
                <div className="h-48 bg-[#1A1D24] rounded-2xl border border-[#2C3038]"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-[500px] bg-[#1A1D24] rounded-2xl border border-[#2C3038]"></div>
                    <div className="space-y-8">
                        <div className="h-64 bg-[#1A1D24] rounded-2xl border border-[#2C3038]"></div>
                        <div className="h-48 bg-[#1A1D24] rounded-2xl border border-[#2C3038]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error === "Record not found") {
        return (
            <div className="max-w-[1000px] mx-auto mt-20 text-center space-y-6">
                <div className="w-20 h-20 bg-[#F28B82]/10 rounded-full flex items-center justify-center mx-auto border border-[#F28B82]/20">
                    <ShieldAlert className="w-10 h-10 text-[#F28B82]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Record not found</h1>
                    <p className="text-[#9AA0A6]">This hash has not been registered in your organization's registry</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="inline-flex items-center gap-2 bg-[#1A1D24] hover:bg-[#2C3038] text-white px-6 py-3 rounded-xl font-bold transition-all border border-[#2C3038]"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[1000px] mx-auto mt-20 text-center space-y-6">
                <div className="w-20 h-20 bg-[#F28B82]/10 rounded-full flex items-center justify-center mx-auto border border-[#F28B82]/20">
                    <AlertTriangle className="w-10 h-10 text-[#F28B82]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Error Loading Record</h1>
                    <p className="text-[#9AA0A6]">{error}</p>
                </div>
                <button
                    onClick={() => fetchRecord()}
                    className="inline-flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <RefreshCw className="w-4 h-4" /> Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 pb-20 relative">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-xl bg-[#111118] border border-[#1E1E2E] shadow-2xl flex items-center gap-3 min-w-[320px]"
                    >
                        <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-[#10B981]/10' : 'bg-[#F28B82]/10'}`}>
                            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <AlertTriangle className="w-4 h-4 text-[#F28B82]" />}
                        </div>
                        <span className="text-sm text-white font-medium">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-auto text-[#9AA0A6] hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-6">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-fit flex items-center gap-2 text-[#9AA0A6] hover:text-white transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Feed
                </button>

                <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-8 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4285F4]"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <StatusBadge status={record.status} />
                                <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest bg-[#0A0A0F] px-2 py-1 rounded border border-[#1E1E2E]">DEVNET CLUSTER</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-mono text-white break-all max-w-[80%] leading-relaxed">
                                    {record.hash}
                                </h1>
                                <button
                                    onClick={() => handleCopy(record.hash, 'Hash')}
                                    className="p-2 rounded-lg bg-[#20232A] text-[#9AA0A6] hover:text-white transition-all shadow-sm"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 shrink-0">
                            {record.explorerUrl && (
                                <a
                                    href={record.explorerUrl}
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#4285F4]/20 active:scale-95"
                                >
                                    View on Solana Explorer <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            <button
                                onClick={handleDownloadCertificate}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1D24] border border-[#2C3038] hover:bg-[#2C3038] text-white rounded-xl text-sm font-bold transition-all active:scale-95"
                            >
                                <Download className="w-4 h-4" /> Proof Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#161621] flex items-center justify-between">
                            <h3 className="text-white text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                                <HardDrive className="w-4 h-4 text-[#4285F4]" /> Cryptographic Identity
                            </h3>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <DetailItem
                                    label="Owner / Initial Issuer"
                                    value={record.owner}
                                    mono
                                    link={`https://explorer.solana.com/address/${record.owner}?cluster=devnet`}
                                    onCopy={() => handleCopy(record.owner, 'Owner Address')}
                                />
                                <DetailItem
                                    label="Original Anchor Date"
                                    value={new Date(record.registeredAt).toLocaleString()}
                                    icon={Clock}
                                />
                                <DetailItem
                                    label="On-chain Expiry"
                                    value={record.expiry ? new Date(record.expiry).toLocaleDateString() : 'Infinite / Immutable'}
                                    icon={Ban}
                                />
                                <DetailItem
                                    label="Registry Account (PDA)"
                                    value={record.pdaAddress}
                                    mono
                                    link={record.pdaExplorerUrl}
                                    onCopy={() => handleCopy(record.pdaAddress, 'PDA Address')}
                                />
                            </div>

                            <div className="pt-8 border-t border-[#1E1E2E]">
                                <DetailItem
                                    label="Transaction Signature"
                                    value={record.txSignature || '—'}
                                    mono
                                    link={record.explorerUrl}
                                    onCopy={() => handleCopy(record.txSignature, 'TX Signature')}
                                />
                            </div>

                            {record.status === 'revoked' && record.revokedAt && (
                                <div className="pt-8 border-t border-[#F28B82]/20">
                                    <DetailItem
                                        label="Revocation Timestamp"
                                        value={new Date(record.revokedAt).toLocaleString()}
                                        icon={ShieldAlert}
                                    />
                                </div>
                            )}

                            <div className="pt-8 border-t border-[#1E1E2E]">
                                <label className="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest mb-3 block">Metadata Payload</label>
                                <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4 text-[#E8EAED] text-sm font-mono leading-relaxed whitespace-pre-wrap">
                                    {record.metadata || 'No metadata provided for this record.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#161621]">
                            <h3 className="text-white text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Verify This Document
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <p className="text-xs text-[#9AA0A6] leading-relaxed">
                                To cryptographically verify that a local file matches this on-chain record, use the SipHeron CLI:
                            </p>

                            <div className="relative group">
                                <code className="block bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4 text-xs text-[#8AB4F8] font-mono break-all group-hover:border-[#4285F4]/30 transition-all">
                                    sipheron-vdr verify ./your-file.pdf
                                </code>
                                <button
                                    onClick={() => handleCopy(`sipheron-vdr verify ./your-file.pdf`, 'Command')}
                                    className="absolute right-3 top-3 p-1.5 rounded-lg bg-[#20232A] text-[#5F6368] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl p-4">
                                <p className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Expected SHA-256
                                </p>
                                <code className="text-[11px] text-[#E8EAED] font-mono break-all opacity-80 leading-relaxed block">
                                    {record.hash}
                                </code>
                            </div>
                        </div>
                    </div>

                    {record.status === 'active' && (
                        <div className="bg-[#F28B82]/5 border border-[#F28B82]/20 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#F28B82]/10 rounded-lg">
                                        <Ban className="w-5 h-5 text-[#F28B82]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white text-sm font-bold">Revoke Proof</h3>
                                        <p className="text-[11px] text-[#9AA0A6]">Permanently invalidate this record.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowRevokeModal(true)}
                                    className="w-full py-3 bg-[#F28B82]/10 hover:bg-[#F28B82] text-[#F28B82] hover:text-white text-xs font-bold rounded-xl transition-all border border-[#F28B82]/30 active:scale-95 px-4"
                                >
                                    INITIATE ON-CHAIN REVOCATION
                                </button>
                                <p className="text-[10px] text-[#5F6368] text-center italic">Requires write access to Organization Identity.</p>
                            </div>
                        </div>
                    )}

                    <div className="p-6 bg-[#4285F4]/5 border border-[#4285F4]/20 rounded-2xl">
                        <div className="flex items-start gap-4">
                            <Info className="w-5 h-5 text-[#4285F4] shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <h4 className="text-white text-[13px] font-bold">Blockchain finality</h4>
                                <p className="text-[11px] text-[#9AA0A6] leading-relaxed">This record is permanently anchored to the Solana Devnet. Use the CLI `revoke` command or this dashboard to invalidate it.</p>
                                <Link href="/docs/concepts" className="text-[11px] text-[#4285F4] font-bold hover:underline flex items-center gap-1">
                                    Learn more <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
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
            </AnimatePresence>
        </div>
    );
}

function DetailItem({ label, value, mono, link, icon: Icon, onCopy }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest block">{label}</label>
            <div className="flex items-center gap-2 group">
                <div className={`flex-1 py-3 px-4 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl text-sm ${mono ? 'font-mono' : 'text-[#E8EAED]'} break-all flex items-center gap-2`}>
                    {Icon && <Icon className="w-3.5 h-3.5 text-[#9AA0A6]" />}
                    <span className="opacity-90">{value}</span>
                </div>
                {(link || onCopy) && (
                    <div className="flex flex-col gap-1 shrink-0">
                        {onCopy && (
                            <button
                                onClick={onCopy}
                                className="p-2 rounded-lg bg-[#20232A] text-[#9AA0A6] hover:text-white transition-all shadow-sm"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        )}
                        {link && (
                            <a
                                href={link}
                                target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-[#20232A] text-[#9AA0A6] hover:text-white transition-all shadow-sm"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        active: { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', dot: 'bg-[#10B981]', label: 'Active Status' },
        revoked: { bg: 'bg-[#F28B82]/10', text: 'text-[#F28B82]', dot: 'bg-[#F28B82]', label: 'Revoked Archive' },
        expired: { bg: 'bg-[#FBC02D]/10', text: 'text-[#FBC02D]', dot: 'bg-[#FBC02D]', label: 'Expired' }
    };
    const s = config[status] || config.active;
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${s.bg} ${s.text} font-bold text-[10px] uppercase tracking-[0.2em] border border-transparent shadow-sm shadow-black/20`}>
            <div className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`}></div> {s.label}
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
            onError(err.response?.data?.error || "On-chain revocation failed. Check registry status.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#111118] border border-[#1E1E2E] rounded-2xl shadow-2xl overflow-hidden p-8" >
                <div className="w-14 h-14 rounded-full bg-[#F28B82]/10 border border-[#F28B82]/20 flex items-center justify-center mb-6 mx-auto">
                    <ShieldAlert className="w-7 h-7 text-[#F28B82]" />
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-2">Revoke Document Proof?</h3>
                <p className="text-sm text-[#9AA0A6] text-center leading-relaxed mb-6 px-4">
                    This action is <span className="text-[#F28B82] font-bold">permanent</span> and irreversible. The hash will be marked as revoked on the Solana blockchain.
                </p>

                <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4 mb-8 font-mono text-[11px] text-[#4285F4] break-all relative group">
                    <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#0A0A0F] px-2 text-[8px] font-bold text-[#5F6368] uppercase tracking-widest border border-[#1E1E2E] rounded">Hash Target</div>
                    {record.hash}
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest ml-1">Type CONFIRM to authorize</label>
                    <input
                        type="text"
                        placeholder="CONFIRM"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="w-full bg-[#131418] border border-[#1E1E2E] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#F28B82] uppercase font-bold tracking-widest placeholder:opacity-20"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-3.5 rounded-xl text-sm text-[#9AA0A6] font-bold hover:text-white transition-colors" >
                        CANCEL
                    </button>
                    <button
                        disabled={confirmText !== 'CONFIRM' || loading}
                        onClick={handleRevoke}
                        className="px-4 py-3.5 rounded-xl bg-[#F28B82] text-white text-sm font-bold hover:bg-[#EE675C] disabled:bg-[#1A1D24] disabled:text-[#3C4043] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F28B82]/10"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-t-white border-white/20 rounded-full animate-spin" /> : "REVOKE PROOF"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
