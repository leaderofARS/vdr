'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const SIDEBAR_ITEMS = [
    {
        title: 'Getting Started',
        items: [
            { label: 'Introduction', href: '/docs' },
            { label: 'Quick Start', href: '/docs/quickstart' },
            { label: 'Installation', href: '/docs/getting-started/installation' },
            {
                label: 'Authentication', href: '/docs/authentication', children: [
                    { label: 'Bearer Tokens', href: '/docs/authentication/bearer' },
                    { label: 'API Keys', href: '/docs/authentication/api-keys' }
                ]
            }
        ]
    },
    {
        title: 'Core Concepts',
        items: [
            { label: 'How Hashing Works', href: '/docs/concepts/hashing' },
            { label: 'Anchor Lifecycle', href: '/docs/concepts/anchor-lifecycle' },
            { label: 'Verification Model', href: '/docs/concepts/verification' },
            { label: 'On-Chain Storage', href: '/docs/concepts/on-chain' }
        ]
    },
    {
        title: 'CLI Reference',
        items: [
            { label: 'Overview', href: '/docs/cli' },
            {
                label: 'sipheron-vdr link', href: '/docs/cli/link', children: [
                    { label: 'Usage', href: '/docs/cli/link#usage' },
                    { label: 'Options', href: '/docs/cli/link#options' },
                    { label: 'Examples', href: '/docs/cli/link#examples' }
                ]
            },
            {
                label: 'sipheron-vdr stage', href: '/docs/cli/stage', children: [
                    { label: 'Usage', href: '/docs/cli/stage#usage' },
                    { label: 'Options', href: '/docs/cli/stage#options' },
                    { label: 'Examples', href: '/docs/cli/stage#examples' }
                ]
            },
            {
                label: 'sipheron-vdr anchor', href: '/docs/cli/anchor', children: [
                    { label: 'Usage', href: '/docs/cli/anchor#usage' },
                    { label: 'Options', href: '/docs/cli/anchor#options' },
                    { label: 'Examples', href: '/docs/cli/anchor#examples' }
                ]
            },
            {
                label: 'sipheron-vdr verify', href: '/docs/cli/verify', children: [
                    { label: 'Usage', href: '/docs/cli/verify#usage' },
                    { label: 'Options', href: '/docs/cli/verify#options' },
                    { label: 'Examples', href: '/docs/cli/verify#examples' }
                ]
            },
            { label: 'sipheron-vdr status', href: '/docs/cli/status' },
            { label: 'sipheron-vdr history', href: '/docs/cli/history' },
            { label: 'sipheron-vdr revoke', href: '/docs/cli/revoke' }
        ]
    },
    {
        title: 'API Reference',
        items: [
            { label: 'Overview', href: '/docs/api' },
            {
                label: 'Authentication', href: '/docs/api/auth', children: [
                    { label: 'Bearer Token', href: '/docs/api/auth/bearer' },
                    { label: 'API Key Header', href: '/docs/api/auth/api-key' },
                    { label: 'Errors', href: '/docs/api/auth/errors' }
                ]
            },
            {
                label: 'Hashes', href: '/docs/api/hashes', children: [
                    { label: 'Register Hash', href: '/docs/api/hashes/register' },
                    { label: 'Get Hash', href: '/docs/api/hashes/get' },
                    { label: 'List Hashes', href: '/docs/api/hashes/list' },
                    { label: 'Revoke Hash', href: '/docs/api/hashes/revoke' },
                    { label: 'Batch Register', href: '/docs/api/hashes/batch' }
                ]
            },
            {
                label: 'API Keys', href: '/docs/api/keys', children: [
                    { label: 'List Keys', href: '/docs/api/keys/list' },
                    { label: 'Create Key', href: '/docs/api/keys/create' },
                    { label: 'Delete Key', href: '/docs/api/keys/delete' }
                ]
            },
            {
                label: 'Organizations', href: '/docs/api/orgs', children: [
                    { label: 'Get Org', href: '/docs/api/orgs/get' },
                    { label: 'Update Org', href: '/docs/api/orgs/update' },
                    { label: 'Get Stats', href: '/docs/api/orgs/stats' }
                ]
            },
            {
                label: 'Webhooks', href: '/docs/api/webhooks', children: [
                    { label: 'List Webhooks', href: '/docs/api/webhooks/list' },
                    { label: 'Create Webhook', href: '/docs/api/webhooks/create' },
                    { label: 'Delete Webhook', href: '/docs/api/webhooks/delete' },
                    { label: 'Webhook Events', href: '/docs/api/webhooks/events' }
                ]
            },
            {
                label: 'Notifications', href: '/docs/api/notifications', children: [
                    { label: 'List Notifications', href: '/docs/api/notifications/list' },
                    { label: 'Mark Read', href: '/docs/api/notifications/read' },
                    { label: 'Delete', href: '/docs/api/notifications/delete' }
                ]
            },
            {
                label: 'Usage & Analytics', href: '/docs/api/usage', children: [
                    { label: 'Usage Summary', href: '/docs/api/usage/summary' },
                    { label: 'Usage Logs', href: '/docs/api/usage/logs' }
                ]
            }
        ]
    },
    {
        title: 'Guides',
        items: [
            { label: 'Legal Documents', href: '/docs/guides/legal' },
            { label: 'Financial Reports', href: '/docs/guides/financial' },
            { label: 'Enterprise Setup', href: '/docs/guides/enterprise' },
            { label: 'CI/CD Integration', href: '/docs/guides/cicd' },
            { label: 'Webhook Integration', href: '/docs/guides/webhooks' }
        ]
    },
    {
        title: 'SDKs & Tools',
        items: [
            { label: 'JavaScript SDK', href: '/docs/sdks/javascript' },
            { label: 'Python SDK', href: '/docs/sdks/python' },
            { label: 'REST API', href: '/docs/api' }
        ]
    },
    {
        title: 'Resources',
        items: [
            { label: 'Changelog', href: '/changelog' },
            { label: 'GitHub ↗', href: 'https://github.com/leaderofARS/solana-vdr', external: true },
            { label: 'Support', href: '/support' },
            { label: 'Status Page ↗', href: 'https://status.sipheron.vdr', external: true }
        ]
    }
];

