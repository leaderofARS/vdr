import DocLayout from '../../components/DocLayout';
import { Database, Shield, Lock, Globe, HardDrive, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'pdas-explained', title: 'Program Derived Addresses (PDAs)', level: 2 },
    { id: 'data-schema', title: 'Data Schema', level: 2 },
    { id: 'immutability-lifecycle', title: 'Immutability & Lifecycle', level: 2 },
    { id: 'storage-costs', title: 'Storage Costs (Rent)', level: 2 },
    { id: 'network-differences', title: 'Devnet vs Mainnet', level: 2 },
    { id: 'direct-access', title: 'Reading from Solana directly', level: 2 },
];

export default function OnChainConceptPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">On-Chain Storage</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    SipHeron VDR leverages Solana's high-throughput architecture to store document proofs as immutable, globally-accessible accounts.
                </p>

                <h2 id="pdas-explained" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Program Derived Addresses (PDAs).
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    Every document hash anchored by SipHeron is stored in its own Program Derived Address (PDA). A PDA is a special account on Solana that is "owned" by the SipHeron Smart Contract but addressed using a combination of your organization's ID and the document's hash.
                </p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">PDA Seed Derivation</p>
                    <code className="text-[11px] text-purple-300 font-mono">
                        [ "hash", organization_public_key, sha256_hash_bytes ]
                    </code>
                </div>

                <h2 id="data-schema" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Data Schema
                </h2>
                <p className="text-gray-300 mb-4">Each document account on-chain stores the following data structure:</p>
                <div className="overflow-x-auto mb-8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Field</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Bytes</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">version</td>
                                <td className="py-3 pr-4 text-gray-400">1</td>
                                <td className="py-3 pr-4 text-gray-300">Schema version (currently 0x01).</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">authority</td>
                                <td className="py-3 pr-4 text-gray-400">32</td>
                                <td className="py-3 pr-4 text-gray-300">The Public Key of the owning organization.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">hash</td>
                                <td className="py-3 pr-4 text-gray-400">32</td>
                                <td className="py-3 pr-4 text-gray-300">The raw SHA-256 hash bytes.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">timestamp</td>
                                <td className="py-3 pr-4 text-gray-400">8</td>
                                <td className="py-3 pr-4 text-gray-300">Unix timestamp when anchored.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">status</td>
                                <td className="py-3 pr-4 text-gray-400">1</td>
                                <td className="py-3 pr-4 text-gray-300">0=Active, 1=Revoked, 2=Expired.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 id="immutability-lifecycle" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Immutability & Lifecycle
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    Once a hash is written to the blockchain, it <strong>cannot be deleted</strong>. The smart contract only allows the <code className="text-purple-300">authority</code> of that hash to change its status to <code className="text-red-400">Revoked</code>. This ensures that even if SipHeron (the company) disappeared, your document proofs would remain valid and readable on the Solana network forever.
                </p>

                <h2 id="storage-costs" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Storage Costs (Rent)
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex gap-3">
                    <Info className="w-5 h-5 text-blue-300 shrink-0" />
                    <p className="text-blue-300 text-sm">
                        SipHeron handles all Solana transaction fees and rent-exempt deposits for you. You do not need to hold SOL to anchor documents; we abstract the blockchain costs into simple subscription tiers.
                    </p>
                </div>

                <h2 id="network-differences" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Devnet vs Mainnet
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-bold mb-2">Devnet</h4>
                        <p className="text-xs text-gray-400">Sandbox environment. Proofs are not persistent and may be reset. For testing only.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10">
                        <h4 className="text-purple-400 font-bold mb-2">Mainnet</h4>
                        <p className="text-xs text-purple-200">Production environment. Persistent, legally-admissible immutable proofs.</p>
                    </div>
                </div>

                <h2 id="direct-access" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Reading from Solana directly
                </h2>
                <p className="text-gray-300 mb-16 italic text-sm">
                    Advanced users can use the <code className="text-purple-300">@solana/web3.js</code> library to fetch and decode these accounts directly from a Solana RPC node without using the SipHeron API.
                </p>
            </div>
        </DocLayout>
    );
}
