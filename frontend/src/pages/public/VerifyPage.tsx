/**
 * @file VerifyPage.tsx
 * @description Public verification page for SipHeron VDR
 * Ported from web/dashboard/src/app/verify/[hash]/page.js
 * CRITICAL: This is a PUBLIC page (no auth required)
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X, Copy } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-sipheron-green" /> : <Copy className="w-3.5 h-3.5 text-sipheron-text-muted" />}
    </button>
  );
};

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.sipheron.com';
const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

interface VerificationRecord {
  hash: string;
  status: string;
  metadata?: string;
  registeredAt?: string;
  revokedAt?: string;
  expiry?: string;
  explorerUrl?: string;
  pdaExplorerUrl?: string;
  txSignature?: string;
  blockNumber?: string | number;
  blockTimestamp?: string;
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

  const verifyInputRef = useRef<HTMLInputElement>(null)
  const [verifyDragging, setVerifyDragging] = useState(false)
  const [verifyHashing, setVerifyHashing] = useState(false)
  const [verifyResult, setVerifyResult] = useState<'AUTHENTIC' | 'MISMATCH' | null>(null)
  const [computedHash, setComputedHash] = useState<string | null>(null)

  const handleVerifyFile = async (file: File) => {
    setVerifyHashing(true)
    setVerifyResult(null)
    setComputedHash(null)
    try {
      const { hashFile } = await import('../../utils/hash')
      const fileHash = await hashFile(file)
      setComputedHash(fileHash)
      // Accept it passing if it matches the parameterized hash or the record hash
      const isMatch = fileHash.toLowerCase() === hash?.toLowerCase()
      setVerifyResult(isMatch ? 'AUTHENTIC' : 'MISMATCH')
    } catch (err) {
      console.error('Hash computation failed:', err)
    } finally {
      setVerifyHashing(false)
      setVerifyDragging(false)
    }
  }

  const handleVerifyDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setVerifyDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) await handleVerifyFile(file)
  }

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sipheron-purple/10 border border-sipheron-purple/20 mb-6 group">
              <div className="w-5 h-5 group-hover:scale-110 transition-transform duration-300">
                <img src="/sipheron_vdap_logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sipheron-green">Secure Protocol Verification</span>
            </div>
      <p className="text-white font-bold text-xl">Verification Failed</p>
      <p className="text-sipheron-text-muted text-sm">{error}</p>
      <Link to="/" className="text-sipheron-purple text-sm hover:text-sipheron-teal mt-4">
        ← Back to SipHeron
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-sipheron-base text-white flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3 group">
          <div className="w-10 h-10 group-hover:scale-110 transition-transform duration-300">
            <img src="/sipheron_vdap_logo.png" alt="SipHeron Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(155,110,255,0.3)]" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SipHeron VDR</span>
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
              {result.record.blockNumber && (
                <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[10px] text-sipheron-text-muted uppercase tracking-widest mb-1">Block Number</p>
                  <p className="text-sm text-white font-medium">{result.record.blockNumber.toString()}</p>
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

        {/* ── Verify Your Document ── */}
        <div className="w-full max-w-2xl bg-[#0D0D1A] border border-white/[0.06] rounded-2xl p-6 mb-8 text-left">
          <p className="text-sm font-semibold text-[#F0F0FF] mb-1">
            Verify Your Document
          </p>
          <p className="text-xs text-[#8888AA] mb-5">
            Drop the document you received to confirm it is identical to the anchored version.
            The file never leaves your device — hashing happens in your browser.
          </p>

          {/* Drop zone */}
          <div
            onDrop={handleVerifyDrop}
            onDragOver={e => { e.preventDefault(); setVerifyDragging(true) }}
            onDragLeave={() => setVerifyDragging(false)}
            onClick={() => verifyInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              verifyDragging
                ? 'border-[#6C63FF] bg-[#6C63FF]/10'
                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            {verifyHashing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#8888AA]">Computing SHA-256...</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#F0F0FF] font-medium">
                  Drop your document here
                </p>
                <p className="text-xs text-[#8888AA] mt-1">or click to select a file</p>
              </>
            )}
            <input
              ref={verifyInputRef}
              type="file"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleVerifyFile(e.target.files[0])}
            />
          </div>

          {/* Result */}
          {verifyResult && (
            <div className={`mt-4 rounded-2xl p-6 text-center border-2 ${
              verifyResult === 'AUTHENTIC'
                ? 'bg-[#00D97E]/10 border-[#00D97E]/40'
                : 'bg-[#FF4757]/10 border-[#FF4757]/40'
            }`}>
              <div className={`text-5xl font-black mb-2 ${
                verifyResult === 'AUTHENTIC' ? 'text-[#00D97E]' : 'text-[#FF4757]'
              }`}>
                {verifyResult === 'AUTHENTIC' ? '✓ AUTHENTIC' : '✗ MISMATCH'}
              </div>
              <p className={`text-sm ${
                verifyResult === 'AUTHENTIC' ? 'text-[#00D97E]/80' : 'text-[#FF4757]/80'
              }`}>
                {verifyResult === 'AUTHENTIC'
                  ? 'This document is identical to the anchored version. It has not been modified.'
                  : 'This document does not match the anchored version. It may have been altered.'}
              </p>
              {verifyResult === 'MISMATCH' && computedHash && (
                <div className="mt-4 bg-black/40 rounded-xl p-3 text-left">
                  <p className="text-[10px] text-[#44445A] uppercase tracking-widest mb-1">
                    Your file's hash
                  </p>
                  <p className="text-xs font-mono text-[#FF4757] break-all">{computedHash}</p>
                  <p className="text-[10px] text-[#44445A] uppercase tracking-widest mt-3 mb-1">
                    Anchored hash
                  </p>
                  <p className="text-xs font-mono text-[#8888AA] break-all">{hash}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Independent Verification Path ── */}
        <div className="w-full max-w-2xl bg-[#0A0A12] border border-[#6C63FF]/20 rounded-2xl p-6 mb-8 text-left">
          <p className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-3">
            Independent Verification
          </p>
          <p className="text-xs text-[#8888AA] mb-4 leading-relaxed">
            You do not need SipHeron to verify this document.
            You can independently verify using any SHA-256 tool and any Solana block explorer.
          </p>

          <div className="space-y-4">
            {/* Step 1 */}
            <div>
              <p className="text-xs font-semibold text-[#F0F0FF] mb-1">
                Step 1 — Compute the document hash
              </p>
              <p className="text-xs text-[#8888AA] mb-2">
                Using any SHA-256 tool, compute the hash of the document you received:
              </p>
              <div className="bg-black/40 rounded-xl p-3 font-mono text-xs space-y-1">
                <p className="text-[#4ECDC4]"># Linux / macOS</p>
                <p className="text-[#F0F0FF]">sha256sum your-document.pdf</p>
                <p className="text-[#4ECDC4] mt-2"># Windows (PowerShell)</p>
                <p className="text-[#F0F0FF]">Get-FileHash your-document.pdf -Algorithm SHA256</p>
                <p className="text-[#4ECDC4] mt-2"># Node.js</p>
                <p className="text-[#F0F0FF]">{"const {createHash}=require('crypto'); createHash('sha256').update(require('fs').readFileSync('file')).digest('hex')"}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <p className="text-xs font-semibold text-[#F0F0FF] mb-1">
                Step 2 — Compare against the anchored hash
              </p>
              <p className="text-xs text-[#8888AA] mb-2">
                The anchored hash for this document is:
              </p>
              <div className="bg-black/40 rounded-xl p-3 flex items-center justify-between gap-3">
                <p className="text-xs font-mono text-[#6C63FF] break-all flex-1">
                  {hash}
                </p>
                <CopyButton text={hash || ''} />
              </div>
              <p className="text-xs text-[#8888AA] mt-2">
                If the hash you computed matches this exactly, the document is authentic.
                Any difference — even a single character — means the document was modified.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <p className="text-xs font-semibold text-[#F0F0FF] mb-1">
                Step 3 — Verify the blockchain record independently
              </p>
              <p className="text-xs text-[#8888AA] mb-2">
                Look up the Solana transaction directly on any block explorer:
              </p>
              {result?.record?.txSignature || result?.record?.explorerUrl ? (
                <a
                  href={result?.record?.explorerUrl || `https://explorer.solana.com/tx/${result?.record?.txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#6C63FF]
                             hover:text-[#4ECDC4] transition-colors font-mono"
                >
                  {(result?.record?.txSignature?.slice(0, 20) || 'Transaction URL')}... ↗
                </a>
              ) : (
                <p className="text-xs text-[#44445A]">Transaction pending confirmation or missing from old record</p>
              )}
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="w-full max-w-2xl bg-white/5 border border-white/[0.06] rounded-2xl p-6 mb-8 flex flex-col items-center">
          <p className="text-[10px] text-sipheron-text-muted uppercase tracking-widest mb-4">Verification QR Code</p>
          {hash && (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${APP_URL}/verify/${hash}`)}&bgcolor=000000&color=a855f7&qzone=2`}
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
      </main>

    </div>
  );
};

export default VerifyPage;
