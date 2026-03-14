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

const ApiReferencePage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Complete reference for the SipHeron REST API. The base URL for all API requests is:
      </p>
      <CodeBlock code="https://api.sipheron.com/dashboard/api/v1" />

      <h2 id="authentication" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Authentication
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        All API requests must include an API key in the Authorization header. You can generate API keys
        from your dashboard under Settings → API Keys.
      </p>
      <CodeBlock code="Authorization: Bearer YOUR_API_KEY" />

      <h2 id="hashes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Hashes
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        The hashes endpoint allows you to create, retrieve, and verify document anchors.
      </p>

      <h3 id="create-hash" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Create Hash
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">POST</span>
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/hashes</code>
      </div>
      <p className="text-gray-300 leading-relaxed mb-4">
        Create a new hash anchor on the blockchain.
      </p>
      <CodeBlock code={`curl -X POST https://api.sipheron.com/dashboard/api/v1/hashes \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...",
    "note": "Contract with Client ABC",
    "network": "devnet"
  }'`} language="bash" />

      <h4 className="text-sm font-semibold text-white mt-6 mb-2">Request Body</h4>
      <div className="overflow-x-auto mb-8">
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
              <td className="py-3 pr-4 text-purple-300 font-mono">hash</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">The SHA-256 hash of the document</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">note</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Optional description or note</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">network</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">devnet, testnet, or mainnet (default: devnet)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 className="text-sm font-semibold text-white mt-6 mb-2">Response</h4>
      <CodeBlock code={`{
  "id": "hash_abc123",
  "hash": "0x7f83b165...",
  "note": "Contract with Client ABC",
  "network": "devnet",
  "solana_tx": "5UfgJ5X...",
  "slot": 284715623,
  "status": "confirmed",
  "created_at": "2024-01-15T09:23:45.123Z"
}`} language="json" />

      <h3 id="list-hashes" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        List Hashes
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/hashes</code>
      </div>
      <p className="text-gray-300 leading-relaxed mb-4">
        Retrieve a paginated list of all hashes for your organization.
      </p>
      <CodeBlock code={`curl https://api.sipheron.com/dashboard/api/v1/hashes \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h4 className="text-sm font-semibold text-white mt-6 mb-2">Query Parameters</h4>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Parameter</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">limit</td>
              <td className="py-3 pr-4 text-gray-300">number</td>
              <td className="py-3 pr-4 text-gray-400">Number of results per page (max: 100)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">cursor</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-400">Pagination cursor</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">network</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-400">Filter by network</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="verify-hash" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Verify Hash
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/hashes/:id/verify</code>
      </div>
      <p className="text-gray-300 leading-relaxed mb-4">
        Verify that a provided hash matches the anchored hash on the blockchain.
      </p>
      <CodeBlock code={`curl https://api.sipheron.com/dashboard/api/v1/hashes/hash_abc123/verify \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h2 id="api-keys" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        API Keys
      </h2>

      <h3 id="list-keys" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        List API Keys
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/keys</code>
      </div>
      <CodeBlock code={`curl https://api.sipheron.com/dashboard/api/v1/keys \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h3 id="create-key" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Create API Key
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">POST</span>
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/keys</code>
      </div>
      <CodeBlock code={`curl -X POST https://api.sipheron.com/dashboard/api/v1/keys \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Production API Key",
    "permissions": ["read", "write"]
  }'`} />

      <h2 id="organizations" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Organizations
      </h2>

      <h3 id="get-org" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Get Organization
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/organizations/:id</code>
      </div>
      <CodeBlock code={`curl https://api.sipheron.com/dashboard/api/v1/organizations/org_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h3 id="org-usage" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Get Usage
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/organizations/:id/usage</code>
      </div>
      <CodeBlock code={`curl https://api.sipheron.com/dashboard/api/v1/organizations/org_abc123/usage \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h2 id="webhooks" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Webhooks
      </h2>

      <h3 id="list-webhooks" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        List Webhooks
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/webhooks</code>
      </div>
      <CodeBlock code={`curl https://api.sipheron.com/dashboard/api/v1/webhooks \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h3 id="create-webhook" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Create Webhook
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">POST</span>
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/webhooks</code>
      </div>
      <CodeBlock code={`curl -X POST https://api.sipheron.com/dashboard/api/v1/webhooks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhooks/sipheron",
    "events": ["hash.created", "hash.verified"],
    "secret": "your_webhook_secret"
  }'`} />

      <h2 id="error-codes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Error Codes
      </h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Code</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">HTTP Status</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-red-400 font-mono">unauthorized</td>
              <td className="py-3 pr-4 text-gray-300">401</td>
              <td className="py-3 pr-4 text-gray-400">Invalid or missing API key</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400 font-mono">forbidden</td>
              <td className="py-3 pr-4 text-gray-300">403</td>
              <td className="py-3 pr-4 text-gray-400">Insufficient permissions</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400 font-mono">not_found</td>
              <td className="py-3 pr-4 text-gray-300">404</td>
              <td className="py-3 pr-4 text-gray-400">Resource not found</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400 font-mono">rate_limited</td>
              <td className="py-3 pr-4 text-gray-300">429</td>
              <td className="py-3 pr-4 text-gray-400">Too many requests</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400 font-mono">invalid_request</td>
              <td className="py-3 pr-4 text-gray-300">400</td>
              <td className="py-3 pr-4 text-gray-400">Invalid request parameters</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="rate-limits" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Rate Limits
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        API requests are rate-limited based on your plan. Rate limit headers are included in all responses:
      </p>
      <CodeBlock code={`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200`} />
    </div>
  );
};

export default ApiReferencePage;
