'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../utils/api'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { CopyButton } from '../../components/shared/CopyButton'
import { SolanaExplorerLink } from '../../components/shared/SolanaExplorerLink'

interface HashRecord {
  id: string
  hash: string
  metadata?: string
  status: string
  txSignature?: string
  blockNumber?: string
  blockTimestamp?: string
  createdAt: string
  fileSize?: string
  mimeType?: string
  tags?: string[]
  certificateGeneratedAt?: string
  certificateCount?: number
  anchoredBy?: { id: string; email: string; name?: string }
  organization?: { id: string; name: string; plan: string }
}

interface Verification {
  id: string
  createdAt: string
  authentic: boolean | null
  ipAddress?: string
  userAgent?: string
  verifiedBy?: { id: string; email: string; name?: string }
  metadata?: Record<string, unknown>
}

function timeAgo(date: string) {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (secs < 60) return `${secs}s ago`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short',
  })
}

function formatFileSize(bytes: string | number) {
  const n = Number(bytes)
  if (!n) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(n) / Math.log(1024))
  return `${(n / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

export function HashDetailPage() {
  const { hash } = useParams<{ hash: string }>()
  const navigate = useNavigate()
  const [record, setRecord] = useState<HashRecord | null>(null)
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [loading, setLoading] = useState(true)
  const [verLoading, setVerLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'blockchain'>('overview')
  const [certDownloading, setCertDownloading] = useState(false)

  const fetchRecord = useCallback(async () => {
    if (!hash) return
    try {
      const res = await api.get(`/api/hashes/${hash}`)
      setRecord(res.data.record || res.data)
    } catch (err) {
      console.error('Failed to fetch hash record:', err)
    } finally {
      setLoading(false)
    }
  }, [hash])

  const fetchVerifications = useCallback(async () => {
    if (!hash) return
    setVerLoading(true)
    try {
      const res = await api.get(`/api/hashes/${hash}/verifications`)
      setVerifications(res.data.verifications || [])
    } catch {
      setVerifications([])
    } finally {
      setVerLoading(false)
    }
  }, [hash])

  useEffect(() => {
    fetchRecord()
    fetchVerifications()
  }, [fetchRecord, fetchVerifications])

  const handleDownloadCertificate = async () => {
    if (!hash) return
    setCertDownloading(true)
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
      if (!response.ok) throw new Error('Failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sipheron-certificate-${hash.slice(0, 8)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Certificate download failed:', err)
    } finally {
      setCertDownloading(false)
    }
  }

  const verifyUrl = `${window.location.origin}/verify/${hash}`

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-sipheron-surface rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!record) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center py-20">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-lg font-bold text-[#F0F0FF]">Hash not found</p>
        <p className="text-[#8888AA] text-sm mt-2">
          This hash does not exist in your organization.
        </p>
        <button
          onClick={() => navigate('/dashboard/hashes')}
          className="mt-6 px-4 py-2 bg-[#6C63FF] text-white rounded-xl
                     text-sm font-semibold hover:bg-[#5B52E8] transition-colors"
        >
          ← Back to Hashes
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm text-[#8888AA]">
        <Link to="/dashboard/hashes"
          className="hover:text-[#F0F0FF] transition-colors">
          Hashes
        </Link>
        <span>/</span>
        <span className="text-[#F0F0FF] font-mono">
          {hash?.slice(0, 12)}...
        </span>
      </div>

      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-start
                      xl:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black text-[#F0F0FF] truncate">
              {record.metadata || 'Untitled Document'}
            </h1>
            <StatusBadge status={record.status as 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REVOKED'} />
          </div>
          <p className="text-[#8888AA] text-sm mt-1">
            Anchored {timeAgo(record.createdAt)}
            {record.anchoredBy && (
              <span> by {record.anchoredBy.name || record.anchoredBy.email}</span>
            )}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm
                       border border-white/10 rounded-xl text-[#F0F0FF]
                       hover:border-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0
                   002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Verify Page
          </a>
          <button
            onClick={handleDownloadCertificate}
            disabled={certDownloading}
            className="flex items-center gap-2 px-3 py-2 text-sm
                       bg-[#6C63FF] hover:bg-[#5B52E8] text-white
                       rounded-xl transition-colors disabled:opacity-50"
          >
            {certDownloading ? (
              <div className="w-4 h-4 border-2 border-white
                              border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0
                     01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414
                     5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Certificate
          </button>
        </div>
      </div>

      {/* ── Hash display ── */}
      <div className="bg-[#0A0A12] border border-[#6C63FF]/30
                      rounded-2xl p-5">
        <p className="text-[10px] text-[#44445A] uppercase
                      tracking-widest font-bold mb-2">
          SHA-256 Document Hash
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-mono text-sm text-[#6C63FF] break-all flex-1">
            {record.hash}
          </p>
        </div>
        <p className="text-[10px] text-[#44445A] mt-2">
          This 64-character fingerprint uniquely identifies your document.
          Any modification to the document produces a completely different hash.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-white/5 border border-white/10
                      rounded-xl p-1 w-fit">
        {([
          ['overview', 'Overview'],
          ['verifications', `Verifications (${verifications.length})`],
          ['blockchain', 'Blockchain'],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg
                        transition-colors ${
              activeTab === tab
                ? 'bg-[#6C63FF] text-white'
                : 'text-[#8888AA] hover:text-[#F0F0FF]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">

          {/* Detail grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Document info */}
            <div className="bg-[#0D0D1A] border border-white/[0.06]
                            rounded-2xl p-5 space-y-4">
              <p className="text-xs font-bold text-[#6C63FF] uppercase
                             tracking-widest">
                Document Information
              </p>
              {[
                { label: 'Document Name', value: record.metadata || 'Untitled' },
                { label: 'File Size', value: record.fileSize
                    ? formatFileSize(record.fileSize) : '—' },
                { label: 'MIME Type', value: record.mimeType || '—' },
                { label: 'Tags', value: record.tags?.join(', ') || '—' },
                { label: 'Anchored By',
                  value: record.anchoredBy?.name ||
                         record.anchoredBy?.email || '—' },
                { label: 'Status', value: record.status },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-[#44445A] uppercase
                                 tracking-widest">{label}</p>
                  <p className="text-sm text-[#F0F0FF] mt-0.5 font-mono
                                 break-all">{value}</p>
                </div>
              ))}
            </div>

            {/* Timestamps */}
            <div className="bg-[#0D0D1A] border border-white/[0.06]
                            rounded-2xl p-5 space-y-4">
              <p className="text-xs font-bold text-[#6C63FF] uppercase
                             tracking-widest">
                Timestamps
              </p>
              {[
                { label: 'Server Timestamp (SipHeron)',
                  value: formatDate(record.createdAt),
                  sub: 'When the anchor request was received' },
                { label: 'Block Timestamp (Solana)',
                  value: record.blockTimestamp
                    ? formatDate(record.blockTimestamp)
                    : 'Pending confirmation',
                  sub: 'Authoritative timestamp from blockchain' },
                { label: 'Certificate First Generated',
                  value: record.certificateGeneratedAt
                    ? formatDate(record.certificateGeneratedAt)
                    : 'Not yet generated',
                  sub: `Generated ${record.certificateCount || 0} times` },
              ].map(({ label, value, sub }) => (
                <div key={label}>
                  <p className="text-[10px] text-[#44445A] uppercase
                                 tracking-widest">{label}</p>
                  <p className="text-sm text-[#F0F0FF] mt-0.5">{value}</p>
                  <p className="text-[10px] text-[#44445A] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification URL */}
          <div className="bg-[#0D0D1A] border border-white/[0.06]
                          rounded-2xl p-5">
            <p className="text-xs font-bold text-[#6C63FF] uppercase
                           tracking-widest mb-3">
              Public Verification URL
            </p>
            <div className="flex items-center gap-3 bg-black/40
                            border border-white/10 rounded-xl p-3">
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#6C63FF] hover:text-[#4ECDC4]
                           transition-colors font-mono flex-1 truncate"
              >
                {verifyUrl}
              </a>
            </div>
            <p className="text-[10px] text-[#44445A] mt-2">
              Share this URL with anyone to let them verify this document.
              No account required.
            </p>
          </div>
        </div>
      )}

      {/* ── VERIFICATIONS TAB ── */}
      {activeTab === 'verifications' && (
        <div className="bg-[#0D0D1A] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]
                          flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#F0F0FF]">
                Verification History
              </p>
              <p className="text-xs text-[#8888AA] mt-0.5">
                Every time this document was verified by an external party
              </p>
            </div>
            <span className="text-xs font-bold bg-[#6C63FF]/20
                             text-[#6C63FF] border border-[#6C63FF]/30
                             rounded-full px-2.5 py-1">
              {verifications.length} events
            </span>
          </div>

          {verLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-white/5 rounded-xl shimmer" />
              ))}
            </div>
          ) : verifications.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">👁</p>
              <p className="text-sm font-medium text-[#F0F0FF]">
                No verifications yet
              </p>
              <p className="text-xs text-[#44445A] mt-1">
                When someone verifies this document using the public URL,
                it will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {verifications.map((v) => (
                <div key={v.id}
                  className="px-5 py-4 flex items-center gap-4
                             hover:bg-white/5 transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    v.authentic === true ? 'bg-[#00D97E]'
                    : v.authentic === false ? 'bg-[#FF4757]'
                    : 'bg-[#8888AA]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5
                                        rounded-full border ${
                        v.authentic === true
                          ? 'bg-[#00D97E]/10 text-[#00D97E] border-[#00D97E]/20'
                          : v.authentic === false
                            ? 'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/20'
                            : 'bg-white/5 text-[#8888AA] border-white/10'
                      }`}>
                        {v.authentic === true ? '✓ AUTHENTIC'
                         : v.authentic === false ? '✗ MISMATCH'
                         : 'VERIFIED'}
                      </span>
                      {v.verifiedBy && (
                        <span className="text-xs text-[#8888AA]">
                          by {v.verifiedBy.name || v.verifiedBy.email}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      {v.ipAddress && (
                        <span className="text-[10px] text-[#44445A] font-mono">
                          IP: {v.ipAddress}
                        </span>
                      )}
                      {v.userAgent && (
                        <span className="text-[10px] text-[#44445A] truncate
                                         max-w-[200px]">
                          {v.userAgent.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[#8888AA]">
                      {timeAgo(v.createdAt)}
                    </p>
                    <p className="text-[10px] text-[#44445A] mt-0.5">
                      {new Date(v.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BLOCKCHAIN TAB ── */}
      {activeTab === 'blockchain' && (
        <div className="space-y-4">
          <div className="bg-[#0D0D1A] border border-white/[0.06]
                          rounded-2xl p-5 space-y-5">
            <p className="text-xs font-bold text-[#6C63FF] uppercase
                           tracking-widest">
              Blockchain Record — Solana
            </p>

            {[
              { label: 'Network', value: 'Solana Devnet' },
              { label: 'Smart Contract',
                value: '6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo',
                mono: true, copy: true },
              { label: 'Transaction Signature',
                value: record.txSignature || 'Pending confirmation',
                mono: true, copy: !!record.txSignature,
                explorer: record.txSignature
                  ? { sig: record.txSignature, type: 'tx' as const }
                  : undefined },
              { label: 'Block Number (Slot)',
                value: record.blockNumber?.toString() || 'Pending',
                mono: true },
              { label: 'Block Timestamp',
                value: record.blockTimestamp
                  ? formatDate(record.blockTimestamp)
                  : 'Pending confirmation' },
            ].map(({ label, value, mono, copy, explorer }) => (
              <div key={label}>
                <p className="text-[10px] text-[#44445A] uppercase
                               tracking-widest mb-1">{label}</p>
                <div className="flex items-start gap-2">
                  <p className={`text-sm text-[#F0F0FF] break-all flex-1 ${
                    mono ? 'font-mono' : ''
                  }`}>
                    {value}
                  </p>
                  {copy && <CopyButton text={value} />}
                  {explorer && (
                    <SolanaExplorerLink
                      signature={explorer.sig}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Independent verification instructions */}
          <div className="bg-[#0A0A12] border border-[#6C63FF]/20
                          rounded-2xl p-5">
            <p className="text-xs font-bold text-[#6C63FF] uppercase
                           tracking-widest mb-3">
              Independent Verification
            </p>
            <p className="text-xs text-[#8888AA] mb-3 leading-relaxed">
              Verify this record independently without using SipHeron's interface:
            </p>
            <div className="bg-black/40 rounded-xl p-3 font-mono
                            text-xs space-y-1">
              <p className="text-[#4ECDC4]"># Linux / macOS</p>
              <p className="text-[#F0F0FF]">sha256sum your-document.pdf</p>
              <p className="text-[#4ECDC4] mt-2"># Windows PowerShell</p>
              <p className="text-[#F0F0FF]">
                Get-FileHash your-document.pdf -Algorithm SHA256
              </p>
            </div>
            <p className="text-[10px] text-[#44445A] mt-3">
              Compare the output against the hash shown above.
              Then verify the transaction on any Solana block explorer.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default HashDetailPage
