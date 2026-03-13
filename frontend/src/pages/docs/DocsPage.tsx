/**
 * @file DocsPage.tsx
 * @placeholder Documentation page for SipHeron VDR
 * Full documentation would be extensive; this is a simplified version
 * that redirects to the comprehensive docs or shows basic info
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Code, Terminal, ExternalLink, ChevronRight, Search, FileText, Key, Webhook } from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: { title: string; href: string }[];
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Book,
    items: [
      { title: 'Quick Start Guide', href: '#' },
      { title: 'Installation', href: '#' },
      { title: 'Authentication', href: '#' },
      { title: 'First Anchor', href: '#' },
    ],
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: Code,
    items: [
      { title: 'Authentication', href: '#' },
      { title: 'Hashes', href: '#' },
      { title: 'Organizations', href: '#' },
      { title: 'Usage & Billing', href: '#' },
    ],
  },
  {
    id: 'cli',
    title: 'CLI Reference',
    icon: Terminal,
    items: [
      { title: 'Installation', href: '#' },
      { title: 'link', href: '#' },
      { title: 'stage', href: '#' },
      { title: 'anchor', href: '#' },
      { title: 'verify', href: '#' },
    ],
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    icon: Webhook,
    items: [
      { title: 'Configuration', href: '#' },
      { title: 'Event Types', href: '#' },
      { title: 'Security', href: '#' },
    ],
  },
  {
    id: 'sdks',
    title: 'SDKs',
    icon: FileText,
    items: [
      { title: 'JavaScript SDK', href: '#' },
      { title: 'Python SDK', href: '#' },
      { title: 'Rust SDK', href: '#' },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: Key,
    items: [
      { title: 'API Keys', href: '#' },
      { title: 'Best Practices', href: '#' },
      { title: 'Compliance', href: '#' },
    ],
  },
];

export const DocsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const filteredSections = docSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.items.length > 0 || searchQuery === '');

  return (
    <div className="min-h-screen bg-sipheron-base text-sipheron-text-primary">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-sipheron-surface/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sipheron-purple to-sipheron-teal flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="font-semibold text-white">SipHeron</span>
              </Link>
              <span className="text-white/[0.2]">|</span>
              <span className="text-sipheron-text-muted">Documentation</span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="https://api.sipheron.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-sipheron-text-muted hover:text-sipheron-purple transition-colors flex items-center gap-1"
              >
                API Reference
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link 
                to="/dashboard"
                className="text-sm bg-sipheron-purple/10 text-sipheron-purple px-4 py-2 rounded-lg hover:bg-sipheron-purple/20 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sipheron-text-muted" />
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-sipheron-surface border border-white/[0.06] rounded-lg text-sm text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:outline-none focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20"
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <div key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-sipheron-purple/10 text-sipheron-purple'
                            : 'text-sipheron-text-secondary hover:text-sipheron-text-primary hover:bg-white/[0.03]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {section.title}
                      </button>
                      {isActive && section.items.length > 0 && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {section.items.map((item) => (
                            <a
                              key={item.title}
                              href={item.href}
                              className="block px-3 py-1.5 text-sm text-sipheron-text-muted hover:text-sipheron-purple transition-colors"
                            >
                              {item.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-sipheron-surface border border-white/[0.06] rounded-2xl p-8">
              <h1 className="text-3xl font-bold text-white mb-4">SipHeron VDR Documentation</h1>
              <p className="text-sipheron-text-secondary text-lg mb-8">
                Welcome to the SipHeron VDR documentation. Learn how to anchor, verify, and manage 
                document proofs on the Solana blockchain.
              </p>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <a 
                  href="#"
                  className="group p-6 bg-sipheron-base border border-white/[0.06] rounded-xl hover:border-sipheron-purple/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Terminal className="w-6 h-6 text-sipheron-purple" />
                    <ChevronRight className="w-4 h-4 text-sipheron-text-muted group-hover:text-sipheron-purple transition-colors" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Quick Start</h3>
                  <p className="text-sm text-sipheron-text-muted">Get up and running in 5 minutes</p>
                </a>

                <a 
                  href="#"
                  className="group p-6 bg-sipheron-base border border-white/[0.06] rounded-xl hover:border-sipheron-purple/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Code className="w-6 h-6 text-sipheron-teal" />
                    <ChevronRight className="w-4 h-4 text-sipheron-text-muted group-hover:text-sipheron-teal transition-colors" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">API Reference</h3>
                  <p className="text-sm text-sipheron-text-muted">Complete API documentation</p>
                </a>
              </div>

              {/* Installation */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
                <p className="text-sipheron-text-secondary mb-4">
                  Install the SipHeron CLI using npm:
                </p>
                <div className="bg-black/50 rounded-xl p-4 font-mono text-sm text-sipheron-teal overflow-x-auto">
                  npm install -g sipheron-vdr
                </div>
              </section>

              {/* Authentication */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
                <p className="text-sipheron-text-secondary mb-4">
                  Link your CLI to your SipHeron account:
                </p>
                <div className="bg-black/50 rounded-xl p-4 font-mono text-sm text-sipheron-teal overflow-x-auto">
                  sipheron-vdr link
                </div>
              </section>

              {/* First Anchor */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Your First Anchor</h2>
                <p className="text-sipheron-text-secondary mb-4">
                  Stage and anchor your first document:
                </p>
                <div className="bg-black/50 rounded-xl p-4 font-mono text-sm text-sipheron-teal overflow-x-auto space-y-2">
                  <div># Stage a document</div>
                  <div>sipheron-vdr stage ./contract.pdf</div>
                  <div className="text-sipheron-text-muted"># Then anchor it to Solana</div>
                  <div>sipheron-vdr anchor</div>
                </div>
              </section>

              {/* Need Help */}
              <div className="bg-sipheron-purple/5 border border-sipheron-purple/20 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">Need Help?</h3>
                <p className="text-sm text-sipheron-text-secondary mb-4">
                  Can't find what you're looking for? Contact our support team.
                </p>
                <a 
                  href="mailto:support@sipheron.com"
                  className="text-sm text-sipheron-purple hover:text-sipheron-teal transition-colors"
                >
                  support@sipheron.com
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
