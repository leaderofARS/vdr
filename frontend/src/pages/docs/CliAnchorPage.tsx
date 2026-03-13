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

const CliAnchorPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">sipheron-vdr anchor</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Create cryptographic anchors on the Solana blockchain. The anchor command computes 
        the hash of your document and records it permanently with a timestamp.
      </p>

      <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Overview
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Anchoring creates an immutable proof that a document existed in a specific state at a 
        specific time. The process computes a SHA-256 hash locally, then submits this hash to 
        the Solana blockchain along with optional metadata.
      </p>

      <h2 id="single-file" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Single File Anchoring
      </h2>
      <CodeBlock code={`# Anchor a single file
sipheron-vdr anchor ./contract.pdf

# With a descriptive note
sipheron-vdr anchor ./contract.pdf --note "Client ABC Master Services Agreement"

# Specify network (devnet, testnet, mainnet)
sipheron-vdr anchor ./contract.pdf --network mainnet

# Wait for confirmation
sipheron-vdr anchor ./contract.pdf --wait

# JSON output for scripting
sipheron-vdr anchor ./contract.pdf --json`} />

      <h2 id="batch-anchoring" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Batch Anchoring
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Anchor multiple files in a single command. Each file gets its own anchor transaction.
      </p>
      <CodeBlock code={`# Anchor multiple files
sipheron-vdr anchor ./file1.pdf ./file2.pdf ./file3.pdf

# Anchor with wildcard (shell expansion)
sipheron-vdr anchor ./contracts/*.pdf

# Anchor directory recursively
sipheron-vdr anchor ./contracts/ --recursive

# Batch with custom batch size
sipheron-vdr anchor ./large-batch/ --recursive --batch-size 50`} />

      <h2 id="options" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Command Options
      </h2>
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
              <td className="py-3 pr-4 text-purple-300 font-mono">--note, -n</td>
              <td className="py-3 pr-4 text-gray-400">Add a descriptive note (max 280 chars)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--network</td>
              <td className="py-3 pr-4 text-gray-400">Target network: devnet, testnet, mainnet</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--recursive, -r</td>
              <td className="py-3 pr-4 text-gray-400">Process directories recursively</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--wait, -w</td>
              <td className="py-3 pr-4 text-gray-400">Wait for transaction confirmation</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--batch-size</td>
              <td className="py-3 pr-4 text-gray-400">Files per batch for large operations</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--json, -j</td>
              <td className="py-3 pr-4 text-gray-400">Output results as JSON</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--quiet, -q</td>
              <td className="py-3 pr-4 text-gray-400">Suppress non-essential output</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--dry-run</td>
              <td className="py-3 pr-4 text-gray-400">Show what would be anchored without submitting</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="output" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Understanding Output
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        When anchoring completes, you'll see detailed information:
      </p>
      <CodeBlock code={`✓ Document anchored successfully!

  Hash:       0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...
  Slot:       284715623
  Signature:  5UfgJ5XGUe... (Solana transaction signature)
  Network:    mainnet
  Timestamp:  2024-01-15T09:23:45.123Z (UTC)
  
  Explorer:   https://explorer.solana.com/tx/5UfgJ5XGUe...
  
  Verification:
  sipheron-vdr verify ./contract.pdf
  
  Public Link:
  https://app.sipheron.io/verify/abc123-def456`} />

      <h2 id="cost-estimation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Cost Estimation
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Estimate costs before anchoring to mainnet:
      </p>
      <CodeBlock code={`# Dry run to estimate costs
sipheron-vdr anchor ./contracts/ --recursive --dry-run

# Output shows estimated cost:
# Estimated cost: 0.0012 SOL (~$0.12 USD)
# Files to anchor: 50
# Network: mainnet`} />

      <h2 id="error-handling" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Error Handling
      </h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Error</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Cause</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Solution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-red-400">Insufficient funds</td>
              <td className="py-3 pr-4 text-gray-400">Not enough SOL for transaction fees</td>
              <td className="py-3 pr-4 text-gray-400">Fund your wallet with more SOL</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">Duplicate hash</td>
              <td className="py-3 pr-4 text-gray-400">File already anchored</td>
              <td className="py-3 pr-4 text-gray-400">Use --force to re-anchor or skip</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-red-400">Network timeout</td>
              <td className="py-3 pr-4 text-gray-400">Solana network congestion</td>
              <td className="py-3 pr-4 text-gray-400">Retry with higher priority fee</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Advanced Examples
      </h2>

      <h3 id="ci-cd-integration" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">CI/CD Integration</h3>
      <CodeBlock code={`# Anchor build artifacts in CI pipeline
sipheron-vdr anchor ./dist/artifacts.zip \\
  --note "Build ${'{{ github.run_number }}'} - ${'{{ github.sha }}'}" \\
  --network mainnet \\
  --json | tee anchor-result.json

# Extract verification URL for build logs
export VERIFY_URL=$(cat anchor-result.json | jq -r '.publicUrl')
echo "Anchor verification: $VERIFY_URL"`} />

      <h3 id="automated-backup-anchoring" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Automated Backup Anchoring</h3>
      <CodeBlock code={`#!/bin/bash
# backup-anchor.sh - Run via cron daily

BACKUP_DIR="/backups/$(date +%Y-%m-%d)"
LOG_FILE="/var/log/sipheron-anchor.log"

echo "[$(date)] Anchoring backup: $BACKUP_DIR" >> $LOG_FILE

sipheron-vdr anchor "$BACKUP_DIR" --recursive \\
  --note "Daily backup - $(date +%Y-%m-%d)" \\
  --network mainnet \\
  --json >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
  echo "[$(date)] Success" >> $LOG_FILE
else
  echo "[$(date)] FAILED" >> $LOG_FILE
  # Alert ops team
fi`} />
    </div>
  );
};

export default CliAnchorPage;
