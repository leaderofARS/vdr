import DocLayout from '../../components/DocLayout';
import { Bell, Webhook, ShieldCheck, Zap, Server, Info, Terminal } from 'lucide-react';

const HEADINGS = [
    { id: 'automation-webhooks', title: 'Automation with Webhooks', level: 2 },
    { id: 'listening-anchors', title: 'Listening for Anchors', level: 2 },
    { id: 'signature-verification', title: 'Signature Verification', level: 2 },
    { id: 'express-example', title: 'Express.js Implementation', level: 2 },
    { id: 'troubleshooting', title: 'Troubleshooting Tips', level: 2 },
];

export default function GuideWebhooksPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Guide: Webhook Integration</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Build reactive applications that respond to blockchain confirmation events in real-time.
                </p>

                <h2 id="automation-webhooks" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Automation with Webhooks
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    Instead of polling the SipHeron API to check if a document has been confirmed on the Solana blockchain, you can configure webhooks to receive a <code className="text-purple-300">POST</code> request the moment the transaction settles.
                </p>

                <h2 id="listening-anchors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Listening for Anchors
                </h2>
                <p className="text-gray-300 mb-4">
                    The most common use case is updating your database status once a proof is locked. When you receive an <code className="text-purple-300">anchor.confirmed</code> event, it contains:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 mb-8 ml-4 text-sm">
                    <li>The original <strong>SHA-256 Hash</strong>.</li>
                    <li>The <strong>Solana Transaction Signature</strong>.</li>
                    <li>The <strong>PDA Address</strong> of the on-chain record.</li>
                    <li>The <strong>Timestamp</strong> of the block.</li>
                </ul>

                <h2 id="signature-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Signature Verification
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8 flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                        <p className="text-blue-200 text-sm leading-relaxed mb-3">
                            To ensure the webhook actually came from SipHeron, verify the <code className="text-white">x-sipheron-signature</code> header using your webhook secret.
                        </p>
                        <code className="text-[10px] text-blue-300 font-mono">HMAC-SHA256(secret, payload_body)</code>
                    </div>
                </div>

                <h2 id="express-example" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Express.js Implementation
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-12 text-xs text-purple-200">
                    <code className="font-mono">
{`app.post('/webhooks/sipheron', (req, res) => {
  const signature = req.headers['x-sipheron-signature'];
  
  if (!verifySignature(req.body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid Signature');
  }

  const { event, data } = req.body;
  if (event === 'anchor.confirmed') {
    updateDatabaseStatus(data.hash, 'CONFIRMED');
  }

  res.status(200).send('OK');
});`}
                    </code>
                </pre>

                <h2 id="troubleshooting" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Troubleshooting Tips
                </h2>
                <div className="space-y-4 mb-24">
                    <div className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                        <Server className="w-5 h-5 text-gray-400 shrink-0" />
                        <div>
                            <h5 className="text-white font-bold text-sm mb-1">Response Time</h5>
                            <p className="text-xs text-gray-400">Your endpoint should respond within 5 seconds. Use a background worker if you need to perform heavy processing.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DocLayout>
    );
}
