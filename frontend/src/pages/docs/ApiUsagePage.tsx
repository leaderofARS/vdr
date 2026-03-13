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

const ApiUsagePage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Usage & Analytics API</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Track your organization's usage, analytics, and billing metrics. 
        Access historical data and export reports for compliance and planning.
      </p>

      <h2 id="current-usage" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Current Usage
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/usage</code>
      </div>
      <p className="text-gray-300 leading-relaxed mb-4">
        Get current billing period usage and quota information.
      </p>
      <CodeBlock code={`curl https://api.sipheron.io/v1/usage \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Response</h3>
      <CodeBlock code={`{
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "plan": "enterprise",
  "quotas": {
    "anchors": {
      "limit": 100000,
      "used": 45678,
      "remaining": 54322
    },
    "api_requests": {
      "limit": 500000,
      "used": 234567,
      "remaining": 265433
    },
    "storage": {
      "limit_bytes": 10737418240,
      "used_bytes": 1288490189,
      "limit_gb": 10,
      "used_gb": 1.2
    }
  },
  "projected": {
    "anchors": 89000,
    "api_requests": 456000
  }
}`} language="json" />

      <h2 id="usage-history" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Usage History
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/usage/history</code>
      </div>
      <CodeBlock code={`# Daily breakdown for current month
curl https://api.sipheron.io/v1/usage/history \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Specific date range
curl "https://api.sipheron.io/v1/usage/history?from=2024-01-01&to=2024-01-31" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Weekly aggregation
curl "https://api.sipheron.io/v1/usage/history?aggregation=week" \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Query Parameters</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Parameter</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">from</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-400">Start date (ISO 8601)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">to</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-400">End date (ISO 8601)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">aggregation</td>
              <td className="py-3 pr-4 text-gray-300">string</td>
              <td className="py-3 pr-4 text-gray-400">day, week, or month</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="anchor-analytics" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Anchor Analytics
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/analytics/anchors</code>
      </div>
      <CodeBlock code={`curl https://api.sipheron.io/v1/analytics/anchors \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Response</h3>
      <CodeBlock code={`{
  "total_anchors": 45678,
  "by_network": {
    "mainnet": 41234,
    "devnet": 3444,
    "testnet": 1000
  },
  "by_time": {
    "last_24h": 1234,
    "last_7d": 8765,
    "last_30d": 34567,
    "all_time": 45678
  },
  "top_tags": [
    { "tag": "contracts", "count": 12345 },
    { "tag": "invoices", "count": 8765 },
    { "tag": "reports", "count": 5432 }
  ]
}`} language="json" />

      <h2 id="verification-analytics" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Verification Analytics
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
        <code className="text-purple-300 font-mono text-sm">/analytics/verifications</code>
      </div>
      <CodeBlock code={`curl https://api.sipheron.io/v1/analytics/verifications \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />

      <h2 id="export" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Export Usage Data
      </h2>
      <CodeBlock code={`# Export as CSV
curl "https://api.sipheron.io/v1/usage/history?format=csv" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  --output usage-report.csv

# Export as JSON
curl "https://api.sipheron.io/v1/usage/history?format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  --output usage-report.json`} />

      <h2 id="rate-limits" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Rate Limits
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Usage API has its own rate limits separate from general API limits:
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Plan</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Limit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr><td className="py-3 pr-4 text-gray-300">Free</td><td className="py-3 pr-4 text-gray-400">10 requests/hour</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">Pro</td><td className="py-3 pr-4 text-gray-400">100 requests/hour</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">Enterprise</td><td className="py-3 pr-4 text-gray-400">1000 requests/hour</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiUsagePage;
