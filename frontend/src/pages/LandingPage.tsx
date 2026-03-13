import React from 'react';
import {
  Hero,
  HowItWorks,
  UseCases,
  LiveTerminalDemo,
  FeaturesGrid,
  Pricing,
  SocialProof,
  CTABanner,
} from '@/sections/landing';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sipheron-base">
      <main>
        <Hero />
        <HowItWorks />
        <UseCases />
        <LiveTerminalDemo />
        <FeaturesGrid />
        <Pricing />
        <SocialProof />
        <CTABanner />
      </main>
    </div>
  );
};

export default LandingPage;
