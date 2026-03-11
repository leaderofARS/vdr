'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.sipheron.com';

export default function VerifyPage() {
    const { hash } = useParams();
    if (!hash) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-white">Invalid verification link.</p>
        </div>
    );
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!hash) return;
        fetch(`${API_BASE}/api/hashes/public/${hash}`)
            .then(r => r.json())
            .then(data => {
                setResult(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to contact registry');
                setLoading(false);
            });
    }, [hash]);

    const isRevoked = result?.record?.status === 'revoked';
    const isVerified = result?.verified && !isRevoked;

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
            {/* Logo */}
            <div className="mb-12 flex items-center gap-3">
                <Image src="/sipheron_vdap_logo.png" alt="SipHeron" width={40} height={40} />
                <span className="text-xl font-bold text-white">SipHeron VDR</span>
            </div>

            {/* Status Card */}
            <div className={`w-full max-w-2xl rounded-2xl border p-8 mb-8 ${
                isVerified
                    ? 'border-green-500/30 bg-green-500/5'
                    : isRevoked
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-red-500/30 bg-red-500/5'
            }`}>
                {/* Big status icon */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                        isVerified ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                        {isVerified ? (
                            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <h1 className={`text-3xl font-bold mb-2 ${isVerified ? 'text-green-400' : 'text-red-400'}`}>
                        {isVerified ? 'Document Authentic' : isRevoked ? 'Document Revoked' : 'Not Found in Registry'}
                    </h1>
                    <p className="text-gray-400 text-sm max-w-md">
                        {isVerified
                            ? 'This document hash has been verified on the Solana blockchain via SipHeron VDR.'
                            : isRevoked
                            ? 'This document proof has been revoked by the issuing organization.'
                            : 'This hash was not found in the SipHeron registry. The document may be tampered or not anchored.'}
                    </p>
                </div>

                {/* Hash */}
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">SHA-256 Hash</p>
                    <p className="font-mono text-xs text-purple-300 break-all">{hash}</p>
                </div>

                {result?.record && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.record.metadata && (
                            <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Document Name</p>
                                <p className="text-sm text-white font-medium">{result.record.metadata}</p>
                            </div>
                        )}
                        {result.record.registeredAt && (
                            <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Registered On</p>
                                <p className="text-sm text-white font-medium">
                                    {new Date(result.record.registeredAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                        {result.organization?.name && (
                            <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Issued By</p>
                                <p className="text-sm text-white font-medium">{result.organization.name}</p>
                            </div>
                        )}
                        {result.record.expiry && (
                            <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Expires</p>
                                <p className="text-sm text-white font-medium">
                                    {new Date(result.record.expiry).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        {isRevoked && result.record.revokedAt && (
                            <div className="bg-black/40 border border-red-500/20 rounded-xl p-4">
                                <p className="text-[10px] text-red-400 uppercase tracking-widest mb-1">Revoked On</p>
                                <p className="text-sm text-red-300 font-medium">
                                    {new Date(result.record.revokedAt).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Explorer Links */}
                {result?.record?.explorerUrl && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <a
                            href={result.record.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition-colors"
                        >
                            View Transaction on Solana Explorer ↗
                        </a>
                        {result.record.pdaExplorerUrl && (
                            <a
                                href={result.record.pdaExplorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors"
                            >
                                View PDA Account ↗
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* QR Code section — hash page renders its own QR */}
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col items-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Verification QR Code</p>
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://app.sipheron.com/verify/${hash}`)}&bgcolor=000000&color=a855f7&qzone=2`}
                    alt="QR Code"
                    className="rounded-xl"
                    width={180}
                    height={180}
                />
                <p className="text-xs text-gray-500 mt-3">Scan to verify this document</p>
            </div>

            {/* Footer */}
            <div className="text-center">
                <p className="text-gray-600 text-xs">
                    Powered by{' '}
                    <a href="https://sipheron.com" className="text-purple-400 hover:text-purple-300">
                        SipHeron VDR
                    </a>
                    {' '}— Immutable document verification on Solana
                </p>
            </div>
        </div>
    );
}
