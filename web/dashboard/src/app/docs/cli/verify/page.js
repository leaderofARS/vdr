import DocLayout from '../../components/DocLayout';
import { Search, ShieldCheck, FileText, Globe, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Overview', level: 2 },
    { id: 'synopsis', title: 'Synopsis', level: 2 },
    { id: 'options', title: 'Options', level: 2 },
    { id: 'how-it-works', title: 'How it works', level: 2 },
    { id: 'examples', title: 'Examples', level: 2 },
    { id: 'outcomes', title: 'Verification Outcomes', level: 2 },
    { id: 'errors', title: 'Common Errors', level: 2 },
];

export default function CliVerifyPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">vdr verify</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Check a local file against the SipHeron VDR blockchain registry to prove its authenticity and integrity.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-4">
                    The <code className="text-purple-300">verify</code> command is the primary way to consume document proofs. It performs a "Zero-Trust" check by re-hashing your local file and asking the blockchain "Does this hash exist in your records?"
                </p>

                <h2 id="synopsis" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Synopsis
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr verify &lt;path&gt; [options]
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
                                <td className="py-3 pr-4 text-purple-300 font-mono">--mainnet</td>
                                <td className="py-3 pr-4 text-gray-400">false</td>
                                <td className="py-3 pr-4 text-gray-300">Search for the record on Solana Mainnet-Beta.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">--json</td>
                                <td className="py-3 pr-4 text-gray-400">false</td>
                                <td className="py-3 pr-4 text-gray-300">Output the result as a machine-readable JSON object.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 id="how-it-works" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How it works
                </h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-8 ml-4">
                    <li>The CLI reads the file at <code className="text-purple-300">&lt;path&gt;</code>.</li>
                    <li>It calculates the SHA-256 hash locally.</li>
                    <li>It sends a search query to the SipHeron API using the hash.</li>
                    <li>The API checks the Solana blockchain for a matching PDA.</li>
                    <li>The CLI compares the blockchain timestamp and owner with the expected values.</li>
                </ol>

                <h2 id="examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Examples
                </h2>
                
                <h3 className="text-white font-bold mb-3 mt-8">Verify a local PDF</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr verify ./contracts/signed_nda.pdf
                    </code>
                </pre>

                <h3 className="text-white font-bold mb-3 mt-8">Output JSON (for scripts)</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6 text-xs text-purple-200">
                    <code className="font-mono">
                        sipheron-vdr verify ./dist/binary.tar.gz --json
                    </code>
                </pre>

                <h2 id="outcomes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Verification Outcomes
                </h2>
                <div className="space-y-4 mb-12">
                    <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex gap-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-white">AUTHENTIC</h4>
                            <p className="text-sm text-gray-400">The file is correct, the on-chain record exists, and it has not been revoked.</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex gap-4">
                        <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-white">NOT FOUND / TAMPERED</h4>
                            <p className="text-sm text-gray-400">The file has been modified, or it was never anchored to the specified network.</p>
                        </div>
                    </div>
                </div>

                <h2 id="errors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Common Errors
                </h2>
                <div className="space-y-4 mb-16">
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">Path is a directory</h4>
                        <p className="text-xs text-gray-400 mt-1">Verification only works on individual files. You cannot verify a folder directly.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                        <h4 className="font-bold text-white text-sm">Wrong Network</h4>
                        <p className="text-xs text-gray-400 mt-1">If you anchored to Mainnet, you must use the <code className="text-purple-300">--mainnet</code> flag to verify, otherwise it will search Devnet by default.</p>
                    </div>
                </div>
            </div>
        </DocLayout>
    );
}
