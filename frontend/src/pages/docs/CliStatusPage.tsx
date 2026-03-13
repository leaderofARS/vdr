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

const CliStatusPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">sipheron-vdr status</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Check the status of anchors, transactions, and network connectivity. 
        Monitor confirmation levels and slot finalization on Solana.
      </p>

      <h2 id="anchor-status" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Anchor Status
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Check the detailed status of a specific anchor on the blockchain.
      </p>
      <CodeBlock code={`# Check anchor by ID
sipheron-vdr status anchor_abc123

# Check by hash
sipheron-vdr status --hash 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...

# JSON output for scripting
sipheron-vdr status anchor_abc123 --json`} />

      <h3 id="sample-output" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Sample Output</h3>
      <CodeBlock code={`Anchor Status: anchor_abc123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Status:         ✓ Confirmed (finalized)
  Network:        mainnet
  
  Anchor Details:
    Hash:         0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...
    Timestamp:    2024-01-15T09:23:45.123Z
    
  Blockchain:
    Slot:         284,715,623
    Block Time:   2024-01-15T09:23:45.000Z
    Confirmations: 32 (finalized)
    
  Transaction:
    Signature:    5UfgJ5XGUe...
    Fee:          0.000005 SOL
    
  Explorer:       https://explorer.solana.com/tx/5UfgJ5XGUe...`} />

      <h2 id="transaction-status" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Transaction Status
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Check the status of a Solana transaction by its signature.
      </p>
      <CodeBlock code={`# Check transaction status
sipheron-vdr status tx 5UfgJ5XGUe8NdGDbVBnx5pdqKJ9ZqQhZ4iNfWcKJdj6RBKBQnhgGFwGz8y7bUkjhU7xkNRCkHmUGXzfdM9G7QUVm

# Watch transaction until confirmed
sipheron-vdr status tx 5UfgJ5XGUe... --watch

# Check with commitment level
sipheron-vdr status tx 5UfgJ5XGUe... --commitment finalized`} />

      <h2 id="confirmation-levels" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Confirmation Levels
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Solana provides different confirmation levels for transactions:
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Level</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-yellow-400">processed</td>
              <td className="py-3 pr-4 text-gray-400">Transaction processed but not confirmed</td>
              <td className="py-3 pr-4 text-gray-400">&lt; 1s</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-blue-400">confirmed</td>
              <td className="py-3 pr-4 text-gray-400">Transaction confirmed by cluster</td>
              <td className="py-3 pr-4 text-gray-400">~1-2s</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-green-400">finalized</td>
              <td className="py-3 pr-4 text-gray-400">Transaction finalized (recommended)</td>
              <td className="py-3 pr-4 text-gray-400">~12-15s</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="network-status" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Network Status
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Check the health and performance of Solana networks.
      </p>
      <CodeBlock code={`# Check network health
sipheron-vdr status network

# Check specific network
sipheron-vdr status network --network mainnet

# Check slot height
sipheron-vdr status slot

# Check current epoch
sipheron-vdr status epoch`} />

      <h3 id="network-status-output" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Network Status Output</h3>
      <CodeBlock code={`Network Status: mainnet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Health:         ✓ Healthy
  
  Current Slot:   284,715,623
  Current Epoch:  567
  Epoch Progress: 78%
  
  Block Time:     ~400ms
  TPS:            3,456
  
  Feature Set:    2345678901
  
  RPC Nodes:      8 available
  Avg Latency:    45ms`} />

      <h2 id="quota-status" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Organization Quota Status
      </h2>
      <CodeBlock code={`# Check your organization's usage quotas
sipheron-vdr status quota

# JSON output
sipheron-vdr status quota --json`} />

      <h3 id="quota-output" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Quota Output</h3>
      <CodeBlock code={`Organization Quota Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Plan:           Enterprise
  
  Anchors:
    Used:         45,678 / 100,000
    Remaining:    54,322
    Resets:       2024-02-01
    
  API Requests:
    Used:         234,567 / 500,000
    Remaining:    265,433
    
  Storage:
    Used:         1.2 GB / 10 GB
    
  Webhooks:       8 / 20 configured`} />
    </div>
  );
};

export default CliStatusPage;
