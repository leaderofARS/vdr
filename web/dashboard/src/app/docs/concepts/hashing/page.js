import DocLayout from '../../components/DocLayout';
import { Hash, Shield, Lock, Zap, Search, EyeOff, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'what-is-hashing', title: 'What is Cryptographic Hashing?', level: 2 },
    { id: 'sha-256', title: 'SHA-256 Standard', level: 2 },
    { id: 'hashing-process', title: 'The Hashing Process', level: 2 },
    { id: 'key-properties', title: 'Key Properties', level: 2 },
    { id: 'collision-resistance', title: 'Collision Resistance', level: 3 },
    { id: 'privacy-security', title: 'Privacy & Security', level: 2 },
    { id: 'code-example', title: 'Code Example', level: 2 },
];

export default function HashingConceptPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">How Hashing Works</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Understand the mathematical foundation of SipHeron VDR and why document fingerprints are the ultimate integrity tool.
                </p>

                <h2 id="what-is-hashing" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    What is Cryptographic Hashing?
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    A cryptographic hash function is a mathematical algorithm that maps data of any size to a bit string of a fixed size (a hash). It is designed to be a one-way function—meaning it is infeasible to invert, providing a permanent, unique fingerprint for any digital file.
                </p>

                <h2 id="sha-256" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    SHA-256 Standard
                </h2>
                <p className="text-gray-300 mb-6">
                    SipHeron VDR exclusively uses <strong>SHA-256</strong> (Secure Hash Algorithm 256-bit). This standard is used by Bitcoin and the global banking system for its extreme security and resistance to current computational attacks.
                </p>

                <h2 id="hashing-process" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    The Hashing Process
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="flex-1 space-y-4">
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                            <span className="text-xs text-gray-400">Input: "Contract_V1.pdf"</span>
                            <Zap className="text-yellow-500" size={16} />
                        </div>
                        <div className="flex justify-center"><Search className="text-purple-500 animate-pulse" /></div>
                        <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10">
                            <code className="text-[10px] text-purple-200 break-all font-mono">85e17e3073507d3910c85a9477fd3e079717c10323ea58760085885c490f058e</code>
                        </div>
                    </div>
                </div>

                <h2 id="key-properties" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Key Properties
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-bold mb-2">Deterministic</h4>
                        <p className="text-xs text-gray-400">The same input always produce the exact same hash.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-bold mb-2">Avalanche Effect</h4>
                        <p className="text-xs text-gray-400">Changing a single comma in a 1,000-page document completely changes the resulting hash.</p>
                    </div>
                </div>

                <h3 id="collision-resistance" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    Collision Resistance
                </h3>
                <p className="text-gray-300 mb-6 font-light">
                    It is virtually impossible for two different files to produce the same SHA-256 hash. The number of possible hashes is 2^256, which is more than the number of atoms in the observable universe.
                </p>

                <h2 id="privacy-security" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Privacy & Security
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8 flex gap-4">
                    <EyeOff className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                        <p className="text-blue-200 text-sm leading-relaxed">
                            Because hashing is a <strong>one-way process</strong>, SipHeron never sees the content of your documents. We only receive the 64-character hash string. This makes SipHeron VDR compliant with strict data privacy laws (like GDPR and HIPAA) as sensitive info never leaves your machine.
                        </p>
                    </div>
                </div>

                <h2 id="code-example" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Code Example
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm">Python (Standard Library)</p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-16 text-xs text-purple-200">
                    <code className="font-mono">
{`import hashlib

def generate_fingerprint(data):
    return hashlib.sha256(data).hexdigest()

print(generate_fingerprint(b"Hello SipHeron"))`}
                    </code>
                </pre>
            </div>
        </DocLayout>
    );
}
