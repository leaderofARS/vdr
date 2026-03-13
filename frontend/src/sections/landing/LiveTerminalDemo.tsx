import React, { useState } from 'react';
import { Search, Check, X, AlertTriangle, ExternalLink, ArrowRight } from 'lucide-react';

type VerificationStatus = 'idle' | 'loading' | 'found' | 'not-found' | 'revoked';

interface VerificationResult {
  status: VerificationStatus;
  hash?: string;
  date?: string;
  org?: string;
  tx?: string;
  message?: string;
}

export const LiveTerminalDemo: React.FC = () => {
  const [hashInput, setHashInput] = useState('');
  const [result, setResult] = useState<VerificationResult>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hashInput.trim() || hashInput.length !== 64) return;

    setIsLoading(true);
    setResult({ status: 'loading' });

    // Simulate API call
    setTimeout(() => {
      // Demo logic - specific hash shows found, others show not found
      if (hashInput === 'a3f4b2c1d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4') {
        setResult({
          status: 'found',
          hash: hashInput,
          date: '14 Jan 2025',
          org: 'ARS Labs',
          tx: '3xK9mPqRsTuVwXyZ123456789',
        });
      } else if (hashInput === '0000000000000000000000000000000000000000000000000000000000000000') {
        setResult({
          status: 'revoked',
          hash: hashInput,
          message: 'This document\'s verification has been revoked by the issuer.',
        });
      } else {
        setResult({
          status: 'not-found',
          hash: hashInput,
          message: 'This hash has not been anchored to SipHeron VDR.',
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const getResultContent = () => {
    switch (result.status) {
      case 'found':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sipheron-green">
              <Check className="w-5 h-5" />
              <span className="font-semibold">AUTHENTIC</span>
            </div>
            <div className="text-sipheron-text-secondary text-sm space-y-1">
              <div>Anchored: {result.date}</div>
              <div>By: {result.org}</div>
              <div className="flex items-center gap-2">
                Tx:
                <a
                  href={`https://explorer.solana.com/tx/${result.tx}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sipheron-purple hover:text-sipheron-teal flex items-center gap-1"
                >
                  {result.tx?.slice(0, 16)}...
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        );
      case 'not-found':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sipheron-red">
              <X className="w-5 h-5" />
              <span className="font-semibold">NOT FOUND</span>
            </div>
            <div className="text-sipheron-text-secondary text-sm">
              {result.message}
            </div>
          </div>
        );
      case 'revoked':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sipheron-orange">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">REVOKED</span>
            </div>
            <div className="text-sipheron-text-secondary text-sm">
              {result.message}
            </div>
          </div>
        );
      case 'loading':
        return (
          <div className="flex items-center gap-3 text-sipheron-text-secondary">
            <div className="w-5 h-5 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin" />
            <span>Verifying on Solana...</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #0a0a1a 50%, #033345 100%)',
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full orb opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(108,99,255,0.5) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full orb orb-delay-2 opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(78,205,196,0.5) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div className="absolute inset-0 dot-grid opacity-30" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-sipheron-text-primary mb-4">
            Verify Any Document Right Now
          </h2>
          <p className="text-sipheron-text-secondary">
            Paste a SHA-256 hash below and see it verified live on Solana
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleVerify} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Paste SHA-256 hash (64 hex characters)..."
                className="w-full px-4 py-3 pl-11 rounded-xl bg-sipheron-base border border-white/[0.1] text-sipheron-text-primary placeholder:text-sipheron-text-muted font-mono text-sm focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                maxLength={64}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sipheron-text-muted" />
            </div>
            <button
              type="submit"
              disabled={isLoading || hashInput.length !== 64}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Hint */}
        <p className="text-center text-xs text-sipheron-text-muted mb-8">
          Try this demo hash:{' '}
          <code className="px-1.5 py-0.5 rounded bg-white/5 text-sipheron-teal">
            a3f4b2c1d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4
          </code>
        </p>

        {/* Result Terminal */}
        {(result.status !== 'idle') && (
          <div
            className="terminal animate-fade-in"
            style={{
              borderColor:
                result.status === 'found'
                  ? 'rgba(0,217,126,0.3)'
                  : result.status === 'revoked'
                  ? 'rgba(255,107,53,0.3)'
                  : result.status === 'not-found'
                  ? 'rgba(255,71,87,0.3)'
                  : 'rgba(108,99,255,0.3)',
            }}
          >
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-sipheron-red/80" />
                <div className="w-3 h-3 rounded-full bg-sipheron-gold/80" />
                <div className="w-3 h-3 rounded-full bg-sipheron-green/80" />
              </div>
              <span className="ml-4 text-xs text-sipheron-text-muted font-mono">
                verification — sipheron-vdr
              </span>
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-sm">
              <div className="text-sipheron-teal mb-2">
                $ sipheron-vdr verify {result.hash?.slice(0, 32)}...
              </div>
              <div className="mt-4">{getResultContent()}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveTerminalDemo;
