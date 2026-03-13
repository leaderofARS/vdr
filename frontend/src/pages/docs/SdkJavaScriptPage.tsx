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

const SdkJavaScriptPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">JavaScript SDK</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Build document verification into your Node.js and browser applications 
        with the official SipHeron JavaScript SDK.
      </p>

      <h2 id="installation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Installation
      </h2>
      <CodeBlock code={`# NPM
npm install @sipheron/vdr-sdk

# Yarn
yarn add @sipheron/vdr-sdk

# CDN (browser)
<script src="https://cdn.sipheron.io/sdk/v2/sipheron-vdr.min.js"></script>`} />

      <h2 id="initialization" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Initialization
      </h2>
      <CodeBlock code={`import { SipHeronClient } from '@sipheron/vdr-sdk';

const client = new SipHeronClient({
  apiKey: 'your-api-key',
  network: 'mainnet' // or 'devnet', 'testnet'
});

// Or with bearer token
const client = new SipHeronClient({
  bearerToken: 'your-jwt-token'
});`} language="javascript" />

      <h2 id="hashing" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Hashing Documents
      </h2>
      <CodeBlock code={`// Hash a file (Node.js)
import { hashFile } from '@sipheron/vdr-sdk';

const hash = await hashFile('./document.pdf');
console.log('Hash:', hash);
// Output: 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...`} language="javascript" />

      <h2 id="anchoring" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Anchoring Documents
      </h2>
      <CodeBlock code={`// Anchor a file
const result = await client.anchor({
  file: './contract.pdf',
  note: 'Client contract'
});

console.log('Anchor ID:', result.id);
console.log('Solana TX:', result.solanaTx);`} language="javascript" />

      <h2 id="verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Verifying Documents
      </h2>
      <CodeBlock code={`// Verify a file against blockchain
const verification = await client.verify({
  file: './contract.pdf',
  anchorId: 'anchor_abc123'
});

if (verification.valid) {
  console.log('Document is valid!');
  console.log('Anchored at:', verification.timestamp);
} else {
  console.log('Document has been modified!');
}`} language="javascript" />

      <h2 id="browser" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Browser Usage
      </h2>
      <CodeBlock code={`// In browser - hash File object
import { hashBlob } from '@sipheron/vdr-sdk/browser';

const fileInput = document.getElementById('file');
const file = fileInput.files[0];

const hash = await hashBlob(file);
console.log('File hash:', hash);`} language="javascript" />

      <h2 id="react" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        React Integration
      </h2>
      <CodeBlock code={`import { useSipHeron } from '@sipheron/vdr-sdk/react';

function DocumentUploader() {
  const { anchor, loading, error } = useSipHeron({
    apiKey: process.env.REACT_APP_SIPHERON_KEY
  });

  const handleUpload = async (file) => {
    const result = await anchor({
      file,
      note: 'User uploaded document'
    });
    console.log('Anchored:', result.id);
  };

  return (
    <input 
      type="file" 
      onChange={(e) => handleUpload(e.target.files[0])}
      disabled={loading}
    />
  );
}`} language="javascript" />

      <h2 id="error-handling" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Error Handling
      </h2>
      <CodeBlock code={`try {
  const result = await client.anchor({ file: './doc.pdf' });
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Not enough SOL for transaction');
  } else if (error.code === 'INVALID_API_KEY') {
    console.error('Check your API key');
  } else {
    console.error('Anchor failed:', error.message);
  }
}`} language="javascript" />
    </div>
  );
};

export default SdkJavaScriptPage;
