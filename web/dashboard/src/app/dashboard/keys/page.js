"use client";
import { useState } from 'react';
import { api } from '@/utils/api';
import { KeyRound, Plus, Copy, Check } from 'lucide-react';

export default function ApiKeysPage() {
    const [keys, setKeys] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(null);

    const generateKey = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/api-key', { name });
            setKeys([{ name, key: data.key, date: new Date().toLocaleDateString() }, ...keys]);
            setName('');
        } catch (e) {
            alert('Failed to generate key');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopied(idx);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">API Infrastructure</h1>
                <p className="text-gray-500 mt-2">Generate API keys to authenticate your backend servers or CLI Provider tools.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <form onSubmit={generateKey} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Token Name</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm"
                                placeholder="e.g. Production Batch Server"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-white focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all flex items-center shadow-md disabled:opacity-50"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            {loading ? 'Generating...' : 'Roll Key'}
                        </button>
                    </form>
                </div>

                <div className="p-6 space-y-4">
                    {keys.length === 0 && (
                        <div className="text-center py-12">
                            <KeyRound className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No active tokens</h3>
                            <p className="text-gray-500">Roll your first key to connect the CLI.</p>
                        </div>
                    )}

                    {keys.map((k, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{k.name}</h4>
                                <p className="text-xs text-gray-500 font-mono mt-1 w-48 sm:w-auto truncate">{k.key}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">{k.date}</span>
                                <button
                                    onClick={() => copyToClipboard(k.key, idx)}
                                    className="p-2 text-gray-500 hover:bg-white dark:hover:bg-gray-800 rounded-lg shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                                >
                                    {copied === idx ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
