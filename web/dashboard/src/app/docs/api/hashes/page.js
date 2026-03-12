import DocLayout from '../../components/DocLayout';
import { Hash, Zap, Search, Shield, List, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const HEADINGS = [
    { id: 'overview', title: 'Hashes API Overview', level: 2 },
    { id: 'endpoints', title: 'Available Endpoints', level: 2 },
    { id: 'base-url', title: 'Base URL', level: 2 },
    { id: 'auth', title: 'Authentication', level: 2 },
    { id: 'rate-limits', title: 'Rate Limits', level: 2 },
];

export default function ApiHashesPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Hashes API</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    The Hashes API is the core of the SipHeron VDR platform, allowing you to programmatically register, anchor, and verify documents on the Solana blockchain.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-6">
                    This API provides endpoints for the entire document lifecycle. Whether you are anchoring single files or processing thousands in a batch, the Hashes API handles the complexity of Solana transaction management for you.
                </p>

                <h2 id="endpoints" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Available Endpoints
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <Link href="/docs/api/hashes/register" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded">POST</span>
                            <code className="text-xs text-white">/api/hashes</code>
                        </div>
                        <p className="text-xs text-gray-400">Anchor a single hash to the blockchain.</p>
                    </Link>
                    <Link href="/docs/api/hashes/batch" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded">POST</span>
                            <code className="text-xs text-white">/api/hashes/batch</code>
                        </div>
                        <p className="text-xs text-gray-400">Anchor up to 1,000 hashes in a single transaction.</p>
                    </Link>
                    <Link href="/docs/api/hashes/list" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">GET</span>
                            <code className="text-xs text-white">/api/hashes</code>
                        </div>
                        <p className="text-xs text-gray-400">Retrieve a paginated list of your organization's anchors.</p>
                    </Link>
                    <Link href="/docs/api/hashes/get" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">GET</span>
                            <code className="text-xs text-white">/api/hashes/:hash</code>
                        </div>
                        <p className="text-xs text-gray-400">Get detailed information about a specific document proof.</p>
                    </Link>
                </div>

                <h2 id="base-url" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Base URL
                </h2>
                <code className="block bg-black/60 p-4 rounded-xl text-purple-400 font-mono text-sm border border-white/10 mb-8">
                    https://api.sipheron.com
                </code>

                <h2 id="auth" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Authentication
                </h2>
                <p className="text-gray-300 mb-4">
                    All Hashes API endpoints require a valid <code className="text-purple-300">x-api-key</code> header with <code className="text-purple-300">write</code> scope for POST requests and <code className="text-purple-300">read</code> scope for GET requests.
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-12">
                    <p className="text-yellow-300 text-sm flex gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Always use HTTPS. Plaintext keys sent over HTTP will be intercepted and revoked.</span>
                    </p>
                </div>

                <h2 id="rate-limits" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Rate Limits
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-16 ml-4">
                    <li><strong>Read Requests:</strong> 100 requests per second.</li>
                    <li><strong>Write Requests:</strong> 10 requests per second.</li>
                    <li><strong>Batch Requests:</strong> 1 request per second.</li>
                </ul>
            </div>
        </DocLayout>
    );
}
