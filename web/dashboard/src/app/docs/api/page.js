import DocLayout from '../components/DocLayout';
import { Send, Shield, Zap, Terminal, Info, Globe, Lock } from 'lucide-react';

const HEADINGS = [
    { id: 'api-introduction', title: 'Introduction', level: 2 },
    { id: 'base-urls', title: 'Base URLs', level: 2 },
    { id: 'authentication', title: 'Authentication', level: 2 },
    { id: 'request-headers', title: 'Required Headers', level: 2 },
    { id: 'response-format', title: 'Response Format', level: 2 },
    { id: 'error-handling', title: 'Error Handling', level: 2 },
    { id: 'idempotency', title: 'Idempotency', level: 2 },
    { id: 'cors', title: 'CORS Policy', level: 2 },
];

export default function RestApiOverviewPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">REST API Overview</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Integrate SipHeron VDR into any language or framework using our standard RESTful interface.
                </p>

                <h2 id="api-introduction" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Introduction
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    The SipHeron VDR API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
                </p>

                <h2 id="base-urls" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Base URLs
                </h2>
                <p className="text-gray-300 mb-4">
                    Depending on your environment, use one of the following base URLs:
                </p>
                <div className="space-y-4 mb-8">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Production</span>
                        <code className="text-sm text-purple-400">https://api.sipheron.com</code>
                    </div>
                </div>

                <h2 id="authentication" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Authentication
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    SipHeron uses API keys to authenticate requests. You can view and manage your API keys in the <a href="https://app.sipheron.com/settings" className="text-purple-400 border-b border-purple-500/30">Dashboard</a>.
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 flex gap-3">
                    <Lock className="w-5 h-5 text-yellow-500 shrink-0" />
                    <p className="text-yellow-300 text-sm">
                        Keep your API keys secret! Do not share them in public repositories or include them in client-side code.
                    </p>
                </div>

                <h2 id="request-headers" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Required Headers
                </h2>
                <div className="overflow-x-auto mb-8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Header</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">x-api-key</td>
                                <td className="py-3 pr-4 text-gray-300">Your organization's API key.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">Content-Type</td>
                                <td className="py-3 pr-4 text-gray-300">Must be <code className="bg-white/5 px-1 py-0.5 rounded">application/json</code>.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 id="response-format" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Response Format
                </h2>
                <p className="text-gray-300 mb-6">
                    All responses return a consistent JSON wrapper:
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`{
  "success": true,   // boolean indicating success/failure
  "data": { ... },   // the payload of the response
  "message": "...",  // descriptive message (usually on error)
  "meta": { ... }    // pagination or extra info
}`}
                    </code>
                </pre>

                <h2 id="error-handling" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Error Handling
                </h2>
                <div className="space-y-4 mb-12">
                    <div className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                        <code className="text-purple-400 font-bold shrink-0">400</code>
                        <p className="text-sm text-gray-300">Bad Request. Often due to missing parameters or invalid JSON body.</p>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                        <code className="text-purple-400 font-bold shrink-0">401</code>
                        <p className="text-sm text-gray-300">Unauthorized. Key is missing, invalid, or revoked.</p>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                        <code className="text-purple-400 font-bold shrink-0">403</code>
                        <p className="text-sm text-gray-300">Forbidden. Key has valid auth but not the required scope (e.g., <code className="text-xs">read</code> key trying to <code className="text-xs">POST</code>).</p>
                    </div>
                </div>

                <h2 id="idempotency" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Idempotency
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    SipHeron VDR supports idempotent requests to allow you to safely retry operations without accidentally creating duplicate records. For example, if a request to anchor a hash succeeds but a network error prevents you from receiving the response, you can re-target the same hash and SipHeron will return the existing record instead of creating a new on-chain account.
                </p>

                <h2 id="cors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    CORS Policy
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-16 flex gap-3">
                    <Globe className="w-5 h-5 text-blue-300 shrink-0" />
                    <p className="text-blue-300 text-sm">
                        To protect your API keys, our servers prohibit cross-origin requests from browsers. You should always interact with the API from a backend environment (Node.js, Python, Go, etc.).
                    </p>
                </div>
            </div>
        </DocLayout>
    );
}
