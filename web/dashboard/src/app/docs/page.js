import Link from 'next/link';
import DocLayout from './components/DocLayout';
import CodeBlock from './components/CodeBlock';
import { Shield, Zap, Lock, Search, Globe, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const HEADINGS = [
    { id: 'what-is-sipheron', title: 'What is SipHeron VDR?', level: 2 },
    { id: 'problem-it-solves', title: 'The Problem It Solves', level: 2 },
    { id: 'document-fraud', title: 'Fighting Document Fraud', level: 3 },
    { id: 'tampering-forgery', title: 'Tampering and Forgery', level: 3 },
    { id: 'how-it-works', title: 'How It Works (Simply)', level: 2 },
    { id: 'step-1-hash', title: '1. The Fingerprint (Hash)', level: 3 },
    { id: 'step-2-anchor', title: '2. The Anchor (Blockchain)', level: 3 },
    { id: 'step-3-verify', title: '3. The Truth (Verification)', level: 3 },
    { id: 'why-solana', title: 'Why Solana?', level: 2 },
    { id: 'architecture', title: 'Architecture Overview', level: 2 },
    { id: 'key-features', title: 'Key Features', level: 2 },
    { id: 'who-is-it-for', title: 'Who is it for?', level: 2 },
    { id: 'what-it-is-not', title: 'What SipHeron VDR is NOT', level: 2 },
    { id: 'get-started', title: 'Get Started', level: 2 },
];

export default function DocsPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Introduction</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    SipHeron VDR (Vessel Daily Report) is an enterprise-grade blockchain document verification platform built on the Solana network.
                    It provides an immutable trail of truth for critical digital assets, ensuring integrity and trust across global operations.
                </p>

                <h2 id="what-is-sipheron" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    What is SipHeron VDR?
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                    At its core, SipHeron VDR is a "notary of the digital age." It allows you to take any file—a PDF contract, a financial report, an image, or a log file—and generate a cryptographic proof that the file existed in a specific state at a specific point in time.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                    Think of it as a permanent, public timestamp that cannot be faked, altered, or deleted. By "anchoring" your documents to the blockchain, you create a defensive layer of transparency that protects both you and your stakeholders.
                </p>

                <h2 id="problem-it-solves" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    The Problem It Solves
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                    Digital documents are inherently fragile. They can be modified in seconds, backdated by administrators, or deleted entirely. In sectors where trust is paramount, this creates massive liability.
                </p>

                <h3 id="document-fraud" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    Fighting Document Fraud
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                    In 2023 alone, document fraud cost enterprises billions of dollars. Traditional methods of verification—signatures, physical seals, and centralized databases—are no longer enough to combat modern forgery techniques.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                    <p className="text-blue-300 text-sm">
                        SipHeron VDR eliminates the need to trust a central authority. The blockchain serves as the ultimate, impartial witness.
                    </p>
                </div>

                <h3 id="tampering-forgery" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    Tampering and Forgery
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                    Consider a maritime vessel report or a construction safety log. If an accident occurs, the integrity of these logs is often the first thing challenged. With SipHeron, you can prove that the logs were created minutes after the event and have not been touched since.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                    <li><strong>Diplomas:</strong> Prevent degree fraud by anchoring graduation certificates.</li>
                    <li><strong>Contracts:</strong> Prove an NDA was signed on a specific date before any leaks occurred.</li>
                    <li><strong>Invoices:</strong> Verify that a payment request matches the original issued version.</li>
                    <li><strong>IP Proofs:</strong> Establish "Prior Art" for patents or creative works.</li>
                </ul>

                <h2 id="how-it-works" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How It Works (Simply)
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                    You don't need to be a blockchain expert to use SipHeron. The process can be broken down into three easy steps.
                </p>

                <h3 id="step-1-hash" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    1. The Fingerprint (Hash)
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                    Imagine taking a document and running it through a high-tech blender that spits out a unique 64-character code. This code is the <strong>hash</strong>. If you change even one tiny comma in the document, the code changes completely. This hash is the digital fingerprint of your file.
                </p>

                <h3 id="step-2-anchor" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    2. The Anchor (Blockchain)
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                    SipHeron takes that digital fingerprint and "anchors" it into the Solana blockchain. It's like carving the hash and the current time into a mountain that can never be moved. This creates a permanent, immutable record of your document's existence.
                </p>

                <h3 id="step-3-verify" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    3. The Truth (Verification)
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                    Ten years from now, anyone can take that same file and re-calculate its digital fingerprint. If it matches the one carved into the mountain, the file is 100% authentic. If it doesn't match, you know the file has been tampered with.
                </p>

                <h2 id="why-solana" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Why Solana?
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                    We chose Solana for one reason: <strong>Performance at Scale.</strong>
                </p>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Metric</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Value</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Benefit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="py-3 pr-4 text-gray-300">Block Time</td>
                                <td className="py-3 pr-4 text-purple-300">~400ms</td>
                                <td className="py-3 pr-4 text-gray-400">Near-instant transaction finality.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-gray-300">Transaction Cost</td>
                                <td className="py-3 pr-4 text-purple-300">&lt; $0.0001</td>
                                <td className="py-3 pr-4 text-gray-400">Low-cost anchoring for enterprise volume.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-gray-300">Throughput</td>
                                <td className="py-3 pr-4 text-purple-300">65,000+ TPS</td>
                                <td className="py-3 pr-4 text-gray-400">Handles thousands of document anchors simultaneously.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 id="architecture" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Architecture Overview
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                    The SipHeron VDR ecosystem is built for security and privacy. Your raw data never leaves your infrastructure.
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
{`[ Your Environment ]         [ SipHeron Cloud ]         [ Solana Blockchain ]
      │                            │                           │
      │ (Local Hashing)            │                           │
      ├───────────────────────────▶│ (Metadata & Usage)        │
      │    SHA-256 Hash Only       │                           │
      │                            ├──────────────────────────▶│ (PDA Creation)
      │                            │    Anchor Request         │   Immutable Proof
      │                            │                           │   (Hash + Time)
      │                            │◀──────────────────────────┤
      │                            │    Confirmation           │
      │◀───────────────────────────┤                           │
      │    Verification Receipt    │                           │
`}
                    </code>
                </pre>

                <h2 id="key-features" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="flex gap-4">
                        <Lock className="w-6 h-6 text-purple-400 shrink-0" />
                        <div>
                            <h4 className="font-bold text-white mb-1">Privacy First</h4>
                            <p className="text-sm text-gray-400">Files are hashed locally. SipHeron never sees or stores your document content.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Zap className="w-6 h-6 text-purple-400 shrink-0" />
                        <div>
                            <h4 className="font-bold text-white mb-1">Sub-Second Speed</h4>
                            <p className="text-sm text-gray-400">Anchor your documents in milliseconds thanks to Solana's high-speed consensus.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Globe className="w-6 h-6 text-purple-400 shrink-0" />
                        <div>
                            <h4 className="font-bold text-white mb-1">Public Verification</h4>
                            <p className="text-sm text-gray-400">Generate public verification links or QR codes for third-party auditing.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <FileText className="w-6 h-6 text-purple-400 shrink-0" />
                        <div>
                            <h4 className="font-bold text-white mb-1">Bulk Operations</h4>
                            <p className="text-sm text-gray-400">Anchor thousands of records in a single batch to save on costs and time.</p>
                        </div>
                    </div>
                </div>

                <h2 id="who-is-it-for" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Who is it for?
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                    SipHeron VDR provides value across a wide range of industries including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-8 ml-4">
                    <li><strong>Enterprises:</strong> Automating compliance audit trails (SOX, ISO, ESG).</li>
                    <li><strong>Law Firms:</strong> Ensuring the provenance and timing of legal filings.</li>
                    <li><strong>Universities:</strong> Issuing tamper-proof diplomas and transcripts.</li>
                    <li><strong>Developers:</strong> Integrating document integrity into existing SaaS platforms.</li>
                    <li><strong>Compliance Teams:</strong> Monitoring real-time operational logs for tampering.</li>
                </ul>

                <h2 id="what-it-is-not" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    What SipHeron VDR is NOT
                </h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                    <p className="text-yellow-300 text-sm">
                        ⚠️ Understanding limitations is key to a secure implementation.
                    </p>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-8 ml-4">
                    <li><strong>Not a Cloud Storage Service:</strong> We do not store your files. If you lose your document, you cannot retrieve it from SipHeron.</li>
                    <li><strong>Not a Document Reader:</strong> We cannot see what is inside your documents. We only see the mathematical fingerprint.</li>
                    <li><strong>Not a Legal Advice Service:</strong> While we provide proof of existence, the legal weight of that proof depends on your local jurisdiction.</li>
                </ul>

                <h2 id="get-started" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Get Started
                </h2>
                <p className="text-gray-300 leading-relaxed mb-8">
                    Ready to start anchoring? Follow our guides to integrate SipHeron into your workflow.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                    <Link href="/docs/quick-start" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
                        <Zap className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-bold text-white mb-1">Quick Start</h4>
                        <p className="text-sm text-gray-400">Install the CLI and anchor your first document in under 5 minutes.</p>
                    </Link>
                    <Link href="/docs/cli" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
                        <Search className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-bold text-white mb-1">CLI Reference</h4>
                        <p className="text-sm text-gray-400">Master every command and flag available in the SipHeron CLI.</p>
                    </Link>
                    <Link href="/docs/api" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
                        <CodeBlock language="bash" className="hidden" />
                        <CheckCircle2 className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-bold text-white mb-1">API Reference</h4>
                        <p className="text-sm text-gray-400">Integrate VDR programmatically with our comprehensive REST API.</p>
                    </Link>
                    <Link href="/docs/concepts/how-hashing-works" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
                        <Shield className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-bold text-white mb-1">Core Concepts</h4>
                        <p className="text-sm text-gray-400">Deep dive into hashing, anchor lifecycles, and verification models.</p>
                    </Link>
                </div>
            </div>
        </DocLayout>
    );
}
