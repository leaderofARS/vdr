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

const CliHistoryPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">sipheron-vdr history</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        View and export your organization's anchor history. Search, filter, and analyze 
        all documents anchored to the blockchain.
      </p>

      <h2 id="list" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        List Anchors
      </h2>
      <CodeBlock code={`# List recent anchors (default: last 20)
sipheron-vdr history

# List with limit
sipheron-vdr history --limit 100

# Show all details
sipheron-vdr history --verbose`} />

      <h2 id="filtering" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Filtering Options
      </h2>
      <CodeBlock code={`# Filter by date range
sipheron-vdr history --from 2024-01-01 --to 2024-01-31

# Filter by network
sipheron-vdr history --network mainnet

# Search by note content
sipheron-vdr history --search "contract"

# Filter by file hash
sipheron-vdr history --hash 0x7f83b165...

# Combine filters
sipheron-vdr history \\
  --from 2024-01-01 \\
  --to 2024-01-31 \\
  --network mainnet \\
  --search "client-abc"`} />

      <h2 id="output-formats" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Output Formats
      </h2>
      <CodeBlock code={`# Table format (default)
sipheron-vdr history

# JSON output
sipheron-vdr history --json

# CSV export
sipheron-vdr history --csv > anchors.csv

# Compact format
sipheron-vdr history --compact`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Sample Table Output</h3>
      <CodeBlock code={`TIMESTAMP            HASH                                      NETWORK   NOTE
─────────────────────────────────────────────────────────────────────────────────────────────
2024-01-15 09:23:45  0x7f83b1...a4d9  mainnet   Client ABC Contract
2024-01-15 08:15:22  0x9a2c4e...b7f1  mainnet   Q4 Financial Report
2024-01-14 16:45:00  0x3d8e5a...c2b4  devnet    Test document
2024-01-14 14:30:11  0x1f6b9d...e8a3  mainnet   Vendor Agreement v2`} />

      <h2 id="export" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Exporting History
      </h2>
      <CodeBlock code={`# Export to CSV
sipheron-vdr history --from 2024-01-01 --to 2024-01-31 --csv > january-anchors.csv

# Export to JSON for processing
sipheron-vdr history --json > anchor-history.json

# Export with full details
sipheron-vdr history --verbose --json > detailed-history.json

# Export only mainnet anchors
sipheron-vdr history --network mainnet --csv > mainnet-anchors.csv`} />

      <h2 id="pagination" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Pagination
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        For large histories, use pagination to retrieve results in chunks.
      </p>
      <CodeBlock code={`# Get first page
sipheron-vdr history --limit 100

# Get next page using cursor
sipheron-vdr history --limit 100 --cursor eyJpZCI6ImFiYzEyMyJ9

# Paginate through all results
CURSOR=""
while true; do
  RESULT=$(sipheron-vdr history --limit 100 --cursor "$CURSOR" --json)
  echo "$RESULT" | jq '.anchors[]'
  
  CURSOR=$(echo "$RESULT" | jq -r '.nextCursor')
  [ "$CURSOR" = "null" ] && break
done`} />

      <h2 id="analytics" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        History Analytics
      </h2>
      <CodeBlock code={`# Count anchors in date range
sipheron-vdr history --from 2024-01-01 --to 2024-01-31 --count

# Group by network
sipheron-vdr history --json | jq -r '.anchors[].network' | sort | uniq -c

# Find largest files anchored
sipheron-vdr history --verbose --json | jq '.anchors | sort_by(.fileSize) | reverse | .[0:10]'

# Daily anchor counts
sipheron-vdr history --json | jq -r '.anchors[].timestamp' | cut -d'T' -f1 | sort | uniq -c`} />

      <h2 id="audit-trail" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Audit Trail Generation
      </h2>
      <CodeBlock code={`#!/bin/bash
# generate-audit-trail.sh

YEAR=${"$"}{1:-$(date +%Y)}
MONTH=${"$"}{2:-$(date +%m)}

OUTPUT_FILE="audit-trail-${"$"}{YEAR}-${"$"}{MONTH}.pdf"

echo "Generating audit trail for ${"$"}{YEAR}-${"$"}{MONTH}..."

# Export all anchors for the month
sipheron-vdr history \\
  --from "${"$"}{YEAR}-${"$"}{MONTH}-01" \\
  --to "${"$"}{YEAR}-${"$"}{MONTH}-31" \\
  --json > /tmp/anchors.json

# Generate summary
echo "Total anchors: $(cat /tmp/anchors.json | jq '.anchors | length')"
echo "Mainnet: $(cat /tmp/anchors.json | jq '[.anchors[] | select(.network == "mainnet")] | length')"
echo "Devnet: $(cat /tmp/anchors.json | jq '[.anchors[] | select(.network == "devnet")] | length')"

# Convert to CSV for audit report
sipheron-vdr history \\
  --from "${"$"}{YEAR}-${"$"}{MONTH}-01" \\
  --to "${"$"}{YEAR}-${"$"}{MONTH}-31" \\
  --csv > "audit-trail-${"$"}{YEAR}-${"$"}{MONTH}.csv"

echo "Audit trail saved to: audit-trail-${"$"}{YEAR}-${"$"}{MONTH}.csv"`} />
    </div>
  );
};

export default CliHistoryPage;
