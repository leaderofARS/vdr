'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

export const navigation = [
    {
        title: 'GETTING STARTED',
        items: [
            { title: 'Introduction', href: '/docs' },
            { title: 'Quick Start', href: '/docs/quickstart' },
            { title: 'Installation', href: '/docs/installation' },
            { title: 'Authentication', href: '/docs/authentication' }
        ]
    },
    {
        title: 'CORE CONCEPTS',
        items: [
            { title: 'How Hashing Works', href: '/docs/concepts/hashing' },
            { title: 'Anchor Lifecycle', href: '/docs/concepts/lifecycle' },
            { title: 'Verification Model', href: '/docs/concepts/verification' },
            { title: 'On-Chain Storage', href: '/docs/concepts/storage' }
        ]
    },
    {
        title: 'CLI REFERENCE',
        items: [
            { title: 'Overview', href: '/docs/cli' },
            { title: 'link', href: '/docs/cli/link', prefix: 'sipheron-vdr ' },
            { title: 'stage', href: '/docs/cli/stage', prefix: 'sipheron-vdr ' },
            { title: 'anchor', href: '/docs/cli/anchor', prefix: 'sipheron-vdr ' },
            { title: 'verify', href: '/docs/cli/verify', prefix: 'sipheron-vdr ' },
            { title: 'status', href: '/docs/cli/status', prefix: 'sipheron-vdr ', badge: 'New' },
            { title: 'history', href: '/docs/cli/history', prefix: 'sipheron-vdr ', badge: 'New' },
            { title: 'revoke', href: '/docs/cli/revoke', prefix: 'sipheron-vdr ', badge: 'New' }
        ]
    },
    {
        title: 'API REFERENCE',
        items: [
            { title: 'Authentication', href: '/docs/api/authentication' },
            { title: 'Hashes', href: '/docs/api/hashes' },
            { title: 'API Keys', href: '/docs/api/keys' },
            { title: 'Organizations', href: '/docs/api/organizations' },
            { title: 'Webhooks', href: '/docs/api/webhooks' },
            { title: 'Notifications', href: '/docs/api/notifications' },
            { title: 'Usage & Analytics', href: '/docs/api/usage' }
        ]
    },
    {
        title: 'GUIDES',
        items: [
            { title: 'Legal Documents', href: '/docs/guides/legal' },
            { title: 'Financial Reports', href: '/docs/guides/financial' },
            { title: 'Enterprise Setup', href: '/docs/guides/enterprise' },
            { title: 'CI/CD Integration', href: '/docs/guides/cicd' },
            { title: 'Webhook Integration', href: '/docs/guides/webhook' }
        ]
    },
    {
        title: 'SDKs & TOOLS',
        items: [
            { title: 'JavaScript SDK', href: '/docs/sdks/javascript' },
            { title: 'Python SDK', href: '#', badge: 'Soon' },
            { title: 'REST API', href: '/docs/api' }
        ]
    },
    {
        title: 'RESOURCES',
        items: [
            { title: 'Changelog', href: '/changelog', external: true },
            { title: 'Status Page', href: 'https://status.sipheron.com', external: true },
            { title: 'GitHub', href: 'https://github.com/leaderofARS/solana-vdr', external: true },
            { title: 'Support', href: '/contact', external: true }
        ]
    }
];

export default function DocsSidebar({ onNavigate }) {
    const pathname = usePathname();

    return (
        <nav className="w-60 xl:w-64 shrink-0 pb-24 h-full sticky top-24 overflow-y-auto pr-4 hidden md:block custom-scrollbar">
            {navigation.map((group, i) => (
                <div key={i} className="mb-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B5380] mb-3 ml-3">
                        {group.title}
                    </h4>
                    <ul className="space-y-1">
                        {group.items.map((item, j) => {
                            const isActive = pathname === item.href || (item.href !== '/docs' && pathname.startsWith(item.href + '/'));

                            return (
                                <li key={j}>
                                    <Link
                                        href={item.href}
                                        onClick={onNavigate}
                                        className={`flex items-center gap-2 py-1.5 pl-3 pr-2 rounded-r-lg border-l-2 transition-alltext-sm font-medium
                                            ${isActive
                                                ? 'border-[#9B6EFF] bg-[#9B6EFF]/5 text-[#B794FF]'
                                                : 'border-transparent text-[#9B8EC4] hover:bg-[#151525]/50 hover:text-[#F0EEFF]'
                                            }
                                        `}
                                    >
                                        <div className="flex-1 truncate">
                                            {item.prefix && <span className="text-[#5B5380]">{item.prefix}</span>}
                                            <span>{item.title}</span>
                                        </div>
                                        {item.badge && (
                                            <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-bold ${item.badge === 'New'
                                                ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                                                : 'bg-[#5B5380]/10 text-[#5B5380] border border-[#5B5380]/20'
                                                }`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
