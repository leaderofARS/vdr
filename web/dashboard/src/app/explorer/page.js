"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Search, Hash, Clock, User, ExternalLink } from "lucide-react";
import axios from "axios";

export default function Explorer() {
    const [searchQuery, setSearchQuery] = useState("");
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery || searchQuery.length !== 64) {
            setError("Please enter a valid 64-character SHA-256 hex string.");
            return;
        }

        setLoading(true);
        setError("");
        setRecord(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const res = await axios.get(`${apiUrl}/record/${searchQuery}`);
            setRecord(res.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError("Record not found in the registry.");
            } else {
                setError("Failed to connect to the backend API.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">Registry Explorer</h1>
                        <p className="mt-2 text-gray-400">Search and view verified hashes directly from Solana.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 shadow-lg">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-grow relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-4 border border-gray-800 rounded-lg leading-5 bg-gray-950 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-lg font-mono"
                                placeholder="0x... or paste full 64-character SHA-256 hash"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 md:w-auto w-full flex-shrink-0 transition-colors shadow-lg shadow-purple-900/20"
                        >
                            {loading ? "Searching..." : "Lookup Record"}
                        </button>
                    </form>
                    {error && <p className="mt-3 text-red-500 text-sm font-medium">{error}</p>}
                </div>

                {/* Results Data */}
                {record && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl slide-up-fade-in relative z-10">
                        <div className="px-6 py-5 border-b border-gray-800 bg-gray-900/80 flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                                <Hash className="w-5 h-5 mr-2 text-purple-400" /> Record Found
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/20">
                                Verified On-chain
                            </span>
                        </div>

                        <div className="px-6 py-6 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-800/60">
                                <div className="py-5 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 pl-4 hover:bg-gray-800/30 transition-colors">
                                    <dt className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center">
                                        <Hash className="w-4 h-4 mr-2" /> SHA-256 Hash
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2 font-mono break-all font-semibold">
                                        {record.hash}
                                    </dd>
                                </div>

                                <div className="py-5 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 pl-4 hover:bg-gray-800/30 transition-colors">
                                    <dt className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center">
                                        <User className="w-4 h-4 mr-2" /> Owner Wallet
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-2 font-mono break-all">
                                        {record.owner}
                                    </dd>
                                </div>

                                <div className="py-5 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 pl-4 hover:bg-gray-800/30 transition-colors">
                                    <dt className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center">
                                        <Clock className="w-4 h-4 mr-2" /> Timestamp (UTC)
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-2">
                                        {new Date(record.timestamp * 1000).toUTCString()}
                                        <span className="ml-3 text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">Unix: {record.timestamp}</span>
                                    </dd>
                                </div>

                                <div className="py-5 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 pl-4 hover:bg-gray-800/30 transition-colors">
                                    <dt className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center">
                                        Metadata URI
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-2 break-all">
                                        {record.metadata ? (
                                            <span className="bg-blue-900/20 text-blue-300 border border-blue-800/30 px-3 py-1 rounded-md font-mono text-xs">
                                                {record.metadata}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </dd>
                                </div>

                                <div className="py-5 sm:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 pl-4 hover:bg-gray-800/30 transition-colors">
                                    <dt className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center">
                                        Anchor PDA Address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-2 font-mono break-all flex items-center">
                                        {record.pdaAddress}
                                        <a
                                            href={`https://explorer.solana.com/address/${record.pdaAddress}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-3 flex items-center text-blue-400 hover:text-blue-300"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
