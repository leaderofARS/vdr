import DocLayout from '../../components/DocLayout';
import { History, List, ExternalLink, Clock, Hash } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Overview', level: 2 },
    { id: 'synopsis', title: 'Synopsis', level: 2 },
    { id: 'options', title: 'Options', level: 2 },
    { id: 'output-format', title: 'Output Format', level: 2 },
    { id: 'example', title: 'Example', level: 2 },
    { id: 'filtering', title: 'Filtering Results', level: 2 },
];

export default function CliHistoryPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">vdr history</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Retrieve a list of your most recent document anchors and transaction details from the blockchain.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-4">
                    The <code className="text-purple-300">history</code> command allows you to audit your past activities. It fetches the last N records associated with your organization, providing hashes, timestamps, and direct links to the Solana Explorer.
                </p>

                <h2 id="synopsis" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Synopsis
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr history [limit] [options]
                    </code>
                </pre>

                <h2 id="options" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Options
                </h2>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Flag</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Default</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">--limit, -l &lt;n&gt;</td>
                                <td className="py-3 pr-4 text-gray-400">10</td>
                                <td className="py-3 pr-4 text-gray-300">Number of recent records to display.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">--json</td>
                                <td className="py-3 pr-4 text-gray-400">false</td>
                                <td className="py-3 pr-4 text-gray-300">Return history as a JSON array.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 id="output-format" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Output Format
                </h2>
                <p className="text-gray-300 mb-4">The command displays a table with the following columns:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 mb-8 ml-4">
                    <li><strong>Timestamp:</strong> Date and time the anchor was confirmed.</li>
                    <li><strong>Hash:</strong> The first 8 characters of the SHA-256 hash.</li>
                    <li><strong>Network:</strong> Solana Devnet or Mainnet.</li>
                    <li><strong>Explorer:</strong> A shortened URL to view the transaction.</li>
                </ul>

                <h2 id="example" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Example
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6 text-xs text-purple-200">
                    <code className="font-mono">
{`Showing last 5 anchors:

DATE (UTC)       HASH       NETWORK    STATUS
2026-03-12 10:15  85e17e30   mainnet    CONFIRMED
2026-03-12 09:44  f2d4a1c5   mainnet    CONFIRMED
2026-03-11 23:12  a3b8d1b6   mainnet    REVOKED
2026-03-10 14:05  c5dae3d8   devnet     CONFIRMED
2026-03-10 12:20  2b30193e   devnet     CONFIRMED`}
                    </code>
                </pre>

                <h2 id="filtering" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Filtering Results
                </h2>
                <p className="text-gray-300 mb-4">
                    You can restrict history to a specific network to avoid clutter:
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-16">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr history --limit 50 --mainnet
                    </code>
                </pre>
            </div>
        </DocLayout>
    );
}
