import React from 'react';
import { Link } from 'react-router-dom';

const ChangelogPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Changelog</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Track the latest updates, improvements, and new features in SipHeron VDR.
      </p>

      <div className="flex items-center gap-2 mb-8">
        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
          Latest
        </span>
        <span className="text-gray-400">Version 2.5.0 - January 2024</span>
      </div>

      <div className="space-y-12">
        <div className="border-l-2 border-purple-500/50 pl-6">
          <h2 id="v2-5-0" className="text-2xl font-bold text-white mb-2 scroll-mt-24">v2.5.0</h2>
          <p className="text-sm text-gray-500 mb-4">Released January 15, 2024</p>
          
          <h3 id="new-features" className="text-lg font-semibold text-white mb-3 scroll-mt-24">New Features</h3>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Bulk verification API - verify up to 100 documents in a single request</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Advanced webhook filtering by event metadata</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Organization-level audit logs export</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Python SDK async/await support</span>
            </li>
          </ul>

          <h3 id="improvements" className="text-lg font-semibold text-white mb-3 scroll-mt-24">Improvements</h3>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>50% faster transaction confirmation on Solana mainnet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Reduced API latency for hash operations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Enhanced CLI progress indicators for batch operations</span>
            </li>
          </ul>
        </div>

        <div className="border-l-2 border-gray-700 pl-6">
          <h2 id="v2-4-0" className="text-2xl font-bold text-white mb-2 scroll-mt-24">v2.4.0</h2>
          <p className="text-sm text-gray-500 mb-4">Released December 1, 2023</p>
          
          <h3 id="new-features" className="text-lg font-semibold text-white mb-3 scroll-mt-24">New Features</h3>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Team management with RBAC permissions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>SSO/SAML integration for enterprise plans</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Custom webhook headers support</span>
            </li>
          </ul>
        </div>

        <div className="border-l-2 border-gray-700 pl-6">
          <h2 id="v2-3-0" className="text-2xl font-bold text-white mb-2 scroll-mt-24">v2.3.0</h2>
          <p className="text-sm text-gray-500 mb-4">Released October 15, 2023</p>
          
          <h3 id="new-features" className="text-lg font-semibold text-white mb-3 scroll-mt-24">New Features</h3>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Password-protected verification links</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>One-time use verification links</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>JavaScript SDK v2 with TypeScript support</span>
            </li>
          </ul>
        </div>

        <div className="border-l-2 border-gray-700 pl-6">
          <h2 id="v2-2-0" className="text-2xl font-bold text-white mb-2 scroll-mt-24">v2.2.0</h2>
          <p className="text-sm text-gray-500 mb-4">Released September 1, 2023</p>
          
          <h3 id="new-features" className="text-lg font-semibold text-white mb-3 scroll-mt-24">New Features</h3>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Anchor revocation with reason codes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Public verification API (no auth required)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">+</span>
              <span>Analytics dashboard with usage metrics</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 id="migration" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Migration Guides
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/docs/sdks/javascript" className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all">
          <h4 className="font-bold text-white text-sm mb-1">SDK v1 to v2</h4>
          <p className="text-xs text-gray-400">JavaScript SDK migration guide</p>
        </Link>
        <Link to="/docs/api" className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all">
          <h4 className="font-bold text-white text-sm mb-1">API v1 to v2</h4>
          <p className="text-xs text-gray-400">REST API breaking changes</p>
        </Link>
      </div>

      <h2 id="subscribe" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Stay Updated
      </h2>
      <p className="text-gray-300 mb-4">
        Subscribe to our release notifications:
      </p>
      <ul className="space-y-2 text-gray-400 text-sm">
        <li>• GitHub Releases: <a href="https://github.com/leaderofARS/vdr/releases" className="text-purple-400 hover:text-purple-300">github.com/leaderofARS/vdr/releases</a></li>
        <li>• Developer Newsletter: Subscribe in your dashboard</li>
        <li>• RSS Feed: <a href="https://sipheron.io/changelog.xml" className="text-purple-400 hover:text-purple-300">sipheron.io/changelog.xml</a></li>
      </ul>
    </div>
  );
};

export default ChangelogPage;
