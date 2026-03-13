/**
 * @file WebhooksPage.tsx
 * @description Webhook management page for SipHeron VDR
 * Ported from web/dashboard/src/app/(dashboard)/dashboard/webhooks/page.js
 */

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Plus,
  Trash2,
  Send,
  ChevronUp,
  Globe,
  Clock,
  AlertCircle,
  CheckCircle2,
  Copy,
  RefreshCw,
  Terminal,
  Activity,
  Webhook,
  Info,
  Check
} from 'lucide-react';
import api from '@/utils/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggeredAt?: string;
  failureCount: number;
  secret: string;
}

interface WebhookLog {
  id: string;
  event: string;
  statusCode: number;
  durationMs: number;
  responseSummary?: string;
  createdAt: string;
  success: boolean;
}

interface TestResult {
  success: boolean;
  message: string;
  statusCode?: number;
}

const availableEvents = [
  { id: 'anchor_success', label: 'Hash Success', desc: 'On-chain registration finalized' },
  { id: 'anchor_failed', label: 'Hash Failure', desc: 'Registry anchor failed' },
  { id: 'hash_revoked', label: 'Proof Revoked', desc: 'Identity invalidated on-chain' },
  { id: 'key_created', label: 'Credential Issued', desc: 'API key provisioned' },
  { id: 'low_balance', label: 'Balance Warning', desc: 'Institutional wallet below threshold' },
];

