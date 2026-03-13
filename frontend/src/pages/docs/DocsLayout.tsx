import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { Navbar, Footer } from '@/sections/landing';
import { TableOfContents } from '@/components/docs/TableOfContents';

// Sidebar navigation structure
const SIDEBAR_ITEMS = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/docs' },
      { label: 'Quick Start', href: '/docs/quickstart' },
      { label: 'Installation', href: '/docs/installation' },
      {
        label: 'Authentication',
        href: '/docs/authentication',
        children: [
          { label: 'Bearer Tokens', href: '/docs/authentication/bearer' },
          { label: 'API Keys', href: '/docs/authentication/api-keys' },
        ],
      },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { label: 'How Hashing Works', href: '/docs/concepts/hashing' },
      { label: 'Anchor Lifecycle', href: '/docs/concepts/lifecycle' },
      { label: 'Verification Model', href: '/docs/concepts/verification' },
      { label: 'On-Chain Storage', href: '/docs/concepts/storage' },
    ],
  },
  {
    title: 'CLI Reference',
    items: [
      { label: 'Overview', href: '/docs/cli' },
      { label: 'sipheron-vdr link', href: '/docs/cli/link' },
      { label: 'sipheron-vdr stage', href: '/docs/cli/stage' },
      { label: 'sipheron-vdr anchor', href: '/docs/cli/anchor' },
      { label: 'sipheron-vdr verify', href: '/docs/cli/verify' },
      { label: 'sipheron-vdr status', href: '/docs/cli/status' },
      { label: 'sipheron-vdr history', href: '/docs/cli/history' },
      { label: 'sipheron-vdr revoke', href: '/docs/cli/revoke' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { label: 'Overview', href: '/docs/api' },
      { label: 'Authentication', href: '/docs/api/auth' },
      { label: 'Hashes', href: '/docs/api/hashes' },
      { label: 'API Keys', href: '/docs/api/keys' },
      { label: 'Organizations', href: '/docs/api/orgs' },
      { label: 'Webhooks', href: '/docs/api/webhooks' },
      { label: 'Usage & Analytics', href: '/docs/api/usage' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'Legal Documents', href: '/docs/guides/legal' },
      { label: 'Financial Reports', href: '/docs/guides/financial' },
      { label: 'Enterprise Setup', href: '/docs/guides/enterprise' },
      { label: 'CI/CD Integration', href: '/docs/guides/cicd' },
      { label: 'Webhook Integration', href: '/docs/guides/webhooks' },
    ],
  },
  {
    title: 'SDKs & Tools',
    items: [
      { label: 'JavaScript SDK', href: '/docs/sdks/javascript' },
      { label: 'Python SDK', href: '/docs/sdks/python' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Changelog', href: '/changelog' },
      { label: 'GitHub', href: 'https://github.com/leaderofARS/vdr', external: true },
      { label: 'Support', href: '/support' },
    ],
  },
];

interface SidebarItemProps {
  item: {
    label: string;
    href: string;
    external?: boolean;
    children?: Array<{ label: string; href: string }>;
  };
  level?: number;
}

const SidebarItem: React.FC<SidebarItemProps & { currentPath: string }> = ({ item, level = 0, currentPath }) => {
  const [isOpen, setIsOpen] = useState(currentPath.startsWith(item.href));
  const isActive = currentPath === item.href;
  const hasChildren = item.children && item.children.length > 0;

  const indentClass = level === 1 ? 'pl-3' : level === 2 ? 'pl-6' : '';

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        {item.external ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 text-[13px] py-1.5 transition-colors duration-100 text-[#888888] hover:text-[#EDEDED] ${indentClass} flex items-center gap-1`}
          >
            {item.label}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <Link
            to={item.href}
            className={`flex-1 text-[13px] py-1.5 transition-colors duration-100 flex items-center justify-between group ${indentClass} ${
              isActive
                ? 'text-[#EDEDED] font-medium border-l-2 border-[#9B6EFF] -ml-[1px]'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            <span className={isActive ? 'pl-2.5' : ''}>{item.label}</span>
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
          {item.children!.map((child, i) => (
            <SidebarItem key={i} item={child} level={level + 1} currentPath={currentPath} />
          ))}
        </div>
      )}
    </div>
  );
};

const DocsSidebar: React.FC<{ currentPath: string }> = ({ currentPath }) => {
  return (
    <aside className="fixed left-0 top-12 w-[240px] h-[calc(100vh-48px)] overflow-y-auto bg-[#0A0A0A] border-r border-[#2A2A2A] hidden lg:block pt-8 pb-12 px-6">
      <div className="flex flex-col gap-8">
        {SIDEBAR_ITEMS.map((section, i) => (
          <div key={i} className="flex flex-col gap-3">
            <h5 className="text-[11px] uppercase tracking-[0.08em] text-[#555555] font-medium">
              {section.title}
            </h5>
            <div className="flex flex-col">
              {section.items.map((item, j) => (
                <SidebarItem key={j} item={item} currentPath={currentPath} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

const MobileSidebar: React.FC<{ isOpen: boolean; onClose: () => void; currentPath: string }> = ({ isOpen, onClose, currentPath }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        className="absolute left-0 top-12 bottom-0 w-[280px] bg-[#0A0A0A] border-r border-[#2A2A2A] overflow-y-auto pt-8 pb-12 px-6"
      >
        <div className="flex flex-col gap-8">
          {SIDEBAR_ITEMS.map((section, i) => (
            <div key={i} className="flex flex-col gap-3">
              <h5 className="text-[11px] uppercase tracking-[0.08em] text-[#555555] font-medium">
                {section.title}
              </h5>
              <div className="flex flex-col">
                {section.items.map((item, j) => (
                  <SidebarItem key={j} item={item} currentPath={currentPath} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const DocsLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <Navbar />

      <div className="flex-1 flex pt-12">
        {/* Sidebar */}
        <DocsSidebar currentPath={currentPath} />
        <MobileSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} currentPath={currentPath} />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-[240px] flex">
          <div className="flex-1 max-w-4xl mx-auto px-6 py-12 flex gap-12">
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
            
            {/* Table of Contents - Right Side */}
            <TableOfContents />
          </div>
        </main>
      </div>

      <div className="lg:ml-[240px]">
        <Footer />
      </div>
    </div>
  );
};

export default DocsLayout;
