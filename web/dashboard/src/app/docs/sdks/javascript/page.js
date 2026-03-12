import DocLayout from '../../components/DocLayout';
import { Code, Package, Zap, ShieldCheck, Terminal, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'installation', title: 'Installation', level: 2 },
    { id: 'initialization', title: 'Initialization', level: 2 },
    { id: 'anchoring-files', title: 'Anchoring Files', level: 2 },
    { id: 'verifying-hashes', title: 'Verifying Hashes', level: 2 },
    { id: 'full-example', title: 'Full Example', level: 2 },
    { id: 'browser-usage', title: 'Browser Usage', level: 2 },
];

export default function SdkJavascriptPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">SipHeron VDR JavaScript SDK</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    The official client library for Node.js and the browser. Securely interact with SipHeron VDR using idiomatic JavaScript.
                </p>

                <h2 id="installation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Installation
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
                        npm install @sipheron/vdr-sdk
                    </code>
                </pre>

                <h2 id="initialization" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Initialization
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`import { SipHeronClient } from '@sipheron/vdr-sdk';

const vdr = new SipHeronClient({
  apiKey: process.env.SIPHERON_API_KEY,
  network: 'mainnet' // default is devnet
});`}
                    </code>
                </pre>

                <h2 id="anchoring-files" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Anchoring Files
                </h2>
                <p className="text-gray-300 mb-4 font-light">
                    The SDK automatically handles file hashing and batching if provided with a file list.
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`const result = await vdr.anchorFile('./agreement.pdf', {
  metadata: { department: 'Legal' }
});

console.log('Document Anchored:', result.pda);`}
                    </code>
                </pre>

                <h2 id="verifying-hashes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Verifying Hashes
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`const isValid = await vdr.verify('85e17e3073507d3910c...');
if (isValid.authentic) {
  console.log('Document is untampered. Confirmed at:', isValid.timestamp);
}`}
                    </code>
                </pre>

                <h2 id="full-example" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Full Example
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-12 text-xs text-purple-200">
                    <code className="font-mono">
{`import { SipHeronClient } from '@sipheron/vdr-sdk';
import fs from 'fs';

async function run() {
  const vdr = new SipHeronClient({ apiKey: 'svdr_...' });
  
  // 1. Stage and Anchor
  const { hash, txSignature } = await vdr.anchorFile('./invoice.pdf');
  console.log(\`Anchored hash \${hash} in \${txSignature}\`);

  // 2. Poll for confirmation (optional, webhooks recommended)
  const status = await vdr.getStatus(hash);
  console.log('Status:', status.label);
}

run();`}
                    </code>
                </pre>

                <h2 id="browser-usage" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Browser Usage
                </h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-16">
                    <p className="text-yellow-300 text-sm">
                        ⚠️ Never include your <code className="text-purple-300">apiKey</code> in browser-side code. Use the SDK in the browser only for <strong>Public Verification</strong> or by proxying requests through your own backend.
                    </p>
                </div>
            </div>
        </DocLayout>
    );
}
