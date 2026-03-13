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

const ApiAuthPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">API Authentication</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Secure your API requests with Bearer token authentication. SipHeron VDR supports 
        multiple authentication methods to ensure your document anchors remain protected.
      </p>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 mb-12">
        <h3 className="text-lg font-semibold text-white mb-2">Base URL</h3>
        <CodeBlock code="https://api.sipheron.io/v1" />
      </div>

      {/* Bearer Token Authentication */}
      <h2 id="bearer-auth" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Bearer Token Authentication
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        The primary authentication method for all API requests. Include your API key in the 
        Authorization header using the Bearer scheme. API keys are generated from your dashboard 
        under Settings → API Keys.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Header Format</h3>
      <CodeBlock code="Authorization: Bearer {YOUR_API_KEY}" />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Example Request</h3>
      <CodeBlock code={`curl -X GET https://api.sipheron.io/v1/hashes \\
  -H "Authorization: Bearer {'{token}'}" \\
  -H "Content-Type: application/json"`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">TypeScript Interface</h3>
      <CodeBlock code={`interface AuthHeaders {
  'Authorization': string;  // Bearer {token}
  'Content-Type': 'application/json';
  'X-API-Version': 'v1';
}

// Example usage
const headers: AuthHeaders = {
  'Authorization': 'Bearer sk_live_51HYs2jK8QJ4mP2v9...',
  'Content-Type': 'application/json',
  'X-API-Version': 'v1',
};`} language="typescript" />

      {/* API Key Authentication */}
      <h2 id="api-key-auth" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        API Key Authentication
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Alternative authentication method using the X-API-Key header. This method is useful 
        for legacy integrations and services that have difficulty with Bearer tokens.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Header Format</h3>
      <CodeBlock code="X-API-Key: {YOUR_API_KEY}" />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Example Request</h3>
      <CodeBlock code={`curl -X GET https://api.sipheron.io/v1/hashes \\
  -H "X-API-Key: {'{your_api_key}'}" \\
  -H "Content-Type: application/json"`} />

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 my-6">
        <p className="text-yellow-400 text-sm">
          <strong>Note:</strong> Bearer token authentication is recommended for all new integrations. 
          X-API-Key method may be deprecated in future API versions.
        </p>
      </div>

      {/* Token Refresh */}
      <h2 id="token-refresh" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Token Refresh
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Refresh your authentication token before it expires. This endpoint returns a new 
        access token while invalidating the previous one.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="POST" />
        <code className="text-purple-300 font-mono text-sm">/auth/refresh</code>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Request Headers</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Header</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Required</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Authorization</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">Bearer {'{your_token}'}</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">X-Refresh-Token</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">Refresh token from initial auth</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Request Example</h3>
      <CodeBlock code={`curl -X POST https://api.sipheron.io/v1/auth/refresh \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "X-Refresh-Token: rt_abc123xyz789..." \\
  -H "Content-Type: application/json"`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "rt_new456uvw012...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "expires_at": "2024-01-15T10:23:45Z"
  }
}`} language="json" />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response Fields</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Field</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">access_token</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-400">New JWT access token</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">refresh_token</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-400">New refresh token for subsequent refreshes</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">token_type</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-400">Always "Bearer"</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">expires_in</td>
              <td className="py-3 pr-4 text-gray-300">number</td>
              <td className="py-3 pr-4 text-gray-400">Token lifetime in seconds</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">expires_at</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-400">ISO 8601 expiration timestamp</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Revoke Token */}
      <h2 id="revoke-token" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Revoke Token
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Immediately invalidate an access token or refresh token. Use this endpoint when 
        a token is compromised or when a user logs out.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="POST" />
        <code className="text-purple-300 font-mono text-sm">/auth/revoke</code>
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
              <td className="py-3 pr-4 text-purple-300 font-mono">token</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">The token to revoke</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">token_type_hint</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">"access_token" or "refresh_token"</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Request Example</h3>
      <CodeBlock code={`curl -X POST https://api.sipheron.io/v1/auth/revoke \\
  -H "Authorization: Bearer sk_live_51HYs2jK8QJ4mP2v9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type_hint": "access_token"
  }'`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "revoked": true,
    "revoked_at": "2024-01-15T09:30:00Z"
  }
}`} language="json" />

      {/* Auth Error Responses */}
      <h2 id="auth-errors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Authentication Error Responses
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Common authentication errors and their resolutions.
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">HTTP Status</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Error Code</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Resolution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-red-400">401</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">unauthorized</td>
              <td className="py-3 pr-4 text-gray-400">Invalid or missing API key</td>
              <td className="py-3 pr-4 text-gray-400">Check your API key and Authorization header format</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">401</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">token_expired</td>
              <td className="py-3 pr-4 text-gray-400">Access token has expired</td>
              <td className="py-3 pr-4 text-gray-400">Use /auth/refresh to obtain a new token</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">401</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">token_revoked</td>
              <td className="py-3 pr-4 text-gray-400">Token has been revoked</td>
              <td className="py-3 pr-4 text-gray-400">Generate a new API key from the dashboard</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">403</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">forbidden</td>
              <td className="py-3 pr-4 text-gray-400">Insufficient permissions</td>
              <td className="py-3 pr-4 text-gray-400">Check API key permissions in dashboard</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">429</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">rate_limited</td>
              <td className="py-3 pr-4 text-gray-400">Too many auth attempts</td>
              <td className="py-3 pr-4 text-gray-400">Wait and retry with exponential backoff</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Error Response Example</h3>
      <CodeBlock code={`{
  "success": false,
  "error": {
    "code": "token_expired",
    "message": "The access token has expired",
    "details": {
      "expired_at": "2024-01-15T09:23:45Z",
      "suggestion": "Use POST /auth/refresh to obtain a new token"
    }
  }
}`} language="json" />

      {/* Postman Collection */}
      <h2 id="postman" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Postman Collection
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Import this collection to quickly test all authentication endpoints in Postman.
      </p>

      <CodeBlock code={`{
  "info": {
    "name": "SipHeron VDR - Authentication",
    "description": "Authentication endpoints for SipHeron VDR API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Refresh Token",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          },
          {
            "key": "X-Refresh-Token",
            "value": "{{refresh_token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/auth/refresh",
          "host": ["{{base_url}}"],
          "path": ["auth", "refresh"]
        }
      }
    },
    {
      "name": "Revoke Token",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\\"token\\": \\"{{token_to_revoke}}\\", \\"token_type_hint\\": \\"access_token\\"}"
        },
        "url": {
          "raw": "{{base_url}}/auth/revoke",
          "host": ["{{base_url}}"],
          "path": ["auth", "revoke"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://api.sipheron.io/v1"
    },
    {
      "key": "access_token",
      "value": "your_access_token_here"
    },
    {
      "key": "refresh_token",
      "value": "your_refresh_token_here"
    }
  ]
}`} language="json" />

      {/* Rate Limiting */}
      <h2 id="rate-limits" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Authentication Rate Limits
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Authentication endpoints have specific rate limits to prevent abuse.
      </p>

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
              <td className="py-3 pr-4 text-purple-300 font-mono">POST /auth/refresh</td>
              <td className="py-3 pr-4 text-gray-300">10</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">POST /auth/revoke</td>
              <td className="py-3 pr-4 text-gray-300">20</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">All authenticated requests</td>
              <td className="py-3 pr-4 text-gray-300">1000</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Rate Limit Headers</h3>
        <p className="text-gray-400 text-sm mb-4">All responses include rate limit information:</p>
        <CodeBlock code={`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705315200
X-RateLimit-Retry-After: 60`} />
      </div>
    </div>
  );
};

export default ApiAuthPage;
