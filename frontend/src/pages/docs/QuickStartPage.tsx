import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const QuickStartPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Quick Start</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Get up and running with SipHeron VDR in under 5 minutes. This guide will walk you through
        installing the CLI, authenticating your account, and anchoring your first document.
      </p>

      <div className="flex flex-col gap-2 mb-12">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <span className="text-purple-400 text-2xl">⏱️</span>
          <div>
            <p className="text-white font-medium">Estimated time: 5 minutes</p>
            <p className="text-sm text-gray-400">You only need Node.js installed to get started.</p>
          </div>
        </div>
      </div>

      <h2 id="step-1-install" className="text-2xl font-bold text-white mt-12 mb-4 scroll-mt-24">
        Step 1: Install the CLI
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        SipHeron provides a command-line interface for local document operations. Install it globally using npm:
      </p>
      <CodeBlock code="npm install -g @sipheron/vdr-cli" />
      <p className="text-gray-300 leading-relaxed mb-4">
        Verify the installation by checking the version:
      </p>
      <CodeBlock code="sipheron-vdr --version" />

      <h2 id="step-2-create-account" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Step 2: Create an Account
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        To start anchoring documents, you need a SipHeron account. You can sign up through our dashboard or
        create one directly via the CLI:
      </p>
      <CodeBlock code="sipheron-vdr auth signup --email you@example.com --password YourPassword123" />
      <p className="text-gray-300 leading-relaxed mb-4">
        Once you've created your account, log in to obtain your access token:
      </p>
      <CodeBlock code="sipheron-vdr auth login" />
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        This command will securely store your credentials and create an API key for CLI usage.
      </p>

      <h2 id="step-3-anchor" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Step 3: Anchor Your First Document
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Now for the fun part—anchoring your first document to the blockchain. Create a simple text file
        or use any file you have:
      </p>
      <CodeBlock code={'echo "This is my first anchored document!" > my-document.txt'} />
      <p className="text-gray-300 leading-relaxed mb-4">
        Use the <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">anchor</code> command
        to create a cryptographic proof on Solana:
      </p>
      <CodeBlock code="sipheron-vdr anchor my-document.txt" />
      <p className="text-gray-300 leading-relaxed mb-4">
        After a few seconds, you'll receive a success message with your anchor details:
      </p>
      <div className="my-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <pre className="text-sm font-mono text-green-300">
{`✓ Document anchored successfully!
  
  Hash:     0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d007f1bfa4d9...
  Slot:     284715623
  Network:  devnet
  Timestamp: 2024-01-15T09:23:45.123Z
  
  View on Solana: https://explorer.solana.com/tx/...`}
        </pre>
      </div>

      <h2 id="step-4-verify" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Step 4: Verify Your Document
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Verification proves that your document hasn't been altered since anchoring. You can verify
        directly from the CLI:
      </p>
      <CodeBlock code="sipheron-vdr verify my-document.txt" />
      <p className="text-gray-300 leading-relaxed mb-4">
        Or use a public verification link that anyone can access without an account:
      </p>
      <CodeBlock code="sipheron-vdr verify my-document.txt --public-link" language="bash" />

      <h2 id="next-steps" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Next Steps
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Congratulations! You've successfully anchored and verified your first document on the blockchain.
        Here are some paths to explore next:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        <Link to="/docs/cli" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all">
          <span className="text-2xl mb-3 block">📖</span>
          <h4 className="text-lg font-bold text-white mb-1">CLI Reference</h4>
          <p className="text-sm text-gray-400">Learn all available commands and advanced options.</p>
        </Link>
        <Link to="/docs/api" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all">
          <span className="text-2xl mb-3 block">🔌</span>
          <h4 className="text-lg font-bold text-white mb-1">API Integration</h4>
          <p className="text-sm text-gray-400">Integrate document verification into your applications.</p>
        </Link>
        <Link to="/docs/guides/webhooks" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all">
          <span className="text-2xl mb-3 block">🔗</span>
          <h4 className="text-lg font-bold text-white mb-1">Webhooks</h4>
          <p className="text-sm text-gray-400">Get notified when documents are anchored or verified.</p>
        </Link>
        <Link to="/docs/sdks/javascript" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all">
          <span className="text-2xl mb-3 block">💻</span>
          <h4 className="text-lg font-bold text-white mb-1">JavaScript SDK</h4>
          <p className="text-sm text-gray-400">Build apps with our official JavaScript library.</p>
        </Link>
      </div>
    </div>
  );
};

export default QuickStartPage;
