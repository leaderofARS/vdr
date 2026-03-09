'use client'
import Link from 'next/link';
import { Search, Github, ExternalLink, Menu } from 'lucide-react';
import { useState } from 'react';
import DocsSearch from './DocsSearch';

export default function DocsHeader() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 h-[48px] bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#2A2A2A] px-4">
                <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/docs" className="flex items-center gap-2 group">
                            <div className="w-6 h-6 bg-[#9B6EFF] rounded-md flex items-center justify-center text-white font-bold text-[14px]">S</div>
                            <span className="text-[#EDEDED] font-semibold tracking-tight hidden sm:block">SipHeron VDR</span>
                            <span className="text-[#555] font-medium hidden sm:block">Docs</span>
                        </Link>
                    </div>

                    <div className="flex-1 max-w-[480px] hidden md:block">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#2A2A2A] rounded-md text-[#555] text-[13px] hover:border-[#444] transition-colors w-full"
                        >
                            <Search className="w-3.5 h-3.5" />
                            <span>Search docs...</span>
                            <kbd className="ml-auto text-[11px] bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#2A2A2A] font-sans">⌘K</kbd>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 text-[13px]">
                        <span className="text-[#555] hidden lg:block">v0.9.4</span>
                        <div className="h-4 w-[1px] bg-[#2A2A2A] hidden lg:block"></div>
                        <a href="https://github.com/leaderofARS/solana-vdr" className="text-[#888] hover:text-[#EDEDED] transition-colors flex items-center gap-1.5">
                            <Github className="w-4 h-4" />
                            <span className="hidden sm:block">GitHub</span>
                            <ExternalLink className="w-3 h-3 lg:hidden" />
                        </a>
                        <Link href="/dashboard" className="px-3 py-1 bg-[#EDEDED] text-[#0A0A0A] rounded-md font-medium hover:bg-[#DEDEDE] transition-colors hidden sm:block">
                            Dashboard
                        </Link>
                        <button className="md:hidden text-[#888]">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>
            {isSearchOpen && <DocsSearch onClose={() => setIsSearchOpen(false)} />}
        </>
    );
}
