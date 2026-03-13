import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border border-[#2A2A2A] rounded-t-lg">
        <span className="text-xs text-[#555]">{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-[#555] hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-[#0D0D0D] border-x border-b border-[#2A2A2A] rounded-b-lg p-4 overflow-x-auto">
        <code className="text-sm font-mono text-[#EDEDED]">{code}</code>
      </pre>
    </div>
  );
};

const MethodBadge: React.FC<{ method: string }> = ({ method }) => {
  const colors: Record<string, string> = {
    GET: 'bg-blue-500/20 text-blue-400',
    POST: 'bg-green-500/20 text-green-400',
    PUT: 'bg-yellow-500/20 text-yellow-400',
    PATCH: 'bg-yellow-500/20 text-yellow-400',
    DELETE: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`px-2 py-1 ${colors[method] || 'bg-gray-500/20 text-gray-400'} text-xs font-mono rounded`}>
      {method}
    </span>
  );
};

const ApiKeysPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">API Keys Management</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Manage API keys for programmatic access to the SipHeron VDR platform. Create, update, 
        and revoke keys with granular permission controls.
      </p>

      {/* Permissions System */}
      <h2 id="permissions" className="text-2xl font-bold text-white mt-12 mb-4 scroll-mt-24">
        Permissions System
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        API keys use a scope-based permission system. Each key can have one or more scopes 
        that determine what actions it can perform.
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Scope</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Access</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">read:hashes</td>
              <td className="py-3 pr-4 text-gray-300">Read-only</td>
              <td className="py-3 pr-4 text-gray-400">List and retrieve hash anchors</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">write:hashes</td>
              <td className="py-3 pr-4 text-gray-300">Read + Write</td>
              <td className="py-3 pr-4 text-gray-400">Create and revoke hash anchors</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">read:keys</td>
              <td className="py-3 pr-4 text-gray-300">Read-only</td>
              <td className="py-3 pr-4 text-gray-400">List and view API keys</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">write:keys</td>
              <td className="py-3 pr-4 text-gray-300">Read + Write</td>
              <td className="py-3 pr-4 text-gray-400">Create, update, and revoke API keys</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">read:webhooks</td>
              <td className="py-3 pr-4 text-gray-300">Read-only</td>
              <td className="py-3 pr-4 text-gray-400">View webhook configurations</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">write:webhooks</td>
              <td className="py-3 pr-4 text-gray-300">Read + Write</td>
              <td className="py-3 pr-4 text-gray-400">Create and manage webhooks</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">read:usage</td>
              <td className="py-3 pr-4 text-gray-300">Read-only</td>
              <td className="py-3 pr-4 text-gray-400">Access usage and analytics data</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">admin</td>
              <td className="py-3 pr-4 text-gray-300">Full Access</td>
              <td className="py-3 pr-4 text-gray-400">All permissions including organization management</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">TypeScript Interfaces</h3>
      <CodeBlock code={`// API Key entity
interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;        // First 8 chars of the key (e.g., "sk_live_")
  permissions: Permission[];
  status: 'active' | 'revoked' | 'expired';
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
  created_by: string;
  revoked_at: string | null;
  revoked_by: string | null;
  ip_restrictions: string[]; // Allowed IP addresses/CIDR ranges
  rate_limit_override: number | null;
}

type Permission = 
  | 'read:hashes' 
  | 'write:hashes' 
  | 'read:keys' 
  | 'write:keys'
  | 'read:webhooks' 
  | 'write:webhooks'
  | 'read:usage'
  | 'admin';`} language="typescript" />

      {/* POST /keys */}
      <h2 id="create-key" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Create API Key
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Generate a new API key with specified permissions. The full key is only returned 
        once during creation - store it securely.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="POST" />
        <code className="text-purple-300 font-mono text-sm">/keys</code>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Request Body</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Field</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Required</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">name</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">Descriptive name for the key</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">permissions</td>
              <td className="py-3 pr-4 text-gray-300">string[]</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">Array of permission scopes</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">expires_in_days</td>
              <td className="py-3 pr-4 text-gray-300">number</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Days until expiration (null = never)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">ip_restrictions</td>
              <td className="py-3 pr-4 text-gray-300">string[]</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Allowed IP addresses or CIDR ranges</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">rate_limit</td>
              <td className="py-3 pr-4 text-gray-300">number</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Custom rate limit (requests/min)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Request Example</h3>
      <CodeBlock code={`curl -X POST https://api.sipheron.io/v1/keys \\
  -H "Authorization: Bearer {your_admin_key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Production Server - Hash Creation",
    "permissions": ["read:hashes", "write:hashes", "read:usage"],
    "expires_in_days": 90,
    "ip_restrictions": ["192.168.1.0/24", "10.0.0.5"],
    "rate_limit": 500
  }'`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response (201 Created)</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "id": "key_abc123xyz789",
    "name": "Production Server - Hash Creation",
    "key": "{your_full_api_key_here}",
    "key_prefix": "sk_live_51",
    "permissions": ["read:hashes", "write:hashes", "read:usage"],
    "status": "active",
    "expires_at": "2024-04-14T09:23:45.000Z",
    "ip_restrictions": ["192.168.1.0/24", "10.0.0.5"],
    "rate_limit_override": 500,
    "created_at": "2024-01-15T09:23:45.123Z",
    "created_by": "user_def456uvw",
    "warning": "This key will only be shown once. Store it securely."
  }
}`} language="json" />

      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 my-6">
        <p className="text-red-400 text-sm">
          <strong>Important:</strong> The full API key is only returned once during creation. 
          If you lose it, you must revoke the key and create a new one.
        </p>
      </div>

      {/* GET /keys */}
      <h2 id="list-keys" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        List API Keys
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Retrieve all API keys for your organization. For security, only the key prefix 
        is returned, never the full key.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="GET" />
        <code className="text-purple-300 font-mono text-sm">/keys</code>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Query Parameters</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Parameter</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Default</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">limit</td>
              <td className="py-3 pr-4 text-gray-300">number</td>
              <td className="py-3 pr-4 text-gray-500">20</td>
              <td className="py-3 pr-4 text-gray-400">Results per page (max: 100)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">cursor</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">Pagination cursor</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">status</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">Filter by status (active, revoked, expired)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">sort_by</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">created_at</td>
              <td className="py-3 pr-4 text-gray-400">Sort field</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Request Example</h3>
      <CodeBlock code={`curl -X GET "https://api.sipheron.io/v1/keys?status=active&limit=50" \\
  -H "Authorization: Bearer {your_admin_key}"`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "items": [
      {
        "id": "key_abc123xyz789",
        "name": "Production Server - Hash Creation",
        "key_prefix": "sk_live_51",
        "permissions": ["read:hashes", "write:hashes", "read:usage"],
        "status": "active",
        "last_used_at": "2024-01-15T14:30:00.000Z",
        "expires_at": "2024-04-14T09:23:45.000Z",
        "created_at": "2024-01-15T09:23:45.123Z",
        "created_by": "user_def456uvw",
        "ip_restrictions": ["192.168.1.0/24"]
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 50,
      "has_more": false,
      "next_cursor": null
    }
  }
}`} language="json" />

      {/* GET /keys/:id */}
      <h2 id="get-key" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Get Key Details
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Retrieve detailed information about a specific API key, including usage statistics.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="GET" />
        <code className="text-purple-300 font-mono text-sm">/keys/:id</code>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">URL Parameters</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Parameter</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Required</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">id</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">The API key ID</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "id": "key_abc123xyz789",
    "name": "Production Server - Hash Creation",
    "key_prefix": "sk_live_51",
    "permissions": ["read:hashes", "write:hashes", "read:usage"],
    "status": "active",
    "last_used_at": "2024-01-15T14:30:00.000Z",
    "expires_at": "2024-04-14T09:23:45.000Z",
    "ip_restrictions": ["192.168.1.0/24", "10.0.0.5"],
    "rate_limit_override": 500,
    "created_at": "2024-01-15T09:23:45.123Z",
    "created_by": "user_def456uvw",
    "usage_stats": {
      "total_requests_24h": 1247,
      "total_requests_7d": 8934,
      "rate_limit_hits": 0
    }
  }
}`} language="json" />

      {/* PATCH /keys/:id */}
      <h2 id="update-key" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Update Key Permissions
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Modify an existing API key's permissions, name, or restrictions. Cannot update 
        a revoked or expired key.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="PATCH" />
        <code className="text-purple-300 font-mono text-sm">/keys/:id</code>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">URL Parameters</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Parameter</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Required</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">id</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">The API key ID to update</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Request Body</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Field</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Required</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">name</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">New name for the key</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">permissions</td>
              <td className="py-3 pr-4 text-gray-300">string[]</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">New permission scopes (replaces existing)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">ip_restrictions</td>
              <td className="py-3 pr-4 text-gray-300">string[]</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">New IP restrictions</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">rate_limit</td>
              <td className="py-3 pr-4 text-gray-300">number</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">New rate limit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Request Example</h3>
      <CodeBlock code={`curl -X PATCH https://api.sipheron.io/v1/keys/key_abc123xyz789 \\
  -H "Authorization: Bearer {your_admin_key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Production Server - Full Access",
    "permissions": ["read:hashes", "write:hashes", "read:webhooks", "write:webhooks", "read:usage"],
    "ip_restrictions": ["192.168.1.0/24", "10.0.0.5", "10.0.0.6"],
    "rate_limit": 1000
  }'`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "id": "key_abc123xyz789",
    "name": "Production Server - Full Access",
    "key_prefix": "sk_live_51",
    "permissions": ["read:hashes", "write:hashes", "read:webhooks", "write:webhooks", "read:usage"],
    "status": "active",
    "ip_restrictions": ["192.168.1.0/24", "10.0.0.5", "10.0.0.6"],
    "rate_limit_override": 1000,
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}`} language="json" />

      {/* DELETE /keys/:id */}
      <h2 id="revoke-key" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Revoke API Key
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Immediately revoke an API key. Revoked keys cannot be reactivated and will return 
        401 Unauthorized on all requests.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="DELETE" />
        <code className="text-purple-300 font-mono text-sm">/keys/:id</code>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Request Example</h3>
      <CodeBlock code={`curl -X DELETE https://api.sipheron.io/v1/keys/key_abc123xyz789 \\
  -H "Authorization: Bearer {your_admin_key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "reason": "Key compromised - rotating credentials"
  }'`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "id": "key_abc123xyz789",
    "status": "revoked",
    "revoked_at": "2024-01-15T11:00:00.000Z",
    "revoked_by": "user_def456uvw",
    "reason": "Key compromised - rotating credentials"
  }
}`} language="json" />

      {/* Key Rotation Workflow */}
      <h2 id="key-rotation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Key Rotation Workflow
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Follow this workflow to securely rotate API keys without service interruption.
      </p>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Step-by-Step Rotation</h3>
        <ol className="space-y-4 text-gray-300 text-sm">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <span>Create new API key with same permissions: <code className="text-purple-300">POST /keys</code></span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <span>Update your application configuration with the new key</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <span>Deploy the updated configuration to all services</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <span>Verify new key is working (check usage stats via <code className="text-purple-300">GET /keys/:id</code>)</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">5</span>
            <span>Revoke the old key: <code className="text-purple-300">DELETE /keys/:old_id</code></span>
          </li>
        </ol>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Automated Rotation Script</h3>
      <CodeBlock code={`#!/bin/bash
