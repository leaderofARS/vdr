import DocLayout from '../../components/DocLayout';
import { Terminal, Package, Code, Info, ShieldCheck } from 'lucide-react';

const HEADINGS = [
    { id: 'installation', title: 'Installation', level: 2 },
    { id: 'quickstart', title: 'Quickstart', level: 2 },
    { id: 'file-hashing', title: 'File Hashing Utilities', level: 2 },
    { id: 'anchoring', title: 'Anchoring Documents', level: 2 },
    { id: 'async-support', title: 'Async/Await Support', level: 2 },
    { id: 'exceptions', title: 'Exception Handling', level: 2 },
];

export default function SdkPythonPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">SipHeron VDR Python SDK</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Integrate SipHeron VDR into your Python data science pipelines, backend services, or automation scripts.
                </p>

                <h2 id="installation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Installation
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
                        pip install sipheron-vdr
                    </code>
                </pre>

                <h2 id="quickstart" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Quickstart
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`from sipheron import VDRClient

vdr = VDRClient(api_key="svdr_...")

# Anchor a file
result = vdr.anchor("./report.csv", network="mainnet")
print(f"Transaction: {result['txSignature']}")`}
                    </code>
                </pre>

                <h2 id="file-hashing" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    File Hashing Utilities
                </h2>
                <p className="text-gray-300 mb-4 font-light">
                    The Python SDK includes high-performance hashing utilities that can handle multi-GB files without high memory usage.
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`from sipheron.utils import compute_sha256

hash_hex = compute_sha256("./large_video_audit.mp4")
print(f"File Fingerprint: {hash_hex}")`}
                    </code>
                </pre>

                <h2 id="anchoring" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Anchoring Documents
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`# Anchor raw hash directly
response = vdr.anchor_hash(
    "85e17e3073507d3910c85a9477fd3e079717c10323ea58760085885c490f058e",
    network="devnet"
)

if response['success']:
    print("Locked on Solana!")`}
                    </code>
                </pre>

                <h2 id="async-support" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Async/Await Support
                </h2>
                <p className="text-gray-300 mb-4 font-light">
                    For high-concurrency environments like FastAPI or Starlette, use the <code className="text-purple-300">AsyncVDRClient</code>.
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`import asyncio
from sipheron import AsyncVDRClient

async def main():
    async with AsyncVDRClient() as vdr:
        results = await vdr.anchor_batch(["./doc1.pdf", "./doc2.pdf"])
        print(f"Processed {len(results)} anchors")

asyncio.run(main())`}
                    </code>
                </pre>

                <h2 id="exceptions" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Exception Handling
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-16 text-xs text-purple-200">
                    <code className="font-mono">
{`from sipheron.exceptions import AuthenticationError, RateLimitError

try:
    vdr.anchor("./file.txt")
except AuthenticationError:
    print("Check your SIPHERON_API_KEY environment variable.")
except RateLimitError:
    print("Slow down! You are exceeding your plan's limits.")`}
                    </code>
                </pre>
            </div>
        </DocLayout>
    );
}
