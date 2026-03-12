'use client';

import { useState, useRef } from 'react';
import { api } from '@/utils/api';
import { 
    CheckSquare, Upload, FileText, Download, 
    RefreshCcw, Search, Filter, Trash2, 
    XCircle, CheckCircle2, AlertTriangle, HelpCircle
} from 'lucide-react';
import { 
    PurpleCard, GlowButton, PurpleBadge,
    PurpleTable, PurpleSkeleton
} from '@/components/ui/PurpleUI';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
    verified: 'text-green-400 bg-green-400/10 border-green-400/20',
    not_found: 'text-red-400 bg-red-400/10 border-red-400/20',
    revoked: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    invalid: 'text-gray-400 bg-gray-400/10 border-gray-400/20'
};

const STATUS_LABELS = {
    verified: '✓ Verified',
    not_found: '✗ Not Found',
    revoked: '⚠ Revoked',
    invalid: '— Invalid'
};

const STATUS_ICONS = {
    verified: CheckCircle2,
    not_found: XCircle,
    revoked: AlertTriangle,
    invalid: HelpCircle
};

export default function BulkVerifyPage() {
    const [hashes, setHashes] = useState('');
    const [results, setResults] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [filter, setFilter] = useState('all');
    const fileInputRef = useRef(null);

    const parseHashes = (text) => {
        return text
            .split(/[\n,;\t]+/)
            .map(h => h.trim())
            .filter(h => h.length > 0);
    };

    const handleCSVUpload = async (file) => {
        setError(null);
        try {
            const text = await file.text();
            const lines = text.split('\n').filter(l => l.trim());
            const parsed = [];
            for (const line of lines) {
                const cols = line.split(/[,;\t]/).map(c => c.trim().replace(/"/g, ''));
                const hashCol = cols.find(c => /^[a-f0-9]{64}$/i.test(c));
                if (hashCol) parsed.push(hashCol);
            }
            if (parsed.length > 0) {
                setHashes(parsed.join('\n'));
            } else {
                setError('No valid SHA-256 hashes found in the provided file. Ensure your CSV has a column with 64-character hex hashes.');
            }
        } catch (err) {
            setError('Failed to parse the uploaded file. Please ensure it is a valid CSV or TXT file.');
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) await handleCSVUpload(file);
    };

    const handleVerify = async () => {
        setError(null);
        const hashList = parseHashes(hashes);
        if (hashList.length === 0) {
            setError('Identification required: Please enter at least one hash to proceed.');
            return;
        }
        if (hashList.length > 500) {
            setError('Transactional Limit: Maximum 500 hashes per verification session.');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/api/hashes/bulk-verify', { hashes: hashList });
            setResults(res.data.results);
            setSummary(res.data.summary);
        } catch (err) {
            setError(err.response?.data?.error || 'The verification engine encountered an unexpected synchronization error.');
        } finally {
            setLoading(false);
        }
    };

    const handleExportResults = () => {
        if (!results) return;
        const csvContent = [
            'Hash,Status,Verified,Metadata,Organization,RegisteredAt',
            ...results.map(r => [
                r.hash,
                r.status,
                r.verified,
                r.metadata || '',
                r.organization || '',
                r.registeredAt ? new Date(r.registeredAt).toISOString() : ''
            ].map(v => `"${v}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `sipheron-verification-report-${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredResults = results?.filter(r => {
        if (filter === 'all') return true;
        return r.status === filter;
    });

    const hashCount = parseHashes(hashes).length;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2 flex items-center gap-4">
                    <CheckSquare className="w-8 h-8 text-purple-vivid" />
                    Mass Verification
                </h1>
                <p className="text-sm text-text-muted max-w-lg leading-relaxed">
                    Verify up to 500 document hashes in a single cryptographic operation. Support for direct injection and CSV ingestion.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Controls */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* File Upload / Drag & Drop */}
                        <div 
                            onDrop={handleDrop}
                            onDragOver={e => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative group overflow-hidden ${
                                dragging 
                                    ? 'border-purple-vivid bg-purple-vivid/[0.05]' 
                                    : 'border-bg-border bg-bg-surface/30 hover:bg-bg-surface hover:border-purple-vivid/30'
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.txt"
                                className="hidden"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handleCSVUpload(file);
                                }}
                            />
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                <div className={`p-4 rounded-2xl ${dragging ? 'bg-purple-vivid text-white animate-bounce' : 'bg-purple-vivid/10 text-purple-vivid group-hover:bg-purple-vivid group-hover:text-white transition-colors'}`}>
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text-primary mb-1">
                                        Ingest Verification File
                                    </p>
                                    <p className="text-[11px] text-text-muted font-medium">
                                        Drag and drop your .CSV or .TXT manifest here
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Direct Paste Area */}
                        <div className="relative">
                            <textarea
                                value={hashes}
                                onChange={e => { setHashes(e.target.value); setError(null); }}
                                placeholder={`Enter SHA-256 hashes (one per line)...\n\nExample:\na3f4b2c1d8e9...`}
                                className="w-full h-full min-h-[160px] bg-black/40 border border-bg-border rounded-3xl px-6 py-5 text-sm font-mono text-purple-glow placeholder:text-text-muted/30 focus:outline-none focus:border-purple-vivid transition-all resize-none shadow-inner"
                            />
                            <div className="absolute top-4 right-6 flex items-center gap-3">
                                {hashCount > 0 && (
                                    <PurpleBadge variant="ghost" className="text-[9px] font-bold px-3">
                                        {hashCount} SIGNALS DETECTED
                                    </PurpleBadge>
                                )}
                                {hashes && (
                                    <button 
                                        onClick={() => { setHashes(''); setResults(null); setSummary(null); setError(null); }}
                                        className="p-1 text-text-muted hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <GlowButton 
                            className="w-full sm:w-[240px] h-14 text-sm uppercase font-bold tracking-[0.2em]"
                            disabled={loading || hashCount === 0}
                            onClick={handleVerify}
                            icon={loading ? RefreshCcw : CheckSquare}
                        >
                            {loading ? `SYNCHRONIZING ${hashCount}...` : `VERIFY ${hashCount > 0 ? hashCount : ''} HASHES`}
                        </GlowButton>
                        
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex-1 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4"
                            >
                                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                                <p className="text-sm text-red-200 font-medium">{error}</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                <AnimatePresence>
                    {summary && (
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-12 space-y-6"
                        >
                            {/* Summary Totals */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Scanned', value: summary.total, icon: Search, color: 'text-text-primary' },
                                    { label: 'Confirmed Valid', value: summary.verified, icon: CheckCircle2, color: 'text-green-400' },
                                    { label: 'Not Authenticated', value: summary.notFound, icon: XCircle, color: 'text-red-400' },
                                    { label: 'Revoked Assets', value: summary.revoked, icon: AlertTriangle, color: 'text-orange-400' }
                                ].map((stat, idx) => {
                                    const Icon = stat.icon;
                                    return (
                                        <PurpleCard key={idx} className="p-6 relative overflow-hidden group">
                                            <Icon className={`absolute -right-2 -bottom-2 w-16 h-16 opacity-[0.03] ${stat.color} transition-transform group-hover:scale-110`} />
                                            <p className={`text-4xl font-mono font-bold tracking-tighter ${stat.color} mb-1 animate-in fade-in slide-in-from-bottom-2`}>
                                                {stat.value.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">
                                                {stat.label}
                                            </p>
                                        </PurpleCard>
                                    );
                                })}
                            </div>

                            {/* Filters and Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-t border-bg-border/30">
                                <div className="flex bg-bg-surface/50 border border-bg-border rounded-2xl p-1.5 gap-1 shadow-inner">
                                    {['all', 'verified', 'not_found', 'revoked'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                                                filter === f
                                                    ? 'bg-purple-vivid text-white shadow-lg shadow-purple-900/40'
                                                    : 'text-text-muted hover:text-text-primary hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            {f === 'all' ? 'All Signals' : f.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>

                                <GlowButton 
                                    variant="ghost" 
                                    className="h-12 px-6 text-[11px] uppercase font-bold tracking-widest opacity-80 hover:opacity-100"
                                    onClick={handleExportResults}
                                    icon={Download}
                                >
                                    Export Manifest (.CSV)
                                </GlowButton>
                            </div>

                            {/* Results Table */}
                            <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead>
                                            <tr className="border-b border-bg-border/50 bg-bg-surface/30">
                                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] w-12 text-center">Seq</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Provenance Signal</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Associated Label</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Historical Stamp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-bg-border/30">
                                            {filteredResults?.map((r, i) => {
                                                const StatusIcon = STATUS_ICONS[r.status] || HelpCircle;
                                                return (
                                                    <motion.tr 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: i * 0.01 }}
                                                        key={i} 
                                                        className="hover:bg-white/[0.02] transition-colors group"
                                                    >
                                                        <td className="px-6 py-4 text-[11px] font-mono text-text-muted group-hover:text-purple-glow text-center">
                                                            {(i + 1).toString().padStart(3, '0')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <code className="text-[11px] text-purple-glow font-mono tracking-tight group-hover:text-text-primary transition-colors">
                                                                    {r.hash?.slice(0, 32)}...
                                                                </code>
                                                                <span className="text-[9px] text-text-muted/50 font-mono mt-0.5">{r.hash?.slice(32)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${STATUS_COLORS[r.status]}`}>
                                                                <StatusIcon className="w-3.5 h-3.5" />
                                                                {STATUS_LABELS[r.status].replace(/[✓✗⚠—]\s/, '')}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-text-primary font-medium">{r.metadata || '—'}</span>
                                                                {r.organization && <span className="text-[10px] text-text-muted/70">{r.organization}</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[11px] text-text-muted font-medium">
                                                                {r.registeredAt
                                                                    ? new Date(r.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                                    : '—'}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredResults?.length === 0 && (
                                    <div className="text-center py-20 bg-bg-surface/10">
                                        <div className="w-16 h-16 bg-bg-surface border border-bg-border rounded-3xl flex items-center justify-center mx-auto mb-4">
                                            <Filter className="w-8 h-8 text-text-muted/20" />
                                        </div>
                                        <p className="text-text-muted text-sm italic">No records identified with the current criteria.</p>
                                    </div>
                                )}
                            </PurpleCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
