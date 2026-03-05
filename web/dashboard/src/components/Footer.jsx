"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Activity, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    if (pathname && pathname.startsWith('/dashboard')) {
        return null;
    }

    const navigation = {
        product: [
            { name: 'Global Explorer', href: '/explorer' },
            { name: 'Public Verifier', href: '/verify' },
            { name: 'Institutional Portal', href: '/dashboard' },
            { name: 'Network Status', href: '#' },
        ],
        resources: [
            { name: 'Documentation', href: '#' },
            { name: 'API Reference', href: '#' },
            { name: 'Security Audits', href: '#' },
            { name: 'Whitepaper', href: '#' },
        ],
        company: [
            { name: 'About SipHeron', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Contact', href: '#' },
        ],
        social: [
            { name: 'GitHub', icon: Github, href: '#' },
            { name: 'Twitter', icon: Twitter, href: '#' },
            { name: 'LinkedIn', icon: Linkedin, href: '#' },
        ],
    };

    return (
        <footer className="relative z-10 border-t border-white/10 bg-[#000000] mt-auto font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
                <div className="xl:grid xl:grid-cols-3 xl:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6 xl:col-span-1">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center p-0.5">
                                <img src="/sipheron_vdap_logo.png" alt="SipHeron" className="w-full h-full object-contain filter brightness-110" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">SipHeron VDR</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 max-w-xs font-light">
                            The institutional backbone for content provenance on the Solana blockchain. Immutable truth for the digital era.
                        </p>
                        <div className="flex space-x-5 pt-2">
                            {navigation.social.map((item) => (
                                <a key={item.name} href={item.href} className="text-gray-500 hover:text-white transition-colors">
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-5 w-5" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2 md:grid-cols-3">
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">Product</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                {navigation.product.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">Resources</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                {navigation.resources.map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-10 md:mt-0">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">Company</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                {navigation.company.map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
                    <p className="text-xs text-gray-500 font-medium">
                        &copy; 2026 SipHeron VDR Protocol. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