function SidebarItem({ item, level = 0 }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(pathname.startsWith(item.href));
    const isActive = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;

    useEffect(() => {
        if (pathname.startsWith(item.href)) {
            setIsOpen(true);
        }
    }, [pathname, item.href]);

    // Indent levels based on level
    const indentClass = level === 1 ? 'pl-3' : level === 2 ? 'pl-6' : level === 3 ? 'pl-9' : '';

    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                {item.external ? (
                    <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 text-[13px] py-1.5 transition-colors duration-100 text-[#888888] hover:text-[#EDEDED] ${indentClass}`}
                    >
                        {item.label}
                    </a>
                ) : (
                    <Link
                        href={item.href}
                        className={`flex-1 text-[13px] py-1.5 transition-colors duration-100 flex items-center justify-between group ${indentClass} ${isActive
                                ? 'text-[#EDEDED] font-medium border-l-2 border-[#9B6EFF] -ml-[1px]'
                                : 'text-[#888888] hover:text-[#EDEDED]'
                            }`}
                    >
                        <span className={isActive ? 'pl-2.5' : ''}>{item.label}</span>
                        {item.soon && <span className="text-[10px] bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#2A2A2A] text-[#555] mr-2">SOON</span>}
                    </Link>
                )}
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                        }}
                        className="p-1.5 text-[#555] hover:text-[#888] transition-colors pr-4"
                    >
                        <ChevronRight className={`w-3 h-3 transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                )}
            </div>
            {hasChildren && isOpen && (
                <div className="flex flex-col">
                    {item.children.map((child, i) => (
                        <SidebarItem key={i} item={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function DocsSidebar() {
    return (
        <aside className="fixed left-0 top-[48px] w-[240px] h-[calc(100vh-48px)] overflow-y-auto bg-[#0A0A0A] border-r border-[#2A2A2A] hidden md:block pt-8 pb-12 px-6 scrollbar-thin scrollbar-thumb-[#1F1F1F]">
            <div className="flex flex-col gap-8">
                {SIDEBAR_ITEMS.map((section, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        <h5 className="text-[11px] uppercase tracking-[0.08em] text-[#555555] font-medium">
                            {section.title}
                        </h5>
                        <div className="flex flex-col">
                            {section.items.map((item, j) => (
                                <SidebarItem key={j} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
