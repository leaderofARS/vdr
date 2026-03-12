import DocLayout from '../../components/DocLayout';
import { Key, List, Trash2, Edit, Plus, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Keys API Overview', level: 2 },
    { id: 'list-keys', title: 'List API Keys', level: 2 },
    { id: 'create-key', title: 'Create API Key', level: 2 },
    { id: 'revoke-key', title: 'Revoke API Key', level: 2 },
    { id: 'schemas', title: 'Data Schema', level: 2 },
];

export default function ApiKeysPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Keys API</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Manage your organization's API keys programmatically. This API is restricted to users with <code className="text-purple-300">admin</code> privileges.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    While you can manage keys in the SipHeron Dashboard, the Keys API allows you to automate rotations or build custom internal administrative tools for your team.
                </p>

                <h2 id="list-keys" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    List API Keys
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-blue-400 font-bold mr-2">GET</span> /api/keys
                </p>
                <p className="text-gray-400 mb-4 text-sm italic">Returns all keys currently active in your organization. For security, the actual key value is NOT returned.</p>
                <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Example Response</h4>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`{
  "success": true,
  "data": [
    {
      "id": "key_182...901",
      "name": "Production Server",
      "scope": "write",
      "createdAt": "2026-01-15T10:00:00Z",
      "lastUsed": "2026-03-12T12:00:00Z"
    }
  ]
}`}
                    </code>
                </pre>

                <h2 id="create-key" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Create API Key
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-green-500 font-bold mr-2">POST</span> /api/keys
                </p>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400">
                                <th className="text-left py-2 pr-4 font-medium">Field</th>
                                <th className="text-left py-2 pr-4 font-medium">Type</th>
                                <th className="text-left py-2 pr-4 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            <tr>
                                <td className="py-2 pr-4 font-mono">name</td>
                                <td className="py-2 pr-4 italic">string</td>
                                <td className="py-2 pr-4">Descriptive name for the key.</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4 font-mono">scope</td>
                                <td className="py-2 pr-4 italic">string</td>
                                <td className="py-2 pr-4">read, write, or admin.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex gap-3">
                    <Info className="w-5 h-5 text-blue-300 shrink-0" />
                    <p className="text-blue-300 text-xs">
                        <strong>Security Note:</strong> The created key will be returned in the response as <code className="text-white">secret</code>. This is the only time you will ever see this value.
                    </p>
                </div>

                <h2 id="revoke-key" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Revoke API Key
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-red-500 font-bold mr-2">DELETE</span> /api/keys/:id
                </p>
                <p className="text-gray-300 mb-6">
                    Immediately invalidates the key. Any requests currently in-flight may complete, but all future requests using this key will return a <code className="text-red-400">401 Unauthorized</code> error.
                </p>

                <h2 id="schemas" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Data Schema
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-16 text-xs text-purple-200">
                    <code className="font-mono">
{`interface ApiKey {
  id: string;             // prefix: key_
  name: string;           // user-defined name
  scope: 'read' | 'write' | 'admin';
  organizationId: string;
  createdAt: string;      // ISO 8601
  lastUsedAt?: string;    // ISO 8601 or null
  secret?: string;        // Only present on creation!
}`}
                    </code>
                </pre>
            </div>
        </DocLayout>
    );
}
