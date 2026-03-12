import DocLayout from '../components/DocLayout';
import { Terminal, Key, ChevronRight } from 'lucide-react';
import Link from 'next/link';



export default function QuickStartPage() {
    return (
        <DocLayout headings={[]}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Quick Start</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Get up and running with SipHeron VDR in less than 5 minutes. We'll guide you from installation to your first blockchain-verified document.
                </p>

                <h2 id="prerequisites" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Prerequisites
                </h2>
                <ul className="list-disc list-inside text-gray-400 space-y-2 mb-8 ml-4">
                    <li><code className="text-purple-400">Node.js</code> version 16 or higher</li>
                    <li>A SipHeron account (sign up at <a href="https://app.sipheron.com" className="text-purple-400 underline">app.sipheron.com</a>)</li>
                    <li>A terminal (Bash, Zsh, or PowerShell)</li>
                </ul>

                <h2 id="installation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    1. Installation
                </h2>
                <p className="text-gray-300 mb-4">Install the CLI globally using npm:</p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8 flex items-center justify-between group">
                    <code className="text-purple-300 font-mono text-sm">npm install -g sipheron-vdr</code>
                    <Terminal className="text-gray-600 group-hover:text-purple-400 transition-colors" size={18} />
                </div>

                <h2 id="get-api-key" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    2. Get API Key
                </h2>
                <div className="flex gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 mb-8">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                        <Key className="text-purple-400" size={20} />
                    </div>
                    <div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                            Log in to your dashboard, navigate to <strong>API Keys</strong>, and create a new key with <code className="text-purple-300">write</code> scope.
                        </p>
                        <Link href="https://app.sipheron.com/dashboard/keys" className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                            Open Dashboard <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>

                <h2 id="link-account" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    3. Link Account
                </h2>
                <p className="text-gray-300 mb-4">Connect your local CLI to your SipHeron account:</p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm">vdr link YOUR_API_KEY</code>
                </div>

                <h2 id="stage-files" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    4. Stage Files
                </h2>
                <p className="text-gray-300 mb-4">Compute the hash of your document without uploading the file:</p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm">vdr stage ./my_document.pdf</code>
                </div>

                <h2 id="anchor-onchain" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    5. Anchor On-Chain
                </h2>
                <p className="text-gray-300 mb-4">Submit the staged hash to the Solana Devnet (it's free!):</p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm">vdr anchor --devnet</code>
                </div>

                <h2 id="verify-proof" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    6. Verify Proof
                </h2>
                <p className="text-gray-300 mb-4">Confirm the document's integrity at any time:</p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-16">
                    <code className="text-purple-300 font-mono text-sm">vdr verify ./my_document.pdf</code>
                </div>
            </div>
        </DocLayout>
    );
}
