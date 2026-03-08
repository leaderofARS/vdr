import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'API Endpoints Reference | SipHeron VDR',
    description: 'Detailed documentation for all SipHeron VDR API endpoints, including registration, verification, and revocation.',
};

export default function EndpointsPage() {
    return (
        <>
            <h1>API Endpoints Reference</h1>
            <p className="lead text-xl text-gray-300">
                This reference provides exhaustive documentation for every public endpoint available in the SipHeron VDR API. Use these endpoints to automate document lifecycle management within your enterprise systems.
            </p>

            <Callout type="info">
                <strong>Authentication Required:</strong> All endpoints documented below require a valid <code>Authorization: Bearer &lt;key&gt;</code> header. Replace <code>sh_live_...</code> in examples with your actual organizational API key.
            </Callout>

            <h2 id="register-hash">Register a Document Hash</h2>
            <p>
                The primary endpoint for anchoring a document to the Solana blockchain. You must provide the SHA-256 hash of your document.
            </p>
            <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-green-900/40 text-green-400 text-xs font-bold rounded">POST</span>
                <code className="text-sm">/v1/registrations</code>
            </div>

            <h3>Request Body</h3>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Field</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Type</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">hash</td>
                            <td className="py-3 px-4 text-sm text-gray-400">string</td>
                            <td className="py-3 px-4 text-sm text-gray-400">The SHA-256 hash of the document (64 hex chars).</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">metadata</td>
                            <td className="py-3 px-4 text-sm text-gray-400">object</td>
                            <td className="py-3 px-4 text-sm text-gray-400">(Optional) Key-value pairs to store with the registration.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <CodeBlock
                language="bash"
                code={`curl -X POST https://api.sipheron.com/v1/registrations \\
  -H "Authorization: Bearer sh_live_...." \\
  -H "Content-Type: application/json" \\
  -d '{
    "hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    "metadata": {
      "filename": "q4_audit_report.pdf",
      "department": "Compliance"
    }
  }'`}
            />

            <h3>Response Schema</h3>
            <CodeBlock
                language="json"
                code={`{
  "id": "reg_8821903",
  "hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
  "status": "pending",
  "transaction_signature": "5mKz...",
  "created_at": "2024-03-08T12:00:00Z"
}`}
            />

            <h2 id="verify-hash">Verify a Document Hash</h2>
            <p>
                Check the current on-chain status of a specific document hash. This endpoint returns the registration details and verification status.
            </p>
            <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-900/40 text-blue-400 text-xs font-bold rounded">GET</span>
                <code className="text-sm">/v1/verifications/:hash</code>
            </div>

            <CodeBlock
                language="bash"
                code={`curl https://api.sipheron.com/v1/verifications/8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92 \\
  -H "Authorization: Bearer sh_live_...."`}
            />

            <h3>Response Schema</h3>
            <CodeBlock
                language="json"
                code={`{
  "is_authentic": true,
  "registration": {
    "issuer_public_key": "6ecWPU...",
    "anchored_at": "2024-03-08T12:05:00Z",
    "status": "active",
    "solana_explorer_url": "https://solscan.io/tx/..."
  }
}`}
            />

            <h2 id="revoke-hash">Revoke a Document</h2>
            <p>
                Mark an existing registration as revoked. This requires an on-chain transaction and consumes registration credits.
            </p>
            <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-red-900/40 text-red-400 text-xs font-bold rounded">POST</span>
                <code className="text-sm">/v1/registrations/:id/revoke</code>
            </div>

            <CodeBlock
                language="bash"
                code={`curl -X POST https://api.sipheron.com/v1/registrations/reg_8821903/revoke \\
  -H "Authorization: Bearer sh_live_...." \\
  -H "Content-Type: application/json" \\
  -d '{"reason": "Document superseded by v2.0"}'`}
            />

            <h2 id="list-registrations">List All Registrations</h2>
            <p>
                Retrieve a paginated list of all document registrations for your organization.
            </p>
            <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-900/40 text-blue-400 text-xs font-bold rounded">GET</span>
                <code className="text-sm">/v1/registrations</code>
            </div>

            <h3>Query Parameters</h3>
            <ul className="list-disc ml-6 my-4 space-y-2 text-sm text-gray-400">
                <li><code>limit</code>: Max results per page (Default: 20, Max: 100).</li>
                <li><code>status</code>: Filter by status (<code>pending</code>, <code>anchored</code>, <code>revoked</code>).</li>
                <li><code>after</code>: Cursor for pagination.</li>
            </ul>

            <h2 id="api-health">System Health</h2>
            <p>
                Check the status of the SipHeron API and its connectivity to the Solana network. Helpful for diagnostic monitoring.
            </p>
            <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-900/40 text-blue-400 text-xs font-bold rounded">GET</span>
                <code className="text-sm">/v1/health</code>
            </div>

            <CodeBlock
                language="json"
                code={`{
  "status": "operational",
  "solana_network": "healthy",
  "version": "1.4.2"
}`}
            />

            <Callout type="warning">
                <strong>Batching:</strong> For integrations processing more than 100 documents per minute, we recommend using the bulk registration endpoint (coming soon) or implementing client-side batching to stay within rate limits.
            </Callout>

            <h2>Error Handling Example</h2>
            <p>
                Always handle non-200 responses. Below is an example of a failed registration due to an invalid hash format.
            </p>
            <CodeBlock
                language="json"
                code={`// Response for 400 Bad Request
{
  "error": {
    "code": "invalid_hash",
    "message": "The provided hash is not a valid 64-character SHA-256 string.",
    "param": "hash"
  }
}`}
            />

            <Callout type="tip">
                <strong>CURL Testing:</strong> You can test these endpoints immediately from your terminal. Ensure your API key has the <code>write</code> scope for POST requests and <code>read</code> scope for GET requests.
            </Callout>
        </>
    );
}
