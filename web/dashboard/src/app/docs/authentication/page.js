import DocLayout from '../components/DocLayout';
import { Lock, Key, ShieldCheck, UserCheck, Info } from 'lucide-react';
import Link from 'next/link';

const HEADINGS = [
    { id: 'auth-overview', title: 'Security & Auth', level: 2 },
    { id: 'methods', title: 'Authentication Methods', level: 2 },
    { id: 'best-practices', title: 'Security Best Practices', level: 2 },
];

export default function AuthenticationOverviewPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Authentication</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    SipHeron VDR provides two primary ways to authenticate your requests, depending on whether you are an end-user or a system integrator.
                </p>

                <h2 id="auth-overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Security & Auth
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    Every interaction with the SipHeron API must be authenticated. We use industry-standard protocols to ensure that your document hashes and organization data are protected.
                </p>

                <h2 id="methods" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Authentication Methods
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Link href="/docs/authentication/bearer" className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <UserCheck className="w-6 h-6 text-blue-400" />
                        </div>
                        <h4 className="text-white font-bold mb-2">Bearer Tokens (JWT)</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Used for user sessions in the dashboard. These are short-lived and tied to your user login.</p>
                    </Link>
                    <Link href="/docs/authentication/api-keys" className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Key className="w-6 h-6 text-green-400" />
                        </div>
                        <h4 className="text-white font-bold mb-2">API Keys</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Used for CLI and programmatic access. These can be long-lived and have specific permission scopes.</p>
                    </Link>
                </div>

                <h2 id="best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Security Best Practices
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-16">
                    <ul className="list-disc list-inside text-blue-200/80 space-y-4">
                        <li><strong>Environment Variables:</strong> Never hardcode API keys in your source code. Use <code className="text-white">.env</code> files or a secrets manager.</li>
                        <li><strong>Least Privilege:</strong> Use <code className="text-white">read-only</code> keys for verification-only services.</li>
                        <li><strong>Rotation:</strong> Rotate your API keys every 90 days to minimize the impact of a potential leak.</li>
                        <li><strong>Revocation:</strong> If you suspect a key is compromised, revoke it immediately from the SipHeron Dashboard.</li>
                    </ul>
                </div>
            </div>
        </DocLayout>
    );
}
