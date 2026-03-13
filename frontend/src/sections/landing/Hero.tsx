import { useState, useEffect } from 'react';
import { Play, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountUp } from '@/components/shared';

// Terminal component with typewriter effect
const Terminal: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const commands = [
    { text: '$ npm install -g sipheron-vdr', type: 'command', delay: 50 },
    { text: '✓ Installed sipheron-vdr@0.9.6', type: 'success', delay: 30 },
    { text: '', type: 'empty', delay: 0 },
    { text: '$ sipheron-vdr link svdr_a3f4b2c1d8e9f0a1...', type: 'command', delay: 40 },
    { text: '✓ Linked to ARS Labs · Solana Devnet', type: 'success', delay: 30 },
    { text: '', type: 'empty', delay: 0 },
    { text: '$ sipheron-vdr stage contract.pdf', type: 'command', delay: 40 },
    { text: '✓ Staged: a3f4b2c1d8e9f0a1b2c3d4e5f6a7b8c9...', type: 'success', delay: 30 },
    { text: '', type: 'empty', delay: 0 },
    { text: '$ sipheron-vdr anchor', type: 'command', delay: 40 },
    { text: '⬡ Broadcasting to Solana...', type: 'output', delay: 30 },
    { text: '✓ Confirmed in 421ms · Tx: 3xK9mP...', type: 'success', delay: 30 },
    { text: '✓ Verify: https://app.sipheron.com/verify/a3f4...', type: 'success', delay: 30 },
  ];

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentLine >= commands.length) {
      const resetTimeout = setTimeout(() => {
        setCurrentLine(0);
        setDisplayText('');
        setIsTyping(true);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }

    const currentCommand = commands[currentLine];

    if (currentCommand.type === 'empty') {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, 200);
      return () => clearTimeout(timeout);
    }

    if (isTyping) {
      if (displayText.length < currentCommand.text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentCommand.text.slice(0, displayText.length + 1));
        }, currentCommand.delay);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + 1);
          setDisplayText('');
          setIsTyping(true);
        }, 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLine, displayText, isTyping]);

  const getLineClass = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-sipheron-teal';
      case 'success':
        return 'text-sipheron-green';
      case 'output':
        return 'text-sipheron-text-secondary';
      default:
        return 'text-sipheron-text-primary';
    }
  };

  return (
    <div className="terminal w-full max-w-3xl mx-auto overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-sipheron-red/80" />
          <div className="w-3 h-3 rounded-full bg-sipheron-gold/80" />
          <div className="w-3 h-3 rounded-full bg-sipheron-green/80" />
        </div>
        <span className="ml-4 text-xs text-sipheron-text-muted font-mono">
          bash — sipheron-vdr
        </span>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm min-h-[280px]">
        {commands.slice(0, currentLine).map((cmd, idx) => (
          <div key={idx} className={getLineClass(cmd.type)}>
            {cmd.text}
          </div>
        ))}
        {currentLine < commands.length && (
          <div className={getLineClass(commands[currentLine].type)}>
            {displayText}
            <span
              className={`inline-block w-2 h-4 bg-sipheron-purple ml-0.5 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Mockup Component
const DashboardMockup: React.FC = () => {
  return (
    <div className="perspective-tilt w-full max-w-6xl mx-auto mt-16">
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: '#0D0D1A',
          border: '1px solid rgba(108,99,255,0.2)',
          boxShadow: '0 40px 120px rgba(108,99,255,0.2), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Mock Dashboard Content */}
        <div className="p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-sipheron-purple/20" />
              <div className="w-32 h-4 rounded bg-white/5" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5" />
              <div className="w-8 h-8 rounded-full bg-white/5" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="w-8 h-8 rounded-lg bg-sipheron-purple/20 mb-3" />
                <div className="w-16 h-6 rounded bg-white/10 mb-2" />
                <div className="w-24 h-3 rounded bg-white/5" />
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] h-48">
              <div className="flex items-center justify-between mb-4">
                <div className="w-32 h-4 rounded bg-white/10" />
                <div className="w-20 h-3 rounded bg-white/5" />
              </div>
              {/* Fake Chart */}
              <div className="flex items-end gap-1 h-32">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-sipheron-purple/40 to-sipheron-purple/20"
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="w-64 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-24 h-4 rounded bg-white/10 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: [ '#00D97E', '#FFD93D', '#FF6B35', '#FF4757'][i],
                      }}
                    />
                    <div className="flex-1 h-3 rounded bg-white/5" />
                    <div className="w-8 h-3 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
            <div className="flex items-center gap-4 p-3 border-b border-white/[0.06] bg-white/[0.02]">
              {['Document', 'Hash', 'Status', 'Date'].map((col) => (
                <div key={col} className="flex-1 text-xs text-sipheron-text-muted">
                  {col}
                </div>
              ))}
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 border-b border-white/[0.04]"
              >
                <div className="flex-1 h-3 rounded bg-white/5" />
                <div className="flex-1 h-3 rounded bg-white/5" />
                <div className="flex-1">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: i === 0 ? 'rgba(0,217,126,0.1)' : 'rgba(255,217,61,0.1)',
                      color: i === 0 ? '#00D97E' : '#FFD93D',
                    }}
                  >
                    {i === 0 ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <div className="flex-1 h-3 rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #020208, transparent)',
          }}
        />
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  const stats = [
    { value: 12847, label: 'Documents Anchored', suffix: '' },
    { value: 284, label: 'Organizations', suffix: '' },
    { value: 99.9, label: 'Uptime', suffix: '%', decimals: 1 },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Purple radial gradient top-center */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.15) 0%, transparent 70%)',
          }}
        />
        {/* Teal radial gradient bottom-right */}
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(78,205,196,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-50" />
        {/* Floating orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full orb opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(108,99,255,0.4) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full orb orb-delay-2 opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(78,205,196,0.4) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-56 h-56 rounded-full orb orb-delay-3 opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)',
            filter: 'blur(35px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sipheron-purple/20 bg-sipheron-purple/10 mb-8">
          <span className="text-sipheron-purple">⬡</span>
          <span className="text-xs text-sipheron-text-secondary">
            Built on Solana · Devnet Live
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
          <span className="text-sipheron-text-primary block">Every Document</span>
          <span className="text-sipheron-text-primary block">Deserves a</span>
          <span className="gradient-text block">Permanent Proof</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-sipheron-text-secondary max-w-2xl mx-auto mb-8">
          Anchor any document&apos;s fingerprint to the Solana blockchain in seconds.
          Tamper-proof. Permanent. Verifiable by anyone, anywhere, forever.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link to="/dashboard" className="btn-primary flex items-center gap-2">
            Start Anchoring Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="btn-ghost flex items-center gap-2">
            <Play className="w-4 h-4" />
            View Live Demo
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12">
          {[
            'No credit card required',
            '100 free anchors/month',
            'Solana devnet live',
          ].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 text-xs text-sipheron-text-muted">
              <Check className="w-3.5 h-3.5 text-sipheron-green" />
              {badge}
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text-purple">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-xs text-sipheron-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Terminal */}
        <Terminal />

        {/* Dashboard Mockup */}
        <DashboardMockup />
      </div>
    </section>
  );
};

export default Hero;
