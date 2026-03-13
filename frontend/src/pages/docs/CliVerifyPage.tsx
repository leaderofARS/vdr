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

const CliVerifyPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">sipheron-vdr verify</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Verify document integrity against blockchain anchors. The verify command recomputes 
        the file hash and compares it with the stored anchor on Solana.
      </p>

      <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Overview
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Verification proves that a document has not been modified since it was anchored. 
        This can be done locally (just checking the hash computation) or against the blockchain 
        (confirming the anchor exists and matches).
      </p>

      <h2 id="local-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Local Verification
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Verify a file against a known anchor hash without making API calls.
      </p>
      <CodeBlock code={`# Verify against a specific hash
sipheron-vdr verify ./contract.pdf --hash 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...

# Quick verify (just compute and display hash)
sipheron-vdr verify ./contract.pdf --compute-only

# Verify with detailed output
sipheron-vdr verify ./contract.pdf --hash 0x7f83b165... --verbose`} />

      <h2 id="blockchain-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Blockchain Verification
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Verify against the blockchain anchor to confirm existence and timestamp.
      </p>
      <CodeBlock code={`# Verify by anchor ID
sipheron-vdr verify ./contract.pdf --anchor-id anchor_abc123

# Auto-detect anchor by file hash
sipheron-vdr verify ./contract.pdf

# Verify on specific network
sipheron-vdr verify ./contract.pdf --network mainnet

# Generate public verification link
sipheron-vdr verify ./contract.pdf --public-link`} />

      <h2 id="batch-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Batch Verification
      </h2>
      <CodeBlock code={`# Verify multiple files
sipheron-vdr verify ./file1.pdf ./file2.pdf ./file3.pdf

# Verify directory
sipheron-vdr verify ./contracts/ --recursive

# Verify with manifest file
sipheron-vdr verify --manifest ./anchor-manifest.json

# Generate verification report
sipheron-vdr verify ./contracts/ --recursive --report ./verification-report.json`} />

      <h2 id="exit-codes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Exit Codes for CI/CD
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        The verify command returns specific exit codes for automation:
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Code</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Meaning</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-green-400 font-mono">0</td>
              <td className="py-3 pr-4 text-gray-400">Verification successful</td>
              <td className="py-3 pr-4 text-gray-400">Document matches anchor</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400 font-mono">1</td>
              <td className="py-3 pr-4 text-gray-400">Verification failed</td>
              <td className="py-3 pr-4 text-gray-400">Document has been modified</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-yellow-400 font-mono">2</td>
              <td className="py-3 pr-4 text-gray-400">Anchor not found</td>
              <td className="py-3 pr-4 text-gray-400">No matching anchor exists</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-orange-400 font-mono">3</td>
              <td className="py-3 pr-4 text-gray-400">Network error</td>
              <td className="py-3 pr-4 text-gray-400">Could not reach blockchain</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="cicd-example" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        CI/CD Pipeline Example
      </h2>
      <CodeBlock code={`# .github/workflows/verify-artifacts.yml
name: Verify Anchored Artifacts

on:
  deployment:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install SipHeron CLI
        run: npm install -g @sipheron/vdr-cli
      
      - name: Download release artifacts
        run: |
          curl -L -o release.zip ${'{{ github.event.deployment.payload.artifact_url }}'}
          unzip release.zip
      
      - name: Verify artifacts match anchor
        run: |
          sipheron-vdr verify ./release.zip \\
            --anchor-id ${'{{ github.event.deployment.payload.anchor_id }}'}
        
      - name: Alert on verification failure
        if: failure()
        run: |
          echo "::error::Artifact verification failed! Possible tampering."
          exit 1`} />

      <h2 id="output-formats" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Output Formats
      </h2>
      <CodeBlock code={`# Human-readable (default)
sipheron-vdr verify ./contract.pdf

# JSON output
sipheron-vdr verify ./contract.pdf --json

# Quiet mode (just exit code)
sipheron-vdr verify ./contract.pdf --quiet`} />

      <h3 id="json-output-example" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">JSON Output Example</h3>
      <CodeBlock code={`{
  "verified": true,
  "file": "./contract.pdf",
  "computedHash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...",
  "anchor": {
    "id": "anchor_abc123",
    "hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...",
    "timestamp": "2024-01-15T09:23:45.123Z",
    "slot": 284715623,
    "network": "mainnet",
    "solanaTx": "5UfgJ5XGUe..."
  },
  "match": true
}`} language="json" />
    </div>
  );
};

export default CliVerifyPage;
