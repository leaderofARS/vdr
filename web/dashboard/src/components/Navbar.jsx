/**
 * @file Navbar.jsx
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/components/Navbar.jsx
 * @description Reusable React UI components.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ShieldCheck, Globe, Activity, ChevronDown } from "lucide-react";

const WalletMultiButton = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

export default function Navbar() {
    const pathname = usePathname();

    if (pathname && pathname.startsWith('/dashboard')) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/20 backdrop-blur-xl transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center p-1 group-hover:bg-blue-600/20 transition-colors">
                                <Image
                                    src="/sipheron_vdap_logo.png"
                                    alt="SipHeron Logo"
                                    width={36}
                                    height={36}
                                    className="object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.6)] group-hover:scale-110 transition-transform duration-300"
                                    priority
                                />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                                SipHeron
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            <NavDropdown title="Product" links={[
                                { name: "Global Explorer", href: "/explorer" },
                                { name: "Public Verifier", href: "/verify" },
                                { name: "Institutional Portal", href: "/dashboard" },
                                { name: "Network Status", href: "#" }
                            ]} />
                            <NavDropdown title="Resources" links={[
                                { name: "Documentation", href: "#" },
                                { name: "API Reference", href: "#" },
                                { name: "Security Audits", href: "#" },
                                { name: "Whitepaper", href: "#" }
                            ]} />
                            <NavDropdown title="Company" links={[
                                { name: "About SipHeron", href: "#" },
                                { name: "Careers", href: "#" },
                                { name: "Blog", href: "#" },
                                { name: "Contact", href: "#" }
                            ]} />
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

function NavDropdown({ title, links }) {
    return (
        <div className="relative group">
            <button className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-white transition-colors py-6 pl-1 pr-1">
                {title}
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-64 pointer-events-none group-hover:pointer-events-auto">
                <div className="p-2 bg-[#050505] border border-white/10 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] flex flex-col gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors flex items-center justify-between group/link"
                        >
                            {link.name}
                            <span className="text-gray-500 opacity-0 -translate-x-2 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0">
                                →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
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
