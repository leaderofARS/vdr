import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Eye, EyeOff, Copy, Trash2, Key, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/utils/api';

interface ApiKey {
  id: string;
  name: string;
  key?: string;
  scope: 'read' | 'write' | 'admin';
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
}

interface NewKeyResponse {
  apiKey: string;
  id: string;
  message: string;
}

const scopeColors: Record<string, string> = {
  read: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  write: 'bg-sipheron-purple/10 text-sipheron-purple border-sipheron-purple/20',
  admin: 'bg-sipheron-red/10 text-sipheron-red border-sipheron-red/20',
};

export const ApiKeysPage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState<'read' | 'write' | 'admin'>('write');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{ key: string; name: string } | null>(null);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);

  // Fetch API keys on mount
  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/keys');
      const data = response.data?.data || [];
      // Map backend response to our interface
      const mappedKeys: ApiKey[] = data.map((k: any) => ({
        id: k.id,
        name: k.name,
        scope: k.scope,
        createdAt: k.createdAt,
        lastUsedAt: k.lastUsedAt,
        status: k.status,
      }));
      setKeys(mappedKeys);
    } catch (error) {
      toast.error('Failed to load API keys');
      console.error('Error fetching API keys:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const maskKey = (key: string) => {
    const parts = key.split('_');
    if (parts.length >= 3) {
      return `${parts[0]}_${parts[1]}_${'*'.repeat(20)}...${'*'.repeat(4)}`;
    }
    return '*'.repeat(key.length);
  };

  const formatLastUsed = (lastUsedAt?: string): string => {
    if (!lastUsedAt) return 'Never';
    const date = new Date(lastUsedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleCreate = async () => {
    if (!newKeyName) return;
    setIsCreating(true);
    try {
      const response = await api.post('/api/keys', { name: newKeyName, scope: newKeyScope });
      const data: NewKeyResponse = response.data;
      
      // Store the newly created key to show to user
      setNewlyCreatedKey({ key: data.apiKey, name: newKeyName });
      setShowNewKeyDialog(true);
      
      // Refresh the keys list
      await fetchKeys();
      
      // Reset form
      setNewKeyName('');
      setIsCreateOpen(false);
      toast.success(data.message || 'API key created successfully');
    } catch (error) {
      toast.error('Failed to create API key');
      console.error('Error creating API key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setIsRevoking(id);
    try {
      await api.delete(`/api/keys/${id}`);
      // Update local state to reflect revocation
      setKeys(keys.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)));
      toast.success('API key revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke API key');
      console.error('Error revoking API key:', error);
    } finally {
      setIsRevoking(null);
    }
  };

  const copyToClipboard = async (text: string, description?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(description || 'Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleCloseNewKeyDialog = () => {
    setShowNewKeyDialog(false);
    setNewlyCreatedKey(null);
  };

  return (
    <div className="space-y-6">
      {/* New Key Display Dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent className="bg-sipheron-surface border-white/[0.06] max-w-lg" onInteractOutside={handleCloseNewKeyDialog}>
          <DialogHeader>
            <DialogTitle className="text-sipheron-text-primary">API Key Created</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-4 rounded-lg bg-sipheron-purple/5 border border-sipheron-purple/20">
              <p className="text-sm text-sipheron-text-secondary mb-3">
                Your new API key for <strong className="text-sipheron-text-primary">{newlyCreatedKey?.name}</strong> has been created. 
                <span className="text-sipheron-red font-medium"> Copy it now - you won&apos;t be able to see it again!</span>
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-sipheron-base font-mono text-sm text-sipheron-teal break-all">
                  {newlyCreatedKey?.key}
                </code>
                <button
                  onClick={() => copyToClipboard(newlyCreatedKey?.key || '', 'API key copied to clipboard')}
                  className="p-2 rounded-lg hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={handleCloseNewKeyDialog}
              className="w-full btn-primary"
            >
              I&apos;ve Copied My Key
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">API Keys</h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Manage API keys for programmatic access
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary flex items-center gap-2 self-start">
              <Plus className="w-4 h-4" />
              Create API Key
            </button>
          </DialogTrigger>
          <DialogContent className="bg-sipheron-surface border-white/[0.06] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sipheron-text-primary">Create New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm text-sipheron-text-secondary mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API"
                  className="w-full px-4 py-2 rounded-lg bg-sipheron-base border border-white/[0.06] text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-sipheron-text-secondary mb-2">
                  Scope
                </label>
                <select
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value as 'read' | 'write' | 'admin')}
                  className="w-full px-4 py-2 rounded-lg bg-sipheron-base border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                >
                  <option value="read">Read Only</option>
                  <option value="write">Read & Write</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                onClick={handleCreate}
                disabled={!newKeyName || isCreating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Key'
                )}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-sipheron-purple animate-spin" />
        </div>
      )}

      {/* API Keys List */}
      {!isLoading && (
        <div className="space-y-4">
          {keys.length === 0 ? (
            <div className="text-center py-12 bg-sipheron-surface rounded-xl border border-white/[0.06]">
              <Key className="w-12 h-12 text-sipheron-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-sipheron-text-primary mb-2">No API Keys</h3>
              <p className="text-sm text-sipheron-text-muted mb-4">Create your first API key to get started</p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create API Key
              </button>
            </div>
          ) : (
            keys.map((apiKey) => (
              <div
                key={apiKey.id}
                className={`
                  bg-sipheron-surface rounded-xl p-5 border border-white/[0.06]
                  ${apiKey.status === 'revoked' ? 'opacity-60' : ''}
                `}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-sipheron-purple/10 flex items-center justify-center">
                      <Key className="w-5 h-5 text-sipheron-purple" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-sipheron-text-primary">
                        {apiKey.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${scopeColors[apiKey.scope]}`}
                        >
                          {apiKey.scope.toUpperCase()}
                        </span>
                        <span className="text-xs text-sipheron-text-muted">
                          Created {new Date(apiKey.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key */}
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1.5 rounded-lg bg-sipheron-base font-mono text-xs text-sipheron-teal">
                      {apiKey.status === 'revoked' 
                        ? 'Revoked' 
                        : (revealedKeys.has(apiKey.id) && apiKey.key 
                            ? apiKey.key 
                            : maskKey(apiKey.key || 'svdr_hidden_xxxxxxxxxxxxxxxxxxxx'))}
                    </code>
                    {apiKey.status === 'active' && (
                      <>
                        <button
                          onClick={() => toggleReveal(apiKey.id)}
                          className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
                        >
                          {revealedKeys.has(apiKey.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => apiKey.key && copyToClipboard(apiKey.key)}
                          className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <div className="text-xs text-sipheron-text-muted">Last used</div>
                      <div className="text-sipheron-text-secondary">{formatLastUsed(apiKey.lastUsedAt)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {apiKey.status === 'active' ? (
                      <button
                        onClick={() => handleRevoke(apiKey.id)}
                        disabled={isRevoking === apiKey.id}
                        className="p-2 rounded-lg hover:bg-sipheron-red/10 text-sipheron-text-muted hover:text-sipheron-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRevoking === apiKey.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-sipheron-red px-2 py-1 rounded bg-sipheron-red/10 border border-sipheron-red/20">
                        Revoked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-sipheron-purple/5 border border-sipheron-purple/20">
        <h4 className="text-sm font-medium text-sipheron-text-primary mb-2">
          API Key Security
        </h4>
        <ul className="text-xs text-sipheron-text-secondary space-y-1 list-disc list-inside">
          <li>Never share your API keys in client-side code</li>
          <li>Use environment variables to store keys securely</li>
          <li>Rotate keys regularly for enhanced security</li>
          <li>Revoke compromised keys immediately</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiKeysPage;
