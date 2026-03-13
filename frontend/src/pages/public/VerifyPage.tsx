/**
 * @file VerifyPage.tsx
 * @description Public verification page for SipHeron VDR
 * Ported from web/dashboard/src/app/verify/[hash]/page.js
 * CRITICAL: This is a PUBLIC page (no auth required)
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.sipheron.com';

interface VerificationRecord {
  hash: string;
  status: string;
  metadata?: string;
  registeredAt?: string;
  revokedAt?: string;
  expiry?: string;
  explorerUrl?: string;
  pdaExplorerUrl?: string;
}

interface VerificationResult {
  verified: boolean;
  record?: VerificationRecord;
  organization?: {
    name: string;
  };
}

export const VerifyPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hash) {
      setLoading(false);
      setError('Invalid verification link');
      return;
    }
    fetch(`${API_BASE}/api/hashes/public/${hash}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to contact registry');
        setLoading(false);
      });
  }, [hash]);

  const isRevoked = result?.record?.status === 'revoked';
  const isVerified = result?.verified && !isRevoked;

  // Loading state
  if (loading) return (
    <div className="min-h-screen bg-sipheron-base flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Error state
  if (error && !result) return (
    <div className="min-h-screen bg-sipheron-base flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full bg-sipheron-red/20 flex items-center justify-center">
        <X className="w-8 h-8 text-sipheron-red" />
      </div>
      <p className="text-white font-bold text-xl">Verification Failed</p>
      <p className="text-sipheron-text-muted text-sm">{error}</p>
      <Link to="/" className="text-sipheron-purple text-sm hover:text-sipheron-teal mt-4">
        ← Back to SipHeron
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-sipheron-base text-white flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="mb-12 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sipheron-purple to-sipheron-teal flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <span className="text-xl font-bold text-white">SipHeron VDR</span>
      </div>

      {/* Status Card */}
      <div className={`w-full max-w-2xl rounded-2xl border p-8 mb-8 ${
        isVerified
          ? 'border-sipheron-green/30 bg-sipheron-green/5'
          : 'border-sipheron-red/30 bg-sipheron-red/5'
      }`}>
        <div className="flex flex-col items-center text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            isVerified ? 'bg-sipheron-green/20' : 'bg-sipheron-red/20'
          }`}>
            {isVerified ? (
              <Check className="w-10 h-10 text-sipheron-green" />
            ) : (
              <X className="w-10 h-10 text-sipheron-red" />
            )}
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isVerified ? 'text-sipheron-green' : 'text-sipheron-red'}`}>
            {isVerified
              ? 'Document Authentic'
              : isRevoked
              ? 'Document Revoked'
              : 'Not Found in Registry'}
          </h1>
          <p className="text-sipheron-text-secondary text-sm max-w-md">
            {isVerified
              ? 'This document hash has been verified on the Solana blockchain via SipHeron VDR.'
              : isRevoked
              ? 'This document proof has been revoked by the issuing organization.'
              : 'This hash was not found in the SipHeron registry. The document may be tampered or not anchored.'}
          </p>
        </div>

        {/* Hash display */}
        <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 mb-4">
          <p className="text-[10px] text-sipheron-text-muted uppercase tracking-widest mb-2">SHA-256 Hash</p>
          <p className="font-mono text-xs text-sipheron-teal break-all">{hash}</p>
        </div>

        {result?.record && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.record.metadata && (
              <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
                <p className="text-[10px] text-sipheron-text-muted uppercase tracking-widest mb-1">Document Name</p>
                <p className="text-sm text-white font-medium">{result.record.metadata}</p>
              </div>
            )}
            {result.record.registeredAt && (
              <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
                <p className="text-[10px] text-sipheron-text-muted uppercase tracking-widest mb-1">Registered On</p>
                <p className="text-sm text-white font-medium">
                  {new Date(result.record.registeredAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            )}
            {result.organization?.name && (
              <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
                <p className="text-[10px] text-sipheron-text-muted uppercase tracking-widest mb-1">Issued By</p>
                <p className="text-sm text-white font-medium">{result.organization.name}</p>
              </div>
            )}
            {result.record.expiry && (
              <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
                <p className="text-[10px] text-sipheron-text-muted uppercase tracking-widest mb-1">Expires</p>
                <p className="text-sm text-white font-medium">
                  {new Date(result.record.expiry).toLocaleDateString()}
                </p>
              </div>
            )}
            {isRevoked && result.record.revokedAt && (
              <div className="bg-black/40 border border-sipheron-red/20 rounded-xl p-4">
                <p className="text-[10px] text-sipheron-red uppercase tracking-widest mb-1">Revoked On</p>
                <p className="text-sm text-sipheron-red/80 font-medium">
                  {new Date(result.record.revokedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}

        {result?.record?.explorerUrl && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={result.record.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-sipheron-purple/30 bg-sipheron-purple/10 text-sipheron-purple text-sm font-medium hover:bg-sipheron-purple/20 transition-colors"
            >
              View Transaction on Solana Explorer ↗
            </a>
            {result.record.pdaExplorerUrl && (
              <a
                href={result.record.pdaExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/5 text-sipheron-text-secondary text-sm font-medium hover:bg-white/10 transition-colors"
              >
                View PDA Account ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* QR Code */}
      <div className="w-full max-w-2xl bg-white/5 border border-white/[0.06] rounded-2xl p-6 mb-8 flex flex-col items-center">
        <p className="text-[10px] text-sipheron-text-muted uppercase tracking-widest mb-4">Verification QR Code</p>
        {hash && (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://app.sipheron.com/verify/${hash}`)}&bgcolor=000000&color=a855f7&qzone=2`}
            alt="QR Code"
            className="rounded-xl"
            width={180}
            height={180}
          />
        )}
        <p className="text-xs text-sipheron-text-muted mt-3">Scan to verify this document</p>
      </div>

      <div className="text-center">
        <p className="text-sipheron-text-muted/50 text-xs">
          Powered by{' '}
          <Link to="/" className="text-sipheron-purple hover:text-sipheron-teal">
            SipHeron VDR
          </Link>
          {' '}— Immutable document verification on Solana
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;
