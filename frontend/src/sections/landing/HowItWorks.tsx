import React, { useEffect, useRef, useState } from 'react';
import { Fingerprint, Link2, ShieldCheck } from 'lucide-react';

interface Step {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  body: string;
  codeSnippet: string;
}

const steps: Step[] = [
  {
    icon: Fingerprint,
    iconColor: 'text-sipheron-purple',
    title: 'Generate a Fingerprint',
    body: 'SHA-256 hashes your document into a unique 64-character string. Your file never leaves your device.',
    codeSnippet: 'sha256(contract.pdf) → a3f4b2c1...',
  },
  {
    icon: Link2,
    iconColor: 'text-sipheron-teal',
    title: 'Anchor to Solana',
    body: "Your document's fingerprint is written permanently to the Solana blockchain. Immutable. Timestamped. Forever.",
    codeSnippet: 'tx: 3xK9mPqR... · block: 284,847,291',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-sipheron-green',
    title: 'Verify Anywhere',
    body: 'Share a link. Anyone can verify your document is authentic without seeing its contents.',
    codeSnippet: '✓ AUTHENTIC · anchored 14 Jan 2025',
  },
];

// Animated arrow connector
const ArrowConnector: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return (
    <div className="hidden md:flex items-center justify-center w-24">
      <svg
        width="80"
        height="24"
        viewBox="0 0 80 24"
        fill="none"
        className="overflow-visible"
      >
        <path
          d="M0 12H75"
          stroke="url(#arrowGradient)"
          strokeWidth="2"
          strokeDasharray="6 4"
          className={`transition-all duration-1000 ${
            isVisible ? 'stroke-dashoffset-0' : ''
          }`}
          style={{
            strokeDasharray: '6 4',
            strokeDashoffset: isVisible ? 0 : 100,
            transition: 'stroke-dashoffset 1.5s ease-out',
          }}
        />
        <path
          d="M68 5L76 12L68 19"
          stroke="url(#arrowGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '1s' }}
        />
        <defs>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#4ECDC4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-0 w-[400px] h-[400px] -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(108,99,255,0.05) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-sipheron-text-primary mb-4">
            From Document to Blockchain in 3 Steps
          </h2>
          <p className="text-sipheron-text-secondary max-w-xl mx-auto">
            No blockchain expertise required. Works with any file type.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-0">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div
                className={`flex-1 max-w-sm mx-auto md:mx-0 text-center md:text-left transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sipheron-surface border border-white/[0.06] mb-6">
                  <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>

                {/* Step Number */}
                <div className="text-xs font-mono text-sipheron-text-muted mb-2">
                  Step {index + 1}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-sipheron-text-primary mb-3">
                  {step.title}
                </h3>

                {/* Body */}
                <p className="text-sm text-sipheron-text-secondary mb-4 leading-relaxed">
                  {step.body}
                </p>

                {/* Code Snippet */}
                <div className="inline-block px-4 py-2 rounded-lg bg-sipheron-base border border-white/[0.06] font-mono text-xs text-sipheron-teal">
                  {step.codeSnippet}
                </div>
              </div>

              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <ArrowConnector isVisible={isVisible} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Callout Box */}
        <div
          className={`mt-16 max-w-2xl mx-auto transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="p-6 rounded-xl bg-sipheron-purple/5 border border-sipheron-purple/20">
            <p className="text-sm text-sipheron-text-secondary italic text-center">
              &ldquo;The document itself never touches our servers.
              Only its mathematical fingerprint is stored on-chain.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
