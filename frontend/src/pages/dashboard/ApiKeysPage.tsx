import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Copy, Trash2, Key } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  scope: 'read' | 'write' | 'admin';
  createdAt: string;
  lastUsed: string;
  usageCount: number;
  status: 'active' | 'revoked';
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API',
    key: 'svdr_live_51H8mPqRsTuVwXyZ123456789',
    scope: 'write',
    createdAt: '2025-01-01',
    lastUsed: '2 minutes ago',
    usageCount: 1247,
    status: 'active',
  },
  {
    id: '2',
    name: 'Development API',
    key: 'svdr_test_7zP2rStUvWxYzAb345678901',
    scope: 'write',
    createdAt: '2025-01-05',
    lastUsed: '1 hour ago',
    usageCount: 384,
    status: 'active',
  },
  {
    id: '3',
    name: 'Read-only Monitoring',
    key: 'svdr_read_9xT4vUwXyZaBcDe567890123',
    scope: 'read',
    createdAt: '2025-01-10',
    lastUsed: '3 hours ago',
    usageCount: 892,
    status: 'active',
  },
];

const scopeColors: Record<string, string> = {
  read: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  write: 'bg-sipheron-purple/10 text-sipheron-purple border-sipheron-purple/20',
  admin: 'bg-sipheron-red/10 text-sipheron-red border-sipheron-red/20',
};

export const ApiKeysPage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>(mockApiKeys);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState<'read' | 'write' | 'admin'>('write');

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

  const handleCreate = () => {
    if (!newKeyName) return;
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `svdr_${newKeyScope}_${Math.random().toString(36).substring(2, 30)}`,
      scope: newKeyScope,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      usageCount: 0,
      status: 'active',
    };
    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setIsCreateOpen(false);
  };

  const handleRevoke = (id: string) => {
    setKeys(keys.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)));
  };

  return (
    <div className="space-y-6">
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
                disabled={!newKeyName}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Key
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {keys.map((apiKey) => (
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
                      Created {apiKey.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key */}
              <div className="flex items-center gap-2">
                <code className="px-3 py-1.5 rounded-lg bg-sipheron-base font-mono text-xs text-sipheron-teal">
                  {revealedKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                </code>
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
                <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <div className="text-xs text-sipheron-text-muted">Last used</div>
                  <div className="text-sipheron-text-secondary">{apiKey.lastUsed}</div>
                </div>
                <div>
                  <div className="text-xs text-sipheron-text-muted">Usage</div>
                  <div className="text-sipheron-text-secondary">{apiKey.usageCount.toLocaleString()}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {apiKey.status === 'active' ? (
                  <button
                    onClick={() => handleRevoke(apiKey.id)}
                    className="p-2 rounded-lg hover:bg-sipheron-red/10 text-sipheron-text-muted hover:text-sipheron-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs text-sipheron-red px-2 py-1 rounded bg-sipheron-red/10 border border-sipheron-red/20">
                    Revoked
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
