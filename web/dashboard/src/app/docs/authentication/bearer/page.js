import DocLayout from '../../components/DocLayout';
import { Shield, Key, Lock, AlertCircle, Info, RefreshCcw } from 'lucide-react';

const HEADINGS = [
    { id: 'what-are-bearer-tokens', title: 'What are Bearer Tokens?', level: 2 },
    { id: 'how-they-are-used', title: 'How they are used', level: 2 },
    { id: 'acquisition', title: 'Acquiring a Token', level: 2 },
    { id: 'expiry-refreshing', title: 'Expiry & Refreshing', level: 2 },
    { id: 'security-implications', title: 'Security Implications', level: 2 },
];

export default function BearerTokensPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Bearer Tokens (JWT)</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Short-lived JSON Web Tokens (JWT) used for authenticated user sessions within the SipHeron web platform.
                </p>

                <h2 id="what-are-bearer-tokens" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    What are Bearer Tokens?
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    Bearer tokens are the standard for web authentication. They allow the server to identify the user making a request based on a signed token string included in the <code className="text-purple-300">Authorization</code> header.
                </p>

                <h2 id="how-they-are-used" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How they are used
                </h2>
                <p className="text-gray-300 mb-4">
                    When you log in to the SipHeron dashboard, our API issues a JWT stored in a secure, HTTP-only cookie. For direct API access, you can also send the token manually:
                </p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm leading-8">
                        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                    </code>
                </div>

                <h2 id="acquisition" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Acquiring a Token
                </h2>
                <p className="text-gray-300 mb-4">You can obtain a bearer token by authenticating with your email and password via the login endpoint:</p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`POST https://api.sipheron.com/api/auth/login
{
  "email": "user@example.com",
  "password": "your_password"
}

// Result:
{
  "token": "eyJhbGciOiJIUzI1Ni..."
}`}
                    </code>
                </pre>

                <h2 id="expiry-refreshing" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Expiry & Refreshing
                </h2>
                <div className="flex gap-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 mb-8">
                    <RefreshCcw className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                    <p className="text-blue-200 text-sm">
                        Bearer tokens expire after 2 hours. The SipHeron Dashboard automatically handles token refreshing using a separate, secure refresh token stored in your browser's persistent storage.
                    </p>
                </div>

                <h2 id="security-implications" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Security Implications
                </h2>
                <div className="space-y-4 mb-16">
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <p className="text-gray-300 text-xs">
                            <strong>Statelessness:</strong> JWTs are stateless. Once issued, they cannot be easily "revoked" on the server until they expire. For high-security programmatic access, we recommend using <strong>API Keys</strong> instead.
                        </p>
                    </div>
                </div>
            </div>
        </DocLayout>
    );
}
