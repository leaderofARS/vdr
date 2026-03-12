import DocLayout from '../../../components/DocLayout';
import { Info, Code, Shield, Send, Terminal, AlertCircle } from 'lucide-react';

const HEADINGS = [
    { id: 'endpoint', title: 'Endpoint Definition', level: 2 },
    { id: 'request-body', title: 'Request Body', level: 2 },
    { id: 'network-parameter', title: 'Network Parameter', level: 3 },
    { id: 'success-response', title: 'Success Response', level: 2 },
    { id: 'error-responses', title: 'Error Responses', level: 2 },
    { id: 'example-code', title: 'Example Implementation', level: 2 },
    { id: 'best-practices', title: 'Best Practices', level: 2 },
];

export default function ApiHashesRegisterPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">POST</span>
                    <h1 className="text-4xl font-bold text-white">/api/hashes</h1>
                </div>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    The primary endpoint for creating a new document anchor. This triggers the Solana smart contract to store your hash.
                </p>

                <h2 id="endpoint" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Endpoint Definition
                </h2>
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm">POST https://api.sipheron.com/api/hashes</code>
                </div>

                <h2 id="request-body" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Request Body
                </h2>
                <div className="overflow-x-auto mb-8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400">
                                <th className="text-left py-3 pr-4 font-medium">Field</th>
                                <th className="text-left py-3 pr-4 font-medium">Type</th>
                                <th className="text-left py-3 pr-4 font-medium">Required</th>
                                <th className="text-left py-3 pr-4 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            <tr>
                                <td className="py-3 pr-4 font-mono text-purple-400">hash</td>
                                <td className="py-3 pr-4 italic">string</td>
                                <td className="py-3 pr-4 text-green-500">Yes</td>
                                <td className="py-3 pr-4">The SHA-256 hex-encoded hash of the document.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 font-mono text-purple-400">filename</td>
                                <td className="py-3 pr-4 italic">string</td>
                                <td className="py-3 pr-4 text-red-500">No</td>
                                <td className="py-3 pr-4">The original name of the file (stored as metadata).</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 font-mono text-purple-400">network</td>
                                <td className="py-3 pr-4 italic">string</td>
                                <td className="py-3 pr-4 text-gray-400">Default: devnet</td>
                                <td className="py-3 pr-4">Either <code className="bg-white/5 px-1 rounded">devnet</code> or <code className="bg-white/5 px-1 rounded">mainnet</code>.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 font-mono text-purple-400">expiryDays</td>
                                <td className="py-3 pr-4 italic">number</td>
                                <td className="py-3 pr-4 text-red-500">No</td>
                                <td className="py-3 pr-4">Optional retention period in days.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 id="network-parameter" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    The <code className="text-purple-400">network</code> Parameter
                </h3>
                <p className="text-gray-300 mb-6 font-light">
                    If you omit or set to <code className="text-purple-300">devnet</code>, the anchor is performed using the Solana Devnet cluster. This is free and recommended for testing. Only set to <code className="text-purple-300">mainnet</code> when you are ready to produce legally-significant proofs.
                </p>

                <h2 id="success-response" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Success Response
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                    <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">HTTP 201 Created</p>
                </div>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`{
  "success": true,
  "data": {
    "hash": "85e17e3073507d3910c85a9477fd3e079717c10323ea58760085885c490f058e",
    "status": "pending",
    "txSignature": "4N8jQLW...z7sY",
    "pda": "6P2j...Fp7",
    "registeredAt": "2026-03-12T14:20:00Z"
  }
}`}
                    </code>
                </pre>

                <h2 id="error-responses" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Error Responses
                </h2>
                <div className="space-y-4 mb-12">
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">401 Unauthorized</h4>
                        <p className="text-xs text-gray-400 mt-1">Provided <code className="text-purple-300">x-api-key</code> is missing or invalid.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">409 Conflict</h4>
                        <p className="text-xs text-gray-400 mt-1">This hash has already been anchored by your organization.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">429 Too Many Requests</h4>
                        <p className="text-xs text-gray-400 mt-1">Rate limit exceeded. Standard limit is 10 anchors/sec.</p>
                    </div>
                </div>

                <h2 id="example-code" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Example Implementation
                </h2>
                <h3 className="text-white font-bold mb-3 mt-8">Node.js</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`const axios = require('axios');

async function anchorDocument(hash) {
  try {
    const response = await axios.post('https://api.sipheron.com/api/hashes', {
      hash: hash,
      network: 'mainnet'
    }, {
      headers: { 'x-api-key': process.env.SIPHERON_API_KEY }
    });
    console.log('Anchored! TX:', response.data.data.txSignature);
  } catch (err) {
    console.error('Anchoring failed:', err.response.data.message);
  }
}`}
                    </code>
                </pre>

                <h2 id="best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Best Practices
                </h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-16">
                    <ul className="list-disc list-inside text-gray-300 space-y-3">
                        <li><strong>Idempotency:</strong> If you receive a 500 or network timeout, you can safely retry the same hash. SipHeron handles deduplication automatically.</li>
                        <li><strong>Batching:</strong> If you have more than 5 files to anchor at once, use the <a href="/docs/api/hashes/batch" className="text-purple-400 underline">Batch Anchor</a> endpoint to save on API overhead.</li>
                        <li><strong>Status Monitoring:</strong> After a successful request, the anchor is <code className="text-yellow-400">pending</code>. Wait ~30 seconds and poll the <code className="text-purple-300">GET /api/hashes/:hash</code> endpoint if you need to confirm "Finalized" status.</li>
                    </ul>
                </div>
            </div>
        </DocLayout>
    );
}
