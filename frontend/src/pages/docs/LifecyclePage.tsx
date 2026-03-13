import React, { useState } from 'react';
import { Copy, Check, Circle, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';

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

const LifecyclePage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Anchor Lifecycle</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Understand the complete lifecycle of a document anchor—from creation through finalization 
        on the Solana blockchain. Learn about state transitions, transaction flows, and commitment levels.
      </p>

      {/* State Overview Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
        {['Created', 'Staged', 'Anchored', 'Confirmed', 'Verified'].map((state, i) => (
          <div key={state} className="p-3 rounded-lg border border-white/10 bg-white/5 text-center">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-400 font-bold text-sm">{i + 1}</span>
            </div>
            <span className="text-white font-medium text-sm">{state}</span>
          </div>
        ))}
      </div>

      <h2 id="lifecycle-overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Full Lifecycle Overview
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Every document anchor in SipHeron progresses through a well-defined lifecycle. Understanding 
        these states helps you build robust integrations and handle edge cases appropriately.
      </p>

      {/* ASCII Lifecycle Diagram */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm overflow-x-auto">
        <div className="text-[#555] mb-2">// Complete Anchor State Machine</div>
        <div className="text-[#EDEDED] whitespace-pre">
{`
                    ┌─────────────┐
         ┌─────────│   START     │
         │         │  (User      │
         │         │   Action)   │
         │         └──────┬──────┘
         │                │
         │                ▼ create()
         │         ┌─────────────┐
         │         │  CREATED    │◄────────────────┐
         │         │  • Hash     │                 │
         │         │    computed │                 │
         │         │  • Metadata │                 │
         │         │    prepared │                 │
         │         └──────┬──────┘                 │
         │                │ stage()                │
         │                ▼                        │
         │         ┌─────────────┐                 │
         │         │   STAGED    │                 │
         │         │  • Queued   │                 │
         │         │    locally  │                 │
         │         │  • Awaiting │                 │
         │         │    batch    │                 │
         │         └──────┬──────┘                 │
         │                │ commit()               │
         │                ▼                        │
         │         ┌─────────────┐                 │
         │         │  ANCHORED   │                 │
         │         │  • Tx sent  │                 │
         │         │  • Pending  │                 │
         │         │    network  │                 │
         │         └──────┬──────┘                 │
         │                │ confirm()              │
         │                ▼                        │
         │         ┌─────────────┐                 │
         │    ┌───►│ CONFIRMED   │──────┐          │
         │    │    │  • On-chain │      │          │
         │    │    │  • Final    │      │          │
         │    │    │    slot set │      │          │
         │    │    └──────┬──────┘      │          │
         │    │           │             │          │
         │    │           ▼ verify()    │          │
         │    │    ┌─────────────┐      │          │
         │    │    │  VERIFIED   │      │          │
         │    │    │  • Hash     │      │          │
         │    │    │    match    │      │          │
         │    │    │  • Proof    │      │          │
         │    │    │    valid    │      │          │
         │    │    └─────────────┘      │          │
         │    │                         │          │
         │    │    [Error Paths]        │          │
         │    │                         │          │
         │    └──────┐   ┌──────────────┘          │
         │           │   │                         │
         ▼           ▼   ▼                         │
    ┌─────────┐  ┌──────────┐                     │
    │  FAILED │  │ EXPIRED  │─────────────────────┘
    │  • Tx   │  │ • TTL    │   re-stage()
    │    error│  │   passed │
    │  • Retry│  │ • Requeue│
    │    after│  │          │
    └────┬────┘  └──────────┘
         │
         ▼ retry()
    [Return to STAGED]
`}
        </div>
      </div>

      <h2 id="state-created" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        State 1: Created
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        The <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">created</code> state 
        represents the initial phase where the document hash has been computed and metadata has been 
        prepared, but no blockchain transaction has been initiated yet.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Technical Details</h3>
      <ul className="text-gray-300 space-y-2 mb-6">
        <li className="flex items-start gap-2">
          <Circle className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span>SHA-256 hash computed locally or server-side</span>
        </li>
        <li className="flex items-start gap-2">
          <Circle className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span>Metadata extracted (file name, size, MIME type)</span>
        </li>
        <li className="flex items-start gap-2">
          <Circle className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span>Anchor record created in database with UUID</span>
        </li>
        <li className="flex items-start gap-2">
          <Circle className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span>Organization and user attribution set</span>
        </li>
      </ul>

      <CodeBlock code={`// Anchor creation request
POST /v1/anchors
{
  "hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...",
  "filename": "contract-v2.pdf",
  "size_bytes": 2457600,
  "mime_type": "application/pdf",
  "metadata": {
    "client": "ABC Corp",
    "project": "Q1-2024"
  }
}

// Response - State: CREATED
{
  "id": "anchor_abc123xyz",
  "status": "created",
  "hash": "0x7f83b165...",
  "created_at": "2024-01-15T09:23:45.123Z",
  "created_by": "user_def456",
  "organization_id": "org_ghi789"
}`} language="json" />

      <h2 id="state-staged" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        State 2: Staged
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        In the <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">staged</code> state, 
        the anchor is queued for batch processing. Staging allows multiple anchors to be grouped 
        together for more efficient on-chain submission.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Why Staging Matters</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Solana transaction costs are low but not zero. By staging multiple anchors and committing 
        them in batches, you can amortize the base transaction fee across many anchors. This is 
        especially valuable for high-volume use cases.
      </p>

      {/* Staging Flow Diagram */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm">
        <div className="text-[#555] mb-2">// Batch Staging Process</div>
        <div className="text-[#EDEDED]">
{`
    Individual Anchors              Batch Operation
    ─────────────────               ───────────────
    
    ┌─────────┐                     ┌─────────────────┐
    │ Anchor 1│──┐                  │ Batch Builder   │
    │ (doc A) │  │                  │ ─────────────── │
    └─────────┘  │   ┌─────────┐    │ • Collect       │
                 ├──►│  Stage  │───►│   staged items  │
    ┌─────────┐  │   │  Queue  │    │ • Build Merkle  │
    │ Anchor 2│──┘   └─────────┘    │   tree (opt)    │
    │ (doc B) │                     │ • Create tx     │
    └─────────┘                     │   instruction   │
                                    └─────────────────┘
    ┌─────────┐                              │
    │ Anchor 3│──────────────────────────────┘
    │ (doc C) │
    └─────────┘
`}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Staging Configuration</h3>
      <CodeBlock code={`// Stage multiple anchors
POST /v1/anchors/stage
{
  "anchor_ids": [
    "anchor_abc123",
    "anchor_def456", 
    "anchor_ghi789"
  ],
  "batch_options": {
    "max_batch_size": 50,
    "max_wait_ms": 30000,
    "priority": "normal"
  }
}

// Staged anchor response
{
  "batch_id": "batch_xyz789",
  "status": "staged",
  "staged_count": 3,
  "estimated_commit": "2024-01-15T09:24:00.000Z",
  "anchors": [
    {
      "id": "anchor_abc123",
      "status": "staged",
      "batch_position": 0,
      "staged_at": "2024-01-15T09:23:46.456Z"
    }
  ]
}`} language="json" />

      <h2 id="state-anchored" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        State 3: Anchored
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        The <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">anchored</code> state 
        indicates that a Solana transaction has been created, signed, and submitted to the network. 
        At this point, the anchor is "in flight" and awaiting confirmation.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Transaction Flow on Solana</h3>

      {/* Transaction Flow Diagram */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm overflow-x-auto">
        <div className="text-[#555] mb-2">// Solana Transaction Lifecycle</div>
        <div className="text-[#EDEDED] whitespace-pre">
{`
    SipHeron Backend              Solana Network
    ──────────────                ──────────────
    
         │                              │
         │ 1. Build Transaction         │
         │    • Create instruction      │
         │    • Set recent blockhash    │
         │    • Add anchor data         │
         ▼                              │
    ┌─────────┐                         │
    │  Built  │                         │
    │   TX    │                         │
    └────┬────┘                         │
         │                              │
         │ 2. Sign Transaction          │
         │    • Fetch payer keypair     │
         │    • Sign with Solana SDK    │
         ▼                              │
    ┌─────────┐                         │
    │ Signed  │                         │
    │   TX    │                         │
    └────┬────┘                         │
         │                              │
         │ 3. Send to RPC               │
         │    • POST to sendTransaction │
         │    • Receive tx signature    │
         ▼                              ▼
    ┌─────────────────────────────────────────┐
    │           Solana Network                │
    │  • Transaction enters mempool           │
    │  • Leaders schedule for inclusion       │
    │  • Block production (~400ms/slot)       │
    └─────────────────────────────────────────┘
`}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Anchor Instruction Structure</h3>
      <CodeBlock code={`// Solana anchor instruction (simplified)
{
  "program_id": "VDR111111111111111111111111111111111111111",
  "accounts": [
    {
      "pubkey": "AnchorAccountPDA...",
      "is_signer": false,
      "is_writable": true
    },
    {
      "pubkey": "PayerWallet...",
      "is_signer": true,
      "is_writable": false
    }
  ],
  "data": {
    "discriminator": [1, 2, 3, 4, 5, 6, 7, 8], // create_anchor discriminator
    "hash": [127, 131, 177, 101, ...], // 32 bytes
    "timestamp": 1705313025, // Unix timestamp
    "metadata_hash": [210, 195, ...] // Optional metadata commitment
  }
}`} language="json" />

      <h2 id="state-confirmed" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        State 4: Confirmed
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        The <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">confirmed</code> state 
        means the transaction has been included in a block and has reached the required commitment 
        level. The anchor is now permanently recorded on the blockchain.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Solana Commitment Levels</h3>
      
      <p className="text-gray-300 leading-relaxed mb-4">
        Solana offers different commitment levels that trade speed for finality:
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Commitment</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Latency</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Finality</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">processed</td>
              <td className="py-3 pr-4 text-gray-300">~400ms</td>
              <td className="py-3 pr-4 text-red-400">Low (may fork)</td>
              <td className="py-3 pr-4 text-gray-400">Internal tracking only</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">confirmed</td>
              <td className="py-3 pr-4 text-gray-300">~1-2s</td>
              <td className="py-3 pr-4 text-yellow-400">Medium (cluster consensus)</td>
              <td className="py-3 pr-4 text-gray-400">Most applications ✓</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">finalized</td>
              <td className="py-3 pr-4 text-gray-300">~12-15s</td>
              <td className="py-3 pr-4 text-green-400">Maximum (rooted)</td>
              <td className="py-3 pr-4 text-gray-400">High-value anchors, legal proof</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Slot Finality Diagram */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm overflow-x-auto">
        <div className="text-[#555] mb-2">// Slot Finality Progression</div>
        <div className="text-[#EDEDED] whitespace-pre">
{`
    Time ──►
    
    Slot N:   [TX Submitted]────►[Block Produced]────►[Vote: 31%]──►... 
              (processed)         (in block)           (confirmed)
    
    Slot N+1:                      [Vote: 67%]───────►[Superminority]
                                                        (confirmed)
    
    Slot N+2:                                           [Votes continue]
    
    ...
    
    Slot N+32:                                         [Rooted]◄── FINALIZED
                                                        (cannot revert)
    
    
    Legend:
    ─────►  Time progression (~400ms per slot)
    [ ]     Block boundaries
    Vote %  Stake-weighted validator votes
`}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">SipHeron Commitment Strategy</h3>
      <CodeBlock code={`// Default: confirmed (recommended for most use cases)
{
  "anchor_id": "anchor_abc123",
  "status": "confirmed",
  "commitment": "confirmed",
  "solana": {
    "signature": "5UfgJ5XVLKw8Tvq3Zz3Yj9Z5Z7Z1Z2Z3Z4Z5Z6Z7Z8Z9Z...",
    "slot": 284715623,
    "block_time": 1705313025,
    "confirmations": 12
  },
  "finality": {
    "level": "confirmed",
    "timestamp": "2024-01-15T09:23:46.789Z",
    "safe_to_verify": true
  }
}

// For high-value anchors, wait for finalized
{
  "status": "confirmed",
  "commitment": "finalized",
  "solana": {
    "slot": 284715623,
    "rooted": true
  },
  "finality": {
    "level": "finalized",
    "timestamp": "2024-01-15T09:24:02.123Z",
    "safe_for_legal_proof": true
  }
}`} language="json" />

      <h2 id="state-verified" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        State 5: Verified
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        The <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">verified</code> state 
        is reached when someone successfully verifies that a document matches its anchored hash. 
        This is not a blockchain state but a verification event that confirms integrity.
      </p>

      <CodeBlock code={`// Verification response
{
  "anchor_id": "anchor_abc123",
  "status": "verified",
  "verification": {
    "timestamp": "2024-01-15T14:32:10.456Z",
    "computed_hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...",
    "anchored_hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...",
    "match": true,
    "method": "direct_comparison",
    "verified_by": "user_jkl012"
  },
  "proof": {
    "solana_signature": "5UfgJ5XVLKw8Tvq3Zz3Yj9Z5Z7Z1Z2Z3Z4Z5Z6Z7Z8Z9Z...",
    "explorer_url": "https://explorer.solana.com/tx/5UfgJ5X...",
    "slot": 284715623,
    "block_time": "2024-01-15T09:23:45.123Z"
  }
}`} language="json" />

      <h2 id="error-states" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Error States and Recovery
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Various error conditions can interrupt the anchor lifecycle. Understanding these helps 
        you build resilient systems.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Common Error States</h3>

      <div className="space-y-6">
        <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
          <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Transaction Failed
          </h4>
          <p className="text-sm text-gray-300 mb-3">
            The Solana transaction failed to execute. Common causes include insufficient funds, 
            invalid instruction data, or program errors.
          </p>
          <CodeBlock code={`{
  "status": "failed",
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Transaction requires 0.002 SOL but account has 0.001 SOL",
    "retryable": true
  },
  "recovery": {
    "action": "auto_retry",
    "attempt": 2,
    "max_attempts": 5,
    "backoff_ms": 2000
  }
}`} language="json" />
        </div>

        <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
          <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Transaction Dropped
          </h4>
          <p className="text-sm text-gray-300 mb-3">
            The transaction was submitted but never landed on-chain, often due to network congestion 
            or an expired blockhash.
          </p>
          <CodeBlock code={`{
  "status": "failed",
  "error": {
    "code": "TRANSACTION_DROPPED",
    "message": "Transaction not found after 90s timeout",
    "retryable": true
  },
  "recovery": {
    "action": "resubmit_with_new_blockhash",
    "original_signature": "5UfgJ5X...",
    "new_signature": "8KlmN2Y..."
  }
}`} language="json" />
        </div>

        <div className="p-4 rounded-lg border border-orange-500/20 bg-orange-500/5">
          <h4 className="text-orange-400 font-medium mb-2">Expired (TTL)</h4>
          <p className="text-sm text-gray-300 mb-3">
            The anchor remained in staged state too long without being committed. This prevents 
            indefinite queuing of stale anchors.
          </p>
          <CodeBlock code={`{
  "status": "expired",
  "error": {
    "code": "STAGING_TTL_EXCEEDED",
    "message": "Anchor staged for > 24 hours without commit",
    "staged_at": "2024-01-14T09:23:45.123Z",
    "expired_at": "2024-01-15T09:23:45.123Z"
  },
  "recovery": {
    "action": "manual_retry",
    "requires_user_action": true
  }
}`} language="json" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Retry Strategies</h3>
      <CodeBlock code={`// Exponential backoff retry
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5,
  baseDelayMs: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      if (!isRetryableError(error)) throw error;
      
      const delay = baseDelayMs * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage for anchor commit
await retryWithBackoff(
  () => anchorCommit(anchorId),
  5,
  2000  // Start with 2s, then 4s, 8s, 16s, 32s
);`} language="javascript" />

      <h2 id="re-anchoring" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Re-Anchoring and Updates
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Documents evolve. When you create a new version, you anchor it as a separate record. 
        SipHeron supports linking anchors to show document lineage.
      </p>

      <CodeBlock code={`// Create new version with parent reference
POST /v1/anchors
{
  "hash": "0x9a2c4e8f1b3d5a7c9e0f2a4b6c8d0e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3",
  "filename": "contract-v3.pdf",
  "previous_version": {
    "anchor_id": "anchor_abc123",
    "relationship": "supersedes"
  },
  "metadata": {
    "version": "3.0",
    "change_summary": "Updated payment terms per legal review"
  }
}

// Response includes lineage
{
  "id": "anchor_def456",
  "status": "created",
  "version_chain": {
    "current": "anchor_def456",
    "previous": "anchor_abc123",
    "root": "anchor_xyz789",
    "depth": 2
  }
}`} language="json" />

      <h2 id="ttl-considerations" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        TTL (Time-to-Live) Considerations
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Time-to-Live settings control how long anchors can remain in intermediate states before 
        automatic cleanup or error transitions occur.
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">State</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Default TTL</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Action on Expiry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">created</td>
              <td className="py-3 pr-4 text-gray-300">1 hour</td>
              <td className="py-3 pr-4 text-gray-400">Auto-delete if not staged</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">staged</td>
              <td className="py-3 pr-4 text-gray-300">24 hours</td>
              <td className="py-3 pr-4 text-gray-400">Move to expired, notify user</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">anchored</td>
              <td className="py-3 pr-4 text-gray-300">5 minutes</td>
              <td className="py-3 pr-4 text-gray-400">Retry or mark failed</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="webhooks" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        State Transition Webhooks
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Subscribe to webhook events to receive real-time notifications when anchors change state.
      </p>

      <CodeBlock code={`// Configure webhook for state transitions
POST /v1/webhooks
{
  "url": "https://your-app.com/webhooks/sipheron",
  "events": [
    "anchor.created",
    "anchor.staged", 
    "anchor.anchored",
    "anchor.confirmed",
    "anchor.failed",
    "anchor.verified"
  ],
  "secret": "whsec_your_webhook_secret"
}

// Webhook payload for anchor.confirmed
{
  "event": "anchor.confirmed",
  "timestamp": "2024-01-15T09:23:46.789Z",
  "data": {
    "anchor_id": "anchor_abc123",
    "organization_id": "org_def456",
    "previous_state": "anchored",
    "current_state": "confirmed",
    "solana": {
      "signature": "5UfgJ5X...",
      "slot": 284715623,
      "commitment": "confirmed"
    }
  }
}`} language="json" />

      <div className="my-8 p-5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <h4 className="text-purple-400 font-medium mb-2">Webhook Best Practices</h4>
        <ul className="text-sm text-gray-300 space-y-2">
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
            <span>Verify webhook signatures using your secret to ensure authenticity</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
            <span>Respond with 200 OK quickly; process asynchronously if needed</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
            <span>Implement idempotency to handle duplicate deliveries</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
            <span>Subscribe only to events you need to minimize load</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LifecyclePage;
