import DocLayout from '../../components/DocLayout';
import { Layers, Info, Terminal, User, Network } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Overview', level: 2 },
    { id: 'synopsis', title: 'Synopsis', level: 2 },
    { id: 'how-it-works', title: 'How it works', level: 2 },
    { id: 'example-output', title: 'Example Output', level: 2 },
    { id: 'config-details', title: 'Configuration Details', level: 3 },
    { id: 'staging-details', title: 'Staging Details', level: 3 },
];

export default function CliStatusPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">vdr status</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    View your current local environment status, authenticated organization, and pending staging queue.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-4">
                    The <code className="text-purple-300">status</code> command provides a snapshot of your local SipHeron VDR configuration. Use it to check which organization you are linked to and how many files are waiting to be anchored.
                </p>

                <h2 id="synopsis" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Synopsis
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr status
                    </code>
                </pre>

                <h2 id="how-it-works" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How it works
                </h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-8 ml-4">
                    <li>Reads your encrypted <code className="text-purple-300">config.json</code> to identify your API key.</li>
                    <li>Calls the SipHeron API to get the latest organization name and plan status.</li>
                    <li>Counts the number of records in your local <code className="text-purple-300">staging.json</code>.</li>
                    <li>Checks for CLI updates and displays a notification if a newer version is available.</li>
                </ol>

                <h2 id="example-output" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Example Output
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6 text-sm">
                    <code className="font-mono">
{`--- Environment ---
CLI Version: 0.9.6
Config: ~/.vdr/config.json
Network: mainnet-beta

--- Authentication ---
Organization: SipHeron Enterprise
Linked Wallet: 8N2j...Fp7
Plan: Business

--- Staging Queue ---
Pending Files: 3
Total Batch Size: ~5 KB
Last Staged: 2 hours ago

--- Solana Status ---
Network Latency: 420ms
Smart Contract: 6ecWP...zAwo (Stable)`}
                    </code>
                </pre>

                <h3 id="config-details" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    Configuration Details
                </h3>
                <p className="text-gray-300 mb-4">
                    The current network (devnet or mainnet) is determined by your most recent <code className="text-purple-300">link</code> or <code className="text-purple-300">config</code> command. You can permanently change this with:
                </p>
                <code className="bg-white/5 p-2 rounded text-xs text-purple-300">vdr config set network mainnet</code>

                <h3 id="staging-details" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    Staging Details
                </h3>
                <p className="text-gray-300 mb-16">
                    If <code className="text-purple-300">Pending Files</code> is greater than zero, those files have not yet been written to the blockchain. You must run <code className="text-purple-300">vdr anchor</code> to finalize them.
                </p>
            </div>
        </DocLayout>
    );
}
