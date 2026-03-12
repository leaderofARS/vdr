import DocLayout from '../components/DocLayout';
import { Mail, MessageSquare, Twitter, Github, HelpCircle, LifeBuoy } from 'lucide-react';

const HEADINGS = [
    { id: 'contact-support', title: 'Contact Support', level: 2 },
    { id: 'community', title: 'Community Channels', level: 2 },
    { id: 'status-page', title: 'System Status', level: 2 },
    { id: 'custom-dev', title: 'Custom Development', level: 2 },
];

export default function SupportPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Support & Community</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Get help from the SipHeron team and join the community of developers building the future of document integrity.
                </p>

                <h2 id="contact-support" className="text-2xl font-bold text-white mt-16 mb-6 scroll-mt-24">
                    Contact Support
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1">Email Support</h4>
                            <p className="text-sm text-gray-400 mb-4">For account issues, billing questions, or enterprise inquiries.</p>
                            <a href="mailto:support@sipheron.com" className="text-purple-400 font-mono text-sm group flex items-center gap-2">
                                support@sipheron.com
                                <span className="text-[10px] bg-purple-500/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                            </a>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1">Live Chat</h4>
                            <p className="text-sm text-gray-400 mb-4">Available for Pro and Enterprise customers during business hours.</p>
                            <button className="text-blue-400 font-bold text-sm hover:underline cursor-pointer">Open Dashboard Chat</button>
                        </div>
                    </div>
                </div>

                <h2 id="community" className="text-2xl font-bold text-white mt-16 mb-6 scroll-mt-24">
                    Community Channels
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    <a href="https://discord.gg/sipheron" className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm text-white font-medium">Discord</span>
                    </a>
                    <a href="https://twitter.com/sipheron_vdr" className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                        <Twitter className="w-5 h-5 text-sky-400" />
                        <span className="text-sm text-white font-medium">Twitter</span>
                    </a>
                    <a href="https://github.com/sipheron-vdr" className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                        <Github className="w-5 h-5 text-white" />
                        <span className="text-sm text-white font-medium">GitHub</span>
                    </a>
                </div>

                <h2 id="status-page" className="text-2xl font-bold text-white mt-16 mb-6 scroll-mt-24">
                    System Status
                </h2>
                <div className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5 flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <div>
                            <p className="text-white font-bold text-sm">All Systems Operational</p>
                            <p className="text-xs text-green-400/70">Verified 30s ago</p>
                        </div>
                    </div>
                    <a href="https://status.sipheron.com" className="text-xs text-gray-400 hover:text-white underline">Historical Data</a>
                </div>

                <h2 id="custom-dev" className="text-2xl font-bold text-white mt-16 mb-6 scroll-mt-24">
                    Custom Development
                </h2>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8 mb-24 relaitve overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Need a custom implementation?</h3>
                        <p className="text-gray-300 text-sm mb-6 max-w-lg">
                            Our architecture team can help you design custom on-chain schemas, private Solana clusters, or complex ERP integrations.
                        </p>
                        <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold text-sm transition-colors">
                            Book an Architecture Review
                        </button>
                    </div>
                    <LifeBuoy className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-purple-500/5 rotate-12" />
                </div>
            </div>
        </DocLayout>
    );
}
