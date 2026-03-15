import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Search,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Eye,
  Download,
  Ban,
  CheckSquare,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  QrCode,
  FileJson,
  Upload,
} from 'lucide-react';
import { StatusBadge, FileUploader } from '@/components/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/utils/api';
import { usePendingHashes } from '@/hooks/usePendingHashes';

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

export const HashesPage: React.FC = () => {
  const navigate = useNavigate();
  // State
  const [hashes, setHashes] = useState<HashRecord[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Filter state
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterMimeType, setFilterMimeType] = useState('')
  const [filterTags, setFilterTags] = useState('')
  const [filterUserId, setFilterUserId] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  // Sort state
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Bulk select state
  const [selectedHashes, setSelectedHashes] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  // Filter options from API
  const [availableMimeTypes, setAvailableMimeTypes] = useState<string[]>([])

  // Members list for "anchored by" filter
  const [members, setMembers] = useState<{id: string; email: string; name?: string}[]>([])

  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [hashToRevoke, setHashToRevoke] = useState<HashRecord | null>(null);
  const [revokeConfirmText, setRevokeConfirmText] = useState('');
  const [revoking, setRevoking] = useState(false);
  const [qrHash, setQrHash] = useState<string | null>(null);
  const [anchorModalOpen, setAnchorModalOpen] = useState(false);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [anchoring, setAnchoring] = useState(false);
  const [anchorMetadata, setAnchorMetadata] = useState('');

  useEffect(() => {
    api.get('/api/members')
      .then(res => setMembers(res.data.members || res.data || []))
      .catch(() => {})
  }, [])

  const fetchHashes = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '50',
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(filterStatus && { status: filterStatus }),
        ...(filterMimeType && { mimeType: filterMimeType }),
        ...(filterTags && { tags: filterTags }),
        ...(filterUserId && { userId: filterUserId }),
        ...(filterDateFrom && { dateFrom: filterDateFrom }),
        ...(filterDateTo && { dateTo: filterDateTo }),
      })
      const res = await api.get(`/api/hashes?${params}`)
      setHashes(res.data.records || res.data.hashes || res.data || [])
      setTotal(res.data.total || 0)
      setPages(res.data.pages || 1)
      if (res.data.filters?.mimeTypes) {
        setAvailableMimeTypes(res.data.filters.mimeTypes)
      }
    } catch (err) {
      console.error('Failed to fetch hashes:', err)
      toast.error('Failed to load hashes')
    } finally {
      setLoading(false)
    }
  }, [page, search, filterStatus, filterMimeType, filterTags,
      filterUserId, filterDateFrom, filterDateTo, sortBy, sortOrder])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => fetchHashes(), 300)
    return () => clearTimeout(timer)
  }, [fetchHashes])

  // Polling for pending hashes
  const { isPolling, startPolling } = usePendingHashes({
    onConfirmed: () => {
      toast.success('Hash confirmed on Solana!')
      fetchHashes()
    },
    onRefresh: () => fetchHashes(),
  })

  // Start polling when there are pending hashes
  useEffect(() => {
    const hasPending = hashes.some((h) => h.status === 'PENDING')
    if (hasPending) startPolling()
  }, [hashes, startPolling])

  // Listen for open-anchor-modal event from CommandPalette
  useEffect(() => {
    const handleOpenAnchor = () => {
      setAnchorModalOpen(true)
      // Also set a dummy fileHash to trigger the modal state
      setFileHash('pending')
      setFileName('New Document')
    }
    window.addEventListener('open-anchor-modal', handleOpenAnchor)
    return () => window.removeEventListener('open-anchor-modal', handleOpenAnchor)
  }, [])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    setSelectedHashes(new Set())
  }

  // Selection handlers
  const toggleSelection = (hash: string) => {
    const next = new Set(selectedHashes)
    if (next.has(hash)) next.delete(hash)
    else next.add(hash)
    setSelectedHashes(next)
  }

  const selectAll = () => {
    if (selectedHashes.size === hashes.length && hashes.length > 0) {
      setSelectedHashes(new Set())
    } else {
      setSelectedHashes(new Set(hashes.map((h: HashRecord) => h.hash)))
    }
  }

  // Bulk certificate download
  const handleBulkCertificates = async () => {
    if (selectedHashes.size === 0) return
    setBulkLoading(true)
    try {
      const res = await api.post('/api/hashes/bulk-certificates', {
        hashes: Array.from(selectedHashes)
      })
      const certs = res.data.certificates || []
      // Download each certificate
      for (const cert of certs) {
        const binary = atob(cert.data)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = cert.filename
        a.click()
        URL.revokeObjectURL(url)
        await new Promise(r => setTimeout(r, 200)) // small delay between downloads
      }
      setSelectedHashes(new Set())
    } catch (err) {
      console.error('Bulk certificate failed:', err)
      toast.error('Bulk certificate generation failed')
    } finally {
      setBulkLoading(false)
    }
  }

  // Sort handler
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setPage(1)
  }

  // Sort indicator component
  const SortIndicator = ({ field }: { field: string }) => (
    <span className="ml-1 text-[#44445A]">
      {sortBy === field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  // Revoke handler
  const openRevokeModal = (hash: HashRecord) => {
    setHashToRevoke(hash);
    setRevokeModalOpen(true);
    setRevokeConfirmText('');
  };

  const handleRevoke = async () => {
    if (!hashToRevoke || revokeConfirmText !== 'CONFIRM') return;

    setRevoking(true);
    try {
      await api.post('/api/hashes/revoke', { hash: hashToRevoke.hash });
      toast.success('Hash revoked successfully');
      setRevokeModalOpen(false);
      fetchHashes();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to revoke hash');
    } finally {
      setRevoking(false);
    }
  };

  // Export handler
  const handleExport = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://api.sipheron.com'}/api/hashes/export?format=${format}`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sipheron-hashes-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export data');
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  // Download Certificate
  const handleDownloadCertificate = async (hash: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://api.sipheron.com'}/api/hashes/${hash}/certificate?download=true`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            ...(localStorage.getItem('sipheron_api_key')
              ? { 'x-api-key': localStorage.getItem('sipheron_api_key') as string }
              : {}),
          },
        }
      )

      if (!response.ok) {
        let errorMsg = 'Certificate generation failed'
        try {
          const errData = await response.json()
          if (errData.error) errorMsg = errData.error
        } catch (e) {
          // ignore parsing error if not json
        }
        throw new Error(errorMsg)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sipheron-certificate-${hash.slice(0, 8)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Certificate download failed:', err)
      toast.error(err.message || 'Failed to download certificate')
    }
  }

  // Handle file hash computed
  const handleHashComputed = (hash: string | null, filename: string | null) => {
    setFileHash(hash);
    setFileName(filename);
    if (hash && filename) {
      setAnchorModalOpen(true);
    }
  };

  // Handle anchor file
  const handleAnchorFile = async () => {
    if (!fileHash || !fileName) return;
    
    setAnchoring(true);
    try {
      await api.post('/api/hashes', {
        hash: fileHash,
        metadata: anchorMetadata.trim() || fileName,
        fileSize,
        mimeType: fileType,
      });
      toast.success('Document anchored successfully');
      setAnchorModalOpen(false);
      setFileHash(null);
      setFileName(null);
      setAnchorMetadata('');
      fetchHashes();
    } catch (err: any) {
      console.error('Anchor error:', err);
      toast.error(err?.response?.data?.error || 'Failed to anchor document');
    } finally {
      setAnchoring(false);
    }
  };

  // Status counts
  const statusCounts = {
    total,
    confirmed: hashes.filter((h) => h.status === 'active' || h.status === 'CONFIRMED').length,
    pending: hashes.filter((h) => h.status === 'PENDING').length,
    revoked: hashes.filter((h) => h.status === 'revoked' || h.status === 'REVOKED').length,
  };

  // QR Code URL
  const verifyUrl = (hash: string) => `https://app.sipheron.com/verify/${hash}`;
  const qrUrl = (hash: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      verifyUrl(hash)
    )}&bgcolor=000000&color=a855f7&qzone=2`;

  return (
    <div className="space-y-6">
      {/* Sync indicator */}
      {isPolling && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-lg bg-sipheron-gold/10 border border-sipheron-gold/20 text-sipheron-gold text-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sipheron-gold animate-pulse" />
          Synchronizing...
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">Hashes</h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Manage and verify your anchored document hashes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard/bulk-verify')}
            className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors"
          >
            Bulk Verify
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={fetchHashes}
            className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: statusCounts.total, color: 'text-sipheron-text-primary' },
          { label: 'Confirmed', value: statusCounts.confirmed, color: 'text-sipheron-green' },
          { label: 'Pending', value: statusCounts.pending, color: 'text-sipheron-gold' },
          { label: 'Revoked', value: statusCounts.revoked, color: 'text-sipheron-red' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-sipheron-surface rounded-xl p-4 border border-white/[0.06]"
          >
            <div className={`text-2xl font-bold ${stat.color}`}>
              {loading ? <div className="h-8 w-12 bg-white/10 rounded animate-pulse" /> : stat.value}
            </div>
            <div className="text-xs text-sipheron-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* File Uploader - Drag & Drop */}
      <div className="bg-sipheron-surface rounded-xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-sipheron-text-primary">Anchor New Document</h3>
            <p className="text-xs text-sipheron-text-muted mt-1">
              Drag and drop a file to compute its hash and anchor to Solana
            </p>
          </div>
        </div>
        <FileUploader 
          onHashComputed={handleHashComputed} 
          onFileSelect={(file) => {
            if (file) {
              setFileSize(file.size);
              setFileType(file.type || null);
            } else {
              setFileSize(null);
              setFileType(null);
            }
          }}
        />
      </div>

      {/* Filter bar */}
      <div className="bg-[#0D0D1A] border border-white/[0.06] rounded-2xl p-4 space-y-3">
        {/* Search + quick filters row */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#44445A]" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by document name..."
              className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10
                         rounded-xl text-sm text-[#F0F0FF] placeholder-[#44445A]
                         focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2
                       text-sm text-[#F0F0FF] focus:outline-none focus:border-[#6C63FF]"
          >
            <option value="">All statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REVOKED">Revoked</option>
          </select>

          {/* MIME type filter */}
          {availableMimeTypes.length > 0 && (
            <select
              value={filterMimeType}
              onChange={e => { setFilterMimeType(e.target.value); setPage(1) }}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2
                         text-sm text-[#F0F0FF] focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="">All types</option>
              {availableMimeTypes.map((m: string) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          )}

          {/* Anchored by filter */}
          {members.length > 0 && (
            <select
              value={filterUserId}
              onChange={e => { setFilterUserId(e.target.value); setPage(1) }}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2
                         text-sm text-[#F0F0FF] focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="">All members</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name || m.email}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date range + tags row */}
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={filterDateFrom}
            onChange={e => { setFilterDateFrom(e.target.value); setPage(1) }}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2
                       text-sm text-[#F0F0FF] focus:outline-none focus:border-[#6C63FF]"
          />
          <span className="flex items-center text-[#44445A] text-sm">to</span>
          <input
            type="date"
            value={filterDateTo}
            onChange={e => { setFilterDateTo(e.target.value); setPage(1) }}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2
                       text-sm text-[#F0F0FF] focus:outline-none focus:border-[#6C63FF]"
          />
          <input
            type="text"
            value={filterTags}
            onChange={e => { setFilterTags(e.target.value); setPage(1) }}
            placeholder="Tags (comma separated)"
            className="flex-1 min-w-[160px] bg-black/40 border border-white/10
                       rounded-xl px-3 py-2 text-sm text-[#F0F0FF]
                       placeholder-[#44445A] focus:outline-none focus:border-[#6C63FF]"
          />
          {/* Clear filters button */}
          {(search || filterStatus || filterMimeType || filterTags ||
            filterUserId || filterDateFrom || filterDateTo) && (
            <button
              onClick={() => {
                setSearch(''); setFilterStatus(''); setFilterMimeType('')
                setFilterTags(''); setFilterUserId('')
                setFilterDateFrom(''); setFilterDateTo(''); setPage(1)
              }}
              className="text-xs text-[#FF4757] hover:text-[#FF6B7A] transition-colors px-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-4 py-3 w-10">
                  <button onClick={selectAll} className="flex items-center justify-center">
                    {selectedHashes.size === hashes.length && hashes.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sipheron-purple" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-sipheron-text-muted" />
                    )}
                  </button>
                </th>
                <th
                  onClick={() => handleSort('metadata')}
                  className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3 cursor-pointer hover:text-[#F0F0FF] select-none"
                >
                  Document <SortIndicator field="metadata" />
                </th>
                <th
                  onClick={() => handleSort('hash')}
                  className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3 cursor-pointer hover:text-[#F0F0FF] select-none"
                >
                  Hash <SortIndicator field="hash" />
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3 cursor-pointer hover:text-[#F0F0FF] select-none"
                >
                  Status <SortIndicator field="status" />
                </th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3 cursor-pointer hover:text-[#F0F0FF] select-none"
                >
                  Date <SortIndicator field="createdAt" />
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Actions
                </th>
                <th className="text-right text-xs text-sipheron-text-muted font-medium px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4"><div className="h-4 w-4 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-24 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-32 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-16 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-20 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-20 bg-white/10 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-8 bg-white/10 rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : hashes.length > 0 ? (
                hashes.map((hash) => (
                  <tr
                    key={hash.hash}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelection(hash.hash)}
                        className="flex items-center justify-center"
                      >
                        {selectedHashes.has(hash.hash) ? (
                          <CheckSquare className="w-4 h-4 text-sipheron-purple" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-sipheron-text-muted" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-sipheron-text-primary">
                        {hash.metadata || 'Untitled'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-sipheron-teal">
                          {hash.hash.slice(0, 12)}...{hash.hash.slice(-8)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(hash.hash, 'Hash')}
                          className="text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={mapStatus(hash.status)} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-sipheron-text-muted">
                        {new Date(hash.registeredAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQrHash(hash.hash)}
                          className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
                          title="QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        {hash.explorerUrl && (
                          <a
                            href={hash.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
                            title="View on Solana Explorer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors ml-auto">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-sipheron-surface border-white/[0.06]"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer focus:bg-white/[0.03]"
                            onClick={() => navigate(`/dashboard/hashes/${hash.hash}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer focus:bg-white/[0.03]"
                            onClick={() => copyToClipboard(verifyUrl(hash.hash), 'Link')}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-[#F0F0FF] focus:bg-white/[0.03]"
                            onClick={() => handleDownloadCertificate(hash.hash)}
                          >
                            <Download className="w-4 h-4 mr-2 text-[#6C63FF]" />
                            Download Certificate
                          </DropdownMenuItem>
                          {hash.status !== 'revoked' && (
                            <>
                              <DropdownMenuSeparator className="bg-white/[0.06]" />
                              <DropdownMenuItem
                                className="cursor-pointer text-sipheron-red focus:bg-white/[0.03]"
                                onClick={() => openRevokeModal(hash)}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Revoke
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-0">
                    <div className="py-16 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sipheron-purple/10 flex items-center justify-center">
                        <Search className="w-8 h-8 text-sipheron-purple" />
                      </div>
                      <h3 className="text-lg font-medium text-sipheron-text-primary mb-2">
                        No hashes found
                      </h3>
                      <p className="text-sm text-sipheron-text-muted mb-4">
                        {search || filterStatus || filterMimeType || filterTags || filterUserId || filterDateFrom || filterDateTo
                          ? 'Try adjusting your search or filters'
                          : 'No documents have been anchored yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <span className="text-xs text-sipheron-text-muted">
              Page {page} of {pages} ({total} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-sipheron-text-muted text-xs hover:bg-white/[0.05] transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <ChevronLeft className="w-3 h-3" />
                Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pages}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-sipheron-text-muted text-xs hover:bg-white/[0.05] transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedHashes.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                        bg-[#13131F] border border-[#6C63FF]/40 rounded-2xl
                        px-5 py-3 flex items-center gap-4 shadow-2xl
                        shadow-[#6C63FF]/20">
          <span className="text-sm font-semibold text-[#F0F0FF]">
            {selectedHashes.size} selected
          </span>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={handleBulkCertificates}
            disabled={bulkLoading}
            className="flex items-center gap-2 text-sm text-[#6C63FF]
                       hover:text-[#F0F0FF] transition-colors font-medium
                       disabled:opacity-50"
          >
            {bulkLoading
              ? 'Generating...'
              : `Download ${selectedHashes.size} Certificate${selectedHashes.size > 1 ? 's' : ''}`}
          </button>
          <button
            onClick={() => setSelectedHashes(new Set())}
            className="text-xs text-[#44445A] hover:text-[#8888AA] transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Revoke Modal */}
      {revokeModalOpen && hashToRevoke && (
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
              <code className="text-xs text-sipheron-teal break-all">{hashToRevoke.hash}</code>
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
                  onClick={() => setRevokeModalOpen(false)}
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
      {qrHash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-sipheron-surface rounded-2xl p-6 max-w-sm w-full border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-sipheron-text-primary">Verification QR</h3>
              <button
                onClick={() => setQrHash(null)}
                className="text-sipheron-text-muted hover:text-sipheron-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-xl">
                <img src={qrUrl(qrHash)} alt="QR Code" width={200} height={200} />
              </div>
              <button
                onClick={() => copyToClipboard(verifyUrl(qrHash), 'Link')}
                className="w-full px-4 py-2 rounded-lg bg-white/[0.05] text-sipheron-text-primary text-sm hover:bg-white/[0.1] transition-colors"
              >
                Copy Verification Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anchor Modal */}
      {anchorModalOpen && fileHash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-sipheron-surface rounded-2xl p-6 max-w-md w-full border border-sipheron-purple/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-sipheron-text-primary">Anchor Document</h3>
              <button
                onClick={() => {
                  setAnchorModalOpen(false);
                  setFileHash(null);
                  setFileName(null);
                  setAnchorMetadata('');
                }}
                className="text-sipheron-text-muted hover:text-sipheron-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Info */}
              <div className="p-3 bg-black/40 border border-white/[0.06] rounded-lg">
                <div className="flex items-center gap-2 text-sipheron-text-secondary text-sm mb-2">
                  <FileJson className="w-4 h-4" />
                  <span className="truncate">{fileName}</span>
                </div>
                <code className="text-xs text-sipheron-teal break-all">{fileHash}</code>
              </div>

              {/* Metadata */}
              <div>
                <label className="block text-xs text-sipheron-text-muted mb-2">
                  Metadata (optional)
                </label>
                <textarea
                  value={anchorMetadata}
                  onChange={(e) => setAnchorMetadata(e.target.value)}
                  placeholder="Document title, description, or other details..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-sipheron-text-primary text-sm placeholder:text-sipheron-text-muted focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setAnchorModalOpen(false);
                    setFileHash(null);
                    setFileName(null);
                    setAnchorMetadata('');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.05] text-sipheron-text-secondary text-sm hover:bg-white/[0.1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnchorFile}
                  disabled={anchoring}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-sipheron-purple to-sipheron-purple-light text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {anchoring ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Anchoring...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Anchor to Solana
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HashesPage;
