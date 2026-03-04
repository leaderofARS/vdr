/**
 * @file Navbar.jsx
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/components/Navbar.jsx
 * @description Reusable React UI components.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import Link from "next/link";
import dynamic from "next/dynamic";
import { ShieldCheck, Globe, Activity } from "lucide-react";

const WalletMultiButton = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/20 backdrop-blur-xl transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">SipHeron <span className="text-blue-500">VDR</span></span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            <NavLink href="/verify">Verify Integrity</NavLink>
                            <NavLink href="/explorer">Global Explorer</NavLink>
                            <NavLink href="/dashboard">Institutional Portal</NavLink>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Mainnet Ready</span>
                        </div>
                        <WalletMultiButton className="!bg-white !text-black !rounded-xl !font-black !text-xs !px-6 !h-11 !transition-all hover:!bg-blue-500 hover:!text-white border-none shadow-lg" />
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }) {
    return (
        <Link
            href={href}
            className="text-sm font-bold text-gray-400 hover:text-white transition-colors relative group py-2"
        >
            {children}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full" />
        </Link>
    );
}
