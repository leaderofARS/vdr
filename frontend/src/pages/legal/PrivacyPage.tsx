/**
 * @file PrivacyPage.tsx
 * @description Privacy Policy page for SipHeron VDR
 * Ported from web/dashboard/src/app/legal/privacy/page.js
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sipheron-base text-sipheron-text-primary">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-sipheron-surface/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-sm text-sipheron-text-muted hover:text-sipheron-purple transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-sipheron-purple/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-sipheron-purple" />
            </div>
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-sipheron-text-muted">Last updated: January 2025</p>
        </div>

        <div className="prose prose-invert prose-sipheron max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">1. Overview</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              SipHeron VDR ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our blockchain 
              document verification platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-white mb-2">2.1 Personal Information</h3>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1 mb-4">
              <li>Name and email address</li>
              <li>Organization details</li>
              <li>Billing information (for paid plans)</li>
              <li>Account credentials</li>
            </ul>

            <h3 className="text-lg font-medium text-white mb-2">2.2 Document Hashes</h3>
            <p className="text-sipheron-text-secondary leading-relaxed">
              We store SHA-256 cryptographic hashes of your documents on the Solana blockchain. 
              <strong className="text-white"> We do not store the actual document content.</strong> 
              The hash is a one-way mathematical fingerprint that cannot be reversed to reveal the original document.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1">
              <li>To provide and maintain our services</li>
              <li>To process and verify document anchors</li>
              <li>To communicate with you about your account</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1 mt-2">
              <li>JWT authentication with HttpOnly cookies</li>
              <li>CSRF protection</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Encrypted database connections</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">5. Blockchain Data</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              Once document hashes are anchored to the Solana blockchain, they become permanent and immutable. 
              This is a fundamental feature of blockchain technology. While you can revoke verification status 
              (which we record), the original hash remains on-chain.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1 mt-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account (subject to blockchain immutability)</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">7. Contact Us</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@sipheron.com" className="text-sipheron-purple hover:text-sipheron-teal">
                privacy@sipheron.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
