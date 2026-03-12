import DocLayout from '../../components/DocLayout';
import { Terminal, Key, ShieldCheck, AlertCircle, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Overview', level: 2 },
    { id: 'synopsis', title: 'Synopsis', level: 2 },
    { id: 'how-it-works', title: 'How it works', level: 2 },
    { id: 'examples', title: 'Examples', level: 2 },
    { id: 'output', title: 'Output', level: 2 },
    { id: 'errors', title: 'Common Errors', level: 2 },
    { id: 'security', title: 'Security Note', level: 2 },
];

export default function CliLinkPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">vdr link</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Authenticate your local CLI environment and associate it with your SipHeron VDR organization.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-4">
                    The <code className="text-purple-300">link</code> command is the first step in using the SipHeron VDR CLI. It securely stores your API key on your local machine so you don't have to provide it for every subsequent command.
                </p>

                <h2 id="synopsis" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Synopsis
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr link &lt;apiKey&gt;
                    </code>
                </pre>

                <h2 id="how-it-works" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How it works
                </h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-8 ml-4">
                    <li>Validates the format of the provided API key (must start with <code className="text-purple-300">svdr_</code>).</li>
                    <li>Tests the key against our API to ensure it is valid and active.</li>
                    <li>Encrypts the key using a machine-specific salt derived from your hostname and username.</li>
                    <li>Saves the encrypted configuration to <code className="text-purple-300">~/.vdr/config.json</code>.</li>
                </ol>

                <h2 id="examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Examples
                </h2>
                
                <h3 className="text-white font-bold mb-3 mt-8">Basic linking</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr link svdr_live_abc1234567890abcdef...
                    </code>
                </pre>

                <h3 className="text-white font-bold mb-3 mt-8">Switching API keys</h3>
                <p className="text-gray-400 text-sm mb-4">You can run the command again to overwrite the existing key with a new one.</p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr link svdr_new_key_here
                    </code>
                </pre>

                <h2 id="output" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Output
                </h2>
                <p className="text-gray-300 mb-4">On success, the CLI will display the organization linked to the key:</p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-green-300 font-mono">
{`✓ Successfully linked!
Organization: SipHeron Enterprise
Scope: admin`}
                    </code>
                </pre>

                <h2 id="errors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Common Errors
                </h2>
                <div className="space-y-4 mb-12">
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">Invalid API Key format</h4>
                        <p className="text-xs text-gray-400 mt-1">Ensure your key begins with <code className="text-purple-300">svdr_</code>. Check for accidental spaces at the end.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">Connection Refused</h4>
                        <p className="text-xs text-gray-400 mt-1">The CLI cannot reach <code className="text-purple-300">api.sipheron.com</code>. Check your internet connection or firewall settings.</p>
                    </div>
                </div>

                <h2 id="security" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Security Note
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-16 flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-300 shrink-0" />
                    <p className="text-blue-300 text-sm">
                        SipHeron uses AES-256-GCM encryption for stored keys. Even if someone steals your <code className="font-mono">config.json</code> file, they cannot decrypt it on another machine.
                    </p>
                </div>
            </div>
        </DocLayout>
    );
}
