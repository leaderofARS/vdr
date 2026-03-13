import React, { useState } from 'react';
import { Scale, DollarSign, GraduationCap, HeartPulse, Code, Building2, ArrowRight } from 'lucide-react';

interface UseCase {
  id: string;
  icon: React.ElementType;
  label: string;
  gradient: string;
  title: string;
  description: string;
  useCases: string[];
  certificateText: string;
}

const useCases: UseCase[] = [
  {
    id: 'legal',
    icon: Scale,
    label: 'Legal & Contracts',
    gradient: 'from-sipheron-purple to-violet-500',
    title: 'Legal Document Verification',
    description: 'Prove contract existence and integrity for disputes, audits, and regulatory compliance. Create immutable records of agreements without exposing sensitive terms.',
    useCases: [
      'Notarize contracts without third parties',
      'Prove document existence for litigation',
      'Timestamp intellectual property claims',
    ],
    certificateText: 'Contract Agreement · Verified 14 Jan 2025',
  },
  {
    id: 'finance',
    icon: DollarSign,
    label: 'Finance & Audit',
    gradient: 'from-emerald-500 to-teal-500',
    title: 'Financial Audit Trails',
    description: 'Create tamper-proof audit trails for financial documents. Satisfy regulatory requirements with blockchain-verified document integrity.',
    useCases: [
      'SOX compliance documentation',
      'Audit trail verification',
      'Financial statement integrity',
    ],
    certificateText: 'Audit Report · Verified 12 Jan 2025',
  },
  {
    id: 'education',
    icon: GraduationCap,
    label: 'Education & Credentials',
    gradient: 'from-blue-500 to-indigo-500',
    title: 'Academic Credentials',
    description: 'Issue verifiable degrees, certificates, and transcripts. Eliminate credential fraud with blockchain-anchored academic records.',
    useCases: [
      'Verifiable digital diplomas',
      'Transcript authentication',
      'Professional certification proofs',
    ],
    certificateText: 'Bachelor of Science · Verified 10 Jan 2025',
  },
  {
    id: 'healthcare',
    icon: HeartPulse,
    label: 'Healthcare Records',
    gradient: 'from-rose-500 to-pink-500',
    title: 'Medical Document Integrity',
    description: 'Ensure medical records remain unaltered. Create audit trails for patient data access and modifications while maintaining HIPAA compliance.',
    useCases: [
      'Medical record integrity',
      'Clinical trial documentation',
      'Patient consent verification',
    ],
    certificateText: 'Medical Record · Verified 08 Jan 2025',
  },
  {
    id: 'software',
    icon: Code,
    label: 'Software & IP',
    gradient: 'from-amber-500 to-orange-500',
    title: 'Software & IP Protection',
    description: 'Timestamp code releases, prove prior art, and protect intellectual property with blockchain anchors. Essential for open source and proprietary software.',
    useCases: [
      'Code release timestamps',
      'Prior art documentation',
      'License verification',
    ],
    certificateText: 'Source Code Release · Verified 05 Jan 2025',
  },
  {
    id: 'enterprise',
    icon: Building2,
    label: 'Enterprise Compliance',
    gradient: 'from-cyan-500 to-blue-500',
    title: 'Enterprise Compliance',
    description: 'Meet regulatory requirements across industries. Create defensible audit trails for GDPR, SOX, HIPAA, and other compliance frameworks.',
    useCases: [
      'GDPR data integrity proofs',
      'Policy version control',
      'Compliance documentation',
    ],
    certificateText: 'Compliance Report · Verified 03 Jan 2025',
  },
];

export const UseCases: React.FC = () => {
  const [activeTab, setActiveTab] = useState('legal');
  const activeUseCase = useCases.find((uc) => uc.id === activeTab) || useCases[0];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px]"
          style={{
            background: 'radial-gradient(circle, rgba(78,205,196,0.05) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-sipheron-text-primary mb-4">
            Trusted Across Industries
          </h2>
          <p className="text-sipheron-text-secondary max-w-xl mx-auto">
            From legal contracts to academic credentials, SipHeron VDR secures documents across every sector.
          </p>
        </div>

        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs - Left Column */}
          <div className="lg:w-1/3">
            <div className="space-y-1">
              {useCases.map((useCase) => {
                const Icon = useCase.icon;
                const isActive = activeTab === useCase.id;

                return (
                  <button
                    key={useCase.id}
                    onClick={() => setActiveTab(useCase.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                      transition-all duration-300 relative overflow-hidden
                      ${
                        isActive
                          ? 'bg-sipheron-elevated'
                          : 'hover:bg-white/[0.03]'
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    <div
                      className={`
                        absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6
                        bg-gradient-to-b ${useCase.gradient}
                        transition-all duration-300
                        ${isActive ? 'opacity-100' : 'opacity-0'}
                      `}
                    />

                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? 'text-sipheron-purple'
                          : 'text-sipheron-text-muted'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-sipheron-text-primary'
                          : 'text-sipheron-text-secondary'
                      }`}
                    >
                      {useCase.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Panel - Right Column */}
          <div className="lg:w-2/3">
            <div
              key={activeTab}
              className="glass rounded-2xl p-6 sm:p-8 animate-fade-in"
              style={{
                boxShadow: `0 0 40px ${activeUseCase.id === 'legal' ? 'rgba(108,99,255,0.1)' : 'rgba(78,205,196,0.1)'}`,
              }}
            >
              {/* Large Icon */}
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${activeUseCase.gradient} flex items-center justify-center mb-6`}
              >
                <activeUseCase.icon className="w-10 h-10 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-bold text-sipheron-text-primary mb-3">
                {activeUseCase.title}
              </h3>
              <p className="text-sipheron-text-secondary mb-6 leading-relaxed">
                {activeUseCase.description}
              </p>

              {/* Use Cases List */}
              <ul className="space-y-3 mb-8">
                {activeUseCase.useCases.map((useCase, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm text-sipheron-text-primary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sipheron-purple" />
                    {useCase}
                  </li>
                ))}
              </ul>

              {/* Certificate Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-sipheron-base border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sipheron-green/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-sipheron-green"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-sipheron-text-primary">
                      {activeUseCase.certificateText}
                    </div>
                    <div className="text-xs text-sipheron-text-muted">
                      Blockchain-verified certificate
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-sm text-sipheron-purple hover:text-sipheron-teal transition-colors">
                  See Template
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
