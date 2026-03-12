'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

const ENDPOINTS = [
    {
        id: 'list-hashes',
        label: 'List Hashes',
        method: 'GET',
        path: '/api/hashes',
        description: 'Retrieve all document hashes for your organization',
        params: [],
        body: null
    },
    {
        id: 'create-hash',
        label: 'Anchor Hash',
        method: 'POST',
        path: '/api/hashes',
        description: 'Anchor a document hash to the Solana blockchain',
        params: [],
        body: [
            { key: 'hash', type: 'string', required: true, placeholder: 'SHA-256 hash (64 hex chars)', description: 'The SHA-256 hash of your document' },
            { key: 'metadata', type: 'string', required: false, placeholder: 'Document name or description', description: 'Optional label for this hash' }
        ]
    },
    {
        id: 'verify-hash',
        label: 'Verify Hash',
        method: 'GET',
        path: '/api/hashes/public/:hash',
        description: 'Publicly verify a document hash — no authentication required',
        params: [{ key: 'hash', placeholder: 'SHA-256 hash to verify', description: 'The hash to look up' }],
        body: null,
        public: true
    },
    {
        id: 'list-keys',
        label: 'List API Keys',
        method: 'GET',
        path: '/api/keys',
        description: 'List all API keys for your organization',
        params: [],
        body: null
    },
    {
        id: 'create-key',
        label: 'Create API Key',
        method: 'POST',
        path: '/api/keys',
        description: 'Create a new API key with a specified scope',
        params: [],
        body: [
            { key: 'name', type: 'string', required: true, placeholder: 'My API Key', description: 'A label for this key' },
            { key: 'scope', type: 'select', required: true, options: ['read', 'write', 'admin'], description: 'Permission scope for this key' }
        ]
    },
    {
        id: 'list-members',
        label: 'List Members',
        method: 'GET',
        path: '/api/members',
        description: 'List all members of your organization',
        params: [],
        body: null
    },
    {
        id: 'invite-member',
        label: 'Invite Member',
        method: 'POST',
        path: '/api/members/invite',
        description: 'Send an invitation email to a new team member',
        params: [],
        body: [
            { key: 'email', type: 'string', required: true, placeholder: 'colleague@company.com', description: 'Email address to invite' },
            { key: 'role', type: 'select', required: true, options: ['member', 'admin'], description: 'Role for the new member' }
        ]
    },
    {
        id: 'list-pending',
        label: 'List Pending Hashes',
        method: 'GET',
        path: '/api/hashes/pending',
        description: 'Get all hashes currently awaiting Solana confirmation',
        params: [],
        body: null
    },
    {
        id: 'usage',
        label: 'Usage Stats',
        method: 'GET',
        path: '/api/usage',
        description: 'Get API usage statistics for your organization',
        params: [],
        body: null
    },
    {
        id: 'audit',
        label: 'Audit Logs',
        method: 'GET',
        path: '/api/audit',
        description: 'Retrieve organization audit logs',
        params: [],
        body: null
    }
];

const METHOD_COLORS = {
    GET: 'text-green-400 bg-green-400/10 border-green-400/20',
    POST: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    DELETE: 'text-red-400 bg-red-400/10 border-red-400/20',
    PATCH: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    PUT: 'text-orange-400 bg-orange-400/10 border-orange-400/20'
};

function syntaxHighlight(json) {
    if (typeof json !== 'string') json = JSON.stringify(json, null, 2);
    return json
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'text-purple-300';
            if (/^"/.test(match)) {
                cls = /:$/.test(match) ? 'text-blue-300' : 'text-green-300';
            } else if (/true|false/.test(match)) {
                cls = 'text-yellow-300';
            } else if (/null/.test(match)) {
                cls = 'text-gray-400';
            } else {
                cls = 'text-orange-300';
            }
            return `<span class="${cls}">${match}</span>`;
        });
}

