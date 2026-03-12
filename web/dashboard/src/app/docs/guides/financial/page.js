import DocLayout from '../../components/DocLayout';
import { Landmark, TrendingUp, ShieldCheck, PieChart, FileCheck, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'financial-transparency', title: 'Financial Transparency', level: 2 },
    { id: 'audit-readiness', title: 'Audit Readiness', level: 2 },
    { id: 'use-cases', title: 'Key Use Cases', level: 2 },
    { id: 'audit-trail', title: 'The Immutable Audit Trail', level: 2 },
    { id: 'regulatory-compliance', title: 'Regulatory Compliance', level: 2 },
];

export default function GuideFinancialPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Guide: Financial Reporting & Audits</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Ensure the integrity of your financial disclosures, audit logs, and tax filings using blockchain-backed verification.
                </p>

                <h2 id="financial-transparency" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Financial Transparency
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    In an era of increased regulatory scrutiny, being able to prove that financial data has not been manipulated after the fact is essential for public trust and shareholder confidence. SipHeron VDR provides a "Proof of non-tampering" for every spreadsheet and report your firm produces.
                </p>

                <h2 id="audit-readiness" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Audit Readiness
                </h2>
                <p className="text-gray-300 mb-4">
                    Traditional audits involve manual sampling and verifying document versions through email chains. With SipHeron, you can provide auditors with a single list of blockchain-verified hashes for the entire fiscal year.
                </p>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-8 flex gap-3 font-light text-sm">
                    <FileCheck className="w-5 h-5 text-green-300 shrink-0" />
                    <p className="text-green-300">
                        Auditors can verify 100% of your records in seconds using our batch verification tools, rather than relying on statistical sampling.
                    </p>
                </div>

                <h2 id="use-cases" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Key Use Cases
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-bold mb-2 text-sm uppercase">Quarterly Disclosures</h4>
                        <p className="text-xs text-gray-400">Anchor 10-Q and 10-K filings to prove they haven't been modified post-submission.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-bold mb-2 text-sm uppercase">Trade Confirmations</h4>
                        <p className="text-xs text-gray-400">Lock in trade details at the moment of execution to prevent front-running disputes.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-bold mb-2 text-sm uppercase">Tax Documents</h4>
                        <p className="text-xs text-gray-400">Store immutable proofs of tax filings to streamline future government audits.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-bold mb-2 text-sm uppercase">Loan Applications</h4>
                        <p className="text-xs text-gray-400">Verify the authenticity of borrower-provided financial statements.</p>
                    </div>
                </div>

                <h2 id="audit-trail" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    The Immutable Audit Trail
                </h2>
                <p className="text-gray-300 mb-6">
                    A typical financial audit trail in SipHeron looks like this:
                </p>
                <div className="border-l-2 border-purple-500/30 ml-4 pl-6 space-y-8 mb-12">
                    <div className="relative">
                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-black" />
                        <h5 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">EOD Reconciliation</h5>
                        <p className="text-xs text-gray-400">CLI automatically anchors end-of-day balances at 11:59 PM.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-black" />
                        <h5 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Monthly Closing</h5>
                        <p className="text-xs text-gray-400">Controller anchors the final monthly report.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-black" />
                        <h5 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Annual Audit</h5>
                        <p className="text-xs text-gray-400">External auditors verify all monthly anchors using the API.</p>
                    </div>
                </div>

                <h2 id="regulatory-compliance" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Regulatory Compliance
                </h2>
                <p className="text-gray-300 mb-16 leading-relaxed text-justify">
                    SipHeron VDR helps firms meet the data integrity requirements of <strong>Sarbanes-Oxley (SOX)</strong> and <strong>GDPR</strong> by ensuring that records remain accurate and that any changes are detectable.
                </p>
            </div>
        </DocLayout>
    );
}
