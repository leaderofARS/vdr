import DocLayout from '../../components/DocLayout';
import { Shield, CheckCircle2, XCircle, Search, Globe, QrCode } from 'lucide-react';

const HEADINGS = [
    { id: 'verification-overview', title: 'What is Verification?', level: 2 },
    { id: 'cli-verification', title: 'CLI Verification', level: 2 },
    { id: 'public-verification', title: 'Public URL Verification', level: 2 },
    { id: 'qr-codes', title: 'QR Code Integration', level: 2 },
    { id: 'outcomes', title: 'Verification Outcomes', level: 2 },
    { id: 'independent-verification', title: 'Independent Verification', level: 2 },
];

export default function VerificationConceptPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Verification Model</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    SipHeron VDR provides multiple ways to prove that a document in your possession matches its original blockchain-anchored state.
                </p>

                <h2 id="verification-overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    What is Verification?
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    Verification is the process of re-computing a file's hash locally and comparing that hash to the record stored on the Solana blockchain. If the hashes match, the document is definitively authentic. If even a single byte has been changed, the hashes will mismatch.
                </p>

                <h2 id="cli-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    CLI Verification
                </h2>
                <p className="text-gray-300 mb-4">
                    Best for automated systems and developers. Hashing happens locally, and only the hash is sent to the SipHeron API to check against the blockchain.
                </p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm leading-8">vdr verify ./contract_final.pdf</code>
                </div>

                <h2 id="public-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Public URL Verification
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    Each anchored document has a unique public verification URL. This allows third parties (like auditors or clients) to verify a document without needing a SipHeron account or technical knowledge.
                </p>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center gap-4 mb-8">
                    <Globe className="text-blue-400" />
                    <code className="text-[10px] text-gray-400 font-mono">https://app.sipheron.com/v/85e17e3073507d3910c85...</code>
                </div>

                <h2 id="qr-codes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    QR Code Integration
                </h2>
                <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
                    <div className="p-6 bg-white rounded-2xl flex items-center justify-center border-8 border-purple-500/20">
                        <QrCode className="text-black" size={80} />
                    </div>
                    <p className="text-sm text-gray-400 italic flex-1">
                        "For high-stakes documents, we recommend printing the SipHeron QR code directly onto physical copies. This bridges the gap between digital immutability and the physical world."
                    </p>
                </div>

                <h2 id="outcomes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Verification Outcomes
                </h2>
                <div className="space-y-4 mb-12">
                    <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex gap-4">
                        <CheckCircle2 className="text-green-500 shrink-0" />
                        <div>
                            <h5 className="text-white font-bold text-sm">Authentic</h5>
                            <p className="text-xs text-gray-400">The file is identical to the one anchored on-chain.</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex gap-4">
                        <XCircle className="text-red-500 shrink-0" />
                        <div>
                            <h5 className="text-white font-bold text-sm">Tampered / Modified</h5>
                            <p className="text-xs text-gray-400">The file has been changed after it was anchored.</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-4">
                        <Search className="text-yellow-500 shrink-0" />
                        <div>
                            <h5 className="text-white font-bold text-sm">Not Found</h5>
                            <p className="text-xs text-gray-400">This hash has never been anchored to the blockchain.</p>
                        </div>
                    </div>
                </div>

                <h2 id="independent-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Independent Verification
                </h2>
                <p className="text-gray-300 mb-16">
                    Because your proofs are on the public Solana blockchain, you do not actually need SipHeron to verify them. Any Solana explorer (like Solscan or Solana.fm) can be used to see the hash stored in your organization's PDA, providing ultimate trust and decentralization.
                </p>
            </div>
        </DocLayout>
    );
}
