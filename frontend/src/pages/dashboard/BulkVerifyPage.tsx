import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Copy,
  ArrowLeft,
  FileCheck,
  Shield,
  Search,
  X,
  Loader2,
} from 'lucide-react';
import api from '@/utils/api';

// Types
interface VerificationResult {
  hash: string;
  status: 'verified' | 'not_found' | 'revoked' | 'invalid';
  verified: boolean;
  metadata?: string;
  organization?: string;
  registeredAt?: string;
  revokedAt?: string | null;
  error?: string;
}

interface VerificationSummary {
  total: number;
  verified: number;
  notFound: number;
  revoked: number;
  invalid: number;
}

interface BulkVerifyResponse {
  results: VerificationResult[];
  summary: VerificationSummary;
}

export const BulkVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [hashesInput, setHashesInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState<VerificationResult[] | null>(null);
  const [summary, setSummary] = useState<VerificationSummary | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Parse hashes from input (one per line)
  const parseHashes = useCallback((input: string): string[] => {
    return input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      toast.error('Please upload a .txt or .csv file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setHashesInput(content);
        toast.success(`Loaded ${parseHashes(content).length} hashes from file`);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  }, [parseHashes]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle verify button click
  const handleVerify = async () => {
    const hashes = parseHashes(hashesInput);

    if (hashes.length === 0) {
      toast.error('Please enter at least one hash to verify');
      return;
    }

    if (hashes.length > 1000) {
      toast.error('Maximum 1000 hashes allowed per request');
      return;
    }

    setIsVerifying(true);
    setResults(null);
    setSummary(null);

    try {
      const { data } = await api.post<BulkVerifyResponse>('/api/hashes/bulk-verify', {
        hashes,
      });

      setResults(data.results);
      setSummary(data.summary);
      toast.success(`Verification complete: ${data.summary.verified} verified`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to verify hashes');
      console.error('Bulk verify error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Clear all
  const handleClear = () => {
    setHashesInput('');
    setResults(null);
    setSummary(null);
    toast.info('Cleared all hashes and results');
  };

  // Copy results to clipboard
  const copyResults = () => {
    if (!results) return;

    const csvContent = [
      'Hash,Status,Verified,Metadata,Organization,Error',
      ...results.map((r) => {
        const escapedMetadata = r.metadata ? `"${r.metadata.replace(/"/g, '""')}"` : '';
        return `${r.hash},${r.status},${r.verified},${escapedMetadata},${r.organization || ''},${r.error || ''}`;
      }),
    ].join('\n');

    navigator.clipboard.writeText(csvContent);
    toast.success('Results copied to clipboard');
  };

  // Export results as CSV
  const exportResults = () => {
    if (!results || !summary) return;

    const csvContent = [
      'SipHeron VDR - Bulk Verification Results',
      `Generated: ${new Date().toISOString()}`,
      '',
      'Summary',
      `Total,${summary.total}`,
      `Verified,${summary.verified}`,
      `Not Found,${summary.notFound}`,
      `Revoked,${summary.revoked}`,
      `Invalid,${summary.invalid}`,
      '',
      'Results',
      'Hash,Status,Verified,Metadata,Organization,Registered At,Revoked At,Error',
      ...results.map((r) => {
        const escapedMetadata = r.metadata ? `"${r.metadata.replace(/"/g, '""')}"` : '';
        return `${r.hash},${r.status},${r.verified},${escapedMetadata},${r.organization || ''},${r.registeredAt || ''},${r.revokedAt || ''},${r.error || ''}`;
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sipheron-bulk-verify-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Results exported as CSV');
  };

  // Get status icon based on status
  const getStatusIcon = (status: VerificationResult['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-sipheron-green" />;
      case 'not_found':
        return <Search className="w-5 h-5 text-sipheron-text-muted" />;
      case 'revoked':
        return <XCircle className="w-5 h-5 text-sipheron-red" />;
      case 'invalid':
        return <AlertTriangle className="w-5 h-5 text-sipheron-gold" />;
      default:
        return null;
    }
  };

  // Get status text based on status
  const getStatusText = (status: VerificationResult['status']) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'not_found':
        return 'Not Found';
      case 'revoked':
        return 'Revoked';
      case 'invalid':
        return 'Invalid';
      default:
        return status;
    }
  };

  // Get status color class based on status
  const getStatusColor = (status: VerificationResult['status']) => {
    switch (status) {
      case 'verified':
        return 'text-sipheron-green';
      case 'not_found':
        return 'text-sipheron-text-muted';
      case 'revoked':
        return 'text-sipheron-red';
      case 'invalid':
        return 'text-sipheron-gold';
      default:
        return 'text-sipheron-text-secondary';
    }
  };

  const hashCount = parseHashes(hashesInput).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/hashes')}
            className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.05] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-sipheron-text-primary">Bulk Verify</h2>
            <p className="text-sm text-sipheron-text-muted mt-1">
              Verify multiple document hashes at once
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Text Area */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-sipheron-text-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-sipheron-purple" />
                Enter Hashes
              </label>
              <span className="text-xs text-sipheron-text-muted">
                {hashCount} hash{hashCount !== 1 ? 'es' : ''} (max 1000)
              </span>
            </div>
            <textarea
              value={hashesInput}
              onChange={(e) => setHashesInput(e.target.value)}
              placeholder="Paste hashes here, one per line...&#10;Example:&#10;5f4dcc3b5aa765d61d8327deb882cf99&#10;e99a18c428cb38d5f260853678922e03"
              className="w-full h-48 px-4 py-3 rounded-lg bg-black/40 border border-white/[0.06] text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all font-mono text-sm resize-none"
            />
          </div>

          {/* Or Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-sipheron-surface text-xs text-sipheron-text-muted uppercase tracking-wider">
                Or upload a file
              </span>
            </div>
          </div>

          {/* File Upload Dropzone */}
          <div
            onClick={triggerFileInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragging
                ? 'border-sipheron-purple bg-sipheron-purple/5'
                : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = '';
              }}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-sipheron-purple/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-sipheron-purple" />
            </div>
            <p className="text-sm text-sipheron-text-primary mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-sipheron-text-muted">
              Supports .txt and .csv files with one hash per line
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleVerify}
              disabled={isVerifying || hashCount === 0}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-sipheron-purple to-sipheron-purple/80 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Verify {hashCount > 0 && `(${hashCount})`}
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={isVerifying || (!hashesInput && !results)}
              className="px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && summary && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Stats */}
          <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] p-6">
            <h3 className="text-lg font-semibold text-sipheron-text-primary mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-sipheron-purple" />
              Verification Summary
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-black/40 rounded-xl p-4 border border-white/[0.04]">
                <div className="text-2xl font-bold text-sipheron-text-primary">
                  {summary.total}
                </div>
                <div className="text-xs text-sipheron-text-muted mt-1">Total</div>
              </div>
              <div className="bg-sipheron-green/10 rounded-xl p-4 border border-sipheron-green/20">
                <div className="text-2xl font-bold text-sipheron-green">
                  {summary.verified}
                </div>
                <div className="text-xs text-sipheron-text-muted mt-1">Verified</div>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
                <div className="text-2xl font-bold text-sipheron-text-muted">
                  {summary.notFound}
                </div>
                <div className="text-xs text-sipheron-text-muted mt-1">Not Found</div>
              </div>
              <div className="bg-sipheron-red/10 rounded-xl p-4 border border-sipheron-red/20">
                <div className="text-2xl font-bold text-sipheron-red">
                  {summary.revoked}
                </div>
                <div className="text-xs text-sipheron-text-muted mt-1">Revoked</div>
              </div>
              <div className="bg-sipheron-gold/10 rounded-xl p-4 border border-sipheron-gold/20">
                <div className="text-2xl font-bold text-sipheron-gold">
                  {summary.invalid}
                </div>
                <div className="text-xs text-sipheron-text-muted mt-1">Invalid</div>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-sipheron-text-primary">
                Detailed Results
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={copyResults}
                  className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={exportResults}
                  className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3 w-10">
                      Status
                    </th>
                    <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                      Hash
                    </th>
                    <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                      Document
                    </th>
                    <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                      Organization
                    </th>
                    <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                      Error
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={`${result.hash}-${index}`}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        {getStatusIcon(result.status)}
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs text-sipheron-teal font-mono">
                          {result.hash.length > 24
                            ? `${result.hash.slice(0, 12)}...${result.hash.slice(-12)}`
                            : result.hash}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                          {getStatusText(result.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-sipheron-text-secondary truncate max-w-[200px] block">
                          {result.metadata || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-sipheron-text-secondary">
                          {result.organization || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {result.error ? (
                          <span className="text-xs text-sipheron-red">
                            {result.error}
                          </span>
                        ) : (
                          <span className="text-xs text-sipheron-text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Results Footer */}
            <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
              <span className="text-xs text-sipheron-text-muted">
                Showing {results.length} result{results.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkVerifyPage;
