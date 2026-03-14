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

const ApiHashesPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Hashes API</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Complete reference for document hash anchoring operations. Create, manage, and verify 
        document anchors on the Solana blockchain with our comprehensive hashes API.
      </p>

      {/* TypeScript Interfaces */}
      <h2 id="interfaces" className="text-2xl font-bold text-white mt-12 mb-4 scroll-mt-24">
        TypeScript Interfaces
      </h2>
      <CodeBlock code={`// Hash entity
interface Hash {
  id: string;
  hash: string;
  hash_type: 'sha256' | 'sha512' | 'blake3';
  note: string | null;
  network: 'devnet' | 'testnet' | 'mainnet';
  solana_tx: string;
  slot: number;
  block_time: number;
  status: 'pending' | 'confirmed' | 'finalized' | 'revoked';
  merkle_root: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  revoked_at: string | null;
  organization_id: string;
  created_by: string;
}

// Verification result
interface VerificationResult {
  verified: boolean;
  hash_match: boolean;
  on_chain_hash: string;
  provided_hash: string;
  network: string;
  slot: number;
  block_time: number;
  confirmations: number;
  status: string;
}`} language="typescript" />

      {/* POST /hashes */}
      <h2 id="create-hash" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Create Hash Anchor
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Create a new document hash anchor on the blockchain. This endpoint submits a transaction 
        to Solana anchoring your document hash permanently and immutably.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="POST" />
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/hashes</code>
      </div>

      <h3 id="request-body" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Request Body</h3>
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
              <td className="py-3 pr-4 text-purple-300 font-mono">hash</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">The document hash (64+ hex characters)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">hash_type</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">sha256, sha512, or blake3 (default: sha256)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">note</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Optional description (max 500 chars)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">network</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">devnet, testnet, or mainnet (default: devnet)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">metadata</td>
              <td className="py-3 pr-4 text-gray-300">object</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Custom key-value pairs (max 10 keys)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">webhook_url</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Callback URL for confirmation events</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="request-example" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Request Example</h3>
      <CodeBlock code={`curl -X POST https://api.sipheron.com/dashboard/api/v1/hashes \\
  -H "Authorization: Bearer sk_live_51HYs2jK8QJ4mP2v9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "hash_type": "sha256",
    "note": "Q4 2024 Financial Report - Confidential",
    "network": "mainnet",
    "metadata": {
      "department": "finance",
      "document_type": "report",
      "quarter": "Q4",
      "year": 2024
    },
    "webhook_url": "https://myapp.com/webhooks/hash-events"
  }'`} />

      <h3 id="response-201-created" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Response (201 Created)</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "id": "hash_2vN8mKpQr5StUvWxYzAbCdEfGhIjKlMnOp",
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "hash_type": "sha256",
    "note": "Q4 2024 Financial Report - Confidential",
    "network": "mainnet",
    "solana_tx": "5UfgJ5XKQv4LmN8pQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKl",
    "slot": 284715623,
    "block_time": 1705315200,
    "status": "pending",
    "merkle_root": null,
    "metadata": {
      "department": "finance",
      "document_type": "report",
      "quarter": "Q4",
      "year": 2024
    },
    "created_at": "2024-01-15T09:23:45.123Z",
    "updated_at": "2024-01-15T09:23:45.123Z",
    "organization_id": "org_abc123xyz",
    "created_by": "user_def456uvw"
  }
}`} language="json" />

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 my-6">
        <p className="text-blue-400 text-sm">
          <strong>Note:</strong> The hash status starts as "pending" and transitions to "confirmed" 
          once the Solana transaction is finalized (typically 12-30 seconds on mainnet).
        </p>
      </div>

      {/* GET /hashes */}
      <h2 id="list-hashes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        List Hashes
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Retrieve a paginated list of all hash anchors for your organization with support for 
        filtering, sorting, and cursor-based pagination.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="GET" />
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/hashes</code>
      </div>

      <h3 id="query-parameters" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Query Parameters</h3>
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
              <td className="py-3 pr-4 text-gray-400">Results per page (min: 1, max: 100)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">cursor</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">Pagination cursor from previous response</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">network</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">Filter by network (devnet, testnet, mainnet)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">status</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">Filter by status (pending, confirmed, finalized, revoked)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">hash_type</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">Filter by hash algorithm</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">created_after</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">ISO 8601 timestamp filter</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">created_before</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">ISO 8601 timestamp filter</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">search</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">-</td>
              <td className="py-3 pr-4 text-gray-400">Search in note and metadata values</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">sort_by</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">created_at</td>
              <td className="py-3 pr-4 text-gray-400">Sort field (created_at, updated_at, slot)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">sort_order</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">desc</td>
              <td className="py-3 pr-4 text-gray-400">Sort order (asc, desc)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="request-example" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Request Example</h3>
      <CodeBlock code={`curl -X GET "https://api.sipheron.com/dashboard/api/v1/hashes?limit=10&network=mainnet&status=confirmed&sort_by=created_at&sort_order=desc" \\
  -H "Authorization: Bearer sk_live_51HYs2jK8QJ4mP2v9..."`} />

      <h3 id="response" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "items": [
      {
        "id": "hash_2vN8mKpQr5StUvWxYzAbCdEfGhIjKlMnOp",
        "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "hash_type": "sha256",
        "note": "Q4 2024 Financial Report",
        "network": "mainnet",
        "status": "confirmed",
        "created_at": "2024-01-15T09:23:45.123Z"
      }
    ],
    "pagination": {
      "total": 1523,
      "limit": 10,
      "has_more": true,
      "next_cursor": "eyJpZCI6Imhhc2hfYWJjMTIzIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDEtMTVUMDk6MjM6NDUuMTIzWiJ9",
      "prev_cursor": null
    }
  }
}`} language="json" />

      {/* GET /hashes/:id */}
      <h2 id="get-hash" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Get Specific Hash
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Retrieve detailed information about a specific hash anchor by its ID.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="GET" />
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/hashes/:id</code>
      </div>

      <h3 id="url-parameters" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">URL Parameters</h3>
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
              <td className="py-3 pr-4 text-gray-400">The hash anchor ID</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="request-example" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Request Example</h3>
      <CodeBlock code={`curl -X GET https://api.sipheron.com/dashboard/api/v1/hashes/hash_2vN8mKpQr5StUvWxYzAbCdEfGhIjKlMnOp \\
  -H "Authorization: Bearer sk_live_51HYs2jK8QJ4mP2v9..."`} />

      <h3 id="response" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "id": "hash_2vN8mKpQr5StUvWxYzAbCdEfGhIjKlMnOp",
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "hash_type": "sha256",
    "note": "Q4 2024 Financial Report - Confidential",
    "network": "mainnet",
    "solana_tx": "5UfgJ5XKQv4LmN8pQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKl",
    "slot": 284715623,
    "block_time": 1705315200,
    "status": "finalized",
    "merkle_root": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    "metadata": {
      "department": "finance",
      "document_type": "report"
    },
    "created_at": "2024-01-15T09:23:45.123Z",
    "updated_at": "2024-01-15T09:24:12.456Z",
    "organization_id": "org_abc123xyz",
    "created_by": "user_def456uvw"
  }
}`} language="json" />

      {/* GET /hashes/:id/verify */}
      <h2 id="verify-hash" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Verify Hash
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Verify that a provided document hash matches the anchored hash on the blockchain. 
        This endpoint performs a cryptographic comparison without exposing the original document.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="GET" />
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/hashes/:id/verify</code>
      </div>

      <h3 id="url-parameters" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">URL Parameters</h3>
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
              <td className="py-3 pr-4 text-gray-400">The hash anchor ID</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="query-parameters" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Query Parameters</h3>
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
              <td className="py-3 pr-4 text-purple-300 font-mono">hash</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-yellow-400">Yes</td>
              <td className="py-3 pr-4 text-gray-400">The document hash to verify</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="request-example" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Request Example</h3>
      <CodeBlock code={`curl -X GET "https://api.sipheron.com/dashboard/api/v1/hashes/hash_2vN8mKpQr5StUvWxYzAbCdEfGhIjKlMnOp/verify?hash=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" \\
  -H "Authorization: Bearer sk_live_51HYs2jK8QJ4mP2v9..."`} />

      <h3 id="response" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "verified": true,
    "hash_match": true,
    "on_chain_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "provided_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "network": "mainnet",
    "slot": 284715623,
    "block_time": 1705315200,
    "confirmations": 32,
    "status": "finalized",
    "verified_at": "2024-01-15T10:15:30.789Z"
  }
}`} language="json" />

      {/* DELETE /hashes/:id */}
      <h2 id="revoke-hash" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Revoke Hash
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Revoke a hash anchor to mark it as no longer valid. The blockchain record remains 
        immutable, but the status is updated to "revoked" for compliance purposes.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <MethodBadge method="DELETE" />
        <code className="text-purple-300 font-mono text-sm">/dashboard/api/v1/hashes/:id</code>
      </div>

      <h3 id="url-parameters" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">URL Parameters</h3>
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
              <td className="py-3 pr-4 text-gray-400">The hash anchor ID to revoke</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="request-body" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Request Body</h3>
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
              <td className="py-3 pr-4 text-purple-300 font-mono">reason</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-500">No</td>
              <td className="py-3 pr-4 text-gray-400">Reason for revocation (audit trail)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="request-example" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Request Example</h3>
      <CodeBlock code={`curl -X DELETE https://api.sipheron.com/dashboard/api/v1/hashes/hash_2vN8mKpQr5StUvWxYzAbCdEfGhIjKlMnOp \\
  -H "Authorization: Bearer sk_live_51HYs2jK8QJ4mP2v9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "reason": "Document superseded by version 2.0"
  }'`} />

      <h3 id="response" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Response</h3>
      <CodeBlock code={`{
  "success": true,
  "data": {
    "id": "hash_2vN8mKpQr5StUvWxYzAbCdEfGhIjKlMnOp",
    "status": "revoked",
    "revoked_at": "2024-01-15T11:30:00.000Z",
    "revoked_by": "user_def456uvw",
    "reason": "Document superseded by version 2.0",
    "solana_tx": "7XghK9YLRv5NpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMn"
  }
}`} language="json" />

      {/* Webhook Events */}
      <h2 id="webhooks" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Webhook Events
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Subscribe to webhook events to receive real-time notifications about hash lifecycle changes.
      </p>

      <h3 id="available-events" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Available Events</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Event</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">hash.created</td>
              <td className="py-3 pr-4 text-gray-400">Triggered when a new hash anchor is created</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">hash.confirmed</td>
              <td className="py-3 pr-4 text-gray-400">Triggered when the transaction is confirmed</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">hash.finalized</td>
              <td className="py-3 pr-4 text-gray-400">Triggered when the transaction is finalized</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">hash.revoked</td>
              <td className="py-3 pr-4 text-gray-400">Triggered when a hash is revoked</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">hash.verified</td>
              <td className="py-3 pr-4 text-gray-400">Triggered when a hash is verified</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="webhook-payload-example" className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">Webhook Payload Example</h3>
      <CodeBlock code={`{
  "id": "evt_abc123xyz",
  "type": "hash.confirmed",
  "created_at": "2024-01-15T09:24:15.000Z",
  "data": {
    "hash_id": "hash_2vN8mKpQr5StUvWxYzAbCdEfGhIjKlMnOp",
    "organization_id": "org_abc123xyz",
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "network": "mainnet",
    "solana_tx": "5UfgJ5XKQv4LmN8pQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKl",
    "slot": 284715623,
    "status": "confirmed",
    "previous_status": "pending"
  }
}`} language="json" />

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
              <td className="py-3 pr-4 text-purple-300 font-mono">invalid_hash</td>
              <td className="py-3 pr-4 text-gray-400">Hash format is invalid</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">400</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">duplicate_hash</td>
              <td className="py-3 pr-4 text-gray-400">Hash already exists in organization</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">404</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">hash_not_found</td>
              <td className="py-3 pr-4 text-gray-400">Hash ID does not exist</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">409</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">already_revoked</td>
              <td className="py-3 pr-4 text-gray-400">Hash has already been revoked</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">422</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">network_unavailable</td>
              <td className="py-3 pr-4 text-gray-400">Selected network is temporarily unavailable</td>
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
              <td className="py-3 pr-4 text-purple-300 font-mono">POST /hashes</td>
              <td className="py-3 pr-4 text-gray-300">100</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">GET /hashes</td>
              <td className="py-3 pr-4 text-gray-300">500</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">GET /hashes/:id</td>
              <td className="py-3 pr-4 text-gray-300">1000</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">GET /hashes/:id/verify</td>
              <td className="py-3 pr-4 text-gray-300">1000</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">DELETE /hashes/:id</td>
              <td className="py-3 pr-4 text-gray-300">50</td>
              <td className="py-3 pr-4 text-gray-400">per minute</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiHashesPage;
