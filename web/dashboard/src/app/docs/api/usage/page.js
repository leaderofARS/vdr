import DocLayout from '../../components/DocLayout';
import { BarChart, Clock, Database, Info, Calendar } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Usage API Overview', level: 2 },
    { id: 'get-logs', title: 'Get Usage Logs', level: 2 },
    { id: 'billing-period', title: 'Current Billing Period', level: 2 },
    { id: 'quotas', title: 'Quotas & Limits', level: 2 },
    { id: 'schema', title: 'Usage Record Schema', level: 2 },
];

export default function ApiUsagePage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Usage API</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Track your organization's API activity and anchor consumption detailed by day, network, and endpoint.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    The Usage API is designed for financial auditing and cost allocation. It allows you to see exactly how many anchors were produced by specific API keys over a given time range.
                </p>

                <h2 id="get-logs" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Get Usage Logs
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-blue-400 font-bold mr-2">GET</span> /api/usage/logs
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <pre className="font-mono">
{`{
  "success": true,
  "data": [
    {
      "date": "2026-03-11",
      "endpoint": "/api/hashes",
      "count": 450,
      "method": "POST",
      "apiKeyName": "Main CI/CD"
    }
  ]
}`}
                    </pre>
                </div>

                <h2 id="billing-period" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Current Billing Period
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-blue-400 font-bold mr-2">GET</span> /api/usage/summary
                </p>
                <p className="text-gray-300 mb-6">
                    Returns a consolidated summary of the current month's billable items.
                </p>

                <h2 id="quotas" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Quotas & Limits
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-3 mb-12 ml-4">
                    <li><strong>Free Tier:</strong> 100 Mainnet anchors per month.</li>
                    <li><strong>Pro Tier:</strong> 10,000 Mainnet anchors per month.</li>
                    <li><strong>Enterprise:</strong> Dynamic scaling with volume discounts.</li>
                </ul>
                <p className="text-gray-400 text-sm mb-12">
                    <em>Note: Devnet anchors are always free and do not count towards your monthly quota.</em>
                </p>

                <h2 id="schema" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Usage Record Schema
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-16 text-xs text-purple-200">
                    <code className="font-mono">
{`interface UsageRecord {
  timestamp: string;      // ISO 8601
  orgId: string;
  apiKeyId: string;
  action: string;         // 'anchor' | 'verify' | 'revoke'
  count: number;
  network: 'devnet' | 'mainnet';
  cost_units?: number;    // Internal cost metric
}`}
                    </code>
                </pre>
            </div>
        </DocLayout>
    );
}
