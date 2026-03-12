import DocLayout from '../../components/DocLayout';
import { Database, Zap, Clock, CheckCircle2, AlertTriangle, XCircle, RotateCw } from 'lucide-react';

const HEADINGS = [
    { id: 'lifecycle-overview', title: 'Lifecycle Overview', level: 2 },
    { id: 'stage-phase', title: 'Stage Phase', level: 2 },
    { id: 'anchor-phase', title: 'Anchor Phase', level: 2 },
    { id: 'pending-phase', title: 'Pending Phase', level: 2 },
    { id: 'confirmed-phase', title: 'Confirmed Phase', level: 2 },
    { id: 'what-is-pda', title: 'What is a PDA?', level: 2 },
    { id: 'on-chain-vs-off-chain', title: 'On-Chain vs Off-Chain Data', level: 2 },
    { id: 'failed-anchors', title: 'Failed Anchors', level: 2 },
    { id: 'revocation', title: 'Revocation', level: 2 },
    { id: 'expiry', title: 'Expiry', level: 2 },
];

export default function AnchorLifecyclePage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Anchor Lifecycle</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    From your local file to an immutable blockchain record. Follow the journey of a document through the SipHeron VDR ecosystem.
                </p>

                <h2 id="lifecycle-overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Lifecycle Overview
                </h2>
                <p className="text-gray-300 mb-8">
                    An "anchor" is more than just a transaction; it represents the state of your document in the eyes of the blockchain.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 py-8 px-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">1</div>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Stage</span>
                    </div>
                    <div className="hidden md:block h-px w-20 bg-white/10" />
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">2</div>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Anchor</span>
                    </div>
                    <div className="hidden md:block h-px w-20 bg-white/10" />
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 mb-2">3</div>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Pending</span>
                    </div>
                    <div className="hidden md:block h-px w-20 bg-white/10" />
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-2">4</div>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Confirmed</span>
                    </div>
                </div>

                <h2 id="stage-phase" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Stage Phase
                </h2>
                <p className="text-gray-300 mb-4">
                    Staging is the "waiting room" for your documents. When you run <code className="text-purple-300">sipheron-vdr stage</code>, the CLI does the following:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                    <li>Computes the SHA-256 hash locally.</li>
                    <li>Records the local file path and metadata in a hidden <code className="text-purple-300">.vdr</code> folder.</li>
                    <li>Prepares the batch for submission to the API.</li>
                </ul>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                    <p className="text-blue-300 text-sm">
                        <strong>Why stage?</strong> Staging allows you to group hundreds of files together and anchor them in a single transaction, significantly reducing costs and API calls.
                    </p>
                </div>

                <h2 id="anchor-phase" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Anchor Phase
                </h2>
                <p className="text-gray-300 mb-4">
                    Running <code className="text-purple-300">sipheron-vdr anchor</code> triggers the actual transmission of hashes to the blockchain.
                </p>
                <p className="text-gray-300 mb-6">
                    The SipHeron API receives your batch of hashes and triggers a transaction on the Solana network. This transaction calls our smart contract to create a <strong>PDA account</strong> for every unique hash in the batch.
                </p>

                <h2 id="pending-phase" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Pending Phase
                </h2>
                <p className="text-gray-300 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    Duration: ~400ms to 2.5s
                </p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    Once submitted, the transaction enters the Solana mempool and is processed by the current leader. During this phase, the record is visible in the SipHeron Dashboard as <strong>PENDING</strong>. We are waiting for "Finalized" status from the cluster.
                </p>

                <h2 id="confirmed-phase" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Confirmed Phase
                </h2>
                <p className="text-gray-300 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Status: Immutable & Final
                </p>
                <p className="text-gray-300 mb-6">
                    A record becomes <strong>CONFIRMED</strong> once at least 66% of Solana validators have reached consensus on the transaction. At this point, the proof is mathematically permanent. You can now view the record on any Solana Explorer and generate verification receipts.
                </p>

                <h2 id="what-is-pda" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    What is a PDA?
                </h2>
                <p className="text-gray-300 mb-4">
                    A <strong>Program Derived Address</strong> (PDA) is a specific type of account on Solana that is controlled by a smart contract. We use PDAs to store your document proofs.
                </p>
                <p className="text-gray-300 mb-6">
                    The address of the PDA is derived from the SHA-256 hash itself. This means to find a proof on the blockchain, you don't need a database—you just need the file and the SipHeron program ID.
                </p>

                <h2 id="on-chain-vs-off-chain" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    On-Chain vs Off-Chain Data
                </h2>
                <div className="overflow-x-auto mb-12">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Data Point</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Stored On-Chain</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Stored Off-Chain (DB)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="py-3 pr-4 text-gray-300 font-medium">Document Hash</td>
                                <td className="py-3 pr-4 text-green-400">Yes (Permanent)</td>
                                <td className="py-3 pr-4 text-green-400">Yes</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-gray-300 font-medium">Timestamp</td>
                                <td className="py-3 pr-4 text-green-400">Yes (Block Time)</td>
                                <td className="py-3 pr-4 text-green-400">Yes</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-gray-300 font-medium">Organization ID</td>
                                <td className="py-3 pr-4 text-green-400">Yes (Owner Wallet)</td>
                                <td className="py-3 pr-4 text-green-400">Yes</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-gray-300 font-medium">Original Filename</td>
                                <td className="py-3 pr-4 text-red-400">No</td>
                                <td className="py-3 pr-4 text-green-400">Yes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 id="failed-anchors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Failed Anchors
                </h2>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-300 shrink-0" />
                    <div>
                        <h4 className="font-bold text-red-300 mb-1">Blockchain Congestion</h4>
                        <p className="text-red-300/80 text-sm">
                            Occasionally, the Solana network may drop a transaction due to extreme congestion.
                        </p>
                    </div>
                </div>
                <p className="text-gray-300 mb-4">
                    If an anchor fails, the CLI will automatically retry up to 3 times. If it still fails, the hashes remain in your <code className="text-purple-300">staging</code> folder. You can safely run <code className="text-purple-300">sipheron-vdr anchor</code> again to retry the entire batch.
                </p>

                <h2 id="revocation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Revocation
                </h2>
                <p className="text-gray-300 mb-4">
                    While a blockchain record is immutable (cannot be deleted), It <strong>can</strong> be marked as no longer valid.
                </p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    When you revoke a hash via the dashboard or CLI, we update the state in our database. More importantly, we can submit a "Revocation" transaction to the blockchain that updates the metadata flag on the PDA. This informs any public verification tools that the document is no longer trusted by its owner.
                </p>

                <h2 id="expiry" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Expiry
                </h2>
                <p className="text-gray-300 mb-4">
                    Documents are permanent by default, but you can set an optional <strong>Expiry Date</strong> when staging.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-16 ml-4">
                    <li><strong>Before Expiry:</strong> Verification returns <code className="text-green-400">AUTHENTIC</code>.</li>
                    <li><strong>After Expiry:</strong> Verification returns <code className="text-yellow-400">EXPIRED</code>.</li>
                </ul>
            </div>
        </DocLayout>
    );
}
