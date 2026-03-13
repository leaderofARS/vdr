/**
 * @file VerifyLandingPage.tsx
 * @description Public document verification landing page
 * Allows users to upload files and verify against the blockchain
 * Ported from web/dashboard/src/app/verify/page.js
 */

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  FileSearch, 
  Activity, 
  Landmark, 
  ExternalLink,
  Upload,
  File,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface VerificationResult {
  verified: boolean;
  owner?: string;
  timestamp?: number;
  pdaAddress?: string;
  metadata?: string;
  transaction?: string;
}

export const VerifyLandingPage: React.FC = () => {

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error' | 'tampered'>('idle');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const computeHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    
    setFileName(file.name);
    setStatus('verifying');
    
    try {
      const computedHash = await computeHash(file);
      
      // Verify against API
      const API_BASE = import.meta.env.VITE_API_URL || 'https://api.sipheron.com';
      const response = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: computedHash })
      });
      
      if (!response.ok) throw new Error('Verification failed');
      
      const data = await response.json();
      
      if (data.verified) {
        setResult(data);
        setStatus('success');
      } else {
        setResult(null);
        setStatus('tampered');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
    setFileName(null);
  };

  return (
    <div className="min-h-screen bg-sipheron-base text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-sipheron-surface/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sipheron-purple to-sipheron-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-white">SipHeron VDR</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-sm text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/docs" className="text-sm text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
              Docs
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sipheron-purple/10 border border-sipheron-purple/20 mb-6">
              <ShieldCheck className="w-4 h-4 text-sipheron-green" />
              <span className="text-xs font-semibold uppercase tracking-wider text-sipheron-green">Secure Protocol Verification</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-sipheron-purple to-sipheron-teal">Integrity</span>
            </h1>
            <p className="text-lg text-sipheron-text-secondary max-w-xl mx-auto">
              Authenticate your documents against the immutable blockchain ledger on Solana.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-sipheron-surface border border-white/[0.06] rounded-2xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Landmark className="w-5 h-5 text-sipheron-purple" />
              Upload Document for Verification
            </h2>

            {/* File Upload Area */}
            {status === 'idle' && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                  ${isDragging 
                    ? 'border-sipheron-purple bg-sipheron-purple/5' 
                    : 'border-white/[0.1] hover:border-sipheron-purple/50 hover:bg-white/[0.02]'
                  }
                `}
              >
                <input
                  type="file"
                  onChange={handleInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 rounded-2xl bg-sipheron-purple/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-sipheron-purple" />
                </div>
                <p className="text-white font-medium mb-2">
                  Drop your file here, or click to browse
                </p>
                <p className="text-sm text-sipheron-text-muted">
                  Supports any file type. Your file never leaves your device.
                </p>
              </div>
            )}

            {/* Verifying State */}
            {status === 'verifying' && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <Loader2 className="w-16 h-16 animate-spin text-sipheron-purple opacity-20" />
                  <Activity className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sipheron-purple" />
                </div>
                <p className="text-xl font-semibold text-white">Querying Solana Registry...</p>
                <p className="text-sm text-sipheron-text-muted mt-2">Computing SHA-256 hash</p>
                {fileName && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <File className="w-4 h-4 text-sipheron-text-muted" />
                    <span className="text-sm text-sipheron-text-secondary">{fileName}</span>
                  </div>
                )}
              </div>
            )}

            {/* Success State */}
            {status === 'success' && result && (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-sipheron-green/10 border border-sipheron-green/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-sipheron-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Verified Authentic</h3>
                  <p className="text-sipheron-green text-sm font-medium uppercase tracking-wider">On-Chain Match Confirmed</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-sipheron-green/20">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    {result.owner && (
                      <div>
                        <dt className="text-xs text-sipheron-text-muted uppercase tracking-wider mb-1">Issuer Identity</dt>
                        <dd className="font-mono text-sipheron-text-primary break-all">{result.owner}</dd>
                      </div>
                    )}
                    {result.timestamp && (
                      <div>
                        <dt className="text-xs text-sipheron-text-muted uppercase tracking-wider mb-1">Anchored On</dt>
                        <dd className="text-sipheron-text-primary">{new Date(result.timestamp * 1000).toLocaleString()}</dd>
                      </div>
                    )}
                    {result.pdaAddress && (
                      <div>
                        <dt className="text-xs text-sipheron-text-muted uppercase tracking-wider mb-1">Provenance Record</dt>
                        <dd className="font-mono text-sipheron-teal flex items-center gap-2">
                          {result.pdaAddress.slice(0, 16)}...
                          <a 
                            href={`https://explorer.solana.com/address/${result.pdaAddress}?cluster=devnet`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs text-sipheron-text-muted uppercase tracking-wider mb-1">Registry Metadata</dt>
                      <dd className="text-sipheron-text-secondary italic">{result.metadata || "No metadata"}</dd>
                    </div>
                  </dl>
                </div>

                <button
                  onClick={reset}
                  className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sipheron-text-primary font-medium hover:bg-white/[0.08] transition-colors"
                >
                  Verify Another Document
                </button>
              </div>
            )}

            {/* Tampered State */}
            {status === 'tampered' && (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-sipheron-red/10 border border-sipheron-red/20 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-10 h-10 text-sipheron-red" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Verification Failed</h3>
                <p className="text-sipheron-text-secondary max-w-md mx-auto mb-6">
                  This file's signature does not match any record in the SipHeron registry. 
                  The data may have been <span className="text-sipheron-red font-semibold">modified</span> or was never anchored.
                </p>
                <button
                  onClick={reset}
                  className="px-6 py-2.5 rounded-xl bg-sipheron-purple text-white font-medium hover:bg-sipheron-purple/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-sipheron-gold/10 border border-sipheron-gold/20 flex items-center justify-center mb-4">
                  <FileSearch className="w-10 h-10 text-sipheron-gold" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Connection Error</h3>
                <p className="text-sipheron-text-secondary max-w-md mx-auto mb-6">
                  Unable to connect to the verification API. Please check your connection and try again.
                </p>
                <button
                  onClick={reset}
                  className="px-6 py-2.5 rounded-xl bg-sipheron-purple text-white font-medium hover:bg-sipheron-purple/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-sipheron-text-muted">
              Documents are hashed locally in your browser. Your files are never uploaded to our servers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sipheron-text-muted">
            © 2025 SipHeron VDR. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-xs text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VerifyLandingPage;
