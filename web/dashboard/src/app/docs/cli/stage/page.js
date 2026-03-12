import DocLayout from '../../components/DocLayout';
import { Layers, File, Folder, Search, Info, AlertTriangle } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Overview', level: 2 },
    { id: 'synopsis', title: 'Synopsis', level: 2 },
    { id: 'options', title: 'Options', level: 2 },
    { id: 'how-it-works', title: 'How it works', level: 2 },
    { id: 'examples', title: 'Examples', level: 2 },
    { id: 'output', title: 'Output', level: 2 },
    { id: 'errors', title: 'Common Errors', level: 2 },
    { id: 'batch-caching', title: 'Batch Caching', level: 2 },
];

export default function CliStagePage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">vdr stage</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Compute hashes for local files and prepare them for blockchain anchoring.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-4">
                    The <code className="text-purple-300">stage</code> command is used to add documents to your local SipHeron queue. It does not communicate with the blockchain or upload files—it only calculates hashes and stores metadata locally.
                </p>

                <h2 id="synopsis" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Synopsis
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr stage &lt;path&gt; [options]
                    </code>
                </pre>

                <h2 id="options" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Options
                </h2>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Flag</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Default</th>
                                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">--recursive, -r</td>
                                <td className="py-3 pr-4 text-gray-400">false</td>
                                <td className="py-3 pr-4 text-gray-300">Traverse subdirectories when a folder path is provided.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">--expiry &lt;days&gt;</td>
                                <td className="py-3 pr-4 text-gray-400">none</td>
                                <td className="py-3 pr-4 text-gray-300">Set a number of days after which the proof becomes invalid.</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 text-purple-300 font-mono">--force, -f</td>
                                <td className="py-3 pr-4 text-gray-400">false</td>
                                <td className="py-3 pr-4 text-gray-300">Re-stage files even if they already exist in the queue.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 id="how-it-works" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How it works
                </h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-8 ml-4">
                    <li>Reads the file at the specified path.</li>
                    <li>Calculates the SHA-256 hash bit-by-bit.</li>
                    <li>Stores the hash and original filepath in the local <code className="text-purple-300">.vdr/staging.json</code> file.</li>
                    <li>Ignores files that are already staged unless <code className="text-purple-300">--force</code> is used.</li>
                </ol>

                <h2 id="examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Examples
                </h2>
                
                <h3 className="text-white font-bold mb-3 mt-8">Stage a single file</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr stage ./agreement.pdf
                    </code>
                </pre>

                <h3 className="text-white font-bold mb-3 mt-8">Stage an entire directory recursively</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr stage ./logs -r
                    </code>
                </pre>

                <h3 className="text-white font-bold mb-3 mt-8">Stage with 1-year expiry</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        sipheron-vdr stage licenses.zip --expiry 365
                    </code>
                </pre>

                <h2 id="output" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Output
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm font-mono">
{`🔍 Scanning path...
✓ Staged: agreement.pdf (hash: 85e17e3...)
✓ Staged: notes.txt (hash: f2d4a1c...)
Summary: 2 files staged successfully, 0 skipped.`}
                    </code>
                </pre>

                <h2 id="errors" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Common Errors
                </h2>
                <div className="space-y-4 mb-12">
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <h4 className="font-bold text-white text-sm">ENOENT: no such file or directory</h4>
                        <p className="text-xs text-gray-400 mt-1">Check that the path exists and that you have read permissions.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                        <h4 className="font-bold text-white text-sm">File already staged</h4>
                        <p className="text-xs text-gray-400 mt-1">Use <code className="text-purple-300">--force</code> if you have modified the file and want to updated the staged hash.</p>
                    </div>
                </div>

                <h2 id="batch-caching" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Batch Caching
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-16 flex gap-3">
                    <Info className="w-5 h-5 text-blue-300 shrink-0" />
                    <p className="text-blue-300 text-sm">
                        Staging is extremely fast even for large files (several gigabytes) because we stream the data through the hash function without loading the entire file into memory.
                    </p>
                </div>
            </div>
        </DocLayout>
    );
}
