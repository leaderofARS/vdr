import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CTABanner: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #0a0a1a 50%, #033345 100%)',
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full orb opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(108,99,255,0.5) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full orb orb-delay-2 opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(78,205,196,0.5) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full orb orb-delay-3 opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Grid Lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(108,99,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(108,99,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sipheron-text-primary mb-6">
          Start Anchoring Documents Today
        </h2>

        {/* Subtext */}
        <p className="text-lg text-sipheron-text-secondary mb-10 max-w-xl mx-auto">
          Join 284 organizations that trust SipHeron VDR for document integrity
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="
              px-8 py-3 rounded-xl
              bg-white text-sipheron-base
              font-semibold
              hover:bg-sipheron-text-primary
              transition-all duration-300
              flex items-center gap-2
            "
          >
            Get Started Free
          </Link>
          <Link
            to="/dashboard"
            className="
              px-8 py-3 rounded-xl
              border border-white/20 text-white
              font-semibold
              hover:bg-white/5 hover:border-white/40
              transition-all duration-300
              flex items-center gap-2
            "
          >
            Read the Docs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
