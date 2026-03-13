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

const SdkPythonPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Python SDK</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Integrate document verification into your Python applications with the 
        official SipHeron Python SDK.
      </p>

      <h2 id="installation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Installation
      </h2>
      <CodeBlock code={`# pip
pip install sipheron-vdr

# Poetry
poetry add sipheron-vdr

# Conda
conda install -c sipheron sipheron-vdr`} />

      <h2 id="initialization" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Initialization
      </h2>
      <CodeBlock code={`from sipheron import SipHeronClient

# With API key
client = SipHeronClient(
    api_key="your-api-key",
    network="mainnet"  # or "devnet", "testnet"
)

# With bearer token
client = SipHeronClient(
    bearer_token="your-jwt-token"
)`} language="python" />

      <h2 id="hashing" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Hashing Documents
      </h2>
      <CodeBlock code={`from sipheron import hash_file

# Hash a file
file_hash = hash_file("./document.pdf")
print(f"Hash: {file_hash}")
# Output: 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...`} language="python" />

      <h2 id="anchoring" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Anchoring Documents
      </h2>
      <CodeBlock code={`# Anchor a file
result = client.anchor(
    file_path="./contract.pdf",
    note="Client contract"
)

print(f"Anchor ID: {result.id}")
print(f"Solana TX: {result.solana_tx}")
print(f"Timestamp: {result.timestamp}")`} language="python" />

      <h2 id="verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Verifying Documents
      </h2>
      <CodeBlock code={`# Verify a file
verification = client.verify(
    file_path="./contract.pdf",
    anchor_id="anchor_abc123"
)

if verification.valid:
    print("Document is valid!")
    print(f"Anchored at: {verification.timestamp}")
else:
    print("Document has been modified!")`} language="python" />

      <h2 id="async" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Async Support
      </h2>
      <CodeBlock code={`import asyncio
from sipheron import AsyncSipHeronClient

async def main():
    client = AsyncSipHeronClient(api_key="your-key")
    
    # Batch anchor multiple files
    files = ["./doc1.pdf", "./doc2.pdf", "./doc3.pdf"]
    
    tasks = [
        client.anchor(file_path=f, note=f"Document {i}")
        for i, f in enumerate(files)
    ]
    
    results = await asyncio.gather(*tasks)
    print(f"Anchored {len(results)} documents")

asyncio.run(main())`} language="python" />

      <h2 id="django" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Django Integration
      </h2>
      <CodeBlock code={`# settings.py
SIPHERON_API_KEY = os.environ.get("SIPHERON_API_KEY")
SIPHERON_NETWORK = "mainnet"

# models.py
from django.db import models
from sipheron import SipHeronClient

class Document(models.Model):
    file = models.FileField(upload_to="docs/")
    anchor_id = models.CharField(max_length=255, blank=True)
    anchored_at = models.DateTimeField(null=True, blank=True)
    
    def anchor_to_blockchain(self):
        client = SipHeronClient(api_key=settings.SIPHERON_API_KEY)
        result = client.anchor(file_path=self.file.path)
        self.anchor_id = result.id
        self.anchored_at = result.timestamp
        self.save()`} language="python" />

      <h2 id="error-handling" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Error Handling
      </h2>
      <CodeBlock code={`from sipheron.exceptions import (
    InsufficientFundsError,
    InvalidAPIKeyError,
    NetworkError
)

try:
    result = client.anchor(file_path="./doc.pdf")
except InsufficientFundsError:
    print("Not enough SOL for transaction")
except InvalidAPIKeyError:
    print("Check your API key")
except NetworkError as e:
    print(f"Network error: {e}")`} language="python" />
    </div>
  );
};

export default SdkPythonPage;
