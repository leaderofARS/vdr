import DocLayout from '../../components/DocLayout';
import { Anchor, Zap, Cpu, Network, Clock, AlertCircle } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Overview', level: 2 },
    { id: 'synopsis', title: 'Synopsis', level: 2 },
    { id: 'options', title: 'Options', level: 2 },
    { id: 'how-it-works', title: 'How it works', level: 2 },
    { id: 'examples', title: 'Examples', level: 2 },
    { id: 'output', title: 'Output', level: 2 },
    { id: 'errors', title: 'Common Errors', level: 2 },
];

export default function CliAnchorPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">vdr anchor</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Submit your staged document hashes to the Solana blockchain for permanent, immutable timestamping.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-4">
                    The <code className="text-purple-300">anchor</code> command is the core of the SipHeron platform. It takes all hashes you have previously "staged" and bundles them into a transaction that is sent to the Solana network.
                </p>

                <h2 id="synopsis" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Synopsis
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr anchor [options]
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
                                <td className="py-3 pr-4 text-purple-300 font-mono">--devnet</td>
                                <td className="py-3 pr-4 text-gray-400">true</td>
                                <td className="py-3 pr-4 text-gray-300">Anchor to the Solana Devnet (testing).</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">--mainnet</td>
                                <td className="py-3 pr-4 text-gray-400">false</td>
                                <td className="py-3 pr-4 text-gray-300">Anchor to the Solana Mainnet-Beta (production).</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">--batch-size &lt;n&gt;</td>
                                <td className="py-3 pr-4 text-gray-400">100</td>
                                <td className="py-3 pr-4 text-gray-300">Maximum hashes per single transaction.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">--yes, -y</td>
                                <td className="py-3 pr-4 text-gray-400">false</td>
                                <td className="py-3 pr-4 text-gray-300">Skip the confirmation prompt. Recommended for CI/CD.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 id="how-it-works" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How it works
                </h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-8 ml-4">
                    <li>Reads all hashes from your localstaging database (<code className="text-purple-300">~/.vdr/staging.json</code>).</li>
                    <li>Groups hashes into optimal batch sizes.</li>
                    <li>Uploads the batch metadata to SipHeron Cloud via secure API.</li>
                    <li>Triggers the Solana smart contract to create persistent PDA accounts.</li>
                    <li>Clears your local staging queue upon successful transaction confirmation.</li>
                </ol>

                <h2 id="examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Examples
                </h2>
                
                <h3 className="text-white font-bold mb-3 mt-8">Standard anchor (Devnet)</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr anchor
                    </code>
                </pre>

                <h3 className="text-white font-bold mb-3 mt-8">Production anchor (Mainnet)</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr anchor --mainnet --yes
                    </code>
                </pre>

                <h2 id="output" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Output
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6 text-sm">
                    <code className="font-mono">
{`Found 25 staged hashes.
Network: Solana Mainnet-Beta
Batch Size: 100
Confirm anchoring 25 files? (y/N) y

🚀 Anchoring batch 1/1...
✓ Transaction confirmed: 4N8jQ...z7s
✓ 25 document(s) anchored successfully.`}
                    </code>
                </pre>

                <h2 id="errors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Common Errors
                </h2>
                <div className="space-y-4 mb-16">
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">No hashes staged</h4>
                        <p className="text-xs text-gray-400 mt-1">Run <code className="text-purple-300">vdr stage &lt;file&gt;</code> first to add documents to the queue.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">Insufficient SOL</h4>
                        <p className="text-xs text-gray-400 mt-1">If you are using your own wallet (Advanced Mode), ensure you have enough SOL for transaction fees. In Standard Mode, SipHeron covers these fees.</p>
                    </div>
                </div>
            </div>
        </DocLayout>
    );
}
