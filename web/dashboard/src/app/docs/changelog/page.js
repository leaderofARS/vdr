import DocLayout from '../components/DocLayout';
import { Tag, Rocket, ShieldCheck, Zap, Info, Bug } from 'lucide-react';

const HEADINGS = [
    { id: 'v0-9-6', title: 'v0.9.6 - Enhanced Batching', level: 2 },
    { id: 'v0-9-0', title: 'v0.9.0 - Multi-User Orgs', level: 2 },
    { id: 'v0-8-0', title: 'v0.8.0 - Mainnet Migration', level: 2 },
    { id: 'v0-5-0', title: 'v0.5.0 - Initial Beta', level: 2 },
];

export default function ChangelogPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Changelog</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Stay updated with the latest features, security patches, and performance improvements to the SipHeron VDR platform.
                </p>

                <div className="relative border-l-2 border-white/10 ml-4 pl-10 space-y-16 mb-24">
                    
                    {/* v0.9.6 */}
                    <div className="relative">
                        <div className="absolute -left-[51px] top-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center border-4 border-black">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <h2 id="v0-9-6" className="text-2xl font-bold text-white mb-2 scroll-mt-24">v0.9.6 — Enhanced Batching</h2>
                        <p className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-widest text-purple-400">March 12, 2026</p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Batched Anchoring:</span> Combined up to 100 document hashes into a single Solana transaction. Reduced transaction costs by 99% for enterprise users.
                                </div>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-300">
                                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">SDK V1 Release:</span> Official JavaScript and Python SDKs are now out of early access.
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* v0.9.0 */}
                    <div className="relative">
                        <div className="absolute -left-[51px] top-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center border-4 border-black">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                        <h2 id="v0-9-0" className="text-2xl font-bold text-white mb-2 scroll-mt-24">v0.9.0 — Multi-User Orgs</h2>
                        <p className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-widest text-blue-400">February 28, 2026</p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Organization Management:</span> Added ability to invite team members and assign <code className="text-xs">admin</code> or <code className="text-xs">member</code> roles.
                                </div>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-300">
                                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">API Key Scopes:</span> Introduced scoped permissions (read/write/admin) for all API keys.
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* v0.8.0 */}
                    <div className="relative">
                        <div className="absolute -left-[51px] top-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center border-4 border-black">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <h2 id="v0-8-0" className="text-2xl font-bold text-white mb-2 scroll-mt-24">v0.8.0 — Mainnet Migration</h2>
                        <p className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-widest text-green-400">January 15, 2026</p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Rocket className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Solana Mainnet:</span> SipHeron VDR is now live on Solana Mainnet-Beta for production-grade document verification.
                                </div>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Bug className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Reduced Latency:</span> Optimized edge API routes resulting in 40% faster hash registration.
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* v0.5.0 */}
                    <div className="relative">
                        <div className="absolute -left-[51px] top-0 w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center border-4 border-black">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                        <h2 id="v0-5-0" className="text-2xl font-bold text-white mb-2 scroll-mt-24">v0.5.0 — Initial Beta</h2>
                        <p className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-widest text-gray-400">November 10, 2025</p>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                            Initial private beta release of the SipHeron VDR platform, featuring CLI-based anchoring to Devnet and core verification dashboard.
                        </p>
                    </div>

                </div>
            </div>
        </DocLayout>
    );
}
