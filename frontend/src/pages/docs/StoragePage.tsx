import React, { useState } from 'react';
import { Copy, Check, Database, HardDrive, Lock, Globe, Scale, FileX } from 'lucide-react';

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

const StoragePage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">On-Chain Storage</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Understand exactly what data lives on the Solana blockchain, how SipHeron optimizes for 
        cost and efficiency, and the guarantees provided by decentralized storage.
      </p>

      {/* Storage Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <Database className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-bold text-white mb-1">On-Chain</h3>
          <p className="text-sm text-gray-400">Hash, timestamp, and proof</p>
        </div>
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <HardDrive className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-bold text-white mb-1">Off-Chain</h3>
          <p className="text-sm text-gray-400">Document content and metadata</p>
        </div>
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-bold text-white mb-1">Immutable</h3>
          <p className="text-sm text-gray-400">Permanent, tamper-proof records</p>
        </div>
      </div>

      <h2 id="what-is-stored" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        What Gets Stored On-Chain
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        SipHeron follows a minimal on-chain storage principle. Only data essential for 
        cryptographic verification and timestamp proof is stored on Solana. Everything else 
        remains off-chain, preserving privacy and minimizing costs.
      </p>

      {/* Storage Comparison Diagram */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm overflow-x-auto">
        <div className="text-[#555] mb-2">// Data Storage Architecture</div>
        <div className="text-[#EDEDED] whitespace-pre">
{`
    DOCUMENT UPLOAD                    ON-CHAIN STORAGE
    ───────────────                    ────────────────
    
    ┌──────────────────────────────────────────────────────────────┐
    │  Your Document                                               │
    │  ─────────────                                               │
    │  Filename: contract.pdf        ───────┐                      │
    │  Size: 2.4 MB                         │                      │
    │  Content: [■■■■■■■■■■■■■■■■■■■■■■■■]  │                      │
    │  Author: John Doe                     │                      │
    │  Created: 2024-01-15                  │                      │
    │  Metadata: {...}                      │                      │
    └───────────────────────────────────────┼──────────────────────┘
                                            │
                                            ▼ Hash computation
    ┌──────────────────────────────────────────────────────────────┐
    │  ON-CHAIN (Solana)                                           │
    │  ─────────────────                                           │
    │                                                              │
    │  ┌─────────────────────────────────────────────────────────┐ │
    │  │ Anchor Account                                          │ │
    │  │ ─────────────                                           │ │
    │  │ • Document Hash: 0x7f83b165... (32 bytes)              │ │
    │  │ • Timestamp:     1705313025 (Unix, 8 bytes)            │ │
    │  │ • Signer:        Pubkey... (32 bytes)                  │ │
    │  │ • Slot:          284715623 (8 bytes)                   │ │
    │  │ • Version:       1 (1 byte)                            │ │
    │  │                                                         │ │
    │  │ Total: ~81 bytes per anchor                            │ │
    │  └─────────────────────────────────────────────────────────┘ │
    │                                                              │
    │  Transaction Signature: 5UfgJ5XVLKw8Tvq3Zz3Yj9Z5Z7Z1Z2...    │
    │                                                              │
    └──────────────────────────────────────────────────────────────┘
    
    
    OFF-CHAIN (SipHeron Database - Encrypted)
    ─────────────────────────────────────────
    
    ┌──────────────────────────────────────────────────────────────┐
    │  Metadata Record                                             │
    │  ──────────────                                              │
    │  • Anchor ID: anchor_abc123                                  │
    │  • Organization: org_def456                                  │
    │  • Filename: contract.pdf                                    │
    │  • File size: 2457600 bytes                                  │
    │  • MIME type: application/pdf                                │
    │  • User metadata: {...}                                      │
    │  • Created at: 2024-01-15T09:23:45.123Z                      │
    │                                                              │
    │  ⚠️ Document content is NEVER stored                        │
    └──────────────────────────────────────────────────────────────┘
`}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">On-Chain Data Structure</h3>
      <CodeBlock code={`// SipHeron Anchor Account (Solana)
use anchor_lang::prelude::*;

#[account]
pub struct DocumentAnchor {
    /// SHA-256 hash of the document (32 bytes)
    pub document_hash: [u8; 32],
    
    /// Unix timestamp when anchored (8 bytes)
    pub timestamp: i64,
    
    /// Public key of the anchor creator (32 bytes)
    pub creator: Pubkey,
    
    /// Solana slot number for ordering (8 bytes)
    pub slot: u64,
    
    /// Schema version for future upgrades (1 byte)
    pub version: u8,
    
    /// Reserved for future use (39 bytes)
    pub _reserved: [u8; 39],
}

impl DocumentAnchor {
    /// Total account size: 120 bytes
    pub const SIZE: usize = 8 +    // discriminator
                           32 +    // document_hash
                           8 +     // timestamp
                           32 +    // creator
                           8 +     // slot
                           1 +     // version
                           39;     // reserved
}`} language="rust" />

      <h2 id="what-is-not-stored" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        What Doesn't Get Stored
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Understanding what SipHeron explicitly does NOT store is as important as knowing what 
        it does store. This privacy-by-design approach ensures your sensitive data remains 
        under your control.
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Data Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Stored?</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-gray-300">Document content</td>
              <td className="py-3 pr-4 text-red-400 font-mono">NO</td>
              <td className="py-3 pr-4 text-gray-400">Privacy, cost, size limits</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Original filename</td>
              <td className="py-3 pr-4 text-yellow-400 font-mono">Off-chain only</td>
              <td className="py-3 pr-4 text-gray-400">May contain sensitive info</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Author identity</td>
              <td className="py-3 pr-4 text-yellow-400 font-mono">Off-chain only</td>
              <td className="py-3 pr-4 text-gray-400">Only wallet pubkey on-chain</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">File size</td>
              <td className="py-3 pr-4 text-yellow-400 font-mono">Off-chain only</td>
              <td className="py-3 pr-4 text-gray-400">Not needed for verification</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Custom metadata</td>
              <td className="py-3 pr-4 text-yellow-400 font-mono">Off-chain only</td>
              <td className="py-3 pr-4 text-gray-400">User-controlled disclosure</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="my-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
          <FileX className="w-4 h-4" />
          Privacy Guarantee
        </h4>
        <p className="text-sm text-gray-300">
          When using local hashing (default), your document never leaves your device in any form. 
          Even SipHeron servers only receive the 32-byte hash. There's no way to reconstruct the 
          original document from the hash—the process is mathematically one-way.
        </p>
      </div>

      <h2 id="solana-account" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Solana Account Structure for Anchors
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Each anchor is stored as a Solana account with a specific structure optimized for 
        program-derived addresses (PDAs) and efficient lookups.
      </p>

      {/* Account Structure Diagram */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm overflow-x-auto">
        <div className="text-[#555] mb-2">// Solana Account Layout</div>
        <div className="text-[#EDEDED] whitespace-pre">
{`
    SOLANA ACCOUNT (Anchor Storage)
    ───────────────────────────────
    
    Address: Program Derived Address (PDA)
    ┌─────────────────────────────────────────────────────────────┐
    │  PDA Seeds:                                                 │
    │  • Seed 1: "anchor"                                         │
    │  • Seed 2: document_hash[0..32]                            │
    │  • Seed 3: creator_pubkey                                   │
    │  • Bump: u8 (canonical)                                     │
    └─────────────────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────────────┐
    │  Account Structure                                          │
    │  ─────────────────                                          │
    │                                                             │
    │  [0..8]    Discriminator (8 bytes)                         │
    │            - Hash of "account:DocumentAnchor"              │
    │            - Used by Anchor framework                       │
    │                                                             │
    │  [8..40]   Document Hash (32 bytes)                        │
    │            - SHA-256 of document content                   │
    │            - Primary identifier                             │
    │                                                             │
    │  [40..48]  Timestamp (8 bytes, i64)                        │
    │            - Unix timestamp of anchor creation             │
    │                                                             │
    │  [48..80]  Creator Pubkey (32 bytes)                       │
    │            - Solana public key of anchor creator           │
    │                                                             │
    │  [80..88]  Slot Number (8 bytes, u64)                      │
    │            - Solana slot when transaction executed         │
    │                                                             │
    │  [88..89]  Version (1 byte)                                │
    │            - Schema version for migrations                 │
    │                                                             │
    │  [89..128] Reserved (39 bytes)                             │
    │            - Future expansion                              │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
    Total: 128 bytes per anchor account
`}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Program Derived Addresses (PDAs)</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        SipHeron uses PDAs to create deterministic, collision-resistant addresses for anchors. 
        PDAs have special properties: they don't have a private key, ensuring only the program 
        can modify them.
      </p>

      <CodeBlock code={`// PDA derivation for anchor lookup
const anchor = require('@coral-xyz/anchor');
const { PublicKey } = require('@solana/web3.js');

const PROGRAM_ID = new PublicKey('VDR111111111111111111111111111111111111111');

async function findAnchorAddress(documentHash, creator) {
  const [pda, bump] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from('anchor'),
      Buffer.from(documentHash, 'hex'),
      creator.toBuffer()
    ],
    PROGRAM_ID
  );
  
  return { pda, bump };
}

// Example: Look up an anchor by hash
const documentHash = '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...';
const creator = new PublicKey('CreatorPubkeyHere...');

const { pda } = findAnchorAddress(documentHash, creator);
console.log('Anchor account:', pda.toBase58());`} language="javascript" />

      <h2 id="rent-exemption" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Rent Exemption and Storage Costs
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Solana uses a rent model where accounts must maintain a minimum balance to persist. 
        This "rent-exempt" balance is calculated based on account size. SipHeron handles all 
        rent requirements automatically.
      </p>

      {/* Rent Calculation Diagram */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm">
        <div className="text-[#555] mb-2">// Rent Exemption Calculation</div>
        <div className="text-[#EDEDED]">
{`
    RENT EXEMPTION FORMULA (Solana)
    ───────────────────────────────
    
    Rent-exempt balance = (Account size in bytes) × (Rent rate per byte-year) × 2
    
    For SipHeron anchors:
    • Account size: 128 bytes
    • Current rent rate: ~0.00000348 SOL per byte-year
    • Multiplier: 2 years of rent
    
    Calculation:
    128 bytes × 0.00000348 SOL/byte-year × 2 years = 0.00089088 SOL
    
    At $100/SOL: ~$0.089 per anchor
    At $200/SOL: ~$0.178 per anchor
    
    
    COST COMPARISON
    ───────────────
    
    Storage Method          Cost per 128 bytes
    ──────────────────      ──────────────────
    Solana on-chain         ~$0.09 (one-time)
    AWS S3 (standard)       ~$0.000003/month
    IPFS (pinning)          ~$0.001/month
    
    Note: Solana cost is one-time (rent-exempt), not recurring!
    
    
    OPTIMIZATION: BATCH ANCHORING
    ─────────────────────────────
    
    Multiple hashes can share one anchor using Merkle trees:
    
    1000 documents × 0.00089 SOL = 0.89 SOL (individual)
    vs
    1 Merkle root × 0.00089 SOL = 0.00089 SOL (batched)
    Savings: ~99.9% for large batches
`}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Current Pricing (Approximate)</h3>
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Network</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Rent-Exempt (128 bytes)</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Transaction Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Mainnet</td>
              <td className="py-3 pr-4 text-gray-300">~0.00089 SOL (~$0.09)</td>
              <td className="py-3 pr-4 text-gray-300">~0.000005 SOL</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Devnet</td>
              <td className="py-3 pr-4 text-gray-300">~0.00089 SOL (free via faucet)</td>
              <td className="py-3 pr-4 text-gray-300">~0.000005 SOL (free)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Testnet</td>
              <td className="py-3 pr-4 text-gray-300">~0.00089 SOL (free via faucet)</td>
              <td className="py-3 pr-4 text-gray-300">~0.000005 SOL (free)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="data-retention" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Data Retention Guarantees
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Once an anchor is committed to Solana, its persistence is guaranteed by the blockchain 
        itself—not by SipHeron. This is a fundamental shift from traditional cloud storage.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Blockchain Persistence</h3>
      <ul className="text-gray-300 space-y-2 mb-6">
        <li className="flex items-start gap-2">
          <Database className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span><strong>Validator replication:</strong> Thousands of validators store a copy of the ledger</span>
        </li>
        <li className="flex items-start gap-2">
          <Database className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span><strong>No single point of failure:</strong> Data exists across the distributed network</span>
        </li>
        <li className="flex items-start gap-2">
          <Database className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span><strong>No expiration:</strong> Rent-exempt accounts persist indefinitely</span>
        </li>
        <li className="flex items-start gap-2">
          <Database className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span><strong>Censorship resistance:</strong> No central authority can delete your anchor</span>
        </li>
      </ul>

      {/* Retention Comparison */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm">
        <div className="text-[#555] mb-2">// Retention Guarantees Comparison</div>
        <div className="text-[#EDEDED]">
{`
    STORAGE TYPE          RETENTION GUARANTEE          DEPENDENCIES
    ────────────          ───────────────────          ────────────
    
    Local Hard Drive      Until drive fails            Hardware, power
    
    Cloud Storage         Until provider discontinues  Company solvency,
    (AWS, Google)         service or account           terms of service
                          suspended
    
    IPFS                  While nodes pin content      Node operators'
                                                      incentives
    
    Solana On-Chain       Permanent (rent-exempt)      Network consensus,
    (SipHeron)                                         validator set
`}
        </div>
      </div>

      <h2 id="immutability" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Blockchain Immutability Guarantees
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Immutability is the cornerstone of blockchain-based document verification. Once anchored, 
        a document's proof cannot be altered, backdated, or deleted.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">How Immutability Works</h3>

      {/* Immutability Diagram */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm overflow-x-auto">
        <div className="text-[#555] mb-2">// Immutability Through Consensus</div>
        <div className="text-[#EDEDED] whitespace-pre">
{`
    ATTEMPT TO MODIFY ANCHOR
    ─────────────────────────
    
    Attacker wants to change: 0x7f83b165... → 0xfakehash...
    
         Attacker's Node                Network Consensus
         ───────────────                ─────────────────
    
              │                                │
              │  "Change anchor X"             │
              │───────────────────────────────►│
              │                                │
              │                         ┌──────┴──────┐
              │                         │  Validators │
              │                         │  reject tx  │
              │                         │             │
              │                         │ • Anchor    │
              │◄────────────────────────│   program   │
              │   "Transaction failed"  │   enforces  │
              │                         │   immutab.  │
              │                         │             │
              │                         │ • No signer │
              │                         │   authority │
              │                         └─────────────┘
    
    
    WHY IT'S IMPOSSIBLE
    ───────────────────
    
    1. Anchor accounts have NO update instruction in the program
    2. Even if program allowed updates, would need creator's private key
    3. Even with private key, other validators enforce program rules
    4. Changing program requires governance/supermajority vote
    5. Historical records are in finalized blocks (can't be rewritten)
`}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Fork Resistance</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Solana's proof-of-stake consensus makes historical rewriting computationally infeasible. 
        An attacker would need to control 1/3 of the staked SOL to even attempt a reorganization 
        of finalized blocks—and even then, only the most recent blocks are at risk.
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Attack Type</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Cost/Requirement</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-gray-300">Modify anchor data</td>
              <td className="py-3 pr-4 text-red-400">Impossible</td>
              <td className="py-3 pr-4 text-gray-400">Program has no update function</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Delete anchor</td>
              <td className="py-3 pr-4 text-red-400">Impossible</td>
              <td className="py-3 pr-4 text-gray-400">Rent-exempt accounts can't be closed</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Backdate anchor</td>
              <td className="py-3 pr-4 text-yellow-400">Extremely expensive</td>
              <td className="py-3 pr-4 text-gray-400">Requires 51% attack on historical blocks</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Network partition</td>
              <td className="py-3 pr-4 text-yellow-400">Temporary only</td>
              <td className="py-3 pr-4 text-gray-400">Consensus recovers, data persists</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="cross-chain" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Cross-Chain Considerations
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        While SipHeron currently anchors to Solana, the verification model supports cross-chain 
        architectures for redundancy and interoperability.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Multi-Chain Anchoring</h3>
      <CodeBlock code={`// Cross-chain anchor record
{
  "document_hash": "0x7f83b165...",
  "anchors": [
    {
      "chain": "solana",
      "network": "mainnet",
      "signature": "5UfgJ5X...",
      "slot": 284715623,
      "timestamp": 1705313025,
      "status": "confirmed"
    },
    {
      "chain": "ethereum",
      "network": "mainnet",
      "tx_hash": "0xabc123...",
      "block_number": 18500000,
      "timestamp": 1705313050,
      "status": "confirmed"
    }
  ],
  "cross_chain_verification": {
    "required_confirmations": 1,
    "all_chains_match": true
  }
}`} language="json" />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Chain Selection Trade-offs</h3>
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Chain</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Cost</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Speed</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Decentralization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Solana</td>
              <td className="py-3 pr-4 text-green-400">Very low</td>
              <td className="py-3 pr-4 text-green-400">~400ms</td>
              <td className="py-3 pr-4 text-yellow-400">Medium (high hardware req)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Ethereum</td>
              <td className="py-3 pr-4 text-red-400">High</td>
              <td className="py-3 pr-4 text-yellow-400">~12s</td>
              <td className="py-3 pr-4 text-green-400">Very high</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Bitcoin</td>
              <td className="py-3 pr-4 text-yellow-400">Medium</td>
              <td className="py-3 pr-4 text-red-400">~10min</td>
              <td className="py-3 pr-4 text-green-400">Very high</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Polygon</td>
              <td className="py-3 pr-4 text-green-400">Low</td>
              <td className="py-3 pr-4 text-green-400">~2s</td>
              <td className="py-3 pr-4 text-yellow-400">Medium (PoS validators)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="gdpr-compliance" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        GDPR and Compliance Implications
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Blockchain immutability creates unique challenges for data protection regulations like 
        GDPR. SipHeron's architecture is designed to navigate these requirements.
      </p>

      {/* GDPR Diagram */}
      <div className="my-6 p-5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg font-mono text-sm">
        <div className="text-[#555] mb-2">// GDPR Compliance Architecture</div>
        <div className="text-[#EDEDED]">
{`
    GDPR REQUIREMENTS          SIPHERON SOLUTION
    ─────────────────          ───────────────
    
    Right to erasure           Cannot delete anchors from blockchain,
    ("right to be               but personal data isn't stored on-chain.
    forgotten")                 Off-chain metadata can be deleted.
                               
                               User request → Delete metadata record →
                               Anchor remains (just hash) → No PII
    
    
    Data minimization          Only 32-byte hash stored on-chain.
                               No names, emails, file content.
                               Off-chain: only data user explicitly
                               provides in metadata fields.
    
    
    Purpose limitation         Hash used only for integrity verification.
                               No tracking, profiling, or secondary uses.
                               Purpose clearly stated in anchor TX.
    
    
    Data portability           User can export all anchor records
                               including hashes and timestamps.
                               Standard JSON format provided.
    
    
    Transparency               All on-chain data is public and auditable.
                               Open-source verification tools.
                               Clear documentation of data flows.
`}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Personal Data Considerations</h3>
      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
          <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Not Personal Data (On-Chain)
          </h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• SHA-256 hash of document (one-way function)</li>
            <li>• Solana public key (pseudonymous identifier)</li>
            <li>• Unix timestamp</li>
            <li>• Block/slot number</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
          <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Potentially Personal Data (Off-Chain)
          </h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• User email address (account login)</li>
            <li>• Organization name</li>
            <li>• Custom metadata fields (user-provided)</li>
            <li>• IP addresses (log data)</li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">
            All off-chain data can be deleted upon request. Anchor integrity remains 
            verifiable through on-chain data alone.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Data Processing Agreement</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        SipHeron acts as a data processor for off-chain metadata and as a technical facilitator 
        for on-chain data. Users (data controllers) retain control over what metadata is stored. 
        Enterprise customers can request a Data Processing Agreement (DPA) for compliance documentation.
      </p>

      <CodeBlock code={`// Export all user data (GDPR Article 20)
GET /v1/user/data-export
Authorization: Bearer YOUR_API_KEY

// Response - complete data portability
{
  "export_id": "export_abc123",
  "generated_at": "2024-01-15T10:30:00.000Z",
  "user_data": {
    "email": "user@example.com",
    "created_at": "2023-06-01T12:00:00.000Z",
    "organization": "org_def456"
  },
  "anchors": [
    {
      "id": "anchor_xyz789",
      "hash": "0x7f83b165...",
      "metadata": { /* user-provided metadata */ },
      "solana_signature": "5UfgJ5X...",
      "created_at": "2024-01-15T09:23:45.123Z"
    }
  ],
  "verification_logs": [
    /* Record of all verification events */
  ]
}`} language="json" />

      <h2 id="storage-best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Storage Best Practices
      </h2>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Store Originals Securely</h4>
            <p className="text-sm text-gray-400">
              The blockchain stores the proof; you must store the document. Use redundant storage 
              (local + cloud + offline) for critical documents. The anchor is useless without the 
              original file.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Encrypt Sensitive Documents</h4>
            <p className="text-sm text-gray-400">
              While hashes don't reveal content, consider encrypting documents before storing them 
              in your systems. Anchor the encrypted file's hash for defense in depth.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Use Batch Anchoring for Scale</h4>
            <p className="text-sm text-gray-400">
              If anchoring thousands of documents, use Merkle tree batching to reduce costs by 
              99%+ while maintaining individual verifiability.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <HardDrive className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Consider Archive Requirements</h4>
            <p className="text-sm text-gray-400">
              Some industries require multi-decade retention. Solana's persistence is ideal, but 
              ensure your document storage strategy matches your compliance needs.
            </p>
          </div>
        </div>
      </div>

      <div className="my-8 p-5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <h4 className="text-purple-400 font-medium mb-2">Key Takeaway</h4>
        <p className="text-sm text-gray-300">
          SipHeron stores only cryptographic proofs on the blockchain—never your document content. 
          This provides the best of both worlds: the immutability and permanence of blockchain 
          storage for verification, combined with complete privacy and control over your actual data. 
          You're responsible for document storage; SipHeron provides the tamper-proof proof of 
          existence and integrity.
        </p>
      </div>
    </div>
  );
};

export default StoragePage;
