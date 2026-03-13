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

const GuideLegalPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Legal Documents Guide</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Anchor contracts, NDAs, court filings, and other legal documents with 
        court-admissible proof of existence and integrity.
      </p>

      <h2 id="admissibility" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Court Admissibility
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Blockchain anchors provide evidence that meets legal standards for:
      </p>
      <ul className="space-y-3 text-gray-300 mb-8">
        <li>• Proof of existence at a specific time</li>
        <li>• Document integrity verification</li>
        <li>• Immutable audit trails</li>
        <li>• ESIGN Act and eIDAS compliance</li>
      </ul>

      <h2 id="contract-workflow" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Contract Anchoring Workflow
      </h2>
      <CodeBlock code={`# Step 1: Anchor signed contract
sipheron-vdr anchor ./contract-signed.pdf \\
  --note "Client ABC MSA - Executed 2024-01-15" \\
  --network mainnet

# Step 2: Generate verification link for client
sipheron-vdr link generate HASH \\
  --expires 1y \\
  --note "For Client ABC"

# Step 3: Store anchor ID in contract management system
echo "Contract anchored: HASH" >> contract-registry.txt`} />

      <h2 id="nda" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        NDA Management
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Track NDA executions and verify authenticity:
      </p>
      <CodeBlock code={`# Anchor executed NDA
sipheron-vdr anchor ./NDA-Partner-XYZ.pdf \\
  --note "NDA - Partner XYZ - Executed" \\
  --network mainnet

# Batch anchor multiple NDAs
sipheron-vdr anchor ./NDAs/*.pdf --recursive \\
  --note "Q1 2024 NDA Batch" \\
  --network mainnet`} />

      <h2 id="litigation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Litigation Support
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Preserve evidence and create verifiable discovery records:
      </p>
      <CodeBlock code={`# Anchor evidence file
sipheron-vdr anchor ./evidence-exhibit-a.pdf \\
  --note "Case 2024-001 - Exhibit A - Evidence" \\
  --network mainnet

# Generate court-ready verification
sipheron-vdr verify ./evidence-exhibit-a.pdf --json > exhibit-a-verification.json`} />

      <h2 id="best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Legal Best Practices
      </h2>
      <ul className="space-y-3 text-gray-300 mb-8">
        <li>• Use descriptive notes with dates and parties</li>
        <li>• Anchor on mainnet for legal documents</li>
        <li>• Generate verification links for counterparties</li>
        <li>• Export anchor history for compliance</li>
        <li>• Store anchor IDs in contract management systems</li>
      </ul>
    </div>
  );
};

export default GuideLegalPage;
