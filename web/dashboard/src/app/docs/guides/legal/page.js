import DocLayout from '../../components/DocLayout';
import { Gavel, ShieldCheck, FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'legal-overview', title: 'Legal Admissibility Overview', level: 2 },
    { id: 'chain-of-custody', title: 'Chain of Custody', level: 2 },
    { id: 'eidas-compliance', title: 'eIDAS & ESIGN Act', level: 2 },
    { id: 'best-practices', title: 'Implementation Best Practices', level: 2 },
    { id: 'court-room', title: 'In the Courtroom', level: 2 },
    { id: 'example-case', title: 'Success Story: LawFirm X', level: 2 },
];

export default function GuideLegalPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Guide: Legal Documents & Contracts</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Learn how to use SipHeron VDR to create legally-binding, cryptographically-secure proofs of existence for sensitive legal agreements.
                </p>

                <h2 id="legal-overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Legal Admissibility Overview
                </h2>
                <p className="text-gray-300 mb-6 font-light text-justify">
                    Traditional digital documents (PDFs, Docx) are easily altered without leaving a trace. In legal disputes, proving that a specific version of a contract existed on a specific date is often the deciding factor. SipHeron replaces "trust me" with "trust the math."
                </p>

                <h2 id="chain-of-custody" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Chain of Custody
                </h2>
                <p className="text-gray-300 mb-4">
                    To maintain a strong legal position, we recommend anchoring the document at every major milestone:
                </p>
                <div className="space-y-4 mb-8">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex gap-4">
                        <span className="text-purple-400 font-bold shrink-0">Step 1</span>
                        <p className="text-sm text-gray-300">Anchor the <strong>Draft</strong> when sent to the counterparty.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex gap-4">
                        <span className="text-purple-400 font-bold shrink-0">Step 2</span>
                        <p className="text-sm text-gray-300">Anchor the <strong>Final Version</strong> before signatures.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex gap-4">
                        <span className="text-purple-400 font-bold shrink-0">Step 3</span>
                        <p className="text-sm text-gray-300">Anchor the <strong>Executed (Signed) PDF</strong> immediately after completion.</p>
                    </div>
                </div>

                <h2 id="eidas-compliance" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    eIDAS & ESIGN Act
                </h2>
                <p className="text-gray-300 mb-4">
                    SipHeron VDR satisfies the core requirements of major international e-signature and digital document laws:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-3 mb-8 ml-4">
                    <li><strong>ESIGN Act (US):</strong> Provides the "intent to sign" and "association of record" through cryptographic binding.</li>
                    <li><strong>eIDAS (EU):</strong> Supports "Electronic Time Stamps" and "Electronic Seals" requirements by providing a qualified source of time from the Solana consensus.</li>
                </ul>

                <h2 id="best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Implementation Best Practices
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
                    <h4 className="font-bold text-blue-300 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Info className="w-5 h-5" />
                        Recommendations for Legal Teams
                    </h4>
                    <ul className="list-disc list-inside text-blue-200/80 space-y-2 text-sm leading-6">
                        <li><strong>Always use Mainnet:</strong> Devnet proofs have no legal standing as the network can be reset.</li>
                        <li><strong>Metadata Storage:</strong> Store the Solana Transaction ID alongside the document in your internal Document Management System (DMS).</li>
                        <li><strong>Public Verification:</strong> Embed the SipHeron verification QR code on the last page of your contracts.</li>
                    </ul>
                </div>

                <h2 id="court-room" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    In the Courtroom
                </h2>
                <p className="text-gray-300 mb-4 leading-relaxed">
                    If a document's authenticity is challenged in court, you can provide:
                </p>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-8 ml-4">
                    <li>The original digital file.</li>
                    <li>The SipHeron <strong>Verification Certificate</strong> (downloadable from the dashboard).</li>
                    <li>A link to the public Solana Explorer showing the transaction confirmation from 100+ independent validators.</li>
                </ol>

                <h2 id="example-case" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Success Story: LawFirm X
                </h2>
                <p className="text-gray-300 mb-16 italic font-light">
                    "By integrating SipHeron VDR into our partner portal, we reduced contract dispute resolution time by 90%. When both parties can see an immutable timestamp on the blockchain, there is no room for argument about which version of the agreement is final."
                </p>
            </div>
        </DocLayout>
    );
}
