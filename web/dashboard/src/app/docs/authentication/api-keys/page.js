import DocLayout from '../../components/DocLayout';
import { Key, Shield, Lock, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

const HEADINGS = [
    { id: 'what-are-apikeys', title: 'What are API Keys?', level: 2 },
    { id: 'key-format', title: 'Key Format', level: 2 },
    { id: 'scopes', title: 'Key Scopes', level: 2 },
    { id: 'scope-read', title: 'read', level: 3 },
    { id: 'scope-write', title: 'write', level: 3 },
    { id: 'scope-admin', title: 'admin', level: 3 },
    { id: 'creating-key', title: 'How to create an API Key', level: 2 },
    { id: 'using-key', title: 'How to use in requests', level: 2 },
    { id: 'security-rules', title: 'Security Rules', level: 2 },
    { id: 'storage', title: 'How keys are stored', level: 2 },
    { id: 'revocation', title: 'Revoking a key', level: 2 },
    { id: 'limits', title: 'Key Limits', level: 2 },
    { id: 'examples', title: 'Example Requests', level: 2 },
];

export default function ApiKeysPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Authentication: API Keys</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    API keys are designed for programmatic, server-side access and long-running integrations like CI/CD pipelines, automated agents, or backend services.
                </p>

                <h2 id="what-are-apikeys" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    What are API Keys for?
                </h2>
                <p className="text-gray-300 mb-6">
                    Unlike bearer tokens that expire after 7 days, API keys are persistent. They allow your servers to communicate with SipHeron VDR without needing to handle the login flow or manage cookies.
                </p>

                <h2 id="key-format" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Key Format
                </h2>
                <p className="text-gray-300 mb-4">
                    All SipHeron API keys follow a specific format for easy identification and secret scanning:
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
                        svdr_live_64hexCharacters...
                    </code>
                </pre>
                <p className="text-gray-300 mb-4 text-sm italic">
                    Keys are prepended with <code className="bg-white/5 px-1 py-0.5 rounded">svdr_</code> to allow developers to set up rules in tools like GitHub Secret Scanning.
                </p>

                <h2 id="scopes" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Key Scopes
                </h2>
                <p className="text-gray-300 mb-6">
                    Every API key has a scope that defines exactly what it is allowed to do. We follow the principle of least privilege.
                </p>

                <h3 id="scope-read" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    <code className="text-purple-400">read</code>
                </h3>
                <p className="text-gray-300 mb-4">
                    The most restricted scope. Allows the key to retrieve data but never modify or create it. Use this for monitoring dashboards or public verification portals.
                </p>
                <ul className="list-disc list-inside text-gray-400 text-sm mb-6 ml-4">
                    <li>List hashes and anchors</li>
                    <li>Verify document integrity</li>
                    <li>Fetch organization stats</li>
                </ul>

                <h3 id="scope-write" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    <code className="text-purple-400">write</code>
                </h3>
                <p className="text-gray-300 mb-4">
                    The standard scope for active integrations. Allows creation and retrieval but prevents critical administrative actions like deleting billing info or managing members.
                </p>
                <ul className="list-disc list-inside text-gray-400 text-sm mb-6 ml-4">
                    <li>Register new hashes</li>
                    <li>Anchor batches to Solana</li>
                    <li>Revoke existing hashes</li>
                </ul>

                <h3 id="scope-admin" className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24">
                    <code className="text-purple-400">admin</code>
                </h3>
                <p className="text-gray-300 mb-4">
                    Full access to the organization. Only use this for internal scripts that need to manage the environment itself.
                </p>
                <ul className="list-disc list-inside text-gray-400 text-sm mb-6 ml-4">
                    <li>Manage other API keys</li>
                    <li>Update organization settings</li>
                    <li>Invite or remove team members</li>
                </ul>

                <h2 id="creating-key" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How to create an API Key
                </h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-8 ml-4">
                    <li>Go to your <a href="https://app.sipheron.com/settings" className="text-purple-400 hover:underline">SipHeron Dashboard</a>.</li>
                    <li>Click on the <strong>Developers</strong> or <strong>API Keys</strong> tab.</li>
                    <li>Click <strong>Generate New Key</strong>.</li>
                    <li>Give the key a descriptive name (e.g., "GitHub Actions CI").</li>
                    <li>Select the appropriate <strong>Scope</strong>.</li>
                    <li>Click <strong>Create</strong> and copy the result immediately.</li>
                </ol>

                <h2 id="using-key" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How to use in requests
                </h2>
                <p className="text-gray-300 mb-4">
                    Include your API key in every request using the <code className="text-purple-300 font-mono">x-api-key</code> header.
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-sm text-purple-200 font-mono">
{`curl -X GET https://api.sipheron.com/api/hashes \\
     -H "x-api-key: svdr_your_api_key_here"`}
                    </code>
                </pre>

                <h2 id="security-rules" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Security Rules
                </h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                    <p className="text-yellow-300 text-sm">
                        ⚠️ Compromised API keys can lead to unauthorized blockchain anchoring and usage charges.
                    </p>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-8 ml-4">
                    <li><strong>Never commit to git:</strong> Use environment variables (<code className="text-purple-300">SIPHERON_API_KEY</code>).</li>
                    <li><strong>No Frontend Exposure:</strong> Never use API keys in client-side React/Vue/Plain JS code. They will be visible to anyone who views your source.</li>
                    <li><strong>Rotation:</strong> Rotate your keys every 90 days as a standard security precaution.</li>
                </ul>

                <h2 id="storage" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    How keys are stored
                </h2>
                <p className="text-gray-300 mb-6 font-medium italic">
                    Your security is our priority.
                </p>
                <p className="text-gray-300 mb-4 leading-relaxed">
                    SipHeron <strong>never</strong> stores your API keys in plaintext. When a key is created:
                </p>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-8 ml-4">
                    <li>We show the key to you once.</li>
                    <li>We hash the key using a cryptographically secure <strong>SHA-256</strong> algorithm.</li>
                    <li>We store only the hash. When you make a request, we hash your provided key and compare it against our database.</li>
                </ol>

                <h2 id="revocation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Revoking a key
                </h2>
                <p className="text-gray-300 mb-4">
                    If a key is compromised, you can revoke it instantly:
                </p>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-8 ml-4">
                    <li>Locate the key in your Dashboard.</li>
                    <li>Click the <strong>Revoke</strong> or <strong>Delete</strong> button.</li>
                    <li>The key will be invalidated immediately across all SipHeron edge nodes.</li>
                </ol>

                <h2 id="limits" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Key Limits
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-8 ml-4">
                    <li><strong>Standard Plan:</strong> Up to 5 active API keys per organization.</li>
                    <li><strong>Enterprise Plan:</strong> Unlimited API keys with advanced audit logging.</li>
                </ul>

                <h2 id="examples" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Example Requests
                </h2>
                <h3 className="text-white font-bold mb-3 mt-8">Node.js (Fetch)</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-6 text-xs">
                    <code className="text-purple-200 font-mono">
{`const response = await fetch('https://api.sipheron.com/api/hashes', {
  headers: {
    'x-api-key': 'svdr_abc123...',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`}
                    </code>
                </pre>

                <h3 className="text-white font-bold mb-3 mt-8">Python (Requests)</h3>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-16 text-xs">
                    <code className="text-purple-200 font-mono">
{`import requests

headers = {
    'x-api-key': 'svdr_abc123...',
}
response = requests.get('https://api.sipheron.com/api/hashes', headers=headers)
print(response.json())`}
                    </code>
                </pre>
            </div>
        </DocLayout>
    );
}
