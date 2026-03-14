import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  QrCode,
  Ban,
  CheckCircle,
  Shield,
  FileText,
  Calendar,
  User,
  Hash,
  Link,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared';
import api from '@/utils/api';

interface HashRecord {
  hash: string;
  metadata: string;
  status: string;
  registeredAt: string;
  revokedAt: string | null;
  owner: string;
  txSignature: string;
  explorerUrl: string;
  pdaExplorerUrl: string;
  pdaAddress?: string;
}

// Map backend status to StatusBadge type
const mapStatus = (status: string): import('@/components/shared').StatusType => {
  const normalized = status?.toLowerCase();
  if (normalized === 'confirmed' || normalized === 'active') return 'CONFIRMED';
  if (normalized === 'pending') return 'PENDING';
  if (normalized === 'failed') return 'FAILED';
  if (normalized === 'revoked') return 'REVOKED';
  return 'CONFIRMED';
};

export const HashDetailPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<HashRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeConfirmText, setRevokeConfirmText] = useState('');
  const [revoking, setRevoking] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Fetch hash details
  useEffect(() => {
    if (!hash) {
      setError('Invalid hash');
      setLoading(false);
      return;
    }

    const fetchHash = async () => {
      try {
        const { data } = await api.get(`/api/hashes/${hash}`);
        setRecord(data.data || data);
      } catch (err: any) {
        console.error('Failed to fetch hash:', err);
        setError(err?.response?.data?.error || 'Failed to load hash details');
        toast.error('Failed to load hash details');
      } finally {
        setLoading(false);
      }
    };

    fetchHash();
  }, [hash]);

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  // Handle revoke
  const handleRevoke = async () => {
    if (!record || revokeConfirmText !== 'CONFIRM') return;

    setRevoking(true);
    try {
      await api.post(`/api/hashes/${record.hash}/revoke`);
      toast.success('Hash revoked successfully');
      setRevokeModalOpen(false);
      setRevokeConfirmText('');
      // Refresh data
      const { data } = await api.get(`/api/hashes/${hash}`);
      setRecord(data.data || data);
    } catch (err: any) {
      console.error('Revoke error:', err);
      toast.error(err?.response?.data?.error || 'Failed to revoke hash');
    } finally {
      setRevoking(false);
    }
  };

  // QR Code URL
  const verifyUrl = (hash: string) => `https://app.sipheron.com/verify/${hash}`;
  const qrUrl = (hash: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      verifyUrl(hash)
    )}&bgcolor=000000&color=a855f7&qzone=2`;

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  // Truncate for display
  const truncate = (str: string, len: number) => {
    if (!str || str.length <= len) return str;
    return str.slice(0, len) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 rounded-full bg-sipheron-red/10 flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-sipheron-red" />
        </div>
        <h2 className="text-lg font-medium text-sipheron-text-primary mb-2">
          {error || 'Hash not found'}
        </h2>
        <button
          onClick={() => navigate('/dashboard/hashes')}
          className="mt-4 px-4 py-2 rounded-lg bg-sipheron-purple/10 text-sipheron-purple text-sm hover:bg-sipheron-purple/20 transition-colors"
        >
          Back to Hashes
        </button>
      </div>
    );
  }

  const isRevoked = record.status === 'revoked';
  const isPending = record.status === 'PENDING';
  const isConfirmed = !isRevoked && !isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/hashes')}
          className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.05] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">Hash Details</h2>
          <p className="text-sm text-sipheron-text-muted">
            View and manage document proof details
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hash Card */}
          <div className="bg-sipheron-surface rounded-xl p-6 border border-white/[0.06]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sipheron-purple/10 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-sipheron-purple" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-sipheron-text-muted">Document Hash</h3>
                  <StatusBadge status={mapStatus(record.status)} />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setQrModalOpen(true)}
                  className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.05] transition-colors"
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                {!isRevoked && (
                  <button
                    onClick={() => setRevokeModalOpen(true)}
                    className="p-2 rounded-lg bg-sipheron-red/10 border border-sipheron-red/20 text-sipheron-red hover:bg-sipheron-red/20 transition-colors"
                    title="Revoke Hash"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-black/40 rounded-lg p-4 border border-white/[0.06]">
              <code className="text-sm text-sipheron-teal break-all font-mono">{record.hash}</code>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => copyToClipboard(record.hash, 'Hash')}
                className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Hash
              </button>
              <a
                href={verifyUrl(record.hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Public Verify
              </a>
            </div>
          </div>

          {/* Metadata */}
          {record.metadata && (
            <div className="bg-sipheron-surface rounded-xl p-6 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-sipheron-teal/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-sipheron-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-sipheron-text-muted">Metadata</h3>
                  <p className="text-sm text-sipheron-text-primary">Document Information</p>
                </div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-white/[0.06]">
                <p className="text-sm text-sipheron-text-secondary whitespace-pre-wrap">
                  {record.metadata}
                </p>
              </div>
            </div>
          )}

          {/* Blockchain Details */}
          <div className="bg-sipheron-surface rounded-xl p-6 border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-sipheron-green/10 flex items-center justify-center">
                <Link className="w-5 h-5 text-sipheron-green" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-sipheron-text-muted">Blockchain</h3>
                <p className="text-sm text-sipheron-text-primary">Solana Network</p>
              </div>
            </div>

            <div className="space-y-4">
              {record.txSignature && (
                <div>
                  <label className="text-xs text-sipheron-text-muted mb-1 block">Transaction Signature</label>
                  <div className="flex gap-2">
                    <code className="flex-1 text-xs text-sipheron-text-secondary bg-black/40 rounded-lg p-3 border border-white/[0.06] break-all font-mono">
                      {record.txSignature}
                    </code>
                    <a
                      href={record.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.05] transition-colors flex items-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {record.pdaExplorerUrl && (
                <div>
                  <label className="text-xs text-sipheron-text-muted mb-1 block">PDA Account</label>
                  <div className="flex gap-2">
                    <code className="flex-1 text-xs text-sipheron-text-secondary bg-black/40 rounded-lg p-3 border border-white/[0.06] break-all font-mono">
                      {record.pdaAddress || 'View on Explorer'}
                    </code>
                    <a
                      href={record.pdaExplorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.05] transition-colors flex items-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Timeline & Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-sipheron-surface rounded-xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-medium text-sipheron-text-primary mb-4">Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isConfirmed ? 'bg-sipheron-green/10' : 'bg-white/[0.05]'
                }`}>
                  <CheckCircle className={`w-4 h-4 ${isConfirmed ? 'text-sipheron-green' : 'text-sipheron-text-muted'}`} />
                </div>
                <div>
                  <p className="text-sm text-sipheron-text-primary">Confirmed</p>
                  <p className="text-xs text-sipheron-text-muted">On-chain verification</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !isRevoked ? 'bg-sipheron-green/10' : 'bg-sipheron-red/10'
                }`}>
                  <Shield className={`w-4 h-4 ${!isRevoked ? 'text-sipheron-green' : 'text-sipheron-red'}`} />
                </div>
                <div>
                  <p className="text-sm text-sipheron-text-primary">
                    {isRevoked ? 'Revoked' : 'Active'}
                  </p>
                  <p className="text-xs text-sipheron-text-muted">
                    {isRevoked ? 'Proof invalidated' : 'Proof is valid'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-sipheron-surface rounded-xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-medium text-sipheron-text-primary mb-4">Timeline</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-sipheron-purple/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-sipheron-purple" />
                </div>
                <div>
                  <p className="text-sm text-sipheron-text-primary">Registered</p>
                  <p className="text-xs text-sipheron-text-muted">{formatDate(record.registeredAt)}</p>
                </div>
              </div>

              {record.revokedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sipheron-red/10 flex items-center justify-center flex-shrink-0">
                    <Ban className="w-4 h-4 text-sipheron-red" />
                  </div>
                  <div>
                    <p className="text-sm text-sipheron-text-primary">Revoked</p>
                    <p className="text-xs text-sipheron-text-muted">{formatDate(record.revokedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Owner Info */}
          {record.owner && (
            <div className="bg-sipheron-surface rounded-xl p-6 border border-white/[0.06]">
              <h3 className="text-sm font-medium text-sipheron-text-primary mb-4">Owner</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
                  <User className="w-4 h-4 text-sipheron-text-muted" />
                </div>
                <code className="text-xs text-sipheron-text-secondary break-all">
                  {truncate(record.owner, 20)}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revoke Modal */}
      {revokeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-sipheron-surface rounded-2xl p-6 max-w-md w-full border border-sipheron-red/30">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sipheron-red/10 flex items-center justify-center">
              <Ban className="w-8 h-8 text-sipheron-red" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Revoke Proof?</h3>
            <p className="text-sm text-sipheron-text-secondary text-center mb-6">
              This will permanently invalidate the hash on-chain. This operation is{' '}
              <span className="text-sipheron-red font-bold">non-reversible</span>.
            </p>
            <div className="bg-black/40 border border-white/[0.06] rounded-lg p-3 mb-6">
              <code className="text-xs text-sipheron-teal break-all">{record.hash}</code>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={revokeConfirmText}
                onChange={(e) => setRevokeConfirmText(e.target.value)}
                placeholder="Type CONFIRM to authorize"
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-sipheron-red/20 text-center font-bold uppercase tracking-widest text-sm focus:border-sipheron-red focus:ring-2 focus:ring-sipheron-red/20 outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRevokeModalOpen(false);
                    setRevokeConfirmText('');
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/[0.05] text-sipheron-text-secondary text-sm hover:bg-white/[0.1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={revokeConfirmText !== 'CONFIRM' || revoking}
                  className="flex-1 px-4 py-3 rounded-lg bg-sipheron-red/10 text-sipheron-red text-sm hover:bg-sipheron-red/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {revoking ? 'Revoking...' : 'Confirm Revoke'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-sipheron-surface rounded-2xl p-6 max-w-sm w-full border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-sipheron-text-primary">Verification QR</h3>
              <button
                onClick={() => setQrModalOpen(false)}
                className="text-sipheron-text-muted hover:text-sipheron-text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-xl">
                <img src={qrUrl(record.hash)} alt="QR Code" width={200} height={200} />
              </div>
              <button
                onClick={() => copyToClipboard(verifyUrl(record.hash), 'Link')}
                className="w-full px-4 py-2 rounded-lg bg-white/[0.05] text-sipheron-text-primary text-sm hover:bg-white/[0.1] transition-colors"
              >
                Copy Verification Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HashDetailPage;
