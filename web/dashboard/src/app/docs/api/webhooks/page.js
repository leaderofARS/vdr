import DocLayout from '../../components/DocLayout';
import { Bell, Shield, Zap, Terminal, AlertCircle, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Webhooks Overview', level: 2 },
    { id: 'supported-events', title: 'Supported Events', level: 2 },
    { id: 'create-webhook', title: 'Create Webhook', level: 2 },
    { id: 'security', title: 'Security & Signatures', level: 2 },
    { id: 'retry-policy', title: 'Retry Policy', level: 2 },
    { id: 'payload-example', title: 'Payload Example', level: 2 },
];

export default function ApiWebhooksPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Webhooks API</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Automate your workflows by receiving real-time notifications when documents are anchored, revoked, or confirmed on the blockchain.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-6 font-light text-justify">
                    Webhooks allow SipHeron to "push" events to your server as they happen, eliminating the need to poll our API for status updates. When an event occurs, SipHeron sends an HTTP POST request to the URL you specify.
                </p>

                <h2 id="supported-events" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Supported Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <code className="text-purple-400 font-bold block mb-2">anchor.confirmed</code>
                        <p className="text-xs text-gray-400">Triggered when a transaction reaches "Finalized" status on Solana.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <code className="text-purple-400 font-bold block mb-2">hash.revoked</code>
                        <p className="text-xs text-gray-400">Triggered when a document status is changed to Revoked.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <code className="text-purple-400 font-bold block mb-2">usage.limit_reached</code>
                        <p className="text-xs text-gray-400">Triggered when your organization reaches 80% or 100% of its monthly anchor limit.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <code className="text-purple-400 font-bold block mb-2">member.joined</code>
                        <p className="text-xs text-gray-400">Triggered when a new team member joins the organization.</p>
                    </div>
                </div>

                <h2 id="create-webhook" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Create Webhook
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-green-500 font-bold mr-2">POST</span> /api/webhooks
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <pre className="font-mono">
{`{
  "url": "https://your-server.com/webhooks/sipheron",
  "events": ["anchor.confirmed", "hash.revoked"],
  "description": "Enterprise Inventory Sync"
}`}
                    </pre>
                </div>

                <h2 id="security" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Security & Signatures
                </h2>
                <p className="text-gray-300 mb-6">
                    To ensure the webhook came from SipHeron and has not been tampered with, every request includes a <code className="text-purple-300">x-sipheron-signature</code> header.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex gap-3">
                    <Shield className="w-5 h-5 text-blue-300 shrink-0" />
                    <p className="text-blue-300 text-sm">
                        Verify the signature by computing an <strong>HMAC-SHA256</strong> hash of the raw request body using your Webhook Secret as the key.
                    </p>
                </div>

                <h2 id="retry-policy" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Retry Policy
                </h2>
                <p className="text-gray-300 mb-4">
                    If your server returns anything other than a <code className="text-green-400">2xx</code> status code, we will retry the notification:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 mb-8 ml-4">
                    <li><strong>Immediate:</strong> First retry happens after 10 seconds.</li>
                    <li><strong>Exponential Backoff:</strong> Subsequent retries at 1m, 5m, 30m, and 2h.</li>
                    <li><strong>Disabled:</strong> If the webhook fails for 48 consecutive hours, it will be automatically disabled.</li>
                </ul>

                <h2 id="payload-example" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Payload Example
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-16 text-xs text-purple-200">
                    <code className="font-mono">
{`{
  "id": "evt_82j...01",
  "type": "anchor.confirmed",
  "data": {
    "hash": "85e17e3073507d3910c85a9477fd3e079717c10323ea58760085885c490f058e",
    "timestamp": 1710243600,
    "txSignature": "4N8jQLW...z7sY",
    "network": "mainnet"
  },
  "createdAt": "2026-03-12T14:20:05Z"
}`}
                    </code>
                </pre>
            </div>
        </DocLayout>
    );
}
