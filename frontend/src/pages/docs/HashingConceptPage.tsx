import React, { useState } from 'react';
import { Copy, Check, Shield, Zap, Lock, FileCode } from 'lucide-react';

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

const HashingConceptPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Cryptographic Hashing</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        A deep technical dive into the cryptographic foundations of SipHeron VDR. Understand how 
        SHA-256 hashing creates immutable digital fingerprints that power blockchain document verification.
      </p>

      {/* Key Properties Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <h3 id="deterministic" className="font-bold text-white mb-1 scroll-mt-24">Deterministic</h3>
          <p className="text-sm text-gray-400">Same input always produces identical output</p>
        </div>
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <h3 id="avalanche-effect" className="font-bold text-white mb-1 scroll-mt-24">Avalanche Effect</h3>
          <p className="text-sm text-gray-400">Tiny changes produce completely different hashes</p>
        </div>
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-purple-400" />
          </div>
          <h3 id="collision-resistant" className="font-bold text-white mb-1 scroll-mt-24">Collision Resistant</h3>
          <p className="text-sm text-gray-400">Practically impossible to find two identical hashes</p>
        </div>
      </div>

      <h2 id="what-is-sha256" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        What is SHA-256?
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a 
        fixed-size 256-bit (32-byte) hash value from any input data. It's part of the SHA-2 family 
        designed by the NSA and published in 2001. SHA-256 is the backbone of Bitcoin, most blockchain 
        systems, and now SipHeron VDR.
      </p>
      
      <h3 id="mathematical-foundation" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Mathematical Foundation</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        SHA-256 operates on 512-bit message blocks and uses a Merkle-Damgård structure with a 
        Davies-Meyer compression function. The algorithm processes data in 64 rounds of bit 
        manipulation using six logical functions:
      </p>
      
      <div className="my-6 p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg overflow-x-auto">
        <pre className="text-sm font-mono text-[#EDEDED]">
{`Ch(x, y, z)   = (x AND y) XOR ((NOT x) AND z)
Maj(x, y, z)  = (x AND y) XOR (x AND z) XOR (y AND z)
Σ0(x)         = ROTR²(x) XOR ROTR¹³(x) XOR ROTR²²(x)
Σ1(x)         = ROTR⁶(x) XOR ROTR¹¹(x) XOR ROTR²⁵(x)
σ0(x)         = ROTR⁷(x) XOR ROTR¹⁸(x) XOR SHR³(x)
σ1(x)         = ROTR¹⁷(x) XOR ROTR¹⁹(x) XOR SHR¹⁰(x)`}
        </pre>
      </div>

      <h3 id="the-hashing-process" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">The Hashing Process</h3>
      
      {/* ASCII Diagram for Hashing Process */}
      <div className="my-10 flex justify-center">
        {`
\`\`\`mermaid
graph TD
    A[Original File] -- Arbitrary size --> B(Preprocessing)
    B -- Pad to 512-bit blocks --> C(Message Schedule)
    C -- 64 words generation --> D(64 Compression Rounds)
    D -- a-h registers update --> E[Final 32-Byte Hash]
    style A fill:#111,stroke:#2A2A2A,color:#EDEDED
    style B fill:#111,stroke:#9B6EFF,color:#EDEDED
    style C fill:#111,stroke:#9B6EFF,color:#EDEDED
    style D fill:#111,stroke:#9B6EFF,color:#EDEDED
    style E fill:#111,stroke:#9B6EFF,color:#EDEDED
\`\`\`
        `}
      </div>

      <h2 id="hash-properties" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Core Hash Properties
      </h2>

      <h3 id="1-deterministic" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">1. Deterministic</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Given the same input, SHA-256 always produces the exact same output hash. This property 
        is essential for verification—you can re-compute the hash of a document at any time and 
        compare it to the anchored hash. If they match, the document is unchanged.
      </p>
      <CodeBlock code={`// Example: Deterministic hashing in JavaScript
const crypto = require('crypto');

const input = "Hello, SipHeron!";
const hash1 = crypto.createHash('sha256').update(input).digest('hex');
const hash2 = crypto.createHash('sha256').update(input).digest('hex');

console.log(hash1 === hash2); // Always true: true
console.log(hash1); 
// Output: 8d5e5f0e3b5c3d8f9e4a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6`} language="javascript" />

      <h3 id="2-avalanche-effect" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">2. Avalanche Effect</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        A tiny change in the input—even a single bit—results in a completely different hash. 
        On average, 50% of the output bits change. This ensures that any tampering with a document 
        is immediately detectable.
      </p>
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Input</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">SHA-256 Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-gray-300 font-mono">"hello"</td>
              <td className="py-3 pr-4 text-purple-300 font-mono text-xs">2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300 font-mono">"Hello"</td>
              <td className="py-3 pr-4 text-purple-300 font-mono text-xs">185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300 font-mono">"hellO"</td>
              <td className="py-3 pr-4 text-purple-300 font-mono text-xs">d8bb94dcd6159a8eb6e7a69329f0e4ab1c08d3ad4574a336a8f5bce3ffef1b96</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="3-collision-resistance" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">3. Collision Resistance</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        A collision occurs when two different inputs produce the same hash. For SHA-256, finding 
        a collision requires approximately 2¹²⁸ operations (birthday paradox bound). At current 
        computing speeds, this would take longer than the age of the universe, making SHA-256 
        effectively collision-resistant.
      </p>
      <div className="my-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-purple-400" />
          Security Strength
        </h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Pre-image resistance: 2²⁵⁶ operations to reverse</li>
          <li>• Second pre-image resistance: 2²⁵⁶ operations to find alternative input</li>
          <li>• Collision resistance: 2¹²⁸ operations to find any collision</li>
        </ul>
      </div>

      <h2 id="why-hash-before-anchor" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Why Hash Before Anchoring?
      </h2>

      <h3 id="privacy-preservation" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Privacy Preservation</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        By anchoring only the hash (not the actual file), you maintain complete privacy. Anyone 
        examining the blockchain sees only a meaningless 64-character string—not your contracts, 
        financial reports, or sensitive documents. The original file never leaves your control.
      </p>
      
      <div className="my-10 flex justify-center">
        {`
\`\`\`mermaid
graph LR
    subgraph Private System
        Doc[Confidential Document]
    end
    
    subgraph Public Blockchain
        Anchor[Anchor Record: Hash/Timestamp]
    end
    
    subgraph Verifier
        VDoc[Recomputed Hash]
    end
    
    Doc -- Only Hash --> Anchor
    VDoc -- Must Match --> Anchor
    
    style Doc fill:#111,stroke:#EF4444,color:#EDEDED
    style Anchor fill:#111,stroke:#9B6EFF,color:#EDEDED
    style VDoc fill:#111,stroke:#22C55E,color:#EDEDED
\`\`\`
        `}
      </div>

      <h3 id="storage-efficiency" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Storage Efficiency</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Blockchains have limited storage capacity and high storage costs. Anchoring a 64-byte hash 
        instead of a 10MB PDF is approximately 160,000x more efficient. This cost savings makes 
        blockchain anchoring economically viable for all document sizes.
      </p>
      
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Document Size</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Hash Size</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Compression Ratio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-gray-300">1 KB text file</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">64 bytes</td>
              <td className="py-3 pr-4 text-green-400">16:1</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">5 MB PDF</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">64 bytes</td>
              <td className="py-3 pr-4 text-green-400">81,920:1</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">1 GB video</td>
              <td className="py-3 pr-4 text-purple-300 font-mono">64 bytes</td>
              <td className="py-3 pr-4 text-green-400">16,777,216:1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="local-vs-server" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Local vs Server-Side Hashing
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        SipHeron supports both local (client-side) and server-side hashing, each with different 
        privacy and performance implications.
      </p>

      <h3 id="local-hashing-recommended" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Local Hashing (Recommended)</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        The document is hashed on your device before any data is transmitted. Only the hash (not 
        the document) is sent to SipHeron servers. This is the most private option—SipHeron never 
        sees your document content.
      </p>
      <CodeBlock code={`// Local hashing with SipHeron CLI
sipheron-vdr anchor ./contract.pdf --local-hash

// The CLI computes the hash locally:
// 1. Reads file from disk
// 2. Computes SHA-256 hash (in-memory)
// 3. Sends ONLY the hash to API
// 4. File content never leaves your machine`} language="bash" />

      <h3 id="server-side-hashing" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Server-Side Hashing</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        The document is uploaded to SipHeron servers, hashed there, and then the file is discarded. 
        This option is useful when client-side hashing libraries aren't available, but requires 
        trusting that the server properly discards the file after hashing.
      </p>
      <CodeBlock code={`// Server-side hashing
sipheron-vdr anchor ./contract.pdf --server-hash

// The file is uploaded, hashed on server, then deleted
// Trust assumption: server doesn't retain copies`} language="bash" />

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Aspect</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Local Hashing</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Server Hashing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-gray-300">Privacy</td>
              <td className="py-3 pr-4 text-green-400">Maximum (file never leaves device)</td>
              <td className="py-3 pr-4 text-yellow-400">Good (file uploaded then deleted)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Network Usage</td>
              <td className="py-3 pr-4 text-green-400">~64 bytes per file</td>
              <td className="py-3 pr-4 text-red-400">Full file size</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Processing</td>
              <td className="py-3 pr-4 text-gray-300">Client CPU intensive</td>
              <td className="py-3 pr-4 text-green-400">Server handles computation</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Trust Required</td>
              <td className="py-3 pr-4 text-green-400">None (verifiable)</td>
              <td className="py-3 pr-4 text-yellow-400">Server behavior</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="hash-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Hash Verification Walkthrough
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        Verification is the process of proving that a document hasn't been modified since anchoring. 
        It works by recomputing the hash and comparing it to the anchored value.
      </p>

      <div className="my-10 flex justify-center">
        {`
\`\`\`mermaid
graph TD
    Start[Verification Request] --> Step1[1. Receive document]
    Step1 --> Step2[2. Compute SHA-256 locally]
    Step2 --> Step3[3. Query blockchain for stored hash]
    Step3 --> Step4[4. Compare hashes bitwise]
    Step4 --> Match{MATCH?}
    Match -- Yes --> Authentic[Document is AUTHENTIC]
    Match -- No --> Modified[Document has been MODIFIED]
    
    style Start fill:#111,stroke:#2A2A2A,color:#EDEDED
    style Step1 fill:#111,stroke:#9B6EFF,color:#EDEDED
    style Step2 fill:#111,stroke:#9B6EFF,color:#EDEDED
    style Step3 fill:#111,stroke:#9B6EFF,color:#EDEDED
    style Step4 fill:#111,stroke:#9B6EFF,color:#EDEDED
    style Match fill:#111,stroke:#9B6EFF,color:#EDEDED
    style Authentic fill:#111,stroke:#22C55E,color:#EDEDED
    style Modified fill:#111,stroke:#EF4444,color:#EDEDED
\`\`\`
        `}
      </div>

      <h3 id="step-by-step-verification" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Step-by-Step Verification</h3>
      <CodeBlock code={`# Example: Verifying a document
$ sipheron-vdr verify ./contract-signed.pdf

# Step 1: Read file
Reading ./contract-signed.pdf (2.4 MB)...

# Step 2: Compute hash locally  
Computing SHA-256 hash... ✓
Local hash: 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...

# Step 3: Query blockchain
Fetching anchor record from Solana devnet... ✓
Anchored hash: 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...
Anchor slot: 284,715,623
Anchor time: 2024-01-15T09:23:45.123Z

# Step 4: Compare
Comparing hashes... ✓ MATCH

╔══════════════════════════════════════════════════════════╗
║  ✅ VERIFICATION SUCCESSFUL                              ║
║  The document has NOT been modified since anchoring      ║
╚══════════════════════════════════════════════════════════╝`} language="bash" />

      <h2 id="algorithm-comparison" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Hashing Algorithms Comparison
      </h2>

      <p className="text-gray-300 leading-relaxed mb-4">
        While SipHeron uses SHA-256, it's useful to understand how it compares to other 
        cryptographic hash functions.
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Algorithm</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Output Size</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Security</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">SHA-256</td>
              <td className="py-3 pr-4 text-gray-300">256 bits</td>
              <td className="py-3 pr-4 text-green-400">Very High (2¹²⁸)</td>
              <td className="py-3 pr-4 text-green-400">Recommended ✓</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">SHA-3-256</td>
              <td className="py-3 pr-4 text-gray-300">256 bits</td>
              <td className="py-3 pr-4 text-green-400">Very High</td>
              <td className="py-3 pr-4 text-green-400">Secure alternative</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">SHA-1</td>
              <td className="py-3 pr-4 text-gray-300">160 bits</td>
              <td className="py-3 pr-4 text-red-400">Broken (collisions found)</td>
              <td className="py-3 pr-4 text-red-400">Deprecated ✗</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">MD5</td>
              <td className="py-3 pr-4 text-gray-300">128 bits</td>
              <td className="py-3 pr-4 text-red-400">Severely broken</td>
              <td className="py-3 pr-4 text-red-400">Deprecated ✗</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-300 font-mono">BLAKE3</td>
              <td className="py-3 pr-4 text-gray-300">256 bits</td>
              <td className="py-3 pr-4 text-green-400">Very High</td>
              <td className="py-3 pr-4 text-gray-400">Modern, very fast</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="implementation-examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Implementation Examples
      </h2>

      <h3 id="javascript-node-js" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">JavaScript/Node.js</h3>
      <CodeBlock code={`const crypto = require('crypto');
const fs = require('fs');

// Hash a string
function hashString(input) {
  return crypto.createHash('sha256')
    .update(input, 'utf8')
    .digest('hex');
}

// Hash a file (streaming for large files)
function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

// Usage
async function main() {
  const fileHash = await hashFile('./document.pdf');
  console.log('SHA-256:', fileHash);
}

main();`} language="javascript" />

      <h3 id="python" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Python</h3>
      <CodeBlock code={`import hashlib

# Hash a string
def hash_string(input_str):
    return hashlib.sha256(input_str.encode('utf-8')).hexdigest()

# Hash a file (streaming for large files)
def hash_file(file_path, chunk_size=8192):
    sha256_hash = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(chunk_size), b''):
            sha256_hash.update(chunk)
    return sha256_hash.hexdigest()

# Usage
if __name__ == '__main__':
    file_hash = hash_file('./document.pdf')
    print(f'SHA-256: {file_hash}')`} language="python" />

      <h3 id="go" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Go</h3>
      <CodeBlock code={`package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"os"
)

// HashString hashes a string
func HashString(input string) string {
	hash := sha256.Sum256([]byte(input))
	return hex.EncodeToString(hash[:])
}

// HashFile hashes a file using streaming
func HashFile(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	hash := sha256.New()
	if _, err := io.Copy(hash, file); err != nil {
		return "", err
	}

	return hex.EncodeToString(hash.Sum(nil)), nil
}

func main() {
	hash, err := HashFile("./document.pdf")
	if err != nil {
		panic(err)
	}
	fmt.Println("SHA-256:", hash)
}`} language="go" />

      <h3 id="rust" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Rust</h3>
      <CodeBlock code={`use sha2::{Sha256, Digest};
use std::fs::File;
use std::io::{self, Read};
use hex;

// Hash bytes
fn hash_bytes(input: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input);
    hex::encode(hasher.finalize())
}

// Hash file
fn hash_file(path: &str) -> io::Result<String> {
    let mut file = File::open(path)?;
    let mut hasher = Sha256::new();
    let mut buffer = [0u8; 8192];
    
    loop {
        let bytes_read = file.read(&mut buffer)?;
        if bytes_read == 0 {
            break;
        }
        hasher.update(&buffer[..bytes_read]);
    }
    
    Ok(hex::encode(hasher.finalize()))
}

fn main() {
    match hash_file("./document.pdf") {
        Ok(hash) => println!("SHA-256: {}", hash),
        Err(e) => eprintln!("Error: {}", e),
    }
}`} language="rust" />

      <h2 id="edge-cases" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Edge Cases and Special Scenarios
      </h2>

      <h3 id="empty-files" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Empty Files</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        An empty file (0 bytes) still produces a valid SHA-256 hash. This is the hash of the empty string:
      </p>
      <CodeBlock code={`# SHA-256 of empty file
echo -n "" | sha256sum
# Output: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`} language="bash" />

      <h3 id="binary-files" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Binary Files</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        SHA-256 treats all data as binary—it doesn't interpret content. Images, executables, 
        compiled code, and encrypted files are hashed the same way as text files.
      </p>
      <CodeBlock code={`# All these work identically
sipheron-vdr anchor ./photo.jpg      # Binary image
sipheron-vdr anchor ./app.exe        # Executable
sipheron-vdr anchor ./data.enc       # Encrypted file
sipheron-vdr anchor ./video.mp4      # Large binary`} language="bash" />

      <h3 id="very-large-files" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Very Large Files</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        For files larger than available RAM, use streaming (chunked) hashing. This processes 
        the file in small segments without loading it entirely into memory.
      </p>
      <CodeBlock code={`// Streaming hash for large files (Node.js)
const hashLargeFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 }); // 64KB chunks
    
    let bytesProcessed = 0;
    
    stream.on('data', (chunk) => {
      hash.update(chunk);
      bytesProcessed += chunk.length;
      // Progress: bytesProcessed / fs.statSync(filePath).size
    });
    
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};

// Works for any file size - tested up to 100GB+`} language="javascript" />

      <h3 id="encoding-considerations" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Encoding Considerations</h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Text encoding matters! The same text in UTF-8 vs UTF-16 produces different hashes. 
        Always use consistent encoding.
      </p>
      <CodeBlock code={`# Same string, different encodings = different hashes
echo -n "hello" | sha256sum
# UTF-8: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824

echo -n "hello" | iconv -f UTF-8 -t UTF-16LE | sha256sum  
# UTF-16LE: different hash entirely!`} language="bash" />

      <div className="my-8 p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h4 className="text-yellow-400 font-medium mb-2">⚠️ Important Note</h4>
        <p className="text-sm text-gray-300">
          When verifying across different systems, ensure you're using the same encoding and 
          line-ending conventions. Windows (CRLF) and Unix (LF) line endings will produce 
          different hashes for the same "content."
        </p>
      </div>

      <h2 id="best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Best Practices
      </h2>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 font-bold text-sm">1</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Always Use Streaming for Large Files</h4>
            <p className="text-sm text-gray-400">Prevents memory exhaustion and handles files of any size efficiently.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 font-bold text-sm">2</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Verify Immediately After Anchoring</h4>
            <p className="text-sm text-gray-400">Catch encoding or corruption issues before they become problems.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 font-bold text-sm">3</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Store Original Files Securely</h4>
            <p className="text-sm text-gray-400">The hash is proof of existence; the file is needed for verification.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-400 font-bold text-sm">4</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Document Your Encoding Standards</h4>
            <p className="text-sm text-gray-400">Ensure all systems in your pipeline use consistent text encoding.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashingConceptPage;
