/**
 * @file PricingPage.tsx
 * @description Standalone pricing page for SipHeron VDR
 * Uses the Pricing section from LandingPage
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Navbar } from '@/sections/landing';

interface PricingPlan {
  name: string;
  price: {
    monthly: number;
    annually: number;
  };
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlighted?: boolean;
  badge?: string;
}

const plans: PricingPlan[] = [
  {
    name: 'FREE',
    price: { monthly: 0, annually: 0 },
    description: 'Perfect for individuals and small projects',
    features: [
      '100 anchors/month',
      '1 user',
      'Public verification page',
      'CLI + API access',
      '30-day audit log',
      'Community support',
    ],
    cta: 'Get Started Free',
    ctaLink: '/auth/register',
  },
  {
    name: 'BUSINESS',
    price: { monthly: 99, annually: 79 },
    description: 'For teams that need more power and control',
    features: [
      '10,000 anchors/month',
      '10 users',
      'White-label certificates',
      'Compliance exports (SOX, GDPR, ISO)',
      '1-year audit log',
      'Webhook delivery guarantee',
      'Custom verify subdomain',
      'Priority email support',
    ],
    cta: 'Start 14-day Trial',
    ctaLink: '/dashboard',
    highlighted: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'ENTERPRISE',
    price: { monthly: 0, annually: 0 },
    description: 'For organizations with advanced needs',
    features: [
      'Unlimited anchors',
      'Unlimited users',
      'Multi-org console',
      'SSO / SAML',
      'Dedicated Solana RPC',
      '7-year audit log retention',
      'SLA guarantee',
      'Dedicated Slack channel',
    ],
    cta: 'Contact Sales',
    ctaLink: '/dashboard',
  },
];

export const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-sipheron-base">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-sipheron-text-primary mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-sipheron-text-secondary max-w-xl mx-auto mb-8">
              Start free. Scale as you grow. No surprise fees.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-full bg-sipheron-surface border border-white/[0.06]">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !isAnnual
                    ? 'bg-sipheron-purple text-white'
                    : 'text-sipheron-text-secondary hover:text-sipheron-text-primary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  isAnnual
                    ? 'bg-sipheron-purple text-white'
                    : 'text-sipheron-text-secondary hover:text-sipheron-text-primary'
                }`}
              >
                Annual
                <span className="text-xs px-1.5 py-0.5 rounded bg-sipheron-green/20 text-sipheron-green">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`
                  relative rounded-2xl p-6
                  ${
                    plan.highlighted
                      ? 'bg-sipheron-surface border-2 border-sipheron-purple lg:scale-105 lg:-my-4 z-10'
                      : 'bg-sipheron-surface border border-white/[0.06]'
                  }
                  ${plan.name === 'ENTERPRISE' ? 'border-sipheron-gold/50' : ''}
                `}
                style={{
                  boxShadow: plan.highlighted
                    ? '0 0 40px rgba(108,99,255,0.2)'
                    : undefined,
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-sipheron-purple to-sipheron-teal text-white text-xs font-semibold">
                      <Sparkles className="w-3 h-3" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-sipheron-text-primary mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    {plan.price.monthly === 0 && plan.name === 'ENTERPRISE' ? (
                      <span className="text-3xl font-bold text-sipheron-text-primary">
                        Custom
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-sipheron-text-primary">
                          ${isAnnual ? plan.price.annually : plan.price.monthly}
                        </span>
                        <span className="text-sipheron-text-muted">/month</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-sipheron-text-secondary">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="w-4 h-4 text-sipheron-green flex-shrink-0 mt-0.5" />
                      <span className="text-sipheron-text-secondary">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={plan.ctaLink}
                  className={`
                    block w-full text-center py-3 px-4 rounded-xl font-semibold transition-all
                    ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-sipheron-purple to-sipheron-teal text-white hover:opacity-90'
                        : plan.name === 'ENTERPRISE'
                        ? 'bg-sipheron-gold/10 border border-sipheron-gold/30 text-sipheron-gold hover:bg-sipheron-gold/20'
                        : 'bg-white/[0.05] border border-white/[0.06] text-sipheron-text-primary hover:bg-white/[0.1]'
                    }
                  `}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="text-center">
            <p className="text-sipheron-text-muted text-sm mb-4">
              Need a custom solution? Contact our sales team.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sipheron-purple hover:text-sipheron-teal transition-colors"
            >
              Contact Sales
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-sipheron-purple" />
            <span className="text-sipheron-text-primary font-semibold">SipHeron VDR</span>
          </div>
          <p className="text-xs text-sipheron-text-muted">
            © 2025 SipHeron VDR. Built on Solana.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
