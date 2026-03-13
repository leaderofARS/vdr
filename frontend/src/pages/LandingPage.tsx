import React from 'react';
import {
  Navbar,
  Hero,
  HowItWorks,
  UseCases,
  LiveTerminalDemo,
  FeaturesGrid,
  Pricing,
  SocialProof,
  CTABanner,
  Footer,
} from '@/sections/landing';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sipheron-base">
      <Navbar />
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
      <Footer />
    </div>
  );
};

export default LandingPage;
