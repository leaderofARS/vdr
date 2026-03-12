import DocLayout from '../../components/DocLayout';
import { Building2, PieChart, Shield, Users, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Organization API Overview', level: 2 },
    { id: 'get-details', title: 'Get Organization Details', level: 2 },
    { id: 'get-stats', title: 'Get Usage Statistics', level: 2 },
    { id: 'update-org', title: 'Update Settings', level: 2 },
    { id: 'stats-schema', title: 'Statistics Schema', level: 2 },
];

export default function ApiOrgsPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Organization API</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Access and manage your SipHeron VDR organization data, billing status, and real-time usage metrics.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    The Organization API provides a high-level view of your environment. It is primarily used by the dashboard and administrative scripts to monitor health and billing across the organization.
                </p>

                <h2 id="get-details" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Get Organization Details
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-blue-400 font-bold mr-2">GET</span> /api/org
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <pre className="font-mono">
{`{
  "success": true,
  "data": {
    "id": "org_abc123",
    "name": "SipHeron Enterprise",
    "plan": "PRO",
    "wallet": "8N2j...Fp7",
    "createdAt": "2026-01-01T00:00:00Z"
  }
}`}
                    </pre>
                </div>

                <h2 id="get-stats" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Get Usage Statistics
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-blue-400 font-bold mr-2">GET</span> /api/org/stats
                </p>
                <p className="text-gray-300 mb-6">
                    Retrieves total anchor counts, storage used, and network distribution (Devnet vs Mainnet) for the current billing cycle.
                </p>
                <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Example Response</h4>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <pre className="font-mono">
{`{
  "success": true,
  "data": {
    "totalAnchors": 1250,
    "mainnetAnchors": 800,
    "devnetAnchors": 450,
    "activeHashes": 1245,
    "revokedHashes": 5,
    "currentMonthUsage": 150
  }
}`}
                    </pre>
                </div>

                <h2 id="update-org" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Update Settings
                </h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                    <p className="text-yellow-300 text-sm">
                        ⚠️ Changing organization settings requires an <code className="text-purple-300">admin</code> scope API key.
                    </p>
                </div>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-purple-400 font-bold mr-2">PATCH</span> /api/org
                </p>
                <p className="text-gray-300 mb-8">
                    Update the organization name or primary contact information. Note: Wallet and Plan cannot be updated via API.
                </p>

                <h2 id="stats-schema" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Statistics Schema
                </h2>
                <p className="text-gray-300 mb-16 italic text-sm">
                    Usage statistics are cached for 5 minutes. Real-time updates may be slightly delayed.
                </p>
            </div>
        </DocLayout>
    );
}
