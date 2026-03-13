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

const GuideWebhooksPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Webhook Integration Guide</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Build real-time integrations with SipHeron webhooks. Receive instant notifications 
        when documents are anchored, verified, or when other events occur.
      </p>

      <h2 id="architecture" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Webhook Architecture
      </h2>
      <div className="p-6 rounded-xl border border-white/10 bg-white/5 mb-8">
        <pre className="text-sm text-gray-400 font-mono">
{`┌─────────────┐     Anchor Event     ┌─────────────┐
│   SipHeron  │ ────────────────────>│  Your App   │
│   Platform  │    HTTP POST         │  Webhook    │
│             │                      │  Endpoint   │
└─────────────┘                      └─────────────┘
       │                                    │
       │                                    │
       │    ┌─────────────┐                 │
       └───>│  Solana     │                 │
            │  Blockchain │<────────────────┘
            └─────────────┘     Verify`}
        </pre>
      </div>

      <h2 id="setup" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Setting Up Webhooks
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Create a webhook endpoint using the API or CLI:
      </p>
      <CodeBlock code={`curl -X POST https://api.sipheron.io/v1/webhooks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhooks/sipheron",
    "events": ["hash.created", "hash.verified"],
    "secret": "whsec_your_webhook_secret"
  }'`} />

      <h2 id="signature-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Signature Verification
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Always verify webhook signatures to ensure requests came from SipHeron:
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

// Express middleware
app.post('/webhooks/sipheron', (req, res) => {
  const signature = req.headers['x-sipheron-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhook(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  res.status(200).send('OK');
});`} language="javascript" />

      <h2 id="event-types" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Event Types
      </h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Event</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">hash.created</td><td className="py-3 pr-4 text-gray-400">New document anchored</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">hash.verified</td><td className="py-3 pr-4 text-gray-400">Document verified</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">hash.revoked</td><td className="py-3 pr-4 text-gray-400">Anchor revoked</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">api_key.created</td><td className="py-3 pr-4 text-gray-400">New API key created</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300 font-mono">team.member_invited</td><td className="py-3 pr-4 text-gray-400">Team member invited</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="payload" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Webhook Payload
      </h2>
      <CodeBlock code={`{
  "id": "evt_abc123",
  "type": "hash.created",
  "created_at": "2024-01-15T09:23:45.123Z",
  "data": {
    "hash": {
      "id": "hash_def456",
      "hash": "0x7f83b165...",
      "note": "Client contract",
      "network": "mainnet",
      "solana_tx": "5UfgJ5XGUe...",
      "slot": 284715623
    }
  }
}`} language="json" />

      <h2 id="idempotency" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Idempotency
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Handle duplicate webhook deliveries safely:
      </p>
      <CodeBlock code={`const redis = require('redis');
const client = redis.createClient();

app.post('/webhooks/sipheron', async (req, res) => {
  const eventId = req.body.id;
  
  // Check if already processed
  const processed = await client.get('event:' + eventId);
  if (processed) {
    return res.status(200).send('Already processed');
  }
  
  // Process the event
  await processWebhook(req.body);
  
  // Mark as processed (24h TTL)
  await client.setex('event:' + eventId, 86400, '1');
  
  res.status(200).send('OK');
});`} language="javascript" />

      <h2 id="retry-logic" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Retry Logic
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        SipHeron retries failed deliveries with exponential backoff:
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Attempt</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Delay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr><td className="py-3 pr-4 text-gray-300">1</td><td className="py-3 pr-4 text-gray-400">Immediate</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">2</td><td className="py-3 pr-4 text-gray-400">1 second</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">3</td><td className="py-3 pr-4 text-gray-400">2 seconds</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">4</td><td className="py-3 pr-4 text-gray-400">4 seconds</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">5</td><td className="py-3 pr-4 text-gray-400">8 seconds</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="local-dev" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Local Development
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Use ngrok to test webhooks locally:
      </p>
      <CodeBlock code={`# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Use this as your webhook URL: https://abc123.ngrok.io/webhooks/sipheron`} />

      <h2 id="slack-example" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Example: Slack Notifications
      </h2>
      <CodeBlock code={`app.post('/webhooks/sipheron', async (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'hash.created') {
    await slack.chat.postMessage({
      channel: '#document-alerts',
      text: 'New document anchored',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Document Anchored*\\nNetwork: ' + data.hash.network
          }
        },
        {
          type: 'actions',
          elements: [{
            type: 'button',
            text: { type: 'plain_text', text: 'View on Explorer' },
            url: 'https://explorer.solana.com/tx/' + data.hash.solana_tx
          }]
        }
      ]
    });
  }
  
  res.status(200).send('OK');
});`} language="javascript" />

      <h2 id="best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Best Practices
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 text-lg">✓</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Verify Signatures</h4>
            <p className="text-sm text-gray-400">Always verify webhook signatures.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 text-lg">✓</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Return 200 Quickly</h4>
            <p className="text-sm text-gray-400">Acknowledge immediately, process async.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 text-lg">✗</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Don't Process Sync</h4>
            <p className="text-sm text-gray-400">Avoid long-running operations.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 text-lg">✗</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Don't Ignore Retries</h4>
            <p className="text-sm text-gray-400">Handle idempotency properly.</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-pink-500/20 bg-pink-500/5 mb-12">
        <h3 className="text-lg font-bold text-white mb-2">Webhook Support</h3>
        <p className="text-gray-300 mb-4">
          Need help building webhook integrations? Our team can assist with custom integrations.
        </p>
        <a href="/support" className="text-pink-400 hover:text-pink-300 text-sm">
          Contact Developer Support →
        </a>
      </div>
    </div>
  );
};

export default GuideWebhooksPage;
