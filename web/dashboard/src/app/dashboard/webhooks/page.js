"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Plus, MoreVertical, Trash2, Play, ChevronDown,
    ChevronUp, Globe, Clock, AlertCircle, CheckCircle2,
    X, Copy, RefreshCw, Shield, ExternalLink, Activity
} from 'lucide-react';

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
            console.error('Failed to fetch webhooks:', error);
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
            // Refresh logs if open
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
            console.error('Failed to fetch logs:', error);
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
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#4285F4]/10 border border-[#4285F4]/20">
                            <Zap className="w-6 h-6 text-[#4285F4]" />
                        </div>
                        Webhooks
                    </h1>
                    <p className="text-[#9AA0A6] text-sm mt-1">
                        Receive real-time notifications when events occur in your organization
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#4285F4]/20"
                >
                    <Plus className="w-4 h-4" /> Add Webhook
                </button>
            </div>

            {/* Main Table */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#161621] border-b border-[#1E1E2E]">
                            <tr className="text-[#9AA0A6] text-[11px] uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Endpoint URL</th>
                                <th className="px-6 py-4">Events</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Performance</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E1E2E]">
                            {loading ? (
                                <TableSkeleton />
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
                                        <EmptyState onAdd={() => setIsCreateModalOpen(true)} />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            <CreateWebhookModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(newWebhook) => {
                    setWebhooks([newWebhook, ...webhooks]);
                    setIsCreateModalOpen(false);
                    showToast('Webhook created successfully');
                }}
            />

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-xl bg-[#111118] border border-[#1E1E2E] shadow-2xl flex items-center gap-3 min-w-[320px]"
                    >
                        <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-[#10B981]/10' : 'bg-[#F28B82]/10'}`}>
                            {toast.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-[#F28B82]" />
                            )}
                        </div>
                        <span className="text-sm text-white font-medium">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-auto text-[#9AA0A6] hover:text-white">
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
            <tr className={`hover:bg-[#161621] transition-all group ${isSelected ? 'bg-[#161621]' : ''}`}>
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-[#5F6368]" />
                            <span className="text-white font-mono text-xs truncate max-w-[240px]">
                                {webhook.url}
                            </span>
                        </div>
                        {testResult && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`text-[10px] mt-1 font-bold ${testResult.success ? 'text-[#10B981]' : 'text-[#F28B82]'}`}
                            >
                                {testResult.message}
                            </motion.div>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                        {webhook.events.map(event => (
                            <span key={event} className="px-2 py-0.5 rounded-md bg-[#2C3038] text-[#9AA0A6] text-[10px] font-bold uppercase tracking-tight">
                                {event.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${webhook.isActive ? 'bg-[#10B981]' : 'bg-[#5F6368]'}`}></div>
                        <span className={`text-[11px] font-bold uppercase ${webhook.isActive ? 'text-[#10B981]' : 'text-[#5F6368]'}`}>
                            {webhook.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[11px]">
                            <Clock className="w-3 h-3 text-[#5F6368]" />
                            <span className="text-[#9AA0A6]">
                                {webhook.lastTriggeredAt ? new Date(webhook.lastTriggeredAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never triggered'}
                            </span>
                        </div>
                        {webhook.failureCount > 0 && (
                            <div className="flex items-center gap-2 text-[11px] text-[#F28B82] font-bold">
                                <AlertCircle className="w-3 h-3" />
                                {webhook.failureCount} Failures
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => onTest(webhook.id)}
                            disabled={isTesting}
                            className="p-2 rounded-lg hover:bg-[#2C3038] text-[#9AA0A6] hover:text-[#4285F4] transition-all disabled:opacity-50"
                            title="Test Webhook"
                        >
                            {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => onToggleLogs(webhook.id)}
                            className={`p-2 rounded-lg hover:bg-[#2C3038] transition-all ${isSelected ? 'text-[#4285F4] bg-[#4285F4]/10' : 'text-[#9AA0A6]'}`}
                            title="View Logs"
                        >
                            <Activity className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(webhook.id)}
                            className="p-2 rounded-lg hover:bg-[#F28B82]/10 text-[#5F6368] hover:text-[#F28B82] transition-all"
                            title="Delete Webhook"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
            <AnimatePresence>
                {isSelected && (
                    <tr>
                        <td colSpan="5" className="px-0 py-0 bg-[#0A0A0F]">
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 border-b border-[#1E1E2E]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold text-[#E8EAED] uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-3 h-3 text-[#4285F4]" /> Delivery Logs (Last 20)
                                        </h4>
                                        <button className="text-[10px] text-[#4285F4] font-bold uppercase hover:underline">
                                            Refresh Logs
                                        </button>
                                    </div>

                                    {logsLoading ? (
                                        <div className="py-8 flex justify-center">
                                            <RefreshCw className="w-6 h-6 text-[#4285F4] animate-spin" />
                                        </div>
                                    ) : logs.length > 0 ? (
                                        <div className="rounded-xl border border-[#1E1E2E] overflow-hidden">
                                            <table className="w-full text-left text-[11px]">
                                                <thead className="bg-[#161621] text-[#9AA0A6] font-bold uppercase">
                                                    <tr>
                                                        <th className="px-4 py-2 text-[9px] tracking-tighter">Timestamp</th>
                                                        <th className="px-4 py-2 text-[9px] tracking-tighter">Event</th>
                                                        <th className="px-4 py-2 text-[9px] tracking-tighter">Status</th>
                                                        <th className="px-4 py-2 text-[9px] tracking-tighter">Duration</th>
                                                        <th className="px-4 py-2 text-[9px] tracking-tighter text-right">Response</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#1E1E2E] bg-[#111118]">
                                                    {logs.map((log, i) => (
                                                        <tr key={i} className="hover:bg-[#161621]">
                                                            <td className="px-4 py-2 text-[#9AA0A6]">
                                                                {new Date(log.createdAt).toLocaleString()}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <span className="px-1.5 py-0.5 rounded bg-[#2C3038] text-white">
                                                                    {log.event}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className={`w-1 h-1 rounded-full ${log.statusCode >= 200 && log.statusCode < 300 ? 'bg-[#10B981]' : 'bg-[#F28B82]'}`}></div>
                                                                    <span className={log.statusCode >= 200 && log.statusCode < 300 ? 'text-[#10B981]' : 'text-[#F28B82]'}>
                                                                        {log.statusCode || 'FAILED'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 text-[#9AA0A6]">{log.durationMs}ms</td>
                                                            <td className="px-4 py-2 text-right text-[#5F6368] font-mono italic">
                                                                {log.responseSummary || 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-[#5F6368] text-[11px] italic">
                                            No delivery attempts recorded yet
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
        if (events.includes(event)) {
            setEvents(events.filter(e => e !== event));
        } else {
            setEvents([...events, event]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!url.startsWith('https://')) newErrors.url = 'Endpoint must use HTTPS';
        if (events.length === 0) newErrors.events = 'Select at least one event';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/api/webhooks', { url, events, secret });
            onSuccess(data);
        } catch (error) {
            setErrors({ submit: error.response?.data?.error || 'Failed to create webhook' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const availableEvents = [
        { id: 'anchor_success', label: 'Hash anchored successfully', desc: 'Triggered when a document is successfully recorded on-chain.' },
        { id: 'anchor_failed', label: 'Hash registration failed', desc: 'Triggered when a document anchor fails (e.g., insufficient funds).' },
        { id: 'hash_revoked', label: 'Hash revoked', desc: 'Triggered when a proof is explicitly invalidated on-chain.' },
        { id: 'key_created', label: 'API key created', desc: 'Triggered when a new integration key is provisioned.' },
        { id: 'low_balance', label: 'Wallet balance low', desc: 'Triggered when the node identity falls below threshold.' },
    ];

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl bg-[#111118] border border-[#1E1E2E] rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#161621] flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-[#4285F4]" /> Add New Webhook
                    </h3>
                    <button onClick={onClose} className="text-[#9AA0A6] hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#9AA0A6] uppercase tracking-widest ml-1">Payload URL</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="https://api.yourdomain.com/webhooks"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className={`w-full bg-[#0A0A0F] border ${errors.url ? 'border-[#F28B82]' : 'border-[#1E1E2E]'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4285F4] transition-all`}
                            />
                            {errors.url && <p className="text-[10px] text-[#F28B82] font-bold mt-1 ml-1">{errors.url}</p>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-[#9AA0A6] uppercase tracking-widest ml-1">Event Subscriptions</label>
                            {errors.events && <span className="text-[10px] text-[#F28B82] font-bold">{errors.events}</span>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availableEvents.map((evt) => (
                                <div
                                    key={evt.id}
                                    onClick={() => toggleEvent(evt.id)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all ${events.includes(evt.id) ? 'bg-[#4285F4]/5 border-[#4285F4]/30' : 'bg-[#0A0A0F] border-[#1E1E2E] hover:border-[#1E1E2E]'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 w-4 h-4 rounded border transition-all flex items-center justify-center ${events.includes(evt.id) ? 'bg-[#4285F4] border-[#4285F4]' : 'border-[#2C3038]'}`}>
                                            {events.includes(evt.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                        <div>
                                            <p className={`text-[12px] font-bold ${events.includes(evt.id) ? 'text-[#4285F4]' : 'text-white'}`}>{evt.label}</p>
                                            <p className="text-[10px] text-[#9AA0A6] mt-0.5 leading-tight">{evt.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#9AA0A6] uppercase tracking-widest ml-1 flex items-center justify-between">
                            Signing Secret
                            <span className="text-[9px] text-[#5F6368] normal-case">HMAC-SHA256 verification</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    readOnly
                                    value={secret}
                                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-4 py-3 text-xs font-mono text-[#8AB4F8]"
                                />
                                <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(secret)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[#1E1E2E] text-[#5F6368] hover:text-white transition-all"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={regenerateSecret}
                                className="p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl text-[#9AA0A6] hover:text-[#E8EAED] hover:border-[#2C3038] transition-all"
                                title="Regenerate Secret"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-[#5F6368] leading-normal ml-1">
                            Used to sign the payload. Verify the <code className="text-[#8AB4F8]">x-hub-signature-256</code> header to ensure requests are authentic.
                        </p>
                    </div>

                    {errors.submit && (
                        <div className="p-3 rounded-lg bg-[#F28B82]/10 border border-[#F28B82]/20 flex items-center gap-2 text-[#F28B82] text-xs">
                            <AlertCircle className="w-4 h-4" /> {errors.submit}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#9AA0A6] hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="px-8 py-2.5 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] disabled:bg-[#1E1E2E] disabled:text-[#5F6368] text-white text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#4285F4]/20"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Create Webhook"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function TableSkeleton() {
    return Array.from({ length: 3 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
            <td className="px-6 py-5"><div className="h-4 w-48 bg-[#1E1E2E] rounded" /></td>
            <td className="px-6 py-5"><div className="h-4 w-32 bg-[#1E1E2E] rounded" /></td>
            <td className="px-6 py-5"><div className="h-4 w-16 bg-[#1E1E2E] rounded" /></td>
            <td className="px-6 py-5"><div className="h-4 w-24 bg-[#1E1E2E] rounded" /></td>
            <td className="px-6 py-5 text-right"><div className="h-8 w-24 ml-auto bg-[#1E1E2E] rounded" /></td>
        </tr>
    ));
}

function EmptyState({ onAdd }) {
    return (
        <div className="py-24 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-[#1E1E2E] flex items-center justify-center mb-6 relative">
                <Zap className="w-10 h-10 text-[#5F6368]" />
                <div className="absolute inset-0 rounded-full border border-[#2C3038] animate-ping scale-150 opacity-20"></div>
            </div>
            <h3 className="text-white text-lg font-bold mb-2">No webhooks configured</h3>
            <p className="text-[#9AA0A6] text-sm max-w-sm mx-auto mb-8">
                Connect your external applications to receive real-time cryptographic registry events via standard webhooks.
            </p>
            <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#4285F4]/20"
            >
                Add your first webhook
            </button>
        </div>
    );
}
