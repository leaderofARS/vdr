import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CountUp } from '@/components/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Testimonial {
  quote: string;
  initials: string;
  name: string;
  title: string;
  company: string;
  industry: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "SipHeron VDR has transformed how we handle contract verification. The blockchain anchoring gives our clients absolute confidence in document integrity.",
    initials: 'SK',
    name: 'Sarah Kim',
    title: 'General Counsel',
    company: 'Vertex Legal',
    industry: 'Legal',
  },
  {
    quote: "We needed a solution that satisfied SOX requirements without complex infrastructure. SipHeron delivered exactly that, with an API our developers love.",
    initials: 'MR',
    name: 'Michael Rodriguez',
    title: 'CTO',
    company: 'FinFlow Systems',
    industry: 'Fintech',
  },
  {
    quote: "The speed is incredible. Sub-second confirmation on Solana means our academic credential verification is instant and costs virtually nothing.",
    initials: 'JL',
    name: 'Dr. Jennifer Liu',
    title: 'Registrar',
    company: 'Pacific University',
    industry: 'Education',
  },
];

export const SocialProof: React.FC = () => {
  const [liveStats, setLiveStats] = useState([
    { key: 'totalHashes', value: 12847, label: 'Documents Anchored', suffix: '' },
    { key: 'totalOrganizations', value: 284, label: 'Organizations', suffix: '' },
    { key: 'avgConfirmationMs', value: 421, label: 'Average Confirmation Time', suffix: 'ms' },
    { key: 'cost', value: 0.001, label: 'Average Cost Per Anchor', suffix: '', prefix: '$' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/stats`);
        const data = res.data;
        setLiveStats(prev => prev.map(stat => {
          if (data[stat.key] !== undefined) {
            return { ...stat, value: data[stat.key] };
          }
          return stat;
        }));
      } catch (err) {
        console.error('Failed to fetch live stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(78,205,196,0.05) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-sipheron-text-primary mb-4">
            Trusted by Teams That Can&apos;t Afford to Get It Wrong
          </h2>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {liveStats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-sipheron-surface border border-white/[0.06]"
            >
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">
                <CountUp
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.value < 1 ? 3 : 0}
                />
              </div>
              <div className="text-xs text-sipheron-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="
                p-6 rounded-xl
                bg-sipheron-surface/50 border border-white/[0.06]
                backdrop-blur-sm
                hover:bg-sipheron-surface hover:border-sipheron-purple/20
                transition-all duration-300
              "
              style={{
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
              }}
            >
              <p className="text-sm text-sipheron-text-secondary leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{
                    background: `linear-gradient(135deg, hsl(${240 + index * 30}, 70%, 60%), hsl(${240 + index * 30}, 70%, 40%))`,
                    color: 'white',
                  }}
                >
                  {testimonial.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-sipheron-text-primary truncate">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-sipheron-text-muted truncate">
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-sipheron-text-muted">
                  {testimonial.industry}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
