import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Academic Credentials Use Cases | SipHeron VDR',
    description: 'Learn how universities and academic institutions use SipHeron VDR to issue tamper-proof digital diplomas and transcripts.',
};

export default function AcademicPage() {
    return (
        <>
            <h1>Academic Credentials and Verification</h1>
            <p className="lead text-xl text-gray-300">
                In the academic sector, a degree or transcript is a lifelong asset. Unfortunately, credential fraud is a multi-billion dollar problem. SipHeron VDR provides universities and certification bodies with an immutable registry to anchor digital credentials directly to the Solana blockchain.
            </p>

            <Callout type="info">
                <strong>Anti-Fraud Protocol:</strong> By anchoring a student's digital diploma hash to the blockchain, institutions allow future employers to verify the credential's authenticity in seconds without contacting the registrar.
            </Callout>

            <h2>Digitizing the Diploma Lifecycle</h2>
            <p>
                Traditionally, verifying an academic credential involves physical seals, notarized copies, and slow manual communication with university registrars. This process is prone to forgery and is extremely inefficient for global employers.
            </p>

            <h3>Batch Issuance and Anchoring</h3>
            <p>
                Upon graduation, an institution can use the SipHeron API to batch-register the SHA-256 hashes of all issued digital diplomas. Each diploma is tied to the University's verified <strong>Organization Identity</strong> on the Solana network.
            </p>

            <CodeBlock
                language="bash"
                code={`# Typical workflow for a University Registrar
sipheron-vdr stage ./2024_graduates/diplomas/ --recursive
sipheron-vdr anchor ./2024_graduates/diplomas/ --batch --wait
# 1,200 diplomas anchored to Solana in under 5 minutes.`}
            />

            <h2>Self-Sovereign Transcripts</h2>
            <p>
                University transcripts are frequently modified or forged for employment or graduate school applications. By anchoring transcript hashes to SipHeron VDR, the institution enables <strong>Self-Sovereign Proofs</strong>. The student holds their original PDF, and any party can verify its total integrity against the blockchain.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Feature</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Traditional Transcript</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">SipHeron VDR Transcript</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Verification Time</td><td className="py-3 px-4 text-sm text-gray-400">2-4 Weeks (Manual)</td><td className="py-3 px-4 text-sm text-green-400 font-medium">&lt; 1 Second (Automated)</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Integrity Proof</td><td className="py-3 px-4 text-sm text-gray-400">Physical Embossing/Seal</td><td className="py-3 px-4 text-sm text-green-400 font-medium">Cryptographic Hash Match</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Counterfeit Risk</td><td className="py-3 px-4 text-sm text-gray-400">High (Photoshopped)</td><td className="py-3 px-4 text-sm text-green-400 font-bold">Impossible (Non-Collidable SHA-256)</td></tr>
                    </tbody>
                </table>
            </div>

            <Callout type="warning">
                <strong>Privacy of Academic Records:</strong> Schools must NEVER upload actual student transcripts to the VDR. Only the cryptographic hash of the file is anchored, ensuring full <strong>FERPA (Family Educational Rights and Privacy Act)</strong> compliance.
            </Callout>

            <h2>Research Papers and Pre-Prints</h2>
            <p>
                In the research community, establishing "priority" for a discovery is paramount. Scholarly journals and independent researchers can anchor pre-print drafts to SipHeron VDR to create an indisputable <strong>Proof of Discovery</strong> timestamped on the global Solana ledger.
            </p>
            <p>
                This protects researchers against academic plagiarism and provides a permanent, censorship-resistant record of their work's existence prior to official publication.
            </p>

            <CodeBlock
                language="json"
                code={`// Example JSON metadata for a research paper
{
    "title": "Novel Quantum Algorithm for Prime Factorization",
    "authors": ["Dr. Alice V.", "Bob S."],
    "journal_id": "SH-RES-2024-88A",
    "hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    "solana_slot": 251029112
}`}
            />

            <h2>Streamlining Employer Verification</h2>
            <p>
                Large-scale recruiters can integrate the SipHeron API directly into their Application Tracking Systems (ATS). When a candidate uploads their digital diploma, the ATS automatically hashes the file and checks the SipHeron registry on Solana.
            </p>
            <p>
                If the hash matches a registration from a verified University public key, the candidate's education is <strong>instantly verified</strong>, eliminating the need for expensive third-party background check services.
            </p>

            <Callout type="tip">
                <strong>Verifier Components:</strong> SipHeron provides a "White-Label Verifier" React component that universities can embed on their own websites, allowing students and employers to verify documents without leaving the university's domain.
            </Callout>

            <h2>Conclusion</h2>
            <p>
                By leveraging blockchain-based verification, academic institutions move from a paper-based trust model to a <strong>digital-first integrity model</strong>. This protects the institution's reputation, supports graduate mobility, and effectively eliminates credential fraud in the modern job market.
            </p>
        </>
    );
}
