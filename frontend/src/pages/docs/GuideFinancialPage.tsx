import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2002);
  };
  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border border-[#2A2A2A] rounded-t-lg">
        <span className="text-xs text-[#555]">{language}</span>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-[#555] hover:text-white transition-colors">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-[#0D0D0D] border-x border-b border-[#2A2A2A] rounded-b-lg p-4 overflow-x-auto">
        <code className="text-sm font-mono text-[#EDEDED]">{code}</code>
      </pre>
    </div>
  );
};

const GuideFinancialPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Financial Documents Guide</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Anchor financial reports, audit documents, and compliance records with 
        regulatory-compliant verification workflows.
      </p>

      <h2 id="regulatory" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Regulatory Compliance
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Meet SOX, GAAP, and IFRS requirements with immutable audit trails.
      </p>
      <ul className="space-y-3 text-gray-300 mb-8">
        <li>• SOX Section 302 and 404 compliance</li>
        <li>• Immutable financial record keeping</li>
        <li>• Auditor verification workflows</li>
        <li>• 7-year retention guarantees</li>
      </ul>

      <h2 id="workflows" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Anchoring Workflows
      </h2>
      <CodeBlock code={`# Quarterly report anchoring
sipheron-vdr anchor ./Q4-2024-Report.pdf \\
  --note "Q4 2024 Financial Report - Board Approved" \\
  --network mainnet

# Annual report with metadata
sipheron-vdr anchor ./10-K-2024.pdf \\
  --note "Form 10-K FY2024 (SEC Filed)" \\
  --network mainnet

# Audit report anchoring
sipheron-vdr anchor ./Audit-Report-2024.pdf \\
  --note "EY Audit Report FY2024" \\
  --network mainnet`} />

      <h2 id="auditor" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Auditor Verification
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Provide auditors with secure verification links:
      </p>
      <CodeBlock code={`# Generate auditor verification link
sipheron-vdr link generate HASH \\
  --password "Audit2024!" \\
  --expires 90d \\
  --note "For EY Audit Team"`} />

      <h2 id="retention" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Retention Policies
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Blockchain anchors provide permanent, tamper-proof evidence of document existence.
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Document Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Retention Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr><td className="py-3 pr-4 text-gray-300">Annual Reports (10-K)</td><td className="py-3 pr-4 text-gray-400">Permanent</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">Quarterly Reports (10-Q)</td><td className="py-3 pr-4 text-gray-400">Permanent</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">Audit Reports</td><td className="py-3 pr-4 text-gray-400">7 years</td></tr>
            <tr><td className="py-3 pr-4 text-gray-300">Bank Statements</td><td className="py-3 pr-4 text-gray-400">7 years</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuideFinancialPage;
