import DocLayout from '../../components/DocLayout';
import { XCircle, AlertTriangle, Shield, HardDrive, Terminal } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Overview', level: 2 },
    { id: 'synopsis', title: 'Synopsis', level: 2 },
    { id: 'important-warning', title: 'Important Warning', level: 2 },
    { id: 'how-it-works', title: 'How it works', level: 2 },
    { id: 'examples', title: 'Examples', level: 2 },
    { id: 'output', title: 'Output', level: 2 },
    { id: 'errors', title: 'Common Errors', level: 2 },
];

export default function CliRevokePage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">vdr revoke</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Mark a previously anchored document as invalid or untrusted.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-4">
                    The <code className="text-purple-300">revoke</code> command allows you to explicitly signal that a document is no longer valid. This is useful for expired contracts, invalidated ID cards, or files discovered to contain errors.
                </p>

                <h2 id="synopsis" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Synopsis
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr revoke &lt;hash-or-path&gt; [options]
                    </code>
                </pre>

                <h2 id="important-warning" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Important Warning
                </h2>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-300 shrink-0" />
                    <p className="text-red-300 text-sm">
                        Revocation <strong>cannot be undone</strong>. Once a hash is marked as revoked on the blockchain, no one (including SipHeron) can restore it to an "Authentic" state.
                    </p>
                </div>

                <h2 id="how-it-works" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How it works
                </h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-8 ml-4">
                    <li>Identifies the hash (either provided directly or computed from the file path).</li>
                    <li>Submits a revocation transaction to the Solana blockchain.</li>
                    <li>Updates the PDA state on-chain from <code className="bg-white/10 px-1 py-0.5 rounded text-xs">Active</code> to <code className="bg-white/10 px-1 py-0.5 rounded text-xs">Revoked</code>.</li>
                    <li>Updates the local and cloud database to reflect the change.</li>
                </ol>

                <h2 id="examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Examples
                </h2>
                
                <h3 className="text-white font-bold mb-3 mt-8">Revoke by file path</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr revoke ./expired_license.pdf
                    </code>
                </pre>

                <h3 className="text-white font-bold mb-3 mt-8">Revoke by hash directly</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr revoke 85e17e3073507d3910c85a9477fd3e07...
                    </code>
                </pre>

                <h2 id="output" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Output
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6 text-sm">
                    <code className="font-mono text-yellow-300">
{`⚠️ YOU ARE ABOUT TO REVOKE A DOCUMENT.
Hash: 85e17e30...
This action is permanent. Continue? (y/N) y

🚀 Submitting revocation...
✓ Successfully revoked on Solana.
✓ Transaction: 5X8mQ...v1s`}
                    </code>
                </pre>

                <h2 id="errors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Common Errors
                </h2>
                <div className="space-y-4 mb-16">
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">Hash not found</h4>
                        <p className="text-xs text-gray-400 mt-1">You cannot revoke a hash that was never anchored. Use <code className="text-purple-300">vdr history</code> to verify the hash exists.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">Permission Denied</h4>
                        <p className="text-xs text-gray-400 mt-1">Only the organization that anchored the hash can revoke it. Check you are linked to the correct account.</p>
                    </div>
                </div>
            </div>
        </DocLayout>
    );
}
