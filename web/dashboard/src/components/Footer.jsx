"use client";

import { usePathname } from "next/navigation";
import { ShieldCheck, Activity } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    if (pathname && pathname.startsWith('/dashboard')) {
        return null;
    }

    return (
        <footer className="relative z-10 px-6 py-12 border-t border-white/10 bg-[#050505] mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 w-full">
                <div className="text-gray-500 text-sm font-medium">
                    © 2026 SipHeron VDR Protocol. Built on Solana for Creators.
                </div>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Activity className="w-5 h-5" /></a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><ShieldCheck className="w-5 h-5" /></a>
                </div>
            </div>
        </footer>
    );
}
