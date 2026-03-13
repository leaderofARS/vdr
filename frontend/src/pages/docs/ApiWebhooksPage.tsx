import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2002);
  };
  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border border-[#2A2A2A] rounded-t-lg">
        <span className="text-xs text-[#555]">{language}</span>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-[#555] hover:text-white transition-colors">
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

const ApiWebhooksPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Webhooks API</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Subscribe to real-time events via webhooks. Get notified when documents are anchored, 
        verified, or when other important events occur in your organization.
      </p>

      <h2 id="create-webhook" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Create Webhook
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">POST</span>
        <code className="text-purple-300 font-mono text-sm">/webhooks</code>
      </div>
      <CodeBlock code={`curl -X POST https://api.sipheron.io/v1/webhooks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhooks/sipheron",
    "events": ["hash.created", "hash.verified"],
    "secret": "whsec_your_webhook_secret",
    "description": "Production webhook"
  }'`} />

      <h3 id="event-types" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Event Types</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Event</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">hash.created</td><td className="py-3 pr-4 text-gray-400">New hash anchored</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">hash.verified</td><td className="py-3 pr-4 text-gray-400">Hash verified</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">hash.revoked</td><td className="py-3 pr-4 text-gray-400">Hash revoked</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">api_key.created</td><td className="py-3 pr-4 text-gray-400">New API key created</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">api_key.revoked</td><td className="py-3 pr-4 text-gray-400">API key revoked</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">team.member_invited</td><td className="py-3 pr-4 text-gray-400">Team member invited</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">team.member_joined</td><td className="py-3 pr-4 text-gray-400">Team member joined</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="list-webhooks" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        List Webhooks
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/webhooks</code>
      </div>
      <CodeBlock code={`curl https://api.sipheron.io/v1/webhooks \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h2 id="get-webhook" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Get Webhook
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/webhooks/:id</code>
      </div>
      <CodeBlock code={`curl https://api.sipheron.io/v1/webhooks/wh_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h2 id="update-webhook" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Update Webhook
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-mono rounded">PATCH</span>
        <code className="text-purple-300 font-mono text-sm">/webhooks/:id</code>
      </div>
      <CodeBlock code={`curl -X PATCH https://api.sipheron.io/v1/webhooks/wh_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "events": ["hash.created", "hash.verified", "hash.revoked"],
    "active": true
  }'`} />

      <h2 id="delete-webhook" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Delete Webhook
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-mono rounded">DELETE</span>
        <code className="text-purple-300 font-mono text-sm">/webhooks/:id</code>
      </div>
      <CodeBlock code={`curl -X DELETE https://api.sipheron.io/v1/webhooks/wh_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h2 id="test-webhook" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Test Webhook
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">POST</span>
        <code className="text-purple-300 font-mono text-sm">/webhooks/:id/test</code>
      </div>
      <CodeBlock code={`curl -X POST https://api.sipheron.io/v1/webhooks/wh_abc123/test \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "hash.created"
  }'`} />

      <h2 id="signature-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Signature Verification
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Verify webhook payloads to ensure they came from SipHeron:
      </p>
      <CodeBlock code={`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Express middleware example
app.post('/webhooks/sipheron', (req, res) => {
  const signature = req.headers['x-sipheron-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhook(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  res.status(200).send('OK');
});`} language="javascript" />

      <h2 id="payload-example" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Webhook Payload Example
      </h2>
      <CodeBlock code={`{
  "id": "evt_abc123",
  "type": "hash.created",
  "created_at": "2024-01-15T09:23:45.123Z",
  "data": {
    "hash": {
      "id": "hash_def456",
      "hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...",
      "note": "Client contract",
      "network": "mainnet",
      "solana_tx": "5UfgJ5XGUe...",
      "slot": 284715623,
      "timestamp": "2024-01-15T09:23:45.123Z"
    }
  }
}`} language="json" />

      <h2 id="delivery-attempts" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Delivery & Retries
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Webhooks use exponential backoff for retries:
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Attempt</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Delay</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Total Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr><td className="py-3 pr-4 text-gray-300">1</td><td className="py-3 pr-4 text-gray-400">Immediate</td><td className="py-3 pr-4 text-gray-400">0s</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">2</td><td className="py-3 pr-4 text-gray-400">1 second</td><td className="py-3 pr-4 text-gray-400">1s</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">3</td><td className="py-3 pr-4 text-gray-400">2 seconds</td><td className="py-3 pr-4 text-gray-400">3s</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">4</td><td className="py-3 pr-4 text-gray-400">4 seconds</td><td className="py-3 pr-4 text-gray-400">7s</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">5</td><td className="py-3 pr-4 text-gray-400">8 seconds</td><td className="py-3 pr-4 text-gray-400">15s</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiWebhooksPage;
