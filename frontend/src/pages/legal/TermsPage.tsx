/**
 * @file TermsPage.tsx
 * @description Terms of Service page for SipHeron VDR
 * Ported from web/dashboard/src/app/legal/terms/page.js
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
              <FileText className="w-5 h-5 text-sipheron-purple" />
            </div>
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-sipheron-text-muted">Last updated: January 2025</p>
        </div>

        <div className="prose prose-invert prose-sipheron max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              By accessing or using SipHeron VDR ("the Service"), you agree to be bound by these Terms of Service. 
              If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              SipHeron VDR provides blockchain-based document verification services. We allow users to:
            </p>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1 mt-2">
              <li>Generate cryptographic hashes of documents</li>
              <li>Anchor these hashes to the Solana blockchain</li>
              <li>Verify document authenticity</li>
              <li>Manage organization verification workflows</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">3. Account Registration</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1 mt-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly notify us of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">4. Acceptable Use</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1 mt-2">
              <li>Anchor illegal or prohibited content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to reverse-engineer our systems</li>
              <li>Conduct fraudulent verification activities</li>
              <li>Exceed API rate limits or abuse the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">5. Blockchain Immutability</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              You understand and acknowledge that:
            </p>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1 mt-2">
              <li>Document hashes anchored to the blockchain cannot be deleted</li>
              <li>Blockchain transactions are irreversible</li>
              <li>Network fees (SOL) are non-refundable</li>
              <li>You are responsible for verifying document accuracy before anchoring</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">6. Payment Terms</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              For paid plans:
            </p>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1 mt-2">
              <li>Subscription fees are billed in advance</li>
              <li>Unused anchors do not roll over to the next billing period</li>
              <li>You may upgrade or downgrade your plan at any time</li>
              <li>Refunds are provided at our discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              SipHeron VDR is provided "as is" without warranties of any kind. We are not liable for:
            </p>
            <ul className="list-disc list-inside text-sipheron-text-secondary space-y-1 mt-2">
              <li>Blockchain network outages or congestion</li>
              <li>Loss of access to anchored documents</li>
              <li>Third-party integrations or services</li>
              <li>Indirect, incidental, or consequential damages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">8. Termination</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              We may terminate or suspend your account immediately for violations of these terms. 
              Upon termination, your right to use the Service will immediately cease, but anchored 
              document hashes will remain on the blockchain.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of material 
              changes via email or through the Service. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">10. Contact</h2>
            <p className="text-sipheron-text-secondary leading-relaxed">
              For questions about these Terms, contact us at{' '}
              <a href="mailto:legal@sipheron.com" className="text-sipheron-purple hover:text-sipheron-teal">
                legal@sipheron.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
