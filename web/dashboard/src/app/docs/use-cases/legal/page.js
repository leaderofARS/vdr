import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Legal & Compliance Use Cases | SipHeron VDR',
    description: 'Learn how law firms and corporate legal departments use SipHeron VDR for document integrity and chain of custody.',
};

export default function LegalPage() {
    return (
        <>
            <h1>Legal and Compliance Use Cases</h1>
            <p className="lead text-xl text-gray-300">
                In the legal sector, the validity of a document is everything. SipHeron VDR provides legal professionals and corporate compliance departments with a cryptographically secure "Digital Notary" that ensures the integrity and timing of legal filings, contracts, and internal records.
            </p>

            <Callout type="info">
                <strong>Digital Admissibility:</strong> Many jurisdictions globally are updating their evidence laws to recognize blockchain-based timestamps as prima facie evidence of integrity. SipHeron VDR's use of SHA-256 and Solana is designed to meet these stringent legal standards.
            </Callout>

            <h2>Contract Management and Integrity</h2>
            <p>
                Traditional contract management relies on mutual trust and centralized databases. If a dispute arises, proving that a specific version of a PDF was the one signed by both parties can be technically challenging. SipHeron VDR solves this by anchoring the signed contract's hash on-chain at the moment of execution.
            </p>

            <h3>Counterparty Verification</h3>
            <p>
                When you send a signed contract to a counterparty, you can include the <strong>Solana Transaction Hash</strong> as a footer in the document. The counterparty can then use the SipHeron VDR public verifier to confirm that the file they received is identical to the one you anchored.
            </p>

            <CodeBlock
                language="bash"
                code={`# Typical workflow for a Legal Associate
sipheron-vdr anchor ./signed_merger_agreement_v2.pdf --wait
# Success! Transation Signature: 5mKz...88Qp`}
            />

            <h2>Intellectual Property and NDAs</h2>
            <p>
                Proving the "First to Invent" or "First to File" is critical in intellectual property (IP) disputes. By anchoring research logs, patent drafts, or early-stage designs to the Solana blockchain, you create an immutable <strong>Proof of Existence</strong>.
            </p>
            <p>
                This proof is independent of your company's internal servers. If your internal IT systems are compromised or data is lost, the on-chain record remains a permanent, globally verifiable anchor of your IP's timeline.
            </p>

            <h3>Lifecycle of a Legal Document</h3>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Phase</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Traditional Process</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">SipHeron VDR Process</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Creation</td><td className="py-3 px-4 text-sm text-gray-400">Manual local timestamping.</td><td className="py-3 px-4 text-sm text-[#4285F4] font-medium">Local Hashing + On-Chain Anchoring.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Update</td><td className="py-3 px-4 text-sm text-gray-400">Manual version numbering (e.g., v2).</td><td className="py-3 px-4 text-sm text-[#4285F4] font-medium">Automatic revision anchoring.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Revocation</td><td className="py-3 px-4 text-sm text-gray-400">Manual "Void" stamp or email notice.</td><td className="py-3 px-4 text-sm text-red-400 font-medium">Immutable on-chain Revocation instruction.</td></tr>
                    </tbody>
                </table>
            </div>

            <Callout type="warning">
                <strong>Privacy Requirement:</strong> Legal documents contain highly sensitive personal and corporate data. SipHeron VDR's Zero-Knowledge approach ensures that only the hash is stored on Solana, maintaining full compliance with <strong>GDPR Right to Be Forgotten</strong> and other privacy mandates.
            </Callout>

            <h2>Chain of Custody for Evidence</h2>
            <p>
                In litigation, the "Chain of Custody" is the chronological documentation or paper trail that records the sequence of custody, control, transfer, analysis, and disposition of physical or electronic evidence.
            </p>
            <p>
                SipHeron VDR provides a <strong>Digital Chain of Custody</strong>. Each organization is identified by its Solana Public Key. Every modification to a file's status (Registration, Revocation) is signed by the organization's unique key, creating a verifiable audit trail that is technically superior to log files stored on an internal database.
            </p>

            <h2>Regulatory Compliance (SOC2 / ISO 27001)</h2>
            <p>
                Compliance frameworks like SOC2 and ISO 27001 require organizations to prove that their audit trails are tamper-proof. Integrating SipHeron VDR into your DevOps or Legal department directly fulfills these requirements.
            </p>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Audit Readiness:</strong> Instead of showing auditors a spreadsheet, you can point them to the public Solana ledger for absolute proof of data integrity.</li>
                <li><strong>Access Control:</strong> Use SipHeron's IAM to ensure that only authorized legal personnel can anchor high-value contracts.</li>
                <li><strong>Immutable Timestamps:</strong> Eliminate the possibility of "backdating" logs or contracts—a common concern for auditors.</li>
            </ul>

            <CodeBlock
                language="json"
                code={`// Example JSON audit log for a legal filing
{
    "document": "BoardResolution_2024_Q1.pdf",
    "hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    "on_chain_signature": "5mKz72wP...",
    "anchored_at": "2024-03-08T09:15:22Z",
    "issuer": "LawFirm_GeneralCounsel"
}`}
            />

            <Callout type="tip">
                <strong>Legal Tech Integrations:</strong> Many law firms use SipHeron's API to integrate blockchain verification directly into established practice management systems like Clio or iManage.
            </Callout>

            <h2>Conclusion</h2>
            <p>
                By leveraging SipHeron VDR, legal departments move from a trust-based model to a <strong>cryptographically proven</strong> model. This reduces the friction of verification, lowers the cost of litigation, and provides absolute certainty to all parties involved in a legal transaction.
            </p>
        </>
    );
}
