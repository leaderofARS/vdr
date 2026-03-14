import React, { useState } from 'react';
import { Copy, Check, Shield, EyeOff, Users, Lock } from 'lucide-react';

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

const VerificationModelPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Verification Model</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Deep dive into SipHeron's cryptographic verification architecture. Understand how documents 
        are verified without revealing their content, and explore the trust models that ensure 
        integrity across different verification scenarios.
      </p>

      {/* Verification Methods Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <h3 id="self-verification" className="font-bold text-white mb-1 scroll-mt-24">Self-Verification</h3>
          <p className="text-sm text-gray-400">Verify your own documents without third parties</p>
        </div>
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <h3 id="third-party" className="font-bold text-white mb-1 scroll-mt-24">Third-Party</h3>
          <p className="text-sm text-gray-400">Allow auditors to verify without account</p>
        </div>
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <EyeOff className="w-5 h-5 text-purple-400" />
          </div>
          <h3 id="zero-knowledge" className="font-bold text-white mb-1 scroll-mt-24">Zero-Knowledge</h3>
          <p className="text-sm text-gray-400">Prove integrity without revealing content</p>
        </div>
      </div>

      <h2 id="cryptographic-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Cryptographic Verification Process
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        At its core, verification is a simple cryptographic comparison. The verifier recomputes 
        the hash of the document and checks if it matches the hash stored on the blockchain. 
        However, the implementation involves several layers of security and optimization.
      </p>

      <div className="my-10 flex justify-center">
        {`
\`\`\`mermaid
sequenceDiagram
    participant D as Document Source
    participant V as Verification Layer
    participant B as Blockchain
    
    D->>V: 1. Provide document
    V->>V: 2. Hash computation (SHA-256)
    V->>B: 3. Fetch anchor record
    B-->>V: 4. Retrieve proof (Tx, Slot)
    V->>B: 5. Verify on-chain (optional)
    B-->>V: 6. Compare hashes
    V->>D: 7. Return result (VERIFIED/MODIFIED)
\`\`\`
        `}
      </div>

      <h3 id="hash-comparison-security" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Hash Comparison Security</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        SipHeron uses constant-time comparison to prevent timing attacks. In a standard string 
        comparison, the function returns as soon as it finds a mismatch—an attacker could measure 
        response times to guess the correct hash character by character. Constant-time comparison 
        always takes the same duration regardless of where the mismatch occurs.
      </p>

      <CodeBlock code={`// Constant-time hash comparison (Node.js)
import { timingSafeEqual } from 'crypto';

function verifyHash(computedHash: string, anchoredHash: string): boolean {
  // Ensure same length before comparison
  if (computedHash.length !== anchoredHash.length) {
    return false;
  }
  
  // Convert to buffers for timing-safe comparison
  const buf1 = Buffer.from(computedHash, 'hex');
  const buf2 = Buffer.from(anchoredHash, 'hex');
  
  // Returns true only if every byte matches
  return timingSafeEqual(buf1, buf2);
}

// Standard comparison (vulnerable to timing attacks)
function unsafeVerify(computed: string, anchored: string): boolean {
  return computed === anchored; // Returns early on mismatch!
}`} language="typescript" />

      <h2 id="zero-knowledge" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Zero-Knowledge Aspects
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        SipHeron implements a practical form of zero-knowledge verification—you can prove a 
        document matches an anchor without revealing the document's content to anyone, including 
        SipHeron itself.
      </p>

      <div className="my-10 flex justify-center">
        {`
\`\`\`mermaid
graph LR
    subgraph Prover
        D[Document D] --> H[H = SHA-256]
    end
    subgraph Verifier
        A[Anchor A] --> AH[Anchored Hash]
    end
    H -- 1. Send H --> Verifier
    AH -- 2. Compare --> H
    Verifier -- 3. Result --> Prover
    
    style D fill:#111,stroke:#2A2A2A,color:#EDEDED
    style A fill:#111,stroke:#2A2A2A,color:#EDEDED
    style H fill:#111,stroke:#9B6EFF,color:#EDEDED
    style AH fill:#111,stroke:#9B6EFF,color:#EDEDED
\`\`\`
        `}
      </div>

      <h3 id="selective-disclosure" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Selective Disclosure</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Beyond simple existence proofs, SipHeron supports selective disclosure—revealing only 
        specific portions of a document while keeping the rest private. This is achieved using 
        Merkle trees for structured documents.
      </p>

      <CodeBlock code={`// Selective disclosure with Merkle proofs
{
  "anchor_id": "anchor_abc123",
  "full_document_hash": "0x7f83b165...",
  "merkle_root": "0xa1b2c3d4...",
  "selective_proof": {
    "revealed_field": "contract_value",
    "field_hash": "0xe5f6a7b8...",
    "merkle_proof": [
      { "sibling": "0x1234...", "position": "left" },
      { "sibling": "0x5678...", "position": "right" },
      { "sibling": "0x9abc...", "position": "left" }
    ],
    "value": "$1,000,000",
    "verified": true  // Proof confirms value is in anchored document
  }
}`} language="json" />

      <h2 id="verification-modes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Self-Verification vs Third-Party
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Different verification scenarios require different trust models and access patterns.
      </p>

      <h3 id="self-verification" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Self-Verification</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        As the document owner, you can verify your own anchors using your SipHeron account. 
        This provides full access to metadata, history, and detailed verification reports.
      </p>

      <CodeBlock code={`// Self-verification via API
GET /dashboard/api/v1/anchors/anchor_abc123/verify
Authorization: Bearer YOUR_API_KEY

// Response
{
  "verification": {
    "status": "verified",
    "anchor_id": "anchor_abc123",
    "document_hash": "0x7f83b165...",
    "match": true,
    "verified_at": "2024-01-15T14:32:10.456Z"
  },
  "anchor_details": {
    "filename": "contract.pdf",
    "size_bytes": 2457600,
    "anchored_at": "2024-01-15T09:23:45.123Z",
    "solana_signature": "5UfgJ5X...",
    "slot": 284715623
  },
  "organization": {
    "id": "org_def456",
    "name": "Your Organization"
  }
}`} language="json" />

      <h3 id="third-party-verification" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Third-Party Verification</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Third parties can verify documents without a SipHeron account using public verification 
        links. This enables trustless verification where anyone can confirm document integrity 
        without trusting SipHeron or the document owner.
      </p>

      {/* Trust Model Comparison */}
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Aspect</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Self-Verification</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Third-Party</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-gray-300">Account Required</td>
              <td className="py-3 pr-4 text-gray-400">Yes (owner)</td>
              <td className="py-3 pr-4 text-green-400">No</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Trust in SipHeron</td>
              <td className="py-3 pr-4 text-yellow-400">Moderate</td>
              <td className="py-3 pr-4 text-green-400">Minimal (direct to chain)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Metadata Access</td>
              <td className="py-3 pr-4 text-green-400">Full</td>
              <td className="py-3 pr-4 text-gray-400">Limited (public only)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Verification Method</td>
              <td className="py-3 pr-4 text-gray-400">API or direct</td>
              <td className="py-3 pr-4 text-gray-400">Direct to blockchain</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="public-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Public Verification Links Architecture
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Public verification links provide a frictionless way for anyone to verify documents 
        without registration, API keys, or technical knowledge.
      </p>

      <div className="my-10 flex justify-center">
        {`
\`\`\`mermaid
graph TD
    Owner[Doc Owner] --> Hash[Compute Hash]
    Hash --> Anchor[Anchor on Solana]
    Anchor --> Link[Create Public Link]
    
    subgraph Link Structure
        L1[Base URL]
        L2[Link ID]
        L3[Hash Fragment #]
    end
    
    Link --> L1
    Link --> L2
    Link --> L3
    
    style L3 stroke:#EF4444,stroke-dasharray: 5 5
    Note right of L3: Never sent to server
\`\`\`
        `}
      </div>

      <h3 id="link-security-features" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Link Security Features</h3>
      <ul className="text-gray-300 space-y-2 mb-6">
        <li className="flex items-start gap-2">
          <Lock className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span><strong>Fragment-based hash:</strong> The expected hash is in the URL fragment (#) which is never sent to the server, preserving privacy</span>
        </li>
        <li className="flex items-start gap-2">
          <Lock className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span><strong>Expiration:</strong> Links can have TTL (time-to-live) with automatic expiration</span>
        </li>
        <li className="flex items-start gap-2">
          <Lock className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span><strong>Password protection:</strong> Optional password requirement for sensitive documents</span>
        </li>
        <li className="flex items-start gap-2">
          <Lock className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <span><strong>Access limits:</strong> Restrict number of verification attempts</span>
        </li>
      </ul>

      <CodeBlock code={`// Generate public verification link
POST /dashboard/api/v1/anchors/anchor_abc123/links
{
  "type": "public",
  "expires_in_days": 30,
  "password_protected": true,
  "password": "secret123",
  "max_uses": 100,
  "custom_message": "Contract between ABC Corp and XYZ Inc"
}

// Response
{
  "link_id": "link_def456",
  "url": "https://verify.sipheron.com/v/def456#hash=0x7f83b165...",
  "short_url": "https://sipheron.com/v/def456",
  "qr_code": "https://api.sipheron.com/dashboard/api/qr/def456.png",
  "expires_at": "2024-02-14T09:23:45.123Z",
  "uses_remaining": 100
}`} language="json" />

      <h2 id="qr-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        QR Code Verification Flow
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        QR codes enable physical-world verification scenarios—printed contracts, certificates, 
        or product packaging can embed verifiable proofs.
      </p>

      <div className="my-10 flex justify-center">
        {`
\`\`\`mermaid
graph TD
    A[Anchor Created] --> G[Generate Link]
    G --> E[Encode in QR]
    
    subgraph QR Contents
        C1[Protocol: V1]
        C2[Hash]
        C3[Verification URL]
        C4[Solana Signature]
    end
    
    E --> QR[Physical QR Code]
    QR -- Scan --> UI[Verification UI]
    UI --> Proof[Display Solana Proof]
\`\`\`
        `}
      </div>

      <h3 id="offline-verification-mode" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Offline Verification Mode</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        QR codes can include enough information for offline verification. By embedding the 
        Solana transaction signature and block details, verifiers can cross-reference directly 
        with blockchain explorers without relying on SipHeron infrastructure.
      </p>

      <CodeBlock code={`// QR code data structure (JSON encoded)
{
  "protocol": "sipheron:v1",
  "type": "anchor_verification",
  "anchor": {
    "hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...",
    "truncated": "0x7f83...b855"
  },
  "proof": {
    "network": "mainnet",
    "signature": "5UfgJ5XVLKw8Tvq3Zz3Yj9Z5Z7Z1Z2Z3Z4Z5Z6Z7Z8Z9Z...",
    "slot": 284715623,
    "timestamp": 1705313025
  },
  "links": {
    "verify": "https://verify.sipheron.com/v/def456",
    "explorer": "https://explorer.solana.com/tx/5UfgJ5X..."
  }
}`} language="json" />

      <h2 id="batch-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Batch Verification Strategies
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        When dealing with large document collections, individual verification is inefficient. 
        Batch verification using Merkle trees provides scalability.
      </p>

      <div className="my-10 flex justify-center">
        {`
\`\`\`mermaid
graph TD
    DocA[Doc A] --> HA[H(A)]
    DocB[Doc B] --> HB[H(B)]
    DocC[Doc C] --> HC[H(C)]
    DocD[Doc D] --> HD[H(D)]
    
    HA --> HAB[H(A+B)]
    HB --> HAB
    HC --> HCD[H(C+D)]
    HD --> HCD
    
    HAB --> Root[Merkle Root]
    HCD --> Root
    Root --> Solana[Solana Blockchain]
    
    style Root fill:#111,stroke:#9B6EFF,color:#EDEDED
    style Solana fill:#111,stroke:#9B6EFF,color:#EDEDED
\`\`\`
        `}
      </div>

      <CodeBlock code={`// Batch anchor with Merkle tree
POST /dashboard/api/v1/anchors/batch
{
  "documents": [
    { "id": "doc_001", "hash": "0xabc123..." },
    { "id": "doc_002", "hash": "0xdef456..." },
    { "id": "doc_003", "hash": "0xghi789..." },
    // ... up to 10,000 documents
  ]
}

// Response - single anchor for entire set
{
  "batch_id": "batch_xyz789",
  "merkle_root": "0xrootabc...",
  "anchor_id": "anchor_root123",
  "document_count": 10000,
  "solana_signature": "5UfgJ5X...",
  "individual_proofs": {
    "doc_001": {
      "path": ["0xdef456...", "0xbranch2..."],
      "directions": ["right", "left"]
    }
  }
}

// Verify single document from batch
POST /dashboard/api/v1/anchors/batch_xyz789/verify
{
  "document_id": "doc_001",
  "document_hash": "0xabc123..."  // Recomputed locally
}

// Response includes Merkle proof verification
{
  "verified": true,
  "merkle_verification": {
    "root": "0xrootabc...",
    "computed_root": "0xrootabc...",
    "path_length": 14,  // log2(10000) ≈ 14
    "in_batch": true
  }
}`} language="json" />

      <h2 id="verification-apis" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Verification APIs and SDK Methods
      </h2>

      <h3 id="rest-api" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">REST API</h3>
      <CodeBlock code={`// Basic verification
GET /dashboard/api/v1/anchors/:id/verify

// With document upload (server-side hashing)
POST /dashboard/api/v1/anchors/:id/verify
Content-Type: multipart/form-data
file: <binary document data>

// Verify by hash (no account required for public anchors)
GET /dashboard/api/v1/verify?hash=0x7f83b165...

// Response format
{
  "verified": true,
  "match": true,
  "anchor": {
    "id": "anchor_abc123",
    "hash": "0x7f83b165...",
    "network": "mainnet",
    "solana_signature": "5UfgJ5X...",
    "slot": 284715623,
    "timestamp": "2024-01-15T09:23:45.123Z"
  },
  "verification": {
    "timestamp": "2024-01-15T14:32:10.456Z",
    "computed_hash": "0x7f83b165...",
    "method": "sha256"
  }
}`} language="json" />

      <h3 id="javascript-sdk" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">JavaScript SDK</h3>
      <CodeBlock code={`import { SipHeronVDR } from '@sipheron/vdr-sdk';

const vdr = new SipHeronVDR({ apiKey: 'YOUR_API_KEY' });

// Verify by anchor ID
const result = await vdr.anchors.verify('anchor_abc123', {
  file: './document.pdf'  // Local file path
});

console.log(result.verified);  // true
console.log(result.anchor.timestamp);  // Anchor timestamp

// Verify with pre-computed hash
const hash = await vdr.crypto.hashFile('./document.pdf');
const result2 = await vdr.anchors.verifyByHash(hash);

// Batch verification
const batchResults = await vdr.anchors.verifyBatch([
  { id: 'anchor_1', file: './doc1.pdf' },
  { id: 'anchor_2', file: './doc2.pdf' }
]);

// Direct blockchain verification (trustless)
const onChainProof = await vdr.anchors.getOnChainProof('anchor_abc123');
const isValid = await vdr.solana.verifyOnChain(onChainProof);`} language="javascript" />

      <h3 id="python-sdk" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Python SDK</h3>
      <CodeBlock code={`from sipheron import SipHeronVDR

vdr = SipHeronVDR(api_key='YOUR_API_KEY')

# Verify document
result = vdr.anchors.verify(
    anchor_id='anchor_abc123',
    file_path='./document.pdf'
)

if result.verified:
    print(f"Document verified! Anchored at: {result.anchor.timestamp}")
    print(f"Solana signature: {result.anchor.solana_signature}")
else:
    print("Verification failed - document may have been modified")

# Streaming verification for large files
with open('./large-file.zip', 'rb') as f:
    result = vdr.anchors.verify_streaming(
        anchor_id='anchor_def456',
        stream=f,
        chunk_size=8192
    )`} language="python" />

      <h2 id="trust-model" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Trust Assumptions and Security Model
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Understanding what you need to trust is essential for designing secure verification workflows.
      </p>

      <div className="my-10 flex justify-center">
        {`
\`\`\`mermaid
graph TD
    subgraph Full Trust
        U1[User] --> S1[SipHeron API] --> B1[Solana]
    end
    subgraph Partial Trust
        U2[User] --> S2[SipHeron Metadata]
        U2 --> B2[Solana RPC]
    end
    subgraph Zero Trust
        U3[User] --> B3[Solana RPC]
    end
    
    style S1 fill:#111,stroke:#9B6EFF,color:#EDEDED
    style B1 fill:#111,stroke:#9B6EFF,color:#EDEDED
    style B2 fill:#111,stroke:#9B6EFF,color:#EDEDED
    style B3 fill:#111,stroke:#9B6EFF,color:#EDEDED
\`\`\`
        `}
      </div>

      <h3 id="security-properties" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Security Properties</h3>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Property</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Guarantee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Integrity</td>
              <td className="py-3 pr-4 text-gray-300">Document hasn't been altered</td>
              <td className="py-3 pr-4 text-green-400">Cryptographic (SHA-256)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Timestamp</td>
              <td className="py-3 pr-4 text-gray-300">When document was anchored</td>
              <td className="py-3 pr-4 text-green-400">Blockchain consensus</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Existence</td>
              <td className="py-3 pr-4 text-gray-300">Document existed at anchor time</td>
              <td className="py-3 pr-4 text-green-400">Inherent in design</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">Non-repudiation</td>
              <td className="py-3 pr-4 text-gray-300">Anchor creator cannot deny action</td>
              <td className="py-3 pr-4 text-green-400">Digital signatures</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="threat-model" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Threat Model</h3>

      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
          <h4 className="text-green-400 font-medium mb-2">Defended Against</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Document modification after anchoring</li>
            <li>• Backdated anchors (requires rewriting blockchain history)</li>
            <li>• Man-in-the-middle attacks (TLS + hash verification)</li>
            <li>• SipHeron API compromise (verifiable against chain)</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
          <h4 className="text-yellow-400 font-medium mb-2">Limitations</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Cannot verify document authenticity (only integrity)</li>
            <li>• Cannot detect pre-computation attacks (anchor old doc as new)</li>
            <li>• Solana 51% attack could theoretically rewrite history</li>
            <li>• Hash collisions (computationally infeasible for SHA-256)</li>
          </ul>
        </div>
      </div>

      <div className="my-8 p-5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <h4 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Best Practice Recommendation
        </h4>
        <p className="text-sm text-gray-300">
          For maximum security, verify directly against the Solana blockchain using multiple RPC 
          endpoints. This eliminates trust in SipHeron infrastructure entirely. For convenience, 
          the SipHeron API provides pre-formatted verification responses that include both the 
          chain proof and human-readable metadata.
        </p>
      </div>
    </div>
  );
};

export default VerificationModelPage;
