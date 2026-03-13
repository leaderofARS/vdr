import React from 'react';
import {
  Hexagon,
  Lock,
  Globe,
  Radio,
  Key,
  Users,
  BarChart3,
  FileCheck,
  Link2,
  Zap,
  Shield,
  Layers,
} from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: Hexagon,
    title: 'Solana Blockchain',
    description: 'Sub-second finality, $0.001 per anchor',
    iconColor: 'text-sipheron-purple',
  },
  {
    icon: Lock,
    title: 'SHA-256 Hashing',
    description: 'Industry standard, used by Bitcoin and TLS',
    iconColor: 'text-sipheron-teal',
  },
  {
    icon: Globe,
    title: 'Public Verification',
    description: 'Anyone can verify, no account needed',
    iconColor: 'text-sipheron-green',
  },
  {
    icon: Radio,
    title: 'Webhook Events',
    description: 'Real-time notifications to your systems',
    iconColor: 'text-sipheron-gold',
  },
  {
    icon: Key,
    title: 'API-First',
    description: 'REST API + CLI + SDK for full automation',
    iconColor: 'text-sipheron-purple',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Roles, permissions, invite workflows',
    iconColor: 'text-sipheron-teal',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Full audit trail and usage dashboard',
    iconColor: 'text-sipheron-green',
  },
  {
    icon: FileCheck,
    title: 'PDF Certificates',
    description: 'Downloadable notarization certificates',
    iconColor: 'text-sipheron-gold',
  },
  {
    icon: Link2,
    title: 'Embed Anywhere',
    description: 'Badges, buttons, iframes for your website',
    iconColor: 'text-sipheron-purple',
  },
  {
    icon: Zap,
    title: 'Bulk Operations',
    description: 'Anchor and verify up to 500 docs at once',
    iconColor: 'text-sipheron-teal',
  },
  {
    icon: Shield,
    title: 'Compliance Ready',
    description: 'SOX, GDPR, ISO 27001 export formats',
    iconColor: 'text-sipheron-green',
  },
  {
    icon: Layers,
    title: 'Multi-Chain Soon',
    description: 'Ethereum, Polygon, Sui on the roadmap',
    iconColor: 'text-sipheron-gold',
  },
];

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.05) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-sipheron-text-primary mb-4">
            Everything You Need for Document Trust
          </h2>
          <p className="text-sipheron-text-secondary max-w-xl mx-auto">
            A complete platform for anchoring, verifying, and managing document integrity.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="
                  group p-5 rounded-xl
                  bg-sipheron-surface border border-white/[0.06]
                  hover:bg-sipheron-elevated hover:border-sipheron-purple/30
                  transition-all duration-300
                  card-hover
                "
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Icon */}
                <div
                  className={`
                    w-10 h-10 rounded-lg mb-4
                    flex items-center justify-center
                    bg-white/[0.03] group-hover:bg-white/[0.06]
                    transition-colors duration-300
                  `}
                >
                  <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-sipheron-text-primary mb-1">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-sipheron-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
