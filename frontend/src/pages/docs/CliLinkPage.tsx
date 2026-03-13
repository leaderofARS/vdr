import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

const CliLinkPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">sipheron-vdr link</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Generate secure, shareable verification links for any anchored document. 
        Links can be public, password-protected, time-limited, or one-time use.
      </p>

      <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Overview
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Verification links allow third parties to verify document authenticity without requiring 
        a SipHeron account. When someone accesses a verification link, they can upload the document 
        and instantly confirm if it matches the anchored hash on the blockchain.
      </p>

      <h2 id="generate" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        link generate
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Create a new verification link for an existing anchor.
      </p>
      <CodeBlock code={`# Basic public link
sipheron-vdr link generate 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...

# Time-limited link (expires in 7 days)
sipheron-vdr link generate 0x7f83b165... --expires 7d

# Password-protected link
sipheron-vdr link generate 0x7f83b165... --password "secure-password-123"

# One-time use link
sipheron-vdr link generate 0x7f83b165... --one-time

# Combined: password + expiration
sipheron-vdr link generate 0x7f83b165... --password "secret" --expires 30d`} />

      <h3 id="options" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Options</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Flag</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--expires, -e</td>
              <td className="py-3 pr-4 text-gray-400">Expiration duration (e.g., 1h, 7d, 30d, 1y)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--password, -p</td>
              <td className="py-3 pr-4 text-gray-400">Password protection for the link</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--one-time</td>
              <td className="py-3 pr-4 text-gray-400">Link expires after first successful verification</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--custom-url</td>
              <td className="py-3 pr-4 text-gray-400">Custom URL slug (enterprise feature)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="list" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        link list
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        List all verification links for your organization with filtering options.
      </p>
      <CodeBlock code={`# List all links
sipheron-vdr link list

# Filter by anchor hash
sipheron-vdr link list --hash 0x7f83b165...

# Show only active links
sipheron-vdr link list --status active

# Show expired links
sipheron-vdr link list --status expired

# JSON output for scripting
sipheron-vdr link list --json`} />

      <h2 id="revoke" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        link revoke
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Immediately invalidate a verification link before its natural expiration.
      </p>
      <CodeBlock code={`# Revoke by link ID
sipheron-vdr link revoke link_abc123

# Revoke all links for an anchor
sipheron-vdr link revoke --hash 0x7f83b165... --all`} />

      <h2 id="examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Common Use Cases
      </h2>

      <h3 id="client-contract-verification" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Client Contract Verification</h3>
      <CodeBlock code={`# Create a 30-day verification link for client
LINK=$(sipheron-vdr link generate 0x7f83b165... --expires 30d --json | jq -r '.url')
echo "Share this link with your client: $LINK"

# Output: https://app.sipheron.io/verify/abc123-def456`} />

      <h3 id="secure-board-document" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Secure Board Document</h3>
      <CodeBlock code={`# Password-protected link for sensitive board materials
sipheron-vdr link generate 0x7f83b165... \\
  --password "Board2024!" \\
  --expires 7d \\
  --one-time`} />

      <h2 id="url-structure" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        URL Structure
      </h2>
      <CodeBlock code={`https://app.sipheron.io/verify/{link-id}

# Example
https://app.sipheron.io/verify/abc123-def456-ghi789

# With custom domain (enterprise)
https://verify.yourcompany.com/abc123-def456`} language="text" />

      <h2 id="security" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Security Considerations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 text-lg">✓</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Do: Use Passwords</h4>
            <p className="text-sm text-gray-400">Protect sensitive documents with passwords.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 text-lg">✓</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Do: Set Expiration</h4>
            <p className="text-sm text-gray-400">Always set reasonable expiration dates.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 text-lg">✗</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Don't: Share in Public</h4>
            <p className="text-sm text-gray-400">Avoid posting verification links publicly.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 text-lg">✗</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Don't: Forget to Revoke</h4>
            <p className="text-sm text-gray-400">Revoke links when no longer needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CliLinkPage;
