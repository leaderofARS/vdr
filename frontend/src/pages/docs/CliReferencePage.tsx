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
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-[#555] hover:text-white transition-colors"
        >
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

const CliReferencePage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">CLI Reference</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Complete reference for the SipHeron VDR command-line interface. Install the CLI with
        <code className="mx-2 bg-white/10 px-2 py-0.5 rounded text-purple-300">npm install -g @sipheron/vdr-cli</code>
      </p>

      <h2 id="global-flags" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Global Flags
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        These flags can be used with any command:
      </p>
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
              <td className="py-3 pr-4 text-purple-300 font-mono">--help, -h</td>
              <td className="py-3 pr-4 text-gray-400">Show help for the current command</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--version, -v</td>
              <td className="py-3 pr-4 text-gray-400">Display CLI version information</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--json</td>
              <td className="py-3 pr-4 text-gray-400">Output results as JSON (useful for scripting)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--quiet, -q</td>
              <td className="py-3 pr-4 text-gray-400">Suppress non-essential output</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--network, -n</td>
              <td className="py-3 pr-4 text-gray-400">Specify network (devnet, testnet, mainnet)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="auth-commands" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Authentication Commands
      </h2>

      <h3 id="auth-login" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr auth login
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Authenticate with your SipHeron account. This stores a secure token for subsequent commands.
      </p>
      <CodeBlock code={`sipheron-vdr auth login
# or with credentials
sipheron-vdr auth login --email you@example.com --password YourPassword`} />

      <h3 id="auth-logout" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr auth logout
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Remove stored authentication credentials from your local machine.
      </p>
      <CodeBlock code="sipheron-vdr auth logout" />

      <h3 id="auth-whoami" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr auth whoami
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Display the currently logged-in user.
      </p>
      <CodeBlock code="sipheron-vdr auth whoami" />

      <h2 id="anchor-commands" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Anchor Commands
      </h2>

      <h3 id="anchor-create" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr anchor
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Create a cryptographic anchor for a file on the blockchain.
      </p>
      <CodeBlock code={`# Anchor a single file
sipheron-vdr anchor ./contract.pdf

# Anchor with a custom note
sipheron-vdr anchor ./contract.pdf --note "Client contract v2.1"

# Anchor to mainnet
sipheron-vdr anchor ./contract.pdf --network mainnet

# Anchor multiple files
sipheron-vdr anchor ./file1.pdf ./file2.pdf ./file3.pdf`} />

      <h4 className="text-sm font-semibold text-white mt-6 mb-2">Options</h4>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Option</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--note, -m</td>
              <td className="py-3 pr-4 text-gray-400">Add a descriptive note to the anchor</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--network, -n</td>
              <td className="py-3 pr-4 text-gray-400">Target network (devnet, testnet, mainnet)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--wait</td>
              <td className="py-3 pr-4 text-gray-400">Wait for transaction confirmation</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--batch-size</td>
              <td className="py-3 pr-4 text-gray-400">Number of files per batch (default: 100)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="verify" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr verify
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Verify that a file matches its anchored hash on the blockchain.
      </p>
      <CodeBlock code={`# Verify a file
sipheron-vdr verify ./contract.pdf

# Generate a public verification link
sipheron-vdr verify ./contract.pdf --public-link

# Verify against a specific anchor hash
sipheron-vdr verify ./contract.pdf --hash 0x7f83b165...`} />

      <h3 id="status" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr status
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Check the status of an anchor on the blockchain.
      </p>
      <CodeBlock code={`sipheron-vdr status 0x7f83b165...

# JSON output for scripting
sipheron-vdr status 0x7f83b165... --json`} />

      <h3 id="history" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr history
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        View all anchors for your organization, with optional filtering.
      </p>
      <CodeBlock code={`# List recent anchors
sipheron-vdr history

# Filter by date range
sipheron-vdr history --from 2024-01-01 --to 2024-01-31

# Search by note content
sipheron-vdr history --search "contract"`} />

      <h2 id="link-commands" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Link Commands
      </h2>

      <h3 id="link-generate" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr link generate
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Create a shareable verification link for any anchored document.
      </p>
      <CodeBlock code={`# Generate a public link
sipheron-vdr link generate 0x7f83b165...

# Create a time-limited link
sipheron-vdr link generate 0x7f83b165... --expires 7d

# Create a password-protected link
sipheron-vdr link generate 0x7f83b165... --password mysecret`} />

      <h3 id="link-list" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr link list
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        List all verification links created for your organization.
      </p>
      <CodeBlock code="sipheron-vdr link list" />

      <h2 id="stage-commands" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Stage Commands
      </h2>

      <h3 id="stage-create" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr stage
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Stage files for batch processing. This is useful when anchoring large volumes of documents.
      </p>
      <CodeBlock code={`# Stage a file
sipheron-vdr stage ./document.pdf

# Stage a directory recursively
sipheron-vdr stage ./contracts/ --recursive

# Stage with metadata
sipheron-vdr stage ./document.pdf --tag "client-abc" --category "contracts"`} />

      <h3 id="stage-commit" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        sipheron-vdr stage commit
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Anchor all staged files in a single batch operation.
      </p>
      <CodeBlock code={`# Commit staged files
sipheron-vdr stage commit

# Commit with a batch note
sipheron-vdr stage commit --note "January 2024 contracts batch"`} />

      <h2 id="examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Common Workflows
      </h2>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Contract Lifecycle</h3>
      <CodeBlock code={`# 1. Anchor the signed contract
sipheron-vdr anchor ./contract-signed.pdf --note "Client ABC - Signed Contract"

# 2. Generate a verification link for the client
sipheron-vdr link generate 0xHASH --expires 30d

# 3. Verify before archiving
sipheron-vdr verify ./contract-signed.pdf`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Batch Document Processing</h3>
      <CodeBlock code={`# Stage all legal documents
sipheron-vdr stage ./legal-documents/ --recursive --tag "legal-2024"

# Review what's staged
sipheron-vdr stage list

# Commit all at once
sipheron-vdr stage commit --note "Q1 2024 Legal Documents"`} />
    </div>
  );
};

export default CliReferencePage;
