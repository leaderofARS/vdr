'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';

export default function DocsSearch({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [index, setIndex] = useState([]);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (isOpen && index.length === 0) {
            fetch('/docs-search-index.json')
                .then(res => res.json())
                .then(data => setIndex(data))
                .catch(err => console.error(err));
        }
    }, [isOpen, index.length]);

    useEffect(() => {
        if (query.length > 1) {
            const lowerQuery = query.toLowerCase();
            const filtered = index.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.snippet.toLowerCase().includes(lowerQuery)
            ).slice(0, 5); // Limit results to 5
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query, index]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            // Wait for render
            setTimeout(() => document.getElementById('docs-search-input')?.focus(), 100);
        } else {
            document.body.style.overflow = '';
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-[#08080F]/80 backdrop-blur-md transition-opacity" onClick={onClose} />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-[#0F0F1A] rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full border border-[#151525]">
                <div className="relative flex items-center px-4 py-4 border-b border-[#151525]">
                    <Search className="w-5 h-5 text-[#9B8EC4] absolute left-4" />
                    <input
                        id="docs-search-input"
                        type="text"
                        className="w-full bg-transparent border-none focus:ring-0 text-[#F0EEFF] placeholder-[#5B5380] pl-10 pr-4 text-lg"
                        placeholder="Search documentation..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-[#151525] rounded-md text-[#5B5380] text-[10px] font-mono border border-[#5B5380]/20 absolute right-4">
                        ESC
                    </kbd>
                </div>

                <div className="max-h-[60vh] overflow-y-auto w-full">
                    {query.length > 1 && results.length > 0 ? (
                        <ul className="py-2">
                            {results.map((result, i) => (
                                <li key={i}>
                                    <Link
                                        href={result.url}
                                        onClick={onClose}
                                        className="block px-6 py-4 hover:bg-[#151525]/50 hover:bg-gradient-to-r hover:from-[#4F6EF7]/10 hover:to-transparent border-l-2 border-transparent hover:border-[#4F6EF7] transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5B5380] mb-1">{result.section}</div>
                                                <div className="text-[#F0EEFF] font-semibold text-base flex items-center gap-2 group-hover:text-[#B794FF]">
                                                    {result.title}
                                                </div>
                                                <div className="text-sm text-[#9B8EC4] mt-1 line-clamp-1">{result.snippet}</div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-[#5B5380] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : query.length > 1 ? (
                        <div className="px-6 py-12 text-center text-[#9B8EC4]">
                            No results found for "{query}".
                        </div>
                    ) : (
                        <div className="px-6 py-8 text-center text-[#5B5380] text-sm">
                            Type to begin searching the documentation.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
