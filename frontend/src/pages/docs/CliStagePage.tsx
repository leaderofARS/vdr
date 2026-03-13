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

const CliStagePage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">sipheron-vdr stage</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Stage files for batch anchoring. The staging area lets you prepare multiple files 
        before committing them to the blockchain in a single operation.
      </p>

      <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Overview
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Staging is useful when you need to anchor multiple files together, such as a contract 
        with its appendices, or when preparing a batch of documents for periodic anchoring. 
        Files in the staging area are hashed locally but not yet submitted to the blockchain.
      </p>

      <h2 id="stage-add" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        stage add
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Add files or directories to the staging area.
      </p>
      <CodeBlock code={`# Stage a single file
sipheron-vdr stage add ./contract.pdf

# Stage a directory recursively
sipheron-vdr stage add ./contracts/ --recursive

# Stage with metadata tags
sipheron-vdr stage add ./contract.pdf --tag "client-abc" --category "legal"

# Stage multiple files
sipheron-vdr stage add ./file1.pdf ./file2.pdf ./file3.pdf

# Stage with note
sipheron-vdr stage add ./report.pdf --note "Q4 Financial Report"`} />

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
              <td className="py-3 pr-4 text-purple-300 font-mono">--recursive, -r</td>
              <td className="py-3 pr-4 text-gray-400">Stage directories recursively</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--tag, -t</td>
              <td className="py-3 pr-4 text-gray-400">Add a tag for organization</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--category, -c</td>
              <td className="py-3 pr-4 text-gray-400">Assign a category</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--note, -n</td>
              <td className="py-3 pr-4 text-gray-400">Add a descriptive note</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">--glob</td>
              <td className="py-3 pr-4 text-gray-400">Use glob pattern for matching</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="stage-list" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        stage list
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        View all files currently in the staging area.
      </p>
      <CodeBlock code={`# List staged files
sipheron-vdr stage list

# List with full details
sipheron-vdr stage list --verbose

# Filter by tag
sipheron-vdr stage list --tag "client-abc"

# JSON output
sipheron-vdr stage list --json`} />

      <h2 id="stage-remove" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        stage remove
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Remove files from the staging area.
      </p>
      <CodeBlock code={`# Remove specific file
sipheron-vdr stage remove ./contract.pdf

# Remove by pattern
sipheron-vdr stage remove --pattern "*.tmp"

# Remove all staged files
sipheron-vdr stage remove --all`} />

      <h2 id="stage-clear" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        stage clear
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Clear all files from the staging area.
      </p>
      <CodeBlock code={`# Clear staging area
sipheron-vdr stage clear

# Clear with confirmation prompt bypass
sipheron-vdr stage clear --force`} />

      <h2 id="stage-commit" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        stage commit
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Anchor all staged files to the blockchain in a batch operation.
      </p>
      <CodeBlock code={`# Commit all staged files
sipheron-vdr stage commit

# Commit with batch note
sipheron-vdr stage commit --note "January 2024 Legal Documents"

# Commit to specific network
sipheron-vdr stage commit --network mainnet

# Dry run (show what would be anchored)
sipheron-vdr stage commit --dry-run

# Commit with progress bar
sipheron-vdr stage commit --progress`} />

      <h2 id="workflows" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Common Workflows
      </h2>

      <h3 id="monthly-document-batch" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Monthly Document Batch</h3>
      <CodeBlock code={`#!/bin/bash
# monthly-anchor.sh - Run at end of month

echo "Staging monthly documents..."
sipheron-vdr stage add ./monthly-reports/ --recursive --tag "monthly-$(date +%Y-%m)"
sipheron-vdr stage add ./invoices/ --recursive --tag "invoices-$(date +%Y-%m)"

echo "Committing to blockchain..."
sipheron-vdr stage commit \\
  --note "Monthly batch: $(date +%B\ %Y)" \\
  --network mainnet

echo "Generating verification summary..."
sipheron-vdr stage list --json > "anchored-$(date +%Y-%m).json"

# Clear for next month
sipheron-vdr stage clear`} />

      <h3 id="contract-package-anchoring" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Contract Package Anchoring</h3>
      <CodeBlock code={`# Stage main contract and all appendices
sipheron-vdr stage add ./contract-main.pdf --tag "client-xyz" --category "master"
sipheron-vdr stage add ./appendices/ --recursive --tag "client-xyz" --category "appendix"
sipheron-vdr stage add ./exhibits/ --recursive --tag "client-xyz" --category "exhibit"

# Review what's staged
echo "Staged files:"
sipheron-vdr stage list --tag "client-xyz"

# Commit as a single batch
sipheron-vdr stage commit --note "Client XYZ - Complete Contract Package (2024-01-15)"`} />

      <h2 id="storage" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Storage Location
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Staged file metadata is stored locally on your machine:
      </p>
      <CodeBlock code={`# macOS/Linux
~/.config/sipheron/staging.json

# Windows
%APPDATA%\\sipheron\\staging.json

# View raw staging data
cat ~/.config/sipheron/staging.json`} />
    </div>
  );
};

export default CliStagePage;