# API Key Rotation Script

OLD_KEY_ID="key_abc123xyz789"
ADMIN_KEY="{your_admin_key_here}"

# Step 1: Create new key
echo "Creating new API key..."
NEW_KEY_RESPONSE=$(curl -s -X POST https://api.sipheron.io/v1/keys \\
  -H "Authorization: Bearer $ADMIN_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Production Key - Rotated",
    "permissions": ["read:hashes", "write:hashes"]
  }')

NEW_KEY=$(echo $NEW_KEY_RESPONSE | jq -r '.data.key')
NEW_KEY_ID=$(echo $NEW_KEY_RESPONSE | jq -r '.data.id')

echo "New key created: $NEW_KEY_ID"
echo "Update your .env file with: API_KEY=$NEW_KEY"

# After deployment, revoke old key
echo "Revoking old key: $OLD_KEY_ID"
curl -X DELETE https://api.sipheron.io/v1/keys/$OLD_KEY_ID \\
  -H "Authorization: Bearer $ADMIN_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"reason": "Scheduled rotation"}'

echo "Rotation complete!"`} language="bash" />

      {/* Error Responses */}
      <h2 id="errors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Error Responses
      </h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">HTTP</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Code</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-red-400">400</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">invalid_permissions</td>
              <td className="py-3 pr-4 text-gray-400">Invalid or empty permissions array</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">403</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">insufficient_permissions</td>
              <td className="py-3 pr-4 text-gray-400">Cannot create key with more permissions than yours</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">404</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">key_not_found</td>
              <td className="py-3 pr-4 text-gray-400">API key ID does not exist</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">409</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">key_already_revoked</td>
              <td className="py-3 pr-4 text-gray-400">Key has already been revoked</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">422</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">key_limit_reached</td>
              <td className="py-3 pr-4 text-gray-400">Maximum number of keys reached for organization</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rate Limits */}
      <h2 id="rate-limits" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Rate Limits
      </h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Endpoint</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Limit</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Window</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">POST /keys</td>
              <td className="py-3 pr-4 text-gray-300">10</td>
              <td className="py-3 pr-4 text-gray-400">per hour</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">GET /keys</td>
              <td className="py-3 pr-4 text-gray-300">100</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">GET /keys/:id</td>
              <td className="py-3 pr-4 text-gray-300">100</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">PATCH /keys/:id</td>
              <td className="py-3 pr-4 text-gray-300">20</td>
              <td className="py-3 pr-4 text-gray-400">per hour</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">DELETE /keys/:id</td>
              <td className="py-3 pr-4 text-gray-300">10</td>
              <td className="py-3 pr-4 text-gray-400">per hour</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiKeysPage;
