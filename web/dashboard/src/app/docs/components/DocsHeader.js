'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Github, Menu, X, Terminal } from 'lucide-react';
import DocsSearch from './DocsSearch';
import DocsSidebar from './DocsSidebar';

export default function DocsHeader() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b border-[#151525] bg-[#08080F]/80 backdrop-blur-xl">
                <div className="flex h-16 items-center px-4 md:px-8 max-w-[1600px] mx-auto gap-4 md:gap-8">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden text-[#9B8EC4] hover:text-[#F0EEFF]"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <Link href="/docs" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#151525] border border-[#5B5380]/30 flex items-center justify-center p-1">
                            <img src="/sipheron_vdap_logo.png" alt="SipHeron" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#F0EEFF] hidden sm:block">SipHeron Docs</span>
                    </Link>

                    <span className="hidden lg:flex items-center px-2 py-0.5 rounded-full bg-[#151525] border border-[#5B5380]/30 text-[10px] font-mono font-bold text-[#9B8EC4]">
                        v0.9.4
                    </span>

                    <div className="flex-1 flex justify-end md:justify-start">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#5B5380] bg-[#151525]/50 border border-[#5B5380]/20 rounded-xl hover:border-[#9B6EFF]/40 hover:text-[#9B8EC4] transition-all w-full max-w-sm ml-auto mr-auto md:ml-4"
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden sm:inline">Search documentation...</span>
                            <span className="sm:hidden">Search...</span>
                            <kbd className="hidden sm:inline-flex items-center gap-1 ml-auto px-1.5 py-0.5 rounded-md bg-[#08080F] text-[10px] font-mono font-bold">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="https://github.com/leaderofARS/solana-vdr" className="text-[#9B8EC4] hover:text-[#F0EEFF] transition-colors flex items-center gap-2 text-sm font-semibold">
                            <Github className="w-5 h-5" /> GitHub
                        </Link>
                        <Link href="/auth/register" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] text-white text-sm font-bold shadow-[0_0_20px_rgba(155,110,255,0.2)] hover:shadow-[0_0_30px_rgba(155,110,255,0.4)] hover:opacity-90 active:scale-95 transition-all">
                            Get Started &rarr;
                        </Link>
                    </div>
                </div>
            </header>

            <DocsSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-[#08080F]/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="relative w-80 max-w-[80%] h-full bg-[#08080F] border-r border-[#151525] shadow-2xl overflow-y-auto">
                        <div className="p-4 border-b border-[#151525] flex justify-between items-center sticky top-0 bg-[#08080F]/90 backdrop-blur-md z-10">
                            <span className="font-bold text-[#F0EEFF]">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#5B5380] hover:text-[#F0EEFF] p-2 bg-[#151525] rounded-xl">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <DocsSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
