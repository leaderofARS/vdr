import React, { useState } from 'react';
import { Copy, Check, Shield, Clock, RefreshCw, AlertTriangle, Lock, Key, Terminal } from 'lucide-react';

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

const BearerAuthPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Bearer Token Authentication</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Comprehensive guide to JWT-based Bearer token authentication for the SipHeron VDR API. 
        Learn how to acquire, use, refresh, and securely manage authentication tokens for 
        programmatic access to document verification services.
      </p>

      {/* What are JWT Tokens */}
      <h2 id="what-is-jwt" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        What are JWT Tokens
      </h2>
      
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6">
        <Key className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-300 font-medium mb-1">JSON Web Tokens (JWT)</p>
          <p className="text-sm text-blue-400/80">
            Bearer tokens in SipHeron VDR are JWTs—compact, self-contained tokens that encode 
            user identity and permissions using industry-standard RS256 signing.
          </p>
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed mb-4">
        JWT tokens consist of three parts separated by dots: <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">header.payload.signature</code>. 
        The payload contains claims about the user and token metadata, while the signature 
        ensures the token hasn't been tampered with.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Token Structure
      </h3>
      <CodeBlock code={`# Example JWT Token (decoded)
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsInJvbGUiOiJhZG1pbiIsIm9yZ19pZCI6Im9yZ18xMjMifQ.SflKxwRJSMeKKF2QT4fwpMe...`} language="jwt" />

      <p className="text-gray-300 leading-relaxed mb-4">
        When decoded, the payload contains:
      </p>
      <CodeBlock code={`{
  "sub": "user_abc123",           // Subject (user ID)
  "name": "john@example.com",    // User identifier
  "iat": 1704067200,             // Issued at timestamp
  "exp": 1704153600,             // Expiration timestamp
  "role": "admin",               // User role
  "org_id": "org_xyz789",        // Organization ID
  "jti": "token_id_unique"       // JWT ID for revocation
}`} language="json" />

      {/* Token Lifecycle */}
      <h2 id="token-lifecycle" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Token Lifecycle
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
            <Key className="w-5 h-5 text-green-400" />
          </div>
          <h4 className="font-medium text-white text-sm mb-1">1. Acquire</h4>
          <p className="text-xs text-gray-400">Obtain token via login or API</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
            <Terminal className="w-5 h-5 text-blue-400" />
          </div>
          <h4 className="font-medium text-white text-sm mb-1">2. Use</h4>
          <p className="text-xs text-gray-400">Include in API request headers</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
            <RefreshCw className="w-5 h-5 text-yellow-400" />
          </div>
          <h4 className="font-medium text-white text-sm mb-1">3. Refresh</h4>
          <p className="text-xs text-gray-400">Exchange for new token before expiry</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-red-400" />
          </div>
          <h4 className="font-medium text-white text-sm mb-1">4. Revoke</h4>
          <p className="text-xs text-gray-400">Invalidate token when no longer needed</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Token Expiration
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Bearer tokens have a limited lifetime for security. SipHeron uses two token types:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Token Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Lifetime</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-white font-medium">Access Token</td>
              <td className="py-3 pr-4 text-purple-300">15 minutes</td>
              <td className="py-3 pr-4 text-gray-400">API requests</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-white font-medium">Refresh Token</td>
              <td className="py-3 pr-4 text-purple-300">7 days</td>
              <td className="py-3 pr-4 text-gray-400">Obtain new access tokens</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-white font-medium">Session Token</td>
              <td className="py-3 pr-4 text-purple-300">24 hours</td>
              <td className="py-3 pr-4 text-gray-400">CLI sessions</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Getting Tokens */}
      <h2 id="getting-tokens" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        How to Get Tokens
      </h2>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Via CLI Login
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        The CLI automatically handles token acquisition and storage when you log in:
      </p>
      <CodeBlock code={`# Interactive login (stores tokens securely)
sipheron-vdr auth login

# Login with credentials inline
sipheron-vdr auth login --email user@example.com --password YourPassword123

# Login and output token (for scripting)
sipheron-vdr auth login --email user@example.com --password YourPassword123 --json

# Expected JSON output:
# {
#   "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "expires_in": 900,
#   "token_type": "Bearer"
# }`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Via API
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        For programmatic access, exchange credentials directly for tokens:
      </p>
      <CodeBlock code={`# Exchange credentials for tokens
curl -X POST https://api.sipheron.io/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "password",
    "email": "user@example.com",
    "password": "YourPassword123",
    "client_id": "your_client_id"
  }'

# Response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "read write"
}`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Via Dashboard
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Generate tokens from the web dashboard for testing or temporary access:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6">
        <li>Navigate to <strong>Settings → API Access</strong></li>
        <li>Click <strong>Generate Bearer Token</strong></li>
        <li>Select token scope (read, write, or admin)</li>
        <li>Set expiration time (15 min to 24 hours)</li>
        <li>Copy the token (shown only once)</li>
      </ol>

      {/* Using Tokens */}
      <h2 id="using-tokens" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Using Tokens in API Requests
      </h2>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Authorization Header
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Include the token in the <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">Authorization</code> header 
        with the Bearer scheme:
      </p>
      <CodeBlock code={`# Basic API request with Bearer token
curl -X GET https://api.sipheron.io/v1/documents \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json"

# Anchor a document
curl -X POST https://api.sipheron.io/v1/anchors \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "file_hash": "sha256:abc123...",
    "metadata": {
      "name": "contract.pdf",
      "category": "legal"
    }
  }'`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        JavaScript/TypeScript Example
      </h3>
      <CodeBlock code={`// Using native fetch
const anchorDocument = async (fileHash: string, token: string) => {
  const response = await fetch('https://api.sipheron.io/v1/anchors', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file_hash: fileHash,
      metadata: { name: 'document.pdf' }
    })
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token expired or invalid');
    }
    throw new Error(\`API error: \${response.status}\`);
  }

  return response.json();
};

// Usage
const token = process.env.SIPHERON_ACCESS_TOKEN;
anchorDocument('sha256:abc123...', token)
  .then(result => console.log('Anchored:', result))
  .catch(err => console.error('Error:', err));`} language="typescript" />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Python Example
      </h3>
      <CodeBlock code={`import requests
from typing import Dict, Any

def anchor_document(file_hash: str, token: str) -> Dict[str, Any]:
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    
    payload = {
        'file_hash': file_hash,
        'metadata': {'name': 'document.pdf'}
    }
    
    response = requests.post(
        'https://api.sipheron.io/v1/anchors',
        headers=headers,
        json=payload
    )
    
    if response.status_code == 401:
        raise Exception('Token expired or invalid - refresh required')
    
    response.raise_for_status()
    return response.json()

# Usage
token = os.environ['SIPHERON_ACCESS_TOKEN']
result = anchor_document('sha256:abc123...', token)
print(f"Anchor created: {result['anchor_id']}")`} language="python" />

      {/* Refresh Flow */}
      <h2 id="refresh-flow" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Token Refresh Flow
      </h2>

      <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-6">
        <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-300 font-medium mb-1">Automatic vs Manual Refresh</p>
          <p className="text-sm text-yellow-400/80">
            The CLI handles automatic token refresh. For API integrations, implement 
            refresh logic before token expiry to avoid 401 errors.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Manual Token Refresh
      </h3>
      <CodeBlock code={`# Exchange refresh token for new access token
curl -X POST https://api.sipheron.io/v1/auth/refresh \\
  -H "Content-Type: application/json" \\
  -d '{
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "client_id": "your_client_id"
  }'

# Response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",  // New access token
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...", // New refresh token
  "token_type": "Bearer",
  "expires_in": 900
}`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Refresh Implementation Pattern
      </h3>
      <CodeBlock code={`class TokenManager {
  private accessToken: string;
  private refreshToken: string;
  private expiresAt: number;

  constructor(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = Date.now() + (expiresIn * 1000);
  }

  isTokenExpired(): boolean {
    // Refresh 60 seconds before actual expiry
    return Date.now() >= (this.expiresAt - 60000);
  }

  async getValidToken(): Promise<string> {
    if (this.isTokenExpired()) {
      await this.refresh();
    }
    return this.accessToken;
  }

  async refresh(): Promise<void> {
    const response = await fetch('https://api.sipheron.io/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed - re-authentication required');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.expiresAt = Date.now() + (data.expires_in * 1000);
    
    // Store new tokens securely
    this.saveTokens();
  }

  private saveTokens(): void {
    // Implement secure storage
  }
}`} language="typescript" />

      {/* Security Best Practices */}
      <h2 id="security-best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Security Best Practices
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <h4 className="font-medium text-green-300 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Do
          </h4>
          <ul className="space-y-2 text-sm text-green-400/80">
            <li>• Store tokens in environment variables</li>
            <li>• Use short-lived tokens (15 min access)</li>
            <li>• Implement automatic refresh logic</li>
            <li>• Use HTTPS for all API requests</li>
            <li>• Revoke tokens when no longer needed</li>
            <li>• Rotate refresh tokens regularly</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h4 className="font-medium text-red-300 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Don't
          </h4>
          <ul className="space-y-2 text-sm text-red-400/80">
            <li>• Hardcode tokens in source code</li>
            <li>• Commit tokens to version control</li>
            <li>• Share tokens between applications</li>
            <li>• Use tokens in client-side browser code</li>
            <li>• Ignore token expiration warnings</li>
            <li>• Store tokens in localStorage (use httpOnly cookies)</li>
          </ul>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Environment Variable Management
      </h3>
      <CodeBlock code={`# .env file (never commit this!)
SIPHERON_ACCESS_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
SIPHERON_REFRESH_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
SIPHERON_CLIENT_ID=your_client_id

# Load in your application
# Node.js
typeof process !== 'undefined' && process.env && require('dotenv').config();
const accessToken = process.env.SIPHERON_ACCESS_TOKEN;

# Python
from dotenv import load_dotenv
load_dotenv()
access_token = os.environ.get('SIPHERON_ACCESS_TOKEN')`} />

      {/* Revoking Tokens */}
      <h2 id="revoking-tokens" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Revoking Tokens
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Revoke tokens immediately if you suspect compromise or when an employee leaves:
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">
        Revoke via API
      </h3>
      <CodeBlock code={`# Revoke a specific token
curl -X POST https://api.sipheron.io/v1/auth/revoke \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type_hint": "access_token"
  }'

# Revoke all tokens for user (admin only)
curl -X POST https://api.sipheron.io/v1/auth/revoke-all \\
  -H "Authorization: Bearer admin_token..." \\
  -H "Content-Type: application/json" \\
  -d '{"user_id": "user_abc123"}'`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Revoke via CLI
      </h3>
      <CodeBlock code={`# Logout and revoke current session token
sipheron-vdr auth logout

# Revoke specific token
sipheron-vdr auth revoke --token eyJhbGci...

# Revoke all tokens (requires confirmation)
sipheron-vdr auth revoke --all`} />

      {/* Troubleshooting */}
      <h2 id="troubleshooting" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Troubleshooting Auth Errors
      </h2>

      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h3 className="font-semibold text-red-300 mb-2">401 Unauthorized - Token Expired</h3>
          <p className="text-sm text-gray-400 mb-3">
            The access token has expired. Use the refresh token to get a new one.
          </p>
          <CodeBlock code={`# Refresh the token
curl -X POST https://api.sipheron.io/v1/auth/refresh \\
  -H "Content-Type: application/json" \\
  -d '{"refresh_token": "your_refresh_token"}'`} />
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h3 className="font-semibold text-red-300 mb-2">401 Unauthorized - Invalid Token</h3>
          <p className="text-sm text-gray-400 mb-3">
            Token signature is invalid or token has been revoked.
          </p>
          <CodeBlock code={`# Re-authenticate to get new tokens
sipheron-vdr auth login

# Or via API
curl -X POST https://api.sipheron.io/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"grant_type": "password", "email": "...", "password": "..."}'`} />
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h3 className="font-semibold text-red-300 mb-2">403 Forbidden - Insufficient Scope</h3>
          <p className="text-sm text-gray-400 mb-3">
            The token doesn't have permission for the requested operation.
          </p>
          <CodeBlock code={`# Generate a new token with required scope
curl -X POST https://api.sipheron.io/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "password",
    "email": "user@example.com",
    "password": "...",
    "scope": "write admin"  # Request elevated permissions
  }'`} />
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h3 className="font-semibold text-red-300 mb-2">400 Bad Request - Malformed Header</h3>
          <p className="text-sm text-gray-400 mb-3">
            The Authorization header format is incorrect.
          </p>
          <CodeBlock code={`# Correct format
Authorization: Bearer <token>

# Common mistakes:
# ❌ Authorization: token <token>
# ❌ Authorization: bearer <token>  (lowercase)
# ❌ Authorization: Bearer:<token>  (colon instead of space)`} />
        </div>
      </div>

      {/* Quick Reference */}
      <h2 id="quick-reference" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Quick Reference
      </h2>

      <div className="overflow-x-auto mb-16">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Action</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">CLI Command</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">API Endpoint</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-white">Login/Get Token</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">auth login</td>
              <td className="py-3 pr-4 text-gray-400 font-mono">POST /v1/auth/token</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-white">Refresh Token</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">auth refresh</td>
              <td className="py-3 pr-4 text-gray-400 font-mono">POST /v1/auth/refresh</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-white">Logout/Revoke</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">auth logout</td>
              <td className="py-3 pr-4 text-gray-400 font-mono">POST /v1/auth/revoke</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-white">Check Token</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">auth whoami</td>
              <td className="py-3 pr-4 text-gray-400 font-mono">GET /v1/auth/verify</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BearerAuthPage;
