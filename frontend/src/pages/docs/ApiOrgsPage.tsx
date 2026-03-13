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

const ApiOrgsPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Organizations API</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Manage organization settings, members, usage quotas, and billing information. 
        These endpoints require admin permissions.
      </p>

      <h2 id="interfaces" className="text-2xl font-bold text-white mt-12 mb-4 scroll-mt-24">
        TypeScript Interfaces
      </h2>
      <CodeBlock code={`interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  settings: OrganizationSettings;
  quotas: OrganizationQuotas;
  created_at: string;
}

interface OrganizationSettings {
  default_network: 'devnet' | 'testnet' | 'mainnet';
  require_2fa: boolean;
  allowed_domains: string[];
  audit_log_retention_days: number;
}

interface OrganizationQuotas {
  max_hashes_per_month: number;
  max_api_keys: number;
  max_webhooks: number;
  max_team_members: number;
  rate_limit_per_minute: number;
}

interface OrganizationMember {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: string;
  last_active_at: string | null;
}`} language="typescript" />

      <h2 id="get-org" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Get Organization
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="GET" />
        <code className="text-purple-300 font-mono text-sm">/organizations/:id</code>
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
              <td className="py-3 pr-4 text-gray-400">Organization ID or slug</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock code={`curl -X GET https://api.sipheron.io/v1/organizations/org_acme_corp \\
  -H "Authorization: Bearer sk_live_admin_51HYs2jK8QJ4mP2v9..."`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "id": "org_acme_corp",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "description": "Blockchain verification solutions",
    "website": "https://acme.example.com",
    "plan": "professional",
    "status": "active",
    "settings": {
      "default_network": "mainnet",
      "require_2fa": true,
      "allowed_domains": ["acme.example.com"],
      "audit_log_retention_days": 365
    },
    "quotas": {
      "max_hashes_per_month": 10000,
      "max_api_keys": 50,
      "max_webhooks": 20,
      "max_team_members": 25,
      "rate_limit_per_minute": 1000
    },
    "created_at": "2023-06-15T10:30:00.000Z",
    "updated_at": "2024-01-10T14:20:00.000Z"
  }
}`} language="json" />

      <h2 id="update-org" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Update Organization
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="PATCH" />
        <code className="text-purple-300 font-mono text-sm">/organizations/:id</code>
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
              <td className="py-3 pr-4 text-gray-400">Organization display name</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">description</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Organization description</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">website</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Organization website URL</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">settings</td>
              <td className="py-3 pr-4 text-gray-300">object</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Organization settings (partial update)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock code={`curl -X PATCH https://api.sipheron.io/v1/organizations/org_acme_corp \\
  -H "Authorization: Bearer sk_live_admin_51HYs2jK8QJ4mP2v9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Acme Corporation Inc.",
    "description": "Enterprise blockchain verification",
    "settings": {
      "default_network": "mainnet",
      "require_2fa": true,
      "audit_log_retention_days": 730
    }
  }'`} />

      <h2 id="org-usage" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Get Organization Usage
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="GET" />
        <code className="text-purple-300 font-mono text-sm">/organizations/:id/usage</code>
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
              <td className="py-3 pr-4 text-purple-300 font-mono">period</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">current</td>
              <td className="py-3 pr-4 text-gray-400">current, previous, or YYYY-MM</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock code={`curl -X GET "https://api.sipheron.io/v1/organizations/org_acme_corp/usage?period=current" \\
  -H "Authorization: Bearer sk_live_admin_51HYs2jK8QJ4mP2v9..."`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "period": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-31T23:59:59Z",
      "label": "January 2024"
    },
    "usage": {
      "hashes_created": 7254,
      "hashes_verified": 15230,
      "api_requests": 45892,
      "storage_bytes_used": 536870912,
      "webhooks_delivered": 8947
    },
    "quotas": {
      "max_hashes_per_month": 10000,
      "max_api_keys": 50,
      "max_webhooks": 20,
      "max_team_members": 25,
      "rate_limit_per_minute": 1000
    },
    "percentages": {
      "hashes_created": 72.5,
      "storage_bytes_used": 50.0,
      "api_keys_used": 24.0,
      "webhooks_used": 45.0
    },
    "projected": {
      "hashes_created": 8950,
      "projected_over_limit": false
    }
  }
}`} language="json" />

      <h2 id="list-members" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        List Organization Members
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="GET" />
        <code className="text-purple-300 font-mono text-sm">/organizations/:id/members</code>
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
              <td className="py-3 pr-4 text-gray-500">50</td>
              <td className="py-3 pr-4 text-gray-400">Results per page</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">role</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">Filter by role</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock code={`curl -X GET "https://api.sipheron.io/v1/organizations/org_acme_corp/members?limit=50" \\
  -H "Authorization: Bearer sk_live_admin_51HYs2jK8QJ4mP2v9..."`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "items": [
      {
        "id": "mem_abc123",
        "user_id": "user_def456",
        "email": "alice@acme.example.com",
        "name": "Alice Johnson",
        "role": "owner",
        "joined_at": "2023-06-15T10:30:00.000Z",
        "last_active_at": "2024-01-15T08:45:00.000Z"
      },
      {
        "id": "mem_xyz789",
        "user_id": "user_ghi012",
        "email": "bob@acme.example.com",
        "name": "Bob Smith",
        "role": "admin",
        "joined_at": "2023-07-20T14:00:00.000Z",
        "last_active_at": "2024-01-14T16:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 50,
      "has_more": false
    }
  }
}`} language="json" />

      <h2 id="invite-member" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Invite Member
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="POST" />
        <code className="text-purple-300 font-mono text-sm">/organizations/:id/invites</code>
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
              <td className="py-3 pr-4 text-purple-300 font-mono">email</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">Email address of the invitee</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">role</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">Role: owner, admin, member, or viewer</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">message</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Custom message in invitation email</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">expires_in_days</td>
              <td className="py-3 pr-4 text-gray-300">number</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Days until invitation expires (default: 7)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock code={`curl -X POST https://api.sipheron.io/v1/organizations/org_acme_corp/invites \\
  -H "Authorization: Bearer sk_live_admin_51HYs2jK8QJ4mP2v9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "charlie@acme.example.com",
    "role": "member",
    "message": "Welcome to the team! Please join our SipHeron organization.",
    "expires_in_days": 7
  }'`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response (201 Created)</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "id": "inv_pqr567stu",
    "email": "charlie@acme.example.com",
    "role": "member",
    "status": "pending",
    "invite_url": "https://app.sipheron.io/invite/abc123xyz",
    "expires_at": "2024-01-22T09:30:00.000Z",
    "created_at": "2024-01-15T09:30:00.000Z",
    "created_by": "user_def456"
  }
}`} language="json" />

      <h2 id="quotas-limits" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Quotas and Limits by Plan
      </h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Feature</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Free</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Starter</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Professional</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Enterprise</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-gray-300">Hashes/Month</td>
              <td className="py-3 pr-4 text-gray-400">100</td>
              <td className="py-3 pr-4 text-gray-400">1,000</td>
              <td className="py-3 pr-4 text-gray-400">10,000</td>
              <td className="py-3 pr-4 text-gray-400">Unlimited</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">API Keys</td>
              <td className="py-3 pr-4 text-gray-400">2</td>
              <td className="py-3 pr-4 text-gray-400">10</td>
              <td className="py-3 pr-4 text-gray-400">50</td>
              <td className="py-3 pr-4 text-gray-400">Unlimited</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Webhooks</td>
              <td className="py-3 pr-4 text-gray-400">1</td>
              <td className="py-3 pr-4 text-gray-400">5</td>
              <td className="py-3 pr-4 text-gray-400">20</td>
              <td className="py-3 pr-4 text-gray-400">Unlimited</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Team Members</td>
              <td className="py-3 pr-4 text-gray-400">1</td>
              <td className="py-3 pr-4 text-gray-400">5</td>
              <td className="py-3 pr-4 text-gray-400">25</td>
              <td className="py-3 pr-4 text-gray-400">Unlimited</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Rate Limit (req/min)</td>
              <td className="py-3 pr-4 text-gray-400">60</td>
              <td className="py-3 pr-4 text-gray-400">300</td>
              <td className="py-3 pr-4 text-gray-400">1,000</td>
              <td className="py-3 pr-4 text-gray-400">5,000+</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Support</td>
              <td className="py-3 pr-4 text-gray-400">Community</td>
              <td className="py-3 pr-4 text-gray-400">Email</td>
              <td className="py-3 pr-4 text-gray-400">Priority</td>
              <td className="py-3 pr-4 text-gray-400">Dedicated</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="billing" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Billing Integration
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        The Organizations API integrates with Stripe for billing. Use these endpoints 
        to manage subscriptions and payment methods.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Billing Endpoints</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Method</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Endpoint</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4"><MethodBadge method="GET" /></td>
              <td className="py-3 pr-4 text-purple-300 font-mono">/organizations/:id/billing</td>
              <td className="py-3 pr-4 text-gray-400">Get billing details</td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><MethodBadge method="POST" /></td>
              <td className="py-3 pr-4 text-purple-300 font-mono">/organizations/:id/billing/portal</td>
              <td className="py-3 pr-4 text-gray-400">Get Stripe customer portal URL</td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><MethodBadge method="GET" /></td>
              <td className="py-3 pr-4 text-purple-300 font-mono">/organizations/:id/invoices</td>
              <td className="py-3 pr-4 text-gray-400">List invoices</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock code={`curl -X POST https://api.sipheron.io/v1/organizations/org_acme_corp/billing/portal \\
  -H "Authorization: Bearer sk_live_admin_51HYs2jK8QJ4mP2v9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "return_url": "https://app.sipheron.io/settings/billing"
  }'`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "portal_url": "https://billing.stripe.com/session/abc123xyz",
    "expires_at": "2024-01-15T09:35:00.000Z"
  }
}`} language="json" />

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
              <td className="py-3 pr-4 text-purple-300 font-mono">GET /organizations/:id</td>
              <td className="py-3 pr-4 text-gray-300">100</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">PATCH /organizations/:id</td>
              <td className="py-3 pr-4 text-gray-300">10</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">GET /organizations/:id/usage</td>
              <td className="py-3 pr-4 text-gray-300">60</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">POST /organizations/:id/invites</td>
              <td className="py-3 pr-4 text-gray-300">10</td>
              <td className="py-3 pr-4 text-gray-400">per hour</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiOrgsPage;
