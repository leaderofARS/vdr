"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ArrowRight,
  ExternalLink,
  Lock,
  Link as LinkIcon,
  Zap,
  ShieldCheck,
  Activity,
  Database,
  Key,
  Globe,
  Cpu,
  Check,
  Copy,
  Menu,
  X,
  FileText,
  Scale,
  GraduationCap,
  Building2,
  Terminal as TerminalIcon,
  ChevronRight,
  Plus
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';

// --- Constants & Config ---



const COLORS = {
  bg: '#0A0A0F',
  surface: '#111118',
  border: '#1E1E2E',
  primary: '#4F6EF7',
  secondary: '#9B5CF6',
  success: '#10B981',
  textPrimary: '#F8F8FF',
  textMuted: '#6B7280',
  gradient: 'linear-gradient(135deg, #4F6EF7, #9B5CF6)',
};

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: `bg-gradient-to-br from-[#4F6EF7] to-[#9B5CF6] text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(79,110,247,0.3)]`,
    secondary: `bg-white/[0.03] text-white border border-[#1E1E2E] hover:bg-white/[0.08] transition-all`,
    ghost: `bg-transparent text-[#F8F8FF] hover:text-white transition-all`,
    outline: `bg-transparent border border-[#4F6EF7] text-[#4F6EF7] hover:bg-[#4F6EF7]/10 transition-all`,
  };

  return (
    <button
      className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const SectionHeading = ({ eyebrow, title, description, center = true }) => (
  <div className={`mb-16 ${center ? 'text-center' : 'text-left'}`}>
    {eyebrow && (
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-[#4F6EF7] font-mono text-xs tracking-widest uppercase mb-4 block"
      >
        {eyebrow}
      </motion.span>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl font-bold tracking-tight text-[#F8F8FF] mb-6"
    >
      {title}
    </motion.h2>
    {description && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-[#6B7280] text-lg max-w-2xl mx-auto"
      >
        {description}
      </motion.p>
    )}
  </div>
);

const Terminal = () => {
  const [lines, setLines] = useState([]);
  const [activeLine, setActiveLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const terminalContent = [
    { type: 'cmd', text: 'sipheron-vdr stage contract.pdf' },
    { type: 'success', text: '✔ Hash computed: f9f5a703...6c4a' },
    { type: 'info', text: 'Privacy check: Raw file data never leaves your machine.' },
    { type: 'br', text: '' },
    { type: 'cmd', text: 'sipheron-vdr anchor' },
    { type: 'success', text: '✔ Successfully dispatched to blockchain!' },
    { type: 'info', text: 'Job ID: 13' },
    { type: 'br', text: '' },
    { type: 'cmd', text: 'sipheron-vdr verify contract.pdf' },
    { type: 'success', text: '✔ FILE IS AUTHENTIC' },
    { type: 'meta', text: 'Registered By: FxNzog...Xgi5' },
    { type: 'meta', text: 'Original Date: 8/3/2026' },
    { type: 'meta', text: 'Revoked: NO' },
  ];

  useEffect(() => {
    if (activeLine >= terminalContent.length) return;

    const currentLine = terminalContent[activeLine];
    if (currentLine.type === 'br' || currentLine.type === 'info' || currentLine.type === 'success' || currentLine.type === 'meta') {
      setTimeout(() => {
        setLines(prev => [...prev, currentLine]);
        setActiveLine(prev => prev + 1);
        setCharIndex(0);
      }, 500);
      return;
    }

    if (charIndex < currentLine.text.length) {
      const timeout = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setLines(prev => [...prev, currentLine]);
        setActiveLine(prev => prev + 1);
        setCharIndex(0);
      }, 600);
    }
  }, [activeLine, charIndex]);

  return (
    <div className="w-full max-w-2xl bg-[#0F0F15] border border-[#1E1E2E] rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
      <div className="flex items-center gap-1.5 px-4 py-3 bg-[#111118] border-b border-[#1E1E2E]">
        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        <span className="ml-2 text-[#6B7280] text-xs">zsh — SipHeron CLI</span>
      </div>
      <div className="p-6 min-h-[400px]">
        {lines.map((line, i) => (
          <div key={i} className="mb-1.5">
            {line.type === 'cmd' && (
              <div className="flex">
                <span className="text-[#4F6EF7] mr-2">$</span>
                <span className="text-[#F8F8FF]">{line.text}</span>
              </div>
            )}
            {line.type === 'success' && <div className="text-[#10B981]">{line.text}</div>}
            {line.type === 'info' && <div className="text-[#6B7280]">{line.text}</div>}
            {line.type === 'meta' && <div className="text-[#6B7280] ml-4">{line.text}</div>}
            {line.type === 'br' && <div className="h-2" />}
          </div>
        ))}
        {activeLine < terminalContent.length && terminalContent[activeLine].type === 'cmd' && (
          <div className="flex">
            <span className="text-[#4F6EF7] mr-2">$</span>
            <span className="text-[#F8F8FF]">
              {terminalContent[activeLine].text.substring(0, charIndex)}
              <span className="animate-pulse">|</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sections ---



const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#4F6EF7]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#9B5CF6]/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full text-[#10B981] text-xs font-bold uppercase tracking-wider mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              ⬡ Built on Solana Devnet
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-[#F8F8FF] leading-[1.1] mb-8"
            >
              Proof of Existence. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] animate-shimmer">On-Chain.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#6B7280] text-xl md:text-2xl max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-12"
            >
              SipHeron anchors the cryptographic fingerprint of your documents to the Solana blockchain — immutable, verifiable, and private. No file uploads. No trust required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Link href="https://app.sipheron.com">
                <Button className="px-8 py-4 text-lg">Start Anchoring Free <ArrowRight size={20} /></Button>
              </Link>
              <Link href="https://explorer.solana.com/address/6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo?cluster=devnet">
                <Button variant="ghost" className="px-8 py-4 text-lg">View on Explorer <ExternalLink size={20} /></Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-[#6B7280]"
            >
              <span className="flex items-center gap-2 px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-md">Trusted by developers</span>
              <span className="w-1 h-1 bg-[#1E1E2E] rounded-full" />
              <span className="flex items-center gap-2 px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-md">100% on-chain</span>
              <span className="w-1 h-1 bg-[#1E1E2E] rounded-full" />
              <span className="flex items-center gap-2 px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-md">0 files uploaded</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="flex-1 w-full max-w-2xl relative"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-[80px] -z-10 rounded-full" />
            <Terminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TrustBar = () => {
  const logos = [
    { name: 'Law Firms', icon: Scale },
    { name: 'Universities', icon: GraduationCap },
    { name: 'Enterprises', icon: Building2 },
    { name: 'Government', icon: Globe },
    { name: 'Healthcare', icon: Activity },
    { name: 'Finance', icon: Database }
  ];

  return (
    <section className="py-20 border-y border-[#1E1E2E] bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-[#6B7280] mb-10">Designed for</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map(logo => (
            <div key={logo.name} className="flex items-center gap-3 group">
              <logo.icon size={24} className="text-[#F8F8FF] group-hover:text-[#4F6EF7] transition-colors" />
              <span className="text-xl font-bold text-[#F8F8FF] group-hover:text-[#F8F8FF] transition-colors">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Hash Locally',
      desc: 'The SHA-256 fingerprint of your file is computed entirely on your machine. The file never leaves your device.',
      icon: Lock
    },
    {
      num: '02',
      title: 'Anchor On-Chain',
      desc: 'The hash is registered to a PDA on the Solana blockchain via our smart contract. Immutable. Timestamped. Permanent.',
      icon: LinkIcon
    },
    {
      num: '03',
      title: 'Verify Anywhere',
      desc: 'Anyone with the file can verify its authenticity using the CLI, API, or dashboard — in under a second.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="product" className="py-32 bg-[#0A0A0F] relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="How SipHeron Works" eyebrow="The Protocol" />

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[100px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#1E1E2E] to-transparent -z-10" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[#111118] border border-[#1E1E2E] flex items-center justify-center text-3xl font-bold text-[#F8F8FF] group-hover:border-[#4F6EF7]/50 group-hover:shadow-[0_0_20px_rgba(79,110,247,0.15)] transition-all">
                  <step.icon size={32} className="text-[#4F6EF7]" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#111118] border border-[#1E1E2E] flex items-center justify-center text-xs font-mono text-[#6B7280]">
                  {step.num}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#F8F8FF] mb-4">{step.title}</h3>
              <p className="text-[#6B7280] leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="p-8 bg-[#111118] border border-[#1E1E2E] rounded-2xl hover:border-[#4F6EF7]/30 hover:bg-[#151520] transition-all group"
  >
    <div className="w-12 h-12 rounded-xl bg-[#4F6EF7]/10 flex items-center justify-center text-[#4F6EF7] mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-[#F8F8FF] mb-3">{title}</h3>
    <p className="text-[#6B7280] leading-relaxed">{desc}</p>
  </motion.div>
);

const FeaturesGrid = () => {
  const features = [
    { icon: Lock, title: 'Zero File Upload', desc: 'Your documents never leave your machine. Only the hash is transmitted.' },
    { icon: Shield, title: 'Immutable Proof', desc: 'Once anchored, no one — not even SipHeron — can alter or delete your record.' },
    { icon: Zap, title: 'Sub-Second Verification', desc: 'Verify any document instantly via CLI, API, or dashboard.' },
    { icon: Building2, title: 'Enterprise Ready', desc: 'Organization accounts, multi-issuer support, API key management, and audit trails.' },
    { icon: Key, title: 'API First', desc: 'Full REST API with key-based auth. Integrate verification into any workflow.' },
    { icon: Globe, title: 'Open & Verifiable', desc: 'Every proof is publicly verifiable on Solana Explorer. No black boxes.' }
  ];

  return (
    <section className="py-32 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Enterprise-Grade Verifiability" eyebrow="Features" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => <FeatureCard key={i} {...f} delay={i * 0.05} />)}
        </div>
      </div>
    </section>
  );
};

const LiveDemo = () => {
  const [stats, setStats] = useState({ proofs: 0, orgs: 0, success: 0, compute: 0 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const frameRate = 1000 / 60;
      const totalFrames = duration / frameRate;

      let frame = 0;
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        setStats({
          proofs: Math.floor(progress * 13),
          orgs: Math.floor(progress * 1),
          success: Math.floor(progress * 100),
          compute: Math.floor(progress * 21049)
        });
        if (frame === totalFrames) {
          setStats({ proofs: 13, orgs: 1, success: 100, compute: 21049 });
          clearInterval(interval);
        }
      }, frameRate);
    }
  }, [isInView]);

  return (
    <section className="py-32 bg-[#0A0A0F]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          ref={ref}
          className="bg-[#111118] border border-[#1E1E2E] rounded-3xl p-10 md:p-16 relative overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4F6EF7]/10 blur-[100px] rounded-full" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full text-[#10B981] text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" /> devnet
                </div>
                <div className="text-[#6B7280] font-mono text-xs uppercase tracking-widest">Live Registry Monitor</div>
              </div>
              <h2 className="text-3xl font-bold text-[#F8F8FF] mb-2 font-mono">6ecW...zAwo</h2>
              <div className="flex items-center gap-2">
                <span className="text-[#6B7280] text-sm">Program ID</span>
                <button className="text-[#4F6EF7] hover:underline flex items-center gap-1 text-sm font-medium">Copy <Copy size={14} /></button>
              </div>
            </div>
            <Link href="https://explorer.solana.com/address/6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo?cluster=devnet">
              <Button variant="secondary" className="group">View on Solana Explorer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Proofs Anchored', value: stats.proofs },
              { label: 'Organization', value: stats.orgs },
              { label: 'Success Rate', value: `${stats.success}%` },
              { label: 'Avg Compute Units', value: stats.compute.toLocaleString() }
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-[#F8F8FF] mb-2">{stat.value}</div>
                <div className="text-[#6B7280] text-xs uppercase tracking-widest font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const UseCases = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 'legal',
      name: 'Legal',
      icon: Scale,
      headline: 'Secure Legal Document Provenance',
      bullets: [
        'Immutable timestamps for contract execution',
        'ZKP proofs for NDA and IP filing',
        'Court-admissible digital audit trails'
      ],
      mockup: {
        hash: '0x8f2a...c1d5',
        status: 'AUTHENTIC',
        date: 'Oct 24, 2025 14:32:01',
        signer: 'SipHeron Legal Seal'
      }
    },
    {
      id: 'academic',
      name: 'Academic',
      icon: GraduationCap,
      headline: 'Instant Credential Verification',
      bullets: [
        'Tamper-proof diploma and transcript logs',
        'Research paper provenance tracking',
        'Automated employer verification flows'
      ],
      mockup: {
        hash: '0x4e31...b7a2',
        status: 'VERIFIED',
        date: 'Jun 12, 2026 09:15:44',
        signer: 'Solana University'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building2,
      headline: 'Automated Compliance Reporting',
      bullets: [
        'SOC2 and ISO 27001 evidence chains',
        'Supply chain document integrity',
        'Multi-regional audit trail synchronization'
      ],
      mockup: {
        hash: '0x1b9c...f4e8',
        status: 'VALIDATED',
        date: 'Aug 03, 2026 11:22:15',
        signer: 'Acme Corp Org PDA'
      }
    }
  ];

  return (
    <section id="use-cases" className="py-32 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Tailored for Every Industry" eyebrow="Use Cases" />

        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-[#111118] border border-[#1E1E2E] rounded-xl">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === i ? 'bg-[#4F6EF7] text-white shadow-lg shadow-blue-500/20' : 'text-[#6B7280] hover:text-[#F8F8FF]'}`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-4xl font-bold text-[#F8F8FF] mb-6">{tabs[activeTab].headline}</h3>
            <div className="space-y-6">
              {tabs[activeTab].bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#4F6EF7]/10 flex items-center justify-center text-[#4F6EF7] shrink-0 mt-1">
                    <Check size={14} />
                  </div>
                  <p className="text-lg text-[#6B7280]">{bullet}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-12 group">Learn more about {tabs[activeTab].name} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Button>
          </motion.div>

          <motion.div
            key={`mockup-${activeTab}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8 border-b border-[#1E1E2E] pb-6">
              <div className="text-sm font-mono text-[#6B7280] uppercase tracking-widest">Verification Receipt</div>
              <ShieldCheck className="text-[#10B981]" />
            </div>
            <div className="space-y-6 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280] text-xs uppercase">Document Hash</span>
                <span className="text-[#F8F8FF] text-sm">{tabs[activeTab].mockup.hash}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280] text-xs uppercase">Status</span>
                <span className="px-2 py-0.5 bg-[#10B981]/10 border border-[#10B981]/20 rounded text-[#10B981] text-xs font-bold">{tabs[activeTab].mockup.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280] text-xs uppercase">Block Timestamp</span>
                <span className="text-[#F8F8FF] text-sm">{tabs[activeTab].mockup.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280] text-xs uppercase">Registered By</span>
                <span className="text-[#F8F8FF] text-sm">{tabs[activeTab].mockup.signer}</span>
              </div>
            </div>
            <div className="mt-10 p-4 bg-black/40 rounded-lg text-center">
              <p className="text-[#6B7280] text-xs italic">"This document is cryptographically anchored to Solana Slot #283,912,112"</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CLIQuickStart = () => {
  const [copied, setCopied] = useState(false);
  const code = `npm install -g sipheron-vdr

sipheron-vdr link
sipheron-vdr stage document.pdf
sipheron-vdr anchor
sipheron-vdr verify document.pdf`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-32 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#4F6EF7] font-mono text-xs tracking-widest uppercase mb-4 block">Developer Tools</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#F8F8FF] mb-8">Built for Your Workflow.</h2>
            <p className="text-[#6B7280] text-lg mb-10 leading-relaxed">
              Integrate SipHeron into your existing CI/CD pipelines and backend systems with our powerful CLI and REST API. Anchor files in single commands.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[#F8F8FF]">
                <div className="w-8 h-8 rounded-lg bg-[#4F6EF7]/10 flex items-center justify-center text-[#4F6EF7]"><TerminalIcon size={18} /></div>
                <span className="font-medium">Direct Terminal Integration</span>
              </div>
              <div className="flex items-center gap-4 text-[#F8F8FF]">
                <div className="w-8 h-8 rounded-lg bg-[#9B5CF6]/10 flex items-center justify-center text-[#9B5CF6]"><Cpu size={18} /></div>
                <span className="font-medium">Programmable API Keys</span>
              </div>
            </div>
            <Link href="https://app.sipheron.com/docs/cli">
              <Button variant="ghost" className="mt-10 group p-0 text-[#F8F8FF] hover:text-[#4F6EF7] bg-transparent">Full CLI docs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] opacity-30 blur-2xl rounded-[2rem] -z-10" />
            <div className="bg-[#0F0F15] border border-[#1E1E2E] rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E] bg-[#111118]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1E1E2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#1E1E2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#1E1E2E]" />
                </div>
                <button
                  onClick={copyToClipboard}
                  className="text-[#6B7280] hover:text-[#F8F8FF] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  {copied ? <Check size={14} className="text-[#10B981]" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-8 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-[#6B7280]">
                  <span className="text-[#F8F8FF]"># Install</span><br />
                  npm install -g sipheron-vdr<br /><br />
                  <span className="text-[#F8F8FF]"># Link your account</span><br />
                  sipheron-vdr link<br /><br />
                  <span className="text-[#F8F8FF]"># Anchor a document</span><br />
                  sipheron-vdr stage document.pdf<br />
                  sipheron-vdr anchor<br /><br />
                  <span className="text-[#F8F8FF]"># Verify authenticity</span><br />
                  sipheron-vdr verify document.pdf
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const tiers = [
    {
      name: 'Free',
      price: '0',
      desc: 'Perfect for exploring the protocol and simple anchoring.',
      features: ['10 anchors/month', '1 API key', 'Dashboard access', 'Public Explorer link'],
      button: 'Get Started',
      variant: 'secondary'
    },
    {
      name: 'Pro',
      price: '29',
      popular: true,
      desc: 'Ideal for professionals and growing businesses.',
      features: ['Unlimited anchors', '10 API keys', 'Priority support', 'Organization management', 'Custom PDF Receipts'],
      button: 'Go Pro',
      variant: 'primary'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'Dedicated infrastructure for institutional scale.',
      features: ['Unlimited API Keys', 'Custom SLA', 'Dedicated RPC Nodes', 'Audit reports', 'On-premise option'],
      button: 'Contact Us',
      variant: 'secondary'
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Simple, Predictable Pricing." eyebrow="Pricing" />

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative p-8 rounded-3xl border transition-all flex flex-col ${tier.popular ? 'bg-[#151520] border-[#4F6EF7] shadow-xl shadow-blue-500/10' : 'bg-[#111118] border-[#1E1E2E]'}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#4F6EF7] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#F8F8FF] mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#F8F8FF]">{tier.price === 'Custom' ? '' : '$'}{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="text-[#6B7280]">/mo</span>}
                </div>
                <p className="mt-4 text-[#6B7280] text-sm leading-relaxed">{tier.desc}</p>
              </div>
              <div className="flex-1 space-y-4 mb-10">
                {tier.features.map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm text-[#F8F8FF]">
                    <Check size={16} className="text-[#10B981]" />
                    {f}
                  </div>
                ))}
              </div>
              <Button variant={tier.variant} className="w-full">{tier.button}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-32 bg-[#0A0A0F] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F6EF7]/20 via-transparent to-[#9B5CF6]/20 opacity-50 -z-10" />
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-[#111118] border border-[#1E1E2E] p-12 md:p-20 rounded-[3rem] shadow-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#F8F8FF] mb-8">Start building trust <br />into your documents.</h2>
          <p className="text-[#6B7280] text-xl mb-12 max-w-2xl mx-auto">
            Join the developers and institutions anchoring document authenticity on Solana.
          </p>
          <div className="flex flex-col items-center gap-8">
            <Link href="https://app.sipheron.com">
              <Button className="px-12 py-5 text-xl">Get Started Free <ArrowRight size={24} /></Button>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-[#6B7280]">
              <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-md border border-white/5">No credit card required</span>
              <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-md border border-white/5">Devnet free forever</span>
              <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-md border border-white/5">Mainnet coming soon</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const columns = [
    {
      title: 'Product',
      links: [
        { name: 'Dashboard', href: 'https://app.sipheron.com' },
        { name: 'Docs', href: 'https://app.sipheron.com/docs' },
        { name: 'CLI', href: 'https://app.sipheron.com/docs/cli' },
        { name: 'API', href: 'https://app.sipheron.com/docs/api' },
        { name: 'Pricing', href: '/pricing' }
      ]
    },
    {
      title: 'Use Cases',
      links: [
        { name: 'Legal', href: '#use-cases' },
        { name: 'Academic', href: '#use-cases' },
        { name: 'Enterprise', href: '#use-cases' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'GitHub', href: 'https://github.com/leaderofARS/solana-vdr' },
        { name: 'Explorer', href: 'https://explorer.solana.com/address/6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo?cluster=devnet' },
        { name: 'Whitepaper', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: '/blog' },
        { name: 'Changelog', href: '/changelog' }
      ]
    }
  ];

  return (
    <footer className="pt-32 pb-12 bg-[#0A0A0F] border-t border-[#1E1E2E]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center p-1 border border-white/10 hover:border-[#4F6EF7]/50 transition-all">
                <img src="/sipheron_vdap_logo.png" alt="SipHeron" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#F8F8FF]">SIPHERON</span>
            </Link>
            <p className="text-[#6B7280] max-w-sm leading-relaxed mb-8">
              Securing the world's digital provenance on Solana's high-performance blockchain.
            </p>
            <div className="flex gap-4">
              {['Tw', 'Gh', 'In', 'Dc'].map(s => (
                <div key={s} className="w-10 h-10 rounded-full bg-[#111118] border border-[#1E1E2E] flex items-center justify-center text-[#6B7280] hover:text-[#F8F8FF] hover:border-[#F8F8FF] transition-all cursor-pointer font-bold text-xs uppercase">
                  {s}
                </div>
              ))}
            </div>
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-[#F8F8FF] font-bold text-sm mb-6 uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[#6B7280] hover:text-[#4F6EF7] transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-12 border-t border-[#1E1E2E] flex flex-col md:row items-center justify-between gap-6">
          <p className="text-[#6B7280] text-sm">© 2026 SipHeron. Built on Solana.</p>
          <div className="flex gap-8 text-sm text-[#6B7280]">
            <span className="hover:text-[#F8F8FF] cursor-pointer">Security Audit</span>
            <span className="hover:text-[#F8F8FF] cursor-pointer">Status</span>
            <span className="hover:text-[#F8F8FF] cursor-pointer cursor-not-allowed opacity-50">v0.9-beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF] selection:bg-[#4F6EF7]/30 selection:text-white overflow-hidden">
      <LandingNavbar />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <FeaturesGrid />
        <LiveDemo />
        <UseCases />
        <CLIQuickStart />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />

      {/* Global Gradient Overlays */}
      <div className="fixed top-0 left-0 w-full h-[100vh] bg-[radial-gradient(circle_at_20%_20%,_#4F6EF711_0%,_transparent_50%)] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-full h-[100vh] bg-[radial-gradient(circle_at_80%_80%,_#9B5CF611_0%,_transparent_50%)] pointer-events-none -z-10" />

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 6s linear infinite;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
