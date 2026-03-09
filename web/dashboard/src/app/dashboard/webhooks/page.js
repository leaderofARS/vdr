"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Plus, MoreVertical, Trash2, Play, ChevronDown,
    ChevronUp, Globe, Clock, AlertCircle, CheckCircle2,
    X, Copy, RefreshCw, Shield, ExternalLink, Activity,
    Webhook, Terminal, Code, Info, Send
} from 'lucide-react';
import {
    PurpleCard, GlowButton, PurpleBadge, PurpleTable,
    PurpleTableRow, PurpleSkeleton, PurpleModal, PurpleInput
} from '@/components/ui/PurpleUI';

export default function WebhooksPage() {
    const [webhooks, setWebhooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedWebhook, setSelectedWebhook] = useState(null);
    const [logs, setLogs] = useState({});
    const [logsLoading, setLogsLoading] = useState({});
    const [testResults, setTestResults] = useState({});
    const [testingId, setTestingId] = useState(null);
    const [toast, setToast] = useState(null);

    const fetchWebhooks = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/webhooks');
            setWebhooks(data);
        } catch (error) {
            showToast('Failed to load webhooks', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWebhooks();
    }, [fetchWebhooks]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this webhook?')) return;
        try {
            await api.delete(`/api/webhooks/${id}`);
            setWebhooks(webhooks.filter(w => w.id !== id));
            showToast('Webhook deleted successfully');
        } catch (error) {
            showToast('Failed to delete webhook', 'error');
        }
    };

    const handleTest = async (id) => {
        setTestingId(id);
        try {
            const { data } = await api.post(`/api/webhooks/${id}/test`);
            setTestResults(prev => ({
                ...prev,
                [id]: {
                    success: data.success,
                    message: data.success
                        ? `Delivered successfully (${data.duration}ms)`
                        : `Failed: ${data.error || 'Connection refused'}`,
                    statusCode: data.statusCode
                }
            }));
            if (selectedWebhook === id) fetchLogs(id);
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                [id]: { success: false, message: 'Failed to trigger test' }
            }));
        } finally {
            setTestingId(null);
            setTimeout(() => {
                setTestResults(prev => ({ ...prev, [id]: null }));
            }, 5000);
        }
    };

    const fetchLogs = async (id) => {
        setLogsLoading(prev => ({ ...prev, [id]: true }));
        try {
            const { data } = await api.get(`/api/webhooks/${id}/logs`);
            setLogs(prev => ({ ...prev, [id]: data }));
        } catch (error) {
            console.error(error);
        } finally {
            setLogsLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const toggleLogs = (id) => {
        if (selectedWebhook === id) {
            setSelectedWebhook(null);
        } else {
            setSelectedWebhook(id);
            if (!logs[id]) fetchLogs(id);
        }
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2 flex items-center gap-4">
                        <Webhook className="w-8 h-8 text-purple-vivid" />
                        Platform Events
                    </h1>
                    <p className="text-sm text-text-muted max-w-lg">
                        Connect external services to real-time on-chain actions via secure cryptographic webhooks.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <GlowButton onClick={() => setIsCreateModalOpen(true)} icon={Plus} className="px-8 py-4">PROVISION ENDPOINT</GlowButton>
                </motion.div>
            </div>

            {/* Main Table */}
            <PurpleCard className="p-0 overflow-hidden border-bg-border/50">
                <PurpleTable headers={["Endpoint Configuration", "Subscribed Events", "Network Status", "Signal Performance", "Actions"]}>
                    {loading ? (
                        <TableSkeleton rows={3} />
                    ) : webhooks.length > 0 ? (
                        webhooks.map((webhook) => (
                            <WebhookRow
                                key={webhook.id}
                                webhook={webhook}
                                onDelete={handleDelete}
                                onTest={handleTest}
                                isTesting={testingId === webhook.id}
                                testResult={testResults[webhook.id]}
                                isSelected={selectedWebhook === webhook.id}
                                onToggleLogs={toggleLogs}
                                logs={logs[webhook.id] || []}
                                logsLoading={logsLoading[webhook.id]}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">
                                <div className="py-24 text-center">
                                    <div className="w-20 h-20 bg-purple-dim/10 border border-purple-vivid/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                        <Zap className="w-10 h-10 text-purple-glow/20" />
                                        <div className="absolute inset-0 rounded-full border border-purple-vivid/20 animate-ping opacity-20" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No active endpoints</h3>
                                    <p className="text-text-muted text-sm max-w-sm mx-auto mb-8">Provision a webhook endpoint to receive real-time cryptographic registry updates.</p>
                                    <GlowButton onClick={() => setIsCreateModalOpen(true)} icon={Plus} variant="ghost">ADD YOUR FIRST ENDPOINT</GlowButton>
                                </div>
                            </td>
                        </tr>
                    )}
                </PurpleTable>
            </PurpleCard>

            <CreateWebhookModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(newWebhook) => {
                    setWebhooks([newWebhook, ...webhooks]);
                    setIsCreateModalOpen(false);
                    showToast('Webhook created successfully');
                }}
            />

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        className="fixed bottom-12 left-1/2 z-[150] px-6 py-4 rounded-2xl bg-bg-surface border border-purple-vivid/20 shadow-2xl flex items-center gap-4 min-w-[320px]"
                    >
                        <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-bold text-text-primary">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-auto text-text-muted hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function WebhookRow({ webhook, onDelete, onTest, isTesting, testResult, isSelected, onToggleLogs, logs, logsLoading }) {
    return (
        <>
            <PurpleTableRow className={isSelected ? 'bg-purple-vivid/[0.03]' : ''}>
                <td className="px-8 py-5">
                    <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex items-center gap-2 group">
                            <Globe className="w-3.5 h-3.5 text-purple-glow shrink-0" />
                            <span className="text-text-primary font-mono text-xs truncate max-w-[280px]">
                                {webhook.url}
                            </span>
                        </div>
                        {testResult && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                className={`text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide ${testResult.success ? 'text-success' : 'text-danger'}`}
                            >
                                {testResult.success ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                {testResult.message}
                            </motion.div>
                        )}
                    </div>
                </td>
                <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {webhook.events.slice(0, 2).map(event => (
                            <PurpleBadge key={event} variant="purple" className="text-[9px] px-2 py-0.5 whitespace-nowrap">
                                {event.toUpperCase().replace('_', ' ')}
                            </PurpleBadge>
                        ))}
                        {webhook.events.length > 2 && (
                            <span className="text-[10px] text-text-muted font-bold ml-1">+{webhook.events.length - 2} MORE</span>
                        )}
                    </div>
                </td>
                <td className="px-8 py-5 text-center">
                    <PurpleBadge variant={webhook.isActive ? 'success' : 'ghost'} pulse={webhook.isActive}>
                        {webhook.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </PurpleBadge>
                </td>
                <td className="px-8 py-5">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                            <Clock className="w-3.5 h-3.5 text-purple-glow" />
                            {webhook.lastTriggeredAt ? new Date(webhook.lastTriggeredAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase() : 'NEVER TRIGGERED'}
                        </div>
                        {webhook.failureCount > 0 && (
                            <div className="flex items-center gap-2 text-[10px] text-danger font-bold uppercase tracking-tight">
                                <AlertCircle className="w-3 h-3" /> {webhook.failureCount} NETWORK ERRORS
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={() => onTest(webhook.id)}
                            disabled={isTesting}
                            className="p-3 rounded-2xl bg-purple-dim/10 border border-bg-border text-purple-glow hover:text-white hover:border-purple-vivid/40 transition-all disabled:opacity-50"
                            title="Trigger Test Delivery"
                        >
                            {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => onToggleLogs(webhook.id)}
                            className={`p-3 rounded-2xl border transition-all ${isSelected ? 'bg-purple-vivid/20 border-purple-vivid/40 text-purple-glow' : 'bg-purple-dim/10 border-bg-border text-text-muted hover:text-white hover:border-purple-vivid/40'}`}
                            title="Inspect Telemetry Logs"
                        >
                            <Activity className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(webhook.id)}
                            className="p-3 rounded-2xl bg-danger/5 border border-bg-border text-text-muted hover:text-danger hover:border-danger/30 transition-all"
                            title="Remove Configuration"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </PurpleTableRow>

            <AnimatePresence>
                {isSelected && (
                    <tr>
                        <td colSpan="5" className="px-0 py-0 border-b border-bg-border/50 bg-black/40">
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-vivid/10 text-purple-vivid rounded-xl">
                                                <Terminal className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em]">Transmission Logs</h4>
                                        </div>
                                        <button onClick={() => onToggleLogs(webhook.id)} className="text-[10px] text-text-muted hover:text-white uppercase font-bold tracking-widest flex items-center gap-2">
                                            CLOSE LOGS <ChevronUp className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {logsLoading ? (
                                        <div className="py-12 flex flex-col items-center gap-4">
                                            <RefreshCw className="w-8 h-8 text-purple-vivid animate-spin" />
                                            <span className="text-[10px] font-bold text-purple-glow uppercase tracking-widest">Retrieving telemetry...</span>
                                        </div>
                                    ) : logs.length > 0 ? (
                                        <div className="rounded-3xl border border-bg-border overflow-hidden bg-black/20 backdrop-blur-md">
                                            <PurpleTable headers={["Timestamp (UTC)", "Event Context", "Execution Status", "Latency", "Server Response"]} density="tight">
                                                {logs.map((log, i) => (
                                                    <PurpleTableRow key={i}>
                                                        <td className="px-6 py-4 text-[10px] font-mono text-text-muted">
                                                            {new Date(log.createdAt).toLocaleString().toUpperCase()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <PurpleBadge variant="purple" className="text-[9px] uppercase">{log.event.replace('_', ' ')}</PurpleBadge>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${log.statusCode >= 200 && log.statusCode < 300 ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                                                                <span className={`text-[11px] font-bold ${log.statusCode >= 200 && log.statusCode < 300 ? 'text-success' : 'text-danger'}`}>
                                                                    {log.statusCode || 'NETWORK ERROR'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-[11px] font-mono text-purple-glow">{log.durationMs}ms</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <code className="text-[10px] text-text-muted italic bg-white/[0.02] px-2 py-1 rounded truncate max-w-[150px] inline-block">
                                                                {log.responseSummary || "// N/A"}
                                                            </code>
                                                        </td>
                                                    </PurpleTableRow>
                                                ))}
                                            </PurpleTable>
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center bg-white/[0.01] rounded-3xl border border-bg-border/30 border-dashed">
                                            <div className="p-3 bg-purple-dim/10 rounded-2xl inline-block mb-3">
                                                <Activity className="w-6 h-6 text-text-muted opacity-40" />
                                            </div>
                                            <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest">No signals recorded yet</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </>
    );
}

function CreateWebhookModal({ isOpen, onClose, onSuccess }) {
    const [url, setUrl] = useState('');
    const [events, setEvents] = useState(['anchor_success', 'anchor_failed']);
    const [secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            regenerateSecret();
            setUrl('');
            setEvents(['anchor_success', 'anchor_failed']);
        }
    }, [isOpen]);

    const regenerateSecret = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = 'wh_sec_';
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setSecret(result);
    };

    const toggleEvent = (event) => {
        setEvents(prev => prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!url.startsWith('https://')) newErrors.url = 'Endpoint must be encrypted (HTTPS)';
        if (events.length === 0) newErrors.events = 'Identify at least one event type';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/api/webhooks', { url, events, secret });
            onSuccess(data);
        } catch (error) {
            setErrors({ submit: error.response?.data?.error || 'Failed to initialize endpoint' });
        } finally {
            setLoading(false);
        }
    };

    const availableEvents = [
        { id: 'anchor_success', label: 'Hash Success', desc: 'On-chain registration finalized' },
        { id: 'anchor_failed', label: 'Hash Failure', desc: 'Registry anchor failed' },
        { id: 'hash_revoked', label: 'Proof Revoked', desc: 'Identity invalidated on-chain' },
        { id: 'key_created', label: 'Credential Issued', desc: 'API key provisioned' },
        { id: 'low_balance', label: 'Balance Warning', desc: 'Institutional wallet below threshold' },
    ];

    return (
        <PurpleModal isOpen={isOpen} onClose={onClose} title="Configure Webhook Endpoint">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Payload Distribution URL</label>
                    <div className="relative group">
                        <PurpleInput
                            placeholder="https://api.domain.io/v1/webhooks"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={errors.url ? 'border-danger/40 ring-danger/10' : ''}
                        />
                        {errors.url && <p className="text-[10px] text-danger font-bold mt-2 ml-1 uppercase tracking-tight">{errors.url}</p>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Telemetry Triggers</label>
                        {errors.events && <span className="text-[10px] text-danger font-bold uppercase">{errors.events}</span>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableEvents.map((evt) => (
                            <div
                                key={evt.id}
                                onClick={() => toggleEvent(evt.id)}
                                className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-start gap-4 ${events.includes(evt.id) ? 'bg-purple-vivid/10 border-purple-vivid/40 shadow-lg shadow-purple-vivid/5' : 'bg-black/40 border-bg-border hover:border-purple-vivid/30'}`}
                            >
                                <div className={`mt-0.5 w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center shrink-0 ${events.includes(evt.id) ? 'bg-purple-vivid border-purple-vivid' : 'border-bg-border'}`}>
                                    {events.includes(evt.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${events.includes(evt.id) ? 'text-white' : 'text-text-secondary'}`}>{evt.label}</p>
                                    <p className="text-[10px] text-text-muted mt-1 leading-tight font-medium uppercase tracking-tighter">{evt.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-bg-border/50">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1 flex items-center justify-between">
                        Security Signature Secret
                        <PurpleBadge variant="purple" className="text-[9px]">HMAC-SHA256</PurpleBadge>
                    </label>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <PurpleInput
                                readOnly
                                value={secret}
                                className="font-mono text-purple-glow text-xs bg-black/60"
                            />
                            <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(secret)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-purple-dim/30 text-text-muted hover:text-white transition-all shadow-inner"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <GlowButton
                            type="button"
                            variant="ghost"
                            onClick={regenerateSecret}
                            className="p-4 rounded-3xl"
                            icon={RefreshCw}
                        />
                    </div>
                    <div className="p-4 bg-purple-glow/[0.03] border border-bg-border/50 rounded-2xl flex items-start gap-3">
                        <Info className="w-4 h-4 text-purple-glow shrink-0 mt-0.5" />
                        <p className="text-[10px] text-text-secondary leading-relaxed">
                            Every request include a <code className="text-purple-glow">x-hub-signature-256</code> header.
                            Use this secret to verify payload authenticity.
                        </p>
                    </div>
                </div>

                {errors.submit && (
                    <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 flex items-center gap-3 text-danger text-[11px] font-bold uppercase tracking-tight">
                        <AlertCircle className="w-4 h-4" /> {errors.submit}
                    </div>
                )}

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-bg-border/50">
                    <button type="button" onClick={onClose} className="text-xs font-bold text-text-muted hover:text-white uppercase tracking-[0.2em] px-4">DISMISS</button>
                    <GlowButton
                        type="submit"
                        disabled={loading || !url}
                        loading={loading}
                        className="px-8 py-4 text-xs font-bold uppercase tracking-widest"
                        icon={Webhook}
                    >
                        ACTIVATE ENDPOINT
                    </GlowButton>
                </div>
            </form>
        </PurpleModal>
    );
}

function TableSkeleton({ rows = 3 }) {
    return Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
            <td className="px-8 py-5"><PurpleSkeleton className="h-4 w-48" /></td>
            <td className="px-8 py-5"><PurpleSkeleton className="h-4 w-32" /></td>
            <td className="px-8 py-5"><PurpleSkeleton className="h-4 w-16 mx-auto" /></td>
            <td className="px-8 py-5"><PurpleSkeleton className="h-4 w-24" /></td>
            <td className="px-8 py-5"><PurpleSkeleton className="h-10 w-32 ml-auto" /></td>
        </tr>
    ));
}
