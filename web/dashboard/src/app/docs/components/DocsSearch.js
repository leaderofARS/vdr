'use client'
import { useEffect, useState, useRef } from 'react';
import { Search, Command } from 'lucide-react';
import Link from 'next/link';

export default function DocsSearch({ onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Mock search results
    useEffect(() => {
        if (query.length > 2) {
            setResults([
                { title: 'Introduction to VDR', section: 'Getting Started', snippet: 'Vessel Daily Report (VDR) is an enterprise-grade...', href: '/docs' },
                { title: 'sipheron-vdr anchor', section: 'CLI Reference', snippet: 'Anchors a file hash to the Solana blockchain...', href: '/docs/cli/anchor' },
                { title: 'REST API Overview', section: 'API Reference', snippet: 'Complete documentation for the SipHeron API...', href: '/docs/api' },
                { title: 'Webhook Integration', section: 'Guides', snippet: 'Learn how to receive real-time notifications...', href: '/docs/guides/webhooks' },
            ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.snippet.toLowerCase().includes(query.toLowerCase())));
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4">
            <div
                ref={modalRef}
                className="w-full max-w-[560px] bg-[#111] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A]">
                    <Search className="w-4 h-4 text-[#555]" />
                    <input
                        autoFocus
                        placeholder="Search documentation..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent text-[#EDEDED] text-[14px] outline-none placeholder:text-[#555]"
                    />
                    <kbd className="text-[11px] text-[#555] border border-[#2A2A2A] rounded px-1.5 py-0.5 bg-[#0A0A0A]">ESC</kbd>
                </div>
                <div className="max-h-[400px] overflow-y-auto py-2">
                    {query.length > 0 && results.length === 0 && (
                        <div className="px-4 py-8 text-center text-[#555] text-[13px]">
                            No results found for "{query}"
                        </div>
                    )}
                    {query.length === 0 && (
                        <div className="px-4 py-2 text-[#555] text-[11px] uppercase tracking-wider font-medium">
                            Recent Searches
                        </div>
                    )}
                    {results.map(r => (
                        <Link
                            key={r.href}
                            href={r.href}
                            onClick={onClose}
                            className="flex flex-col gap-0.5 px-4 py-3 hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-[#EDEDED] font-medium">{r.title}</span>
                                <span className="text-[11px] text-[#555] px-1.5 py-0.5 rounded border border-[#2A2A2A] bg-[#0A0A0A]">{r.section}</span>
                            </div>
                            <span className="text-[12px] text-[#555] line-clamp-1">{r.snippet}</span>
                        </Link>
                    ))}
                </div>
                <div className="px-4 py-2 border-t border-[#2A2A2A] bg-[#0A0A0A] flex items-center gap-4 text-[11px] text-[#555]">
                    <div className="flex items-center gap-1">
                        <kbd className="border border-[#2A2A2A] rounded px-1">↑↓</kbd> <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <kbd className="border border-[#2A2A2A] rounded px-1">↵</kbd> <span>Select</span>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
