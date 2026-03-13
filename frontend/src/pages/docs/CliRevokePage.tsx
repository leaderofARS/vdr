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

const CliRevokePage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">sipheron-vdr revoke</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Revoke anchors to mark them as invalid. Revocation creates a permanent record 
        on the blockchain that the document should no longer be trusted.
      </p>

      <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Overview
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Revocation is used when a document should no longer be considered valid—such as when 
        a contract is terminated, a certificate expires, or a document was anchored in error. 
        The revocation itself is recorded on-chain, creating an immutable audit trail.
      </p>
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-6">
        <p className="text-sm text-yellow-300">
          <strong>Important:</strong> Revocation is permanent and cannot be undone. The original 
          anchor remains on the blockchain, but it will be marked as revoked in all verifications.
        </p>
      </div>

      <h2 id="single-revoke" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Revoke Single Anchor
      </h2>
      <CodeBlock code={`# Revoke by anchor ID
sipheron-vdr revoke anchor_abc123

# Revoke with reason
sipheron-vdr revoke anchor_abc123 --reason "Contract terminated by mutual agreement"

# Revoke by hash
sipheron-vdr revoke --hash 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...

# Force revocation without confirmation
sipheron-vdr revoke anchor_abc123 --force`} />

      <h2 id="bulk-revoke" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Bulk Revocation
      </h2>
      <CodeBlock code={`# Revoke multiple anchors
sipheron-vdr revoke anchor_abc123 anchor_def456 anchor_ghi789

# Revoke from file list
sipheron-vdr revoke --file ./anchors-to-revoke.txt

# Revoke all anchors matching search
sipheron-vdr revoke --search "expired-certificates" --bulk`} />

      <h2 id="revocation-types" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Revocation Types
      </h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-orange-400">expired</td>
              <td className="py-3 pr-4 text-gray-400">Document exceeded valid period</td>
              <td className="py-3 pr-4 text-gray-400">Certificates, licenses</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">terminated</td>
              <td className="py-3 pr-4 text-gray-400">Agreement ended prematurely</td>
              <td className="py-3 pr-4 text-gray-400">Contracts, NDAs</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-400">superseded</td>
              <td className="py-3 pr-4 text-gray-400">Replaced by newer version</td>
              <td className="py-3 pr-4 text-gray-400">Documents, policies</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-yellow-400">error</td>
              <td className="py-3 pr-4 text-gray-400">Anchored by mistake</td>
              <td className="py-3 pr-4 text-gray-400">Test files, duplicates</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-400">other</td>
              <td className="py-3 pr-4 text-gray-400">Custom reason provided</td>
              <td className="py-3 pr-4 text-gray-400">Any other reason</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="check-status" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Check Revocation Status
      </h2>
      <CodeBlock code={`# Check if anchor is revoked
sipheron-vdr revoke --check anchor_abc123

# List all revoked anchors
sipheron-vdr history --status revoked

# Show revocation details
sipheron-vdr status anchor_abc123`} />

      <h3 id="revocation-output" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Revocation Output</h3>
      <CodeBlock code={`⚠ Anchor Revoked: anchor_abc123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Original Anchor:
    Hash:         0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...
    Timestamp:    2024-01-15T09:23:45.123Z
    
  Revocation:
    Type:         terminated
    Reason:       Contract terminated by mutual agreement
    Revoked At:   2024-02-01T14:30:00.000Z
    Revoked By:   user@example.com
    Tx Signature: 3xK9mNpQr...
    
  Status:         ❌ REVOKED - Do not trust this document`} />

      <h2 id="verification-behavior" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Verification Behavior
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        When verifying a revoked document:
      </p>
      <CodeBlock code={`$ sipheron-vdr verify ./contract.pdf --anchor-id anchor_abc123

⚠ Verification Result: REVOKED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  The document hash matches the anchor, BUT:
  
  ❌ This anchor has been REVOKED
  
  Revocation Details:
    Type:   terminated
    Reason: Contract terminated by mutual agreement
    Date:   2024-02-01T14:30:00.000Z
  
  Do not trust this document for official purposes.`} />

      <h2 id="best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Best Practices
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 text-lg">✓</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Always Provide Reason</h4>
            <p className="text-sm text-gray-400">Include clear revocation reason for audit trail.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 text-lg">✓</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Notify Stakeholders</h4>
            <p className="text-sm text-gray-400">Inform parties when revoking shared documents.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 text-lg">✗</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Don't Revoke Arbitrarily</h4>
            <p className="text-sm text-gray-400">Revocation is permanent—use with caution.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 text-lg">✗</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Don't Lose Revocation Tx</h4>
            <p className="text-sm text-gray-400">Save revocation signatures for your records.</p>
          </div>
        </div>
      </div>

      <h2 id="compliance" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Compliance Considerations
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Revocation creates an immutable audit trail that may be required for compliance:
      </p>
      <CodeBlock code={`# Export revocation records for audit
sipheron-vdr history --status revoked --from 2024-01-01 --json > revocations.json

# Generate revocation report
sipheron-vdr history --status revoked --csv > revocation-report.csv`} />
    </div>
  );
};

export default CliRevokePage;
