import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export const metadata = {
    title: 'Use Cases Overview | SipHeron VDR',
    description: 'Explore how organizations across legal, academic, and enterprise sectors use SipHeron VDR for document verification.',
};

export default function UseCasesPage() {
    return (
        <>
            <h1>Enterprise Use Cases</h1>
            <p className="lead text-xl text-gray-300">
                SipHeron VDR is a versatile platform designed to solve the universal problem of document tampering, data fraud, and integrity loss. In a world where digital assets are the lifeblood of commerce, having an immutable "Proof of Integrity" is no longer optional—it is a foundational requirement for trust.
            </p>

            <Callout type="info">
                <strong>Industry Compliance:</strong> Our platform is designed to align with major regulatory frameworks, including <strong>eIDAS (EU)</strong>, <strong>ESIGN Act (US)</strong>, and <strong>GDPR</strong>, by offering cryptographic evidence that is technically superior to traditional notarization.
            </Callout>

            <h2>The Pillars of Verifiable Document Registry</h2>
            <p>
                The SipHeron VDR ecosystem is built upon three primary pillars of blockchain-facilitated trust. Every use case, regardless of industry, leverages these fundamental properties to secure their digital operations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
                <div className="bg-[#1a1b20] p-6 rounded-xl border border-gray-800 hover:border-[#4285F4] transition-colors group">
                    <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <svg className="w-6 h-6 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 21a11.955 11.955 0 01-8.618-3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-3.179-1.474-6.012-3.782-7.896z"></path></svg>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Authenticity</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Confirm with absolute certainty that a document was actually issued by the organization claiming to have created it, protected by public-key cryptography.</p>
                </div>
                <div className="bg-[#1a1b20] p-6 rounded-xl border border-gray-800 hover:border-[#4285F4] transition-colors group">
                    <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Integrity</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Ensure that not a single byte of the original file has been altered or corrupted since registration. Even a one-bit change breaks the proof.</p>
                </div>
                <div className="bg-[#1a1b20] p-6 rounded-xl border border-gray-800 hover:border-[#4285F4] transition-colors group">
                    <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Timestamping</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Establish an indisputable "Proof of Existence" at a specific point in time using the sequence of the Solana global ledger.</p>
                </div>
            </div>

            <h2>Primary Industry Verticals</h2>
            <p>
                While any business with digital assets can benefit from a Verifiable Document Registry, we have identified three core sectors that have seen the most immediate and significant impact from implementing the SipHeron platform.
            </p>

            <h3>1. Legal and Compliance</h3>
            <p>
                Law firms and corporate legal departments face the constant threat of document tampering or historical revisionism. SipHeron VDR serves as a decentralized "Digital Notary." It is used to anchor contracts, NDAs, and intellectual property logs, providing a cryptographically proven chain of custody that is admissible in modern courts under electronic evidence rules.
            </p>
            <a href="/docs/use-cases/legal" className="text-[#4285F4] hover:underline text-sm font-medium inline-flex items-center gap-1">
                Read detailed Legal Use Cases <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>

            <h3>2. Academic Credentials</h3>
            <p>
                Institutional fraud, credential padding, and "diploma mills" cost employers and universities billions annually. SipHeron VDR allows educational institutions to anchor digital diplomas and transcripts directly to the blockchain, enabling instant, globally verifiable graduate authentication without manual registrar intervention.
            </p>
            <a href="/docs/use-cases/academic" className="text-[#4285F4] hover:underline text-sm font-medium inline-flex items-center gap-1">
                Read detailed Academic Use Cases <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>

            <h3>3. Enterprise Document Control</h3>
            <p>
                For large-scale corporations, maintaining strict control over internal policies, software build manifests, and security audit logs is critical for SOC2 and ISO 27001 compliance. SipHeron VDR provides an immutable audit trail for the entire enterprise document lifecycle, protecting against both external breaches and internal tampering.
            </p>
            <a href="/docs/use-cases/enterprise" className="text-[#4285F4] hover:underline text-sm font-medium inline-flex items-center gap-1">
                Read detailed Enterprise Control <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>

            <h2>The "Trust but Verify" Model</h2>
            <p>
                Traditional document registries operate on a "Trust the Provider" model. You trust that their servers are secure, their staff is honest, and their database logs are accurate. SipHeron VDR replaces this with a <strong>mathematical certainty model</strong>.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Attribute</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Legacy Trust Model</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">SipHeron VDR Model</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300 font-medium">Verification</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Manual verification of physical seals or email signatures.</td>
                            <td className="py-3 px-4 text-sm text-green-400 font-medium">Instant Cryptographic Hash Match on Solana.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300 font-medium">Revocation</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Physical recall of documents or manual status updates.</td>
                            <td className="py-3 px-4 text-sm text-green-400 font-medium">Immutable on-chain "Revoke" Instruction.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300 font-medium">Audit Trail</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Internal logs stored in a private (mutable) database.</td>
                            <td className="py-3 px-4 text-sm text-green-400 font-medium">Publicly verifiable, immutable blockchain ledger.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300 font-medium">Data Privacy</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Raw files often stored in 3rd-party cloud silos.</td>
                            <td className="py-3 px-4 text-sm text-green-400 font-medium">Zero-Knowledge (Hash only is anchored).</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Callout type="warning">
                <strong>Governance Principle:</strong> SipHeron VDR is an integrity layer, not a file storage solution. You must continue to store your physical or digital documents in your own secure repositories (S3, NAS, IPFS). The VDR provides the <em>proof</em>, not the <em>asset</em>.
            </Callout>

            <h2>Automation and Integration</h2>
            <p>
                The true power of SipHeron VDR is realized through automation. By integrating our API or CLI into your existing document management systems (DMS), you can ensure that every document is anchored automatically as it passes through your organization's approval workflows.
            </p>

            <CodeBlock
                language="bash"
                code={`# Example of automated anchoring in a CI/CD pipeline
# Generate a software build manifest
npm run build && create-manifest.js
# Anchor the manifest to SipHeron VDR
sipheron-vdr anchor ./dist/manifest.json --wait --priority high`}
            />

            <h2>Conclusion</h2>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Mitigate Risk:</strong> Significantly reduce exposure to document-related fraud and legal disputes.</li>
                <li><strong>Enhance Trust:</strong> Provide your clients and partners with a high-tech, verifiable way to confirm your assets.</li>
                <li><strong>Streamline Operations:</strong> Replace slow, manual verification processes with frictionless digital proofs.</li>
                <li><strong>Ensure Compliance:</strong> Meet and exceed the most stringent digital audit requirements.</li>
            </ul>

            <p className="text-sm text-gray-500 italic mt-12 pb-8 border-t border-gray-800 pt-8">
                If you are unsure how SipHeron VDR fits into your specific industry, please contact our consulting team for a tailored implementation workshop.
            </p>
        </>
    );
}
