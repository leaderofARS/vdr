"use client";

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { Key, Plus, Trash2, CheckCircle2, AlertCircle, Copy, X } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function ApiKeysPage() {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [org, setOrg] = useState(null);

    // Modal state for generating keys
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [newKeyData, setNewKeyData] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: orgs } = await api.get('/organizations/my');
                if (orgs && orgs.length > 0) setOrg(orgs[0]);

                const { data: apiKeys } = await api.get('/auth/api-keys');
                setKeys(apiKeys || []);
            } catch (e) {
                console.error("Failed to load keys");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateKey = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/api-key', {
                name: nameInput,
                organizationId: org?.id
            });
            setNewKeyData(data);

            setKeys([{
                id: data.id,
                name: nameInput,
                key: data.apiKey,
                createdAt: new Date().toISOString(),
                status: 'Active'
            }, ...keys]);

            setNameInput('');
        } catch (e) {
            alert('Failed to generate API Key.');
        } finally {
            setLoading(false);
        }
    };

    const deleteKey = async (id) => {
        if (!confirm('Are you sure you want to revoke this key?')) return;
        try {
            await api.delete(`/auth/api-key/${id}`);
            setKeys(keys.filter(k => k.id !== id));
        } catch (e) {
            alert('Failed to revoke key.');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-normal text-white mb-1">API Credentials</h1>
                    <p className="text-sm text-[#9AA0A6]">
                        Create and manage API keys to authenticate headless CLI nodes and backend systems.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setNewKeyData(null);
                        setShowCreateModal(true);
                    }}
                    disabled={!org || fetching}
                    className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 disabled:bg-[#3C4043] disabled:text-[#9AA0A6]"
                >
                    <Plus className="w-4 h-4" />
                    CREATE CREDENTIALS
                </button>
            </div>

            {!org && !fetching && (
                <div className="bg-[#3C2A2A] border border-[#F28B82]/30 rounded p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#F28B82] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-[#F28B82] font-medium leading-relaxed">
                        Organization not provisioned. You must provision an organization on the main dashboard before creating API keys.
                    </div>
                </div>
            )}

            {/* Keys Table Container */}
            <div className="bg-[#1A1D24] border border-[#2C3038] rounded">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#1D2128] border-b border-[#2C3038]">
                            <tr className="text-[#9AA0A6] text-xs uppercase cursor-default">
                                <th className="px-5 py-2.5 font-medium">Name</th>
                                <th className="px-5 py-2.5 font-medium">Created (UTC)</th>
                                <th className="px-5 py-2.5 font-medium">Key Prefix</th>
                                <th className="px-5 py-2.5 font-medium border-l border-[#2C3038]">Status</th>
                                <th className="px-5 py-2.5 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2C3038] text-[13px]">
                            {fetching ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-8 text-center text-[#9AA0A6]">Loading credentials...</td>
                                </tr>
                            ) : keys.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-0">
                                        <EmptyState
                                            icon={Key}
                                            title="No API keys yet"
                                            subtitle="Create an API key to start using the SipHeron REST API"
                                            action={() => {
                                                setNewKeyData(null);
                                                setShowCreateModal(true);
                                            }}
                                            actionLabel="Create API Key"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                keys.map((k) => (
                                    <tr key={k.id} className="hover:bg-[#20232A] transition-colors">
                                        <td className="px-5 py-3 text-[#E8EAED] flex items-center gap-2">
                                            <Key className="w-4 h-4 text-[#9AA0A6]" />
                                            {k.name}
                                        </td>
                                        <td className="px-5 py-3 text-[#9AA0A6]">
                                            {new Date(k.createdAt).toUTCString()}
                                        </td>
                                        <td className="px-5 py-3 font-mono text-[#9AA0A6]">
                                            {k.key ? `${k.key.slice(0, 12)}••••••••` : '••••••••••••••••'}
                                        </td>
                                        <td className="px-5 py-3 border-l border-[#2C3038]">
                                            <span className="inline-flex items-center gap-1.5 text-[#10B981] text-xs">
                                                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div> Active
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <button
                                                onClick={() => deleteKey(k.id)}
                                                className="text-[#9AA0A6] hover:text-[#F28B82] p-1 transition-colors"
                                                title="Revoke Key"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / View Key Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1A1D24] border border-[#2C3038] rounded shadow-2xl w-full max-w-lg">
                        <div className="border-b border-[#2C3038] px-5 py-3 flex items-center justify-between bg-[#1D2128]">
                            <h3 className="text-[#E8EAED] text-sm font-medium">
                                {newKeyData ? "API Key Created" : "Create API Key"}
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-[#9AA0A6] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5">
                            {!newKeyData ? (
                                <form onSubmit={handleCreateKey}>
                                    <div className="mb-4">
                                        <label className="block text-xs font-medium text-[#9AA0A6] mb-1.5 uppercase">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={nameInput}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            placeholder="e.g. CI/CD Integration"
                                            className="w-full bg-[#131418] border border-[#3C4043] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4285F4]"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="px-4 py-1.5 text-sm font-medium text-[#4285F4] hover:bg-[#4285F4]/10 rounded transition-colors"
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors disabled:bg-[#3C4043] disabled:text-[#9AA0A6]"
                                        >
                                            {loading ? 'CREATING...' : 'CREATE'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <div className="bg-[#3C3A2A] border border-[#F4B400]/30 rounded p-4 mb-5 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-[#F4B400] flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-[#F4B400] font-medium leading-relaxed">
                                            Store this key securely. It won't be shown again. You cannot retrieve a lost key.
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-xs font-medium text-[#9AA0A6] mb-1.5 uppercase">Secret Key</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={newKeyData.apiKey}
                                                className="w-full bg-[#131418] border border-[#3C4043] rounded px-3 py-2.5 text-sm text-[#4285F4] font-mono focus:outline-none"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(newKeyData.apiKey)}
                                                className="shrink-0 p-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded transition-colors"
                                            >
                                                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setShowCreateModal(false)}
                                            className="px-4 py-1.5 text-sm font-medium text-[#4285F4] hover:bg-[#4285F4]/10 rounded transition-colors"
                                        >
                                            CLOSE
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