export default function PlaygroundPage() {
    const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
    const [paramValues, setParamValues] = useState({});
    const [bodyValues, setBodyValues] = useState({});
    const [apiKey, setApiKey] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [responseTime, setResponseTime] = useState(null);
    const [activeTab, setActiveTab] = useState('response');
    const [copied, setCopied] = useState('');

    // Auto-load user's first API key
    useEffect(() => {
        api.get('/api/keys').then(res => {
            const keys = res.data?.keys || res.data || [];
            if (keys.length > 0) setApiKey(keys[0].key || '');
        }).catch(() => {});
    }, []);

    // Reset form when endpoint changes
    useEffect(() => {
        setParamValues({});
        setBodyValues({});
        setResponse(null);
    }, [selectedEndpoint]);

    const buildPath = () => {
        let path = selectedEndpoint.path;
        (selectedEndpoint.params || []).forEach(p => {
            if (paramValues[p.key]) {
                path = path.replace(`:${p.key}`, paramValues[p.key]);
            }
        });
        return path;
    };

    const handleSend = async () => {
        setLoading(true);
        setResponse(null);
        const start = Date.now();

        try {
            const path = buildPath();
            const headers = {};
            if (apiKey && !selectedEndpoint.public) headers['x-api-key'] = apiKey;

            let res;
            if (selectedEndpoint.method === 'GET') {
                res = await api.get(path, { headers });
            } else if (selectedEndpoint.method === 'POST') {
                res = await api.post(path, bodyValues, { headers });
            } else if (selectedEndpoint.method === 'DELETE') {
                res = await api.delete(path, { headers });
            } else if (selectedEndpoint.method === 'PATCH') {
                res = await api.patch(path, bodyValues, { headers });
            }

            setResponse({ status: res.status, data: res.data, ok: true });
        } catch (err) {
            setResponse({
                status: err.response?.status || 0,
                data: err.response?.data || { error: err.message },
                ok: false
            });
        } finally {
            setResponseTime(Date.now() - start);
            setLoading(false);
        }
    };

    const getCurl = () => {
        const path = buildPath();
        const keyHeader = apiKey ? ` \\\n  -H "x-api-key: ${apiKey}"` : '';
        const body = selectedEndpoint.body && Object.keys(bodyValues).length > 0
            ? ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(bodyValues, null, 2)}'`
            : '';
        return `curl -X ${selectedEndpoint.method} https://api.sipheron.com${path}${keyHeader}${body}`;
    };

    const getNodeJS = () => {
        const path = buildPath();
        const hasBody = selectedEndpoint.body && Object.keys(bodyValues).length > 0;
        return `const response = await fetch('https://api.sipheron.com${path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Content-Type': 'application/json',${apiKey ? `\n    'x-api-key': '${apiKey}'` : ''}
  },${hasBody ? `\n  body: JSON.stringify(${JSON.stringify(bodyValues, null, 2)}),` : ''}
});
const data = await response.json();
console.log(data);`;
    };

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(label);
            setTimeout(() => setCopied(''), 2000);
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-32">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">API Playground</h1>
                <p className="text-gray-400 text-sm mt-1">Test SipHeron API endpoints interactively with your real data</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left — endpoint selector + request builder */}
                <div className="lg:col-span-1 space-y-4">

                    {/* API Key input */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-2">
                            API Key
                        </label>
                        <input
                            type="text"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder="svdr_..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-gray-600 focus:outline-none focus:border-purple-500"
                        />
                        <p className="text-gray-600 text-xs mt-2">Auto-loaded from your first API key</p>
                    </div>

                    {/* Endpoint list */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Endpoints</p>
                        </div>
                        <div className="divide-y divide-white/5">
                            {ENDPOINTS.map(ep => (
                                <button
                                    key={ep.id}
                                    onClick={() => setSelectedEndpoint(ep)}
                                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                                        selectedEndpoint.id === ep.id ? 'bg-purple-500/10' : 'hover:bg-white/5'
                                    }`}
                                >
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${METHOD_COLORS[ep.method]}`}>
                                        {ep.method}
                                    </span>
                                    <span className="text-sm text-white truncate">{ep.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — request + response */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Request builder */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        {/* Endpoint header */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${METHOD_COLORS[selectedEndpoint.method]}`}>
                                {selectedEndpoint.method}
                            </span>
                            <code className="text-sm text-purple-300 font-mono flex-1 truncate">
                                {buildPath()}
                            </code>
                        </div>
                        <p className="text-gray-400 text-sm mb-5">{selectedEndpoint.description}</p>

                        {/* URL params */}
                        {selectedEndpoint.params?.length > 0 && (
                            <div className="mb-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">URL Parameters</p>
                                <div className="space-y-2">
                                    {selectedEndpoint.params.map(p => (
                                        <div key={p.key}>
                                            <label className="text-xs text-gray-400 mb-1 block">
                                                {p.key} <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={paramValues[p.key] || ''}
                                                onChange={e => setParamValues(prev => ({ ...prev, [p.key]: e.target.value }))}
                                                placeholder={p.placeholder}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-mono"
                                            />
                                            <p className="text-gray-600 text-xs mt-1">{p.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Body params */}
                        {selectedEndpoint.body?.length > 0 && (
                            <div className="mb-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Request Body</p>
                                <div className="space-y-3">
                                    {selectedEndpoint.body.map(field => (
                                        <div key={field.key}>
                                            <label className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                                                {field.key}
                                                {field.required && <span className="text-red-400">*</span>}
                                                <span className="text-gray-600">{field.type}</span>
                                            </label>
                                            {field.type === 'select' ? (
                                                <select
                                                    value={bodyValues[field.key] || ''}
                                                    onChange={e => setBodyValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                                                >
                                                    <option value="">Select...</option>
                                                    {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={bodyValues[field.key] || ''}
                                                    onChange={e => setBodyValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                                                />
                                            )}
                                            <p className="text-gray-600 text-xs mt-1">{field.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Send button */}
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                    Send Request
                                </>
                            )}
                        </button>
                    </div>

                    {/* Response panel */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-h-[400px]">
                        {/* Tabs */}
                        <div className="flex items-center border-b border-white/10 px-4">
                            {['response', 'curl', 'nodejs'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${
                                        activeTab === tab
                                            ? 'border-purple-500 text-purple-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-300'
                                    }`}
                                >
                                    {tab === 'nodejs' ? 'Node.js' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                            {response && (
                                <div className="ml-auto flex items-center gap-3 py-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                                        response.ok ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {response.status}
                                    </span>
                                    {responseTime && (
                                        <span className="text-xs text-gray-500">{responseTime}ms</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            {/* Copy button */}
                            <button
                                onClick={() => {
                                    const text = activeTab === 'response'
                                        ? JSON.stringify(response?.data, null, 2)
                                        : activeTab === 'curl' ? getCurl() : getNodeJS();
                                    handleCopy(text, activeTab);
                                }}
                                className="absolute top-3 right-3 z-10 px-3 py-1 text-xs border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors bg-black/40"
                            >
                                {copied === activeTab ? '✓ Copied' : 'Copy'}
                            </button>

                            <pre className="p-4 overflow-x-auto min-h-[350px] max-h-[600px] text-xs font-mono leading-relaxed">
                                {activeTab === 'response' && (
                                    response ? (
                                        <code
                                            dangerouslySetInnerHTML={{
                                                __html: syntaxHighlight(JSON.stringify(response.data, null, 2))
                                            }}
                                        />
                                    ) : (
                                        <span className="text-gray-600 block py-10 text-center italic">
                                            Request results will manifest here in real-time
                                        </span>
                                    )
                                )}
                                {activeTab === 'curl' && (
                                    <code className="text-purple-200 block whitespace-pre-wrap">{getCurl()}</code>
                                )}
                                {activeTab === 'nodejs' && (
                                    <code className="text-purple-200 block whitespace-pre-wrap">{getNodeJS()}</code>
                                )}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
