import DocLayout from '../../components/DocLayout';
import { Terminal, Download, ShieldCheck, AlertCircle, Info, Hash } from 'lucide-react';

const HEADINGS = [
    { id: 'system-requirements', title: 'System Requirements', level: 2 },
    { id: 'install-npm', title: 'Via npm (Recommended)', level: 2 },
    { id: 'install-yarn', title: 'Via Yarn', level: 2 },
    { id: 'verify-install', title: 'Verify Installation', level: 2 },
    { id: 'configuration', title: 'Configuration Paths', level: 2 },
    { id: 'troubleshooting', title: 'Troubleshooting', level: 2 },
];

export default function InstallationPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Installation</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Set up the SipHeron VDR CLI on your local machine or server environment.
                </p>

                <h2 id="system-requirements" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    System Requirements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-bold mb-1 text-sm">Operating System</h4>
                        <p className="text-xs text-gray-400">Windows 10+, macOS 12+, or Linux (Ubuntu 20.04+ recommended).</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-bold mb-1 text-sm">Runtime</h4>
                        <p className="text-xs text-gray-400">Node.js 16.x or 18.x LTS.</p>
                    </div>
                </div>

                <h2 id="install-npm" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Via npm (Recommended)
                </h2>
                <p className="text-gray-300 mb-4 font-light">
                    The CLI is distributed as a global npm package. This allows you to run <code className="text-purple-300">vdr</code> from any directory on your system.
                </p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm">npm install -g sipheron-vdr</code>
                </div>

                <h2 id="install-yarn" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Via Yarn
                </h2>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm">yarn global add sipheron-vdr</code>
                </div>

                <h2 id="verify-install" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Verify Installation
                </h2>
                <p className="text-gray-300 mb-4">Check the CLI version to ensure everything is working:</p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-sm">
                    <code className="font-mono text-blue-300">
{`$ vdr --version
sipheron-vdr/0.9.6 linux-x64 node-v18.15.0`}
                    </code>
                </pre>

                <h2 id="configuration" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Configuration Paths
                </h2>
                <p className="text-gray-300 mb-6">
                    By default, the CLI stores your local staging queue and encrypted API keys in your home directory:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 mb-8 ml-4">
                    <li><strong>Linux/macOS:</strong> <code className="bg-white/5 px-1 rounded">~/.sipheron/config.json</code></li>
                    <li><strong>Windows:</strong> <code className="bg-white/5 px-1 rounded">%USERPROFILE%\.sipheron\config.json</code></li>
                </ul>

                <h2 id="troubleshooting" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Troubleshooting
                </h2>
                <div className="space-y-4 mb-16">
                    <div className="flex gap-4 p-4 rounded-xl border border-red-500/10 bg-red-500/5">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                            <h5 className="text-white font-bold text-sm mb-1">EACCES: permission denied</h5>
                            <p className="text-xs text-gray-400">If you get permission errors during global install, try using <code className="text-purple-300">sudo</code> or fix your npm permissions.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl border border-blue-500/10 bg-blue-500/5">
                        <Info className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                            <h5 className="text-white font-bold text-sm mb-1">Command NOT found</h5>
                            <p className="text-xs text-gray-400">Ensure your npm global bin directory is in your system's <code className="text-purple-300">PATH</code>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DocLayout>
    );
}
