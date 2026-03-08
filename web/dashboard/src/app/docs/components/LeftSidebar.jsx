'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
    {
        title: 'Getting Started',
        links: [
            { title: 'Introduction', href: '/docs' },
            { title: 'Quickstart', href: '/docs/quickstart' },
            { title: 'Core Concepts', href: '/docs/concepts' },
        ]
    },
    {
        title: 'CLI Reference',
        links: [
            { title: 'Overview', href: '/docs/cli' },
            { title: 'Commands', href: '/docs/cli/commands' },
            { title: 'Security', href: '/docs/cli/security' },
        ]
    },
    {
        title: 'API Reference',
        links: [
            { title: 'Overview', href: '/docs/api' },
            { title: 'Endpoints', href: '/docs/api/endpoints' },
            { title: 'Webhooks', href: '/docs/api/webhooks' },
        ]
    },
    {
        title: 'Smart Contract',
        links: [
            { title: 'Overview', href: '/docs/contract' },
            { title: 'Instructions', href: '/docs/contract/instructions' },
            { title: 'Security Model', href: '/docs/contract/security' },
        ]
    },
    {
        title: 'Use Cases',
        links: [
            { title: 'Overview', href: '/docs/use-cases' },
            { title: 'Legal & Compliance', href: '/docs/use-cases/legal' },
            { title: 'Academic Credentials', href: '/docs/use-cases/academic' },
            { title: 'Enterprise Control', href: '/docs/use-cases/enterprise' },
        ]
    },
    {
        title: 'Guides',
        links: [
            { title: 'Organization Setup', href: '/docs/guides/organizations' },
            { title: 'Verification', href: '/docs/guides/verification' },
            { title: 'Migration', href: '/docs/guides/migration' },
        ]
    }
];

export default function LeftSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState({});

    const toggleSection = (idx) => setCollapsed(prev => ({ ...prev, [idx]: !prev[idx] }));

    return (
        <nav className="px-4 pb-12 pt-4">
            {NAV_ITEMS.map((section, idx) => (
                <div key={idx} className="mb-6">
                    <button
                        className="flex items-center justify-between w-full text-left font-semibold text-gray-200 mb-2 hover:text-white transition-colors"
                        onClick={() => toggleSection(idx)}
                    >
                        <span>{section.title}</span>
                        <svg className={`w-4 h-4 transform transition-transform ${collapsed[idx] ? '-rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    {!collapsed[idx] && (
                        <ul className="space-y-1.5 border-l border-gray-800 ml-2 pl-3">
                            {section.links.map(link => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`block text-sm transition-colors ${isActive ? 'text-[#4285F4] font-medium' : 'text-gray-400 hover:text-gray-200'}`}
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            ))}
        </nav>
    );
}