export const WebhooksPage: React.FC = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, WebhookLog[]>>({});
  const [logsLoading, setLogsLoading] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [testingId, setTestingId] = useState<string | null>(null);

  const fetchWebhooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/webhooks');
      setWebhooks(data.webhooks || []);
    } catch (error) {
      toast.error('Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebhooks();
    // Real-time polling every 30s
    const interval = setInterval(fetchWebhooks, 30000);
    return () => clearInterval(interval);
  }, [fetchWebhooks]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;
    try {
      await api.delete(`/api/webhooks/${id}`);
      setWebhooks(webhooks.filter(w => w.id !== id));
      toast.success('Webhook deleted successfully');
    } catch (error) {
      toast.error('Failed to delete webhook');
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const { data } = await api.post(`/api/webhooks/${id}/test`);
      setTestResults(prev => ({
        ...prev,
        [id]: {
          success: data.success,
          message: data.success
            ? `Test delivery initiated`
            : `Failed: ${data.error || 'Connection refused'}`,
          statusCode: data.statusCode
        }
      }));
      if (selectedWebhook === id) fetchLogs(id);
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [id]: { success: false, message: error.response?.data?.error || 'Failed to trigger test' }
      }));
    } finally {
      setTestingId(null);
      setTimeout(() => {
        setTestResults(prev => ({ ...prev, [id]: undefined as any }));
      }, 5000);
    }
  };

  const fetchLogs = async (id: string) => {
    setLogsLoading(prev => ({ ...prev, [id]: true }));
    try {
      const { data } = await api.get(`/api/webhooks/${id}/logs`);
      setLogs(prev => ({ ...prev, [id]: data.logs || [] }));
    } catch (error) {
      console.error(error);
    } finally {
      setLogsLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const toggleLogs = (id: string) => {
    if (selectedWebhook === id) {
      setSelectedWebhook(null);
    } else {
      setSelectedWebhook(id);
      if (!logs[id]) fetchLogs(id);
    }
  };

  const handleCreateSuccess = (newWebhook: Webhook) => {
    setWebhooks([newWebhook, ...webhooks]);
    setIsCreateModalOpen(false);
    toast.success('Webhook created successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sipheron-text-primary flex items-center gap-3">
            <Webhook className="w-7 h-7 text-sipheron-purple" />
            Platform Events
          </h1>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Connect external services to real-time on-chain actions via secure cryptographic webhooks.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-sipheron-purple hover:bg-sipheron-purple/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Provision Endpoint
        </Button>
      </div>

      {/* Webhooks Table */}
      <div className="bg-sipheron-surface border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : webhooks.length > 0 ? (
          <div className="divide-y divide-white/[0.04]">
            {webhooks.map((webhook) => (
              <WebhookRow
                key={webhook.id}
                webhook={webhook}
                onDelete={handleDelete}
                onTest={handleTest}
                isTesting={testingId === webhook.id}
                testResult={testResults[webhook.id]}
                isSelected={selectedWebhook === webhook.id}
                onToggleLogs={() => toggleLogs(webhook.id)}
                logs={logs[webhook.id] || []}
                logsLoading={logsLoading[webhook.id]}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-sipheron-purple/10 border border-sipheron-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-sipheron-purple/40" />
            </div>
            <h3 className="text-xl font-bold text-sipheron-text-primary mb-2">No active endpoints</h3>
            <p className="text-sipheron-text-muted text-sm max-w-sm mx-auto mb-6">
              Provision a webhook endpoint to receive real-time cryptographic registry updates.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="outline"
              className="border-sipheron-purple/30 text-sipheron-purple hover:bg-sipheron-purple/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Endpoint
            </Button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateWebhookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

interface WebhookRowProps {
  webhook: Webhook;
  onDelete: (id: string) => void;
  onTest: (id: string) => void;
  isTesting: boolean;
  testResult?: TestResult;
  isSelected: boolean;
  onToggleLogs: () => void;
  logs: WebhookLog[];
  logsLoading: boolean;
}

const WebhookRow: React.FC<WebhookRowProps> = ({
  webhook,
  onDelete,
  onTest,
  isTesting,
  testResult,
  isSelected,
  onToggleLogs,
  logs,
  logsLoading
}) => {
  return (
    <div className={`${isSelected ? 'bg-sipheron-purple/[0.02]' : ''}`}>
      <div className="p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Endpoint */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sipheron-purple shrink-0" />
            <span className="font-mono text-sm text-sipheron-text-primary truncate">
              {webhook.url}
            </span>
          </div>
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs flex items-center gap-1.5 mt-1 ${testResult.success ? 'text-sipheron-green' : 'text-sipheron-red'}`}
            >
              {testResult.success ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {testResult.message}
            </motion.div>
          )}
        </div>

        {/* Events */}
        <div className="flex flex-wrap gap-1.5">
          {webhook.events.slice(0, 2).map(event => (
            <Badge key={event} variant="secondary" className="text-[10px] bg-sipheron-purple/10 text-sipheron-purple border-sipheron-purple/20">
              {event.replace('_', ' ').toUpperCase()}
            </Badge>
          ))}
          {webhook.events.length > 2 && (
            <span className="text-xs text-sipheron-text-muted">+{webhook.events.length - 2} more</span>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge
            variant={webhook.isActive ? 'default' : 'secondary'}
            className={webhook.isActive ? 'bg-sipheron-green/10 text-sipheron-green border-sipheron-green/20' : ''}
          >
            {webhook.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </div>

        {/* Performance */}
        <div className="text-sm text-sipheron-text-muted min-w-[140px]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            {webhook.lastTriggeredAt
              ? new Date(webhook.lastTriggeredAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Never triggered'}
          </div>
          {webhook.failureCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-sipheron-red mt-1">
              <AlertCircle className="w-3 h-3" /> {webhook.failureCount} errors
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTest(webhook.id)}
            disabled={isTesting}
            className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-purple hover:bg-white/[0.05] transition-colors disabled:opacity-50"
            title="Trigger Test Delivery"
          >
            {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleLogs}
            className={`p-2 rounded-lg border transition-colors ${isSelected ? 'bg-sipheron-purple/20 border-sipheron-purple/40 text-sipheron-purple' : 'bg-white/[0.03] border-white/[0.06] text-sipheron-text-muted hover:text-white'}`}
            title="Inspect Telemetry Logs"
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(webhook.id)}
            className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-muted hover:text-sipheron-red hover:border-sipheron-red/30 transition-colors"
            title="Remove Configuration"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs Panel */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/[0.04]"
          >
            <div className="p-4 lg:p-6 bg-black/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sipheron-purple" />
                  <h4 className="text-sm font-semibold text-sipheron-text-primary">Transmission Logs</h4>
                </div>
                <button
                  onClick={onToggleLogs}
                  className="text-xs text-sipheron-text-muted hover:text-white flex items-center gap-1"
                >
                  Close Logs <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>

              {logsLoading ? (
                <div className="py-8 flex flex-col items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-sipheron-purple animate-spin" />
                  <span className="text-xs text-sipheron-text-muted">Retrieving telemetry...</span>
                </div>
              ) : logs.length > 0 ? (
                <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-black/30">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-white/[0.03]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sipheron-text-muted font-medium">Timestamp (UTC)</th>
                          <th className="px-4 py-3 text-left text-sipheron-text-muted font-medium">Event</th>
                          <th className="px-4 py-3 text-left text-sipheron-text-muted font-medium">Status</th>
                          <th className="px-4 py-3 text-left text-sipheron-text-muted font-medium">Latency</th>
                          <th className="px-4 py-3 text-right text-sipheron-text-muted font-medium">Response</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {logs.map((log, i) => (
                          <tr key={i} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-sipheron-text-muted font-mono">
                              {new Date(log.createdAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary" className="text-[9px] bg-sipheron-purple/10 text-sipheron-purple">
                                {log.event.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${log.statusCode >= 200 && log.statusCode < 300 ? 'bg-sipheron-green' : 'bg-sipheron-red'}`} />
                                <span className={log.statusCode >= 200 && log.statusCode < 300 ? 'text-sipheron-green' : 'text-sipheron-red'}>
                                  {log.statusCode || 'ERROR'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sipheron-purple font-mono">{log.durationMs}ms</td>
                            <td className="px-4 py-3 text-right">
                              <code className="text-sipheron-text-muted bg-white/[0.03] px-2 py-1 rounded truncate max-w-[150px] inline-block">
                                {log.responseSummary || "N/A"}
                              </code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-white/[0.02] rounded-xl border border-white/[0.06] border-dashed">
                  <Activity className="w-6 h-6 text-sipheron-text-muted mx-auto mb-2" />
                  <p className="text-xs text-sipheron-text-muted">No signals recorded yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CreateWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (webhook: Webhook) => void;
}

const CreateWebhookModal: React.FC<CreateWebhookModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>(['anchor_success', 'anchor_failed']);
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      regenerateSecret();
      setUrl('');
      setEvents(['anchor_success', 'anchor_failed']);
      setErrors({});
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

  const toggleEvent = (eventId: string) => {
    setEvents(prev => prev.includes(eventId) ? prev.filter(e => e !== eventId) : [...prev, eventId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!url.startsWith('https://')) newErrors.url = 'Endpoint must use HTTPS';
    if (events.length === 0) newErrors.events = 'Select at least one event';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/webhooks', { url, events, secret });
      onSuccess(data.webhook);
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.error || 'Failed to create webhook' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-sipheron-surface border-white/[0.06] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-sipheron-text-primary flex items-center gap-2">
            <Webhook className="w-5 h-5 text-sipheron-purple" />
            Configure Webhook Endpoint
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* URL */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-sipheron-text-muted uppercase">Payload URL</label>
            <Input
              placeholder="https://api.domain.io/v1/webhooks"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={errors.url ? 'border-sipheron-red' : ''}
            />
            {errors.url && <p className="text-xs text-sipheron-red">{errors.url}</p>}
          </div>

          {/* Events */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-sipheron-text-muted uppercase">Events</label>
              {errors.events && <span className="text-xs text-sipheron-red">{errors.events}</span>}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {availableEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => toggleEvent(evt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    events.includes(evt.id)
                      ? 'bg-sipheron-purple/10 border-sipheron-purple/40'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-sipheron-purple/30'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                    events.includes(evt.id) ? 'bg-sipheron-purple border-sipheron-purple' : 'border-white/[0.2]'
                  }`}>
                    {events.includes(evt.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${events.includes(evt.id) ? 'text-white' : 'text-sipheron-text-secondary'}`}>
                      {evt.label}
                    </p>
                    <p className="text-xs text-sipheron-text-muted">{evt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secret */}
          <div className="space-y-2 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-sipheron-text-muted uppercase">Secret</label>
              <Badge variant="secondary" className="text-[9px] bg-sipheron-purple/10 text-sipheron-purple">HMAC-SHA256</Badge>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  readOnly
                  value={secret}
                  className="font-mono text-xs bg-black/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(secret);
                    toast.success('Secret copied');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={regenerateSecret}
                className="border-white/[0.06]"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-start gap-2 p-3 bg-sipheron-purple/5 rounded-lg">
              <Info className="w-4 h-4 text-sipheron-purple shrink-0 mt-0.5" />
              <p className="text-xs text-sipheron-text-secondary">
                Each request includes a <code className="text-sipheron-purple">x-hub-signature-256</code> header.
                Use this secret to verify payload authenticity.
              </p>
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 rounded-lg bg-sipheron-red/10 border border-sipheron-red/20 flex items-center gap-2 text-sipheron-red text-xs">
              <AlertCircle className="w-4 h-4" /> {errors.submit}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !url}
              className="bg-sipheron-purple hover:bg-sipheron-purple/90 text-white"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Webhook className="w-4 h-4 mr-2" />}
              Activate Endpoint
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WebhooksPage;
