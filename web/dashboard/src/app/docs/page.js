import CodeBlock from './components/CodeBlock';
import Callout from './components/Callout';

export const metadata = {
    title: 'Introduction to SipHeron VDR',
    description: 'Learn about the enterprise-grade blockchain document verification platform.',
};

export default function IntroductionPage() {
    return (
        <>
            <h1>Introduction to SipHeron VDR</h1>
            <p className="lead text-xl text-gray-300">
                Welcome to the official documentation for SipHeron VDR (Verifiable Document Registry). This comprehensive resource is designed to guide you through the implementation and management of an enterprise-grade document integrity system. SipHeron VDR empowers organizations to establish immutable proof of existence, authenticity, and integrity for their most critical digital assets without compromising data privacy.
            </p>

            <Callout type="info">
                <strong>Enterprise Readiness:</strong> SipHeron VDR is built to handle millions of document registrations with sub-second finality. Whether you are a legal firm, an academic institution, or a global corporation, our platform provides the scalability and security required for mission-critical operations.
            </Callout>

            <h2>The Problem: Document Fraud and Tampering</h2>
            <p>
                In an increasingly digitized world, the ability to trust the origins and integrity of digital files has become a significant challenge. Traditional document verification methods are often slow, expensive, and reliant on centralized authorities that create single points of failure.
            </p>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Physical Notarization:</strong> Slow, manual, and easily forged with modern scanning equipment.</li>
                <li><strong>Centralized Registries:</strong> Vulnerable to database tampering by privileged insiders or sophisticated external attackers.</li>
                <li><strong>E-Signature Services:</strong> While useful for signing, they often store the full content of sensitive documents in their own cloud environments, creating a massive privacy risk.</li>
            </ul>

            <h2>The Solution: SipHeron VDR</h2>
            <p>
                SipHeron VDR revolutionizes document verification by leveraging the power of the <strong>Solana Blockchain</strong>. Instead of storing the document itself, we store a cryptographic "anchor"—a unique SHA-256 hash that represents the file.
            </p>
            <p>
                This approach provides three fundamental guarantees:
            </p>
            <ol className="list-decimal ml-6 my-6 space-y-4 text-gray-300">
                <li><strong>Proof of Existence (PoE):</strong> Establishing that a specific file existed at a specific point in time.</li>
                <li><strong>Proof of Integrity (PoI):</strong> Ensuring that the file has never been modified since its registration.</li>
                <li><strong>Proof of Authenticity (PoA):</strong> Confirming that the file was registered by a verified, authoritative issuer.</li>
            </ol>

            <div className="bg-[#1a1b20] p-6 rounded-lg my-6 border border-gray-800 font-mono text-sm overflow-x-auto text-[#4285F4]">
                <pre>{`
  Global Integrity Lifecycle:
  [ File Created ] -> [ Local Hashing ] -> [ API Relay ] -> [ Solana Anchor ]
                                                                   |
                                                                   V
  [ Public Verification ] <- [ Query Solana ] <- [ Re-hash File ] <---
        `}</pre>
            </div>

            <h2>Technical Foundations</h2>
            <p>
                The SipHeron VDR platform is built on several key technical pillars that ensure its security and scalability.
            </p>

            <h3>SHA-256 Cryptographic Hashing</h3>
            <p>
                At the heart of our system is the SHA-256 algorithm. This industry-standard hash function is irreversible and non-collidable for all practical applications. Even changing a single character in a 100-page lease agreement will result in a completely different 64-character hash string.
            </p>

            <h3>The Solana Network</h3>
            <p>
                We chose Solana for its incredible throughput and near-instant transaction finality. With over 2,000 transactions per second (TPS) and 400ms block times, Solana allows enterprises to anchor thousands of documents in real-time, unlike traditional blockchains like Ethereum or Bitcoin.
            </p>

            <h3>Zero-Knowledge Privacy Architecture</h3>
            <p>
                SipHeron VDR follows a <strong>Zero-Knowledge</strong> data model. We NEVER ask you to upload your sensitive PDFs or binary files. All hashing happens on your infrastructure (via the CLI or SDK). Our servers and the blockchain only ever see the irreversable hash.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Specification</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Detail</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Program ID</td><td className="py-3 px-4 text-sm font-mono text-gray-400">6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Network</td><td className="py-3 px-4 text-sm text-gray-400">Solana Mainnet-Beta</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Finality</td><td className="py-3 px-4 text-sm text-gray-400">&lt; 1 Second</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Hashing</td><td className="py-3 px-4 text-sm text-gray-400">SHA-256 (NIST Standard)</td></tr>
                    </tbody>
                </table>
            </div>

            <h2>Core Ecosystem Components</h2>
            <p>
                Integrating SipHeron VDR is achieved through several interacting components designed for different use cases and technological maturity levels.
            </p>

            <h3>1. sipheron-vdr CLI</h3>
            <p>
                The command-line interface is the primary tool for system administrators and developers. It provides local wallet management, file hashing, and synchronization with the VDR API. It is ideally suited for bulk processing and server-side automation.
            </p>

            <h3>2. REST API</h3>
            <p>
                For deep engineering integrations, our REST API provides endpoints for programmatic registration, verification, and revocation. It acts as a high-performance relay to the Solana network, handling transaction subsidization and network retries.
            </p>

            <h3>3. VDR Dashboard</h3>
            <p>
                The web-based dashboard provides a high-level overview of your organization's document health. Manage identities, view registration history, and handle organizational billing and IAM settings through a clean, intuitive interface.
            </p>

            <h3>4. Public Verifier / Explorer</h3>
            <p>
                A public-facing utility that allows anyone with a copy of the original file and the transaction signature to verify the document's authenticity against the public Solana ledger.
            </p>

            <Callout type="warning">
                <strong>A Note on Document Storage:</strong> SipHeron VDR is NOT a cloud storage provider. You are responsible for the physical storage of your original documents. If you lose the original file, you cannot "download" it from SipHeron or the blockchain—only the proof remains.
            </Callout>

            <h2>Global Use Cases</h2>
            <p>
                Our platform is utilized across diverse industries to solve a variety of data integrity challenges:
            </p>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Legal:</strong> Immutable anchoring of contracts, NDAs, and board resolutions to prevent retroactive tampering.</li>
                <li><strong>Academic:</strong> Issuance of digital, tamper-proof diplomas and transcripts that employers can verify instantly.</li>
                <li><strong>Enterprise:</strong> Secure logging of internal financial reports and software build manifests for compliance auditing.</li>
                <li><strong>Government:</strong> Issuance of digital certificates, permits, and titles with unforgeable timestamps.</li>
            </ul>

            <CodeBlock
                language="bash"
                code={`# Simple verification flow used worldwide
sipheron-vdr verify ./contracts/Agreement_Final.pdf
# Result: VERIFIED ON-CHAIN
# Issuer: LegalDept (6mKz...)
# Timestamp: 2024-03-08 14:30:00 UTC`}
            />

            <h2>Security and Compliance Standards</h2>
            <p>
                SipHeron VDR is built with an uncompromising focus on security. Our smart contracts have been audited by top-tier firms, and our cloud infrastructure follows NIST and SOC2 security guidelines.
            </p>
            <p>
                We utilize <strong>AES-256-GCM</strong> encryption for all sensitive keys at rest and enforce <strong>TLS 1.3</strong> for all data in transit. By combining institutional-grade security with decentralized blockchain technology, we provide the most secure document registry on the market.
            </p>

            <h2>Getting Started with Your Integration</h2>
            <p>
                Ready to build the future of document verification? Follow our curated paths to get started in minutes.
            </p>

            <div className="flex flex-wrap gap-4 my-8">
                <a href="/docs/quickstart" className="px-6 py-3 bg-[#4285F4] text-white font-semibold rounded-lg hover:bg-blue-600 transition-shadow shadow-lg shadow-blue-500/20">
                    Quickstart Guide
                </a>
                <a href="/docs/api" className="px-6 py-3 bg-[#1a1b20] text-gray-200 border border-gray-800 font-semibold rounded-lg hover:bg-[#24252a] transition-all">
                    API Reference
                </a>
                <a href="/docs/use-cases" className="px-6 py-3 bg-[#1a1b20] text-gray-200 border border-gray-800 font-semibold rounded-lg hover:bg-[#24252a] transition-all">
                    Explore Use Cases
                </a>
            </div>

            <p className="text-sm text-gray-500 italic mt-12 pb-8 border-t border-gray-800 pt-8">
                Last updated: March 2024. For further assistance, contact our technical support team at support@sipheron.com or join our developer community.
            </p>
        </>
    );
}
