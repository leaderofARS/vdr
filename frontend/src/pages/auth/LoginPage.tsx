/**
 * @file LoginPage.tsx
 * @description Login page for SipHeron VDR
 * Ported from web/dashboard/src/app/auth/login/page.js
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, ShieldCheck, Database, Zap, Github, Terminal, ChevronRight, AlertTriangle, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const terminalLines = [
  "> sipheron-vdr login",
  "Authenticating...",
  "Success: Credentials verified.",
  "> sipheron-vdr anchor ./document.pdf",
  "Calculating SHA-256 hash...",
  "Hash: 8f434346648f6b96df89dda901c5176b...",
  "Anchoring to Solana Devnet...",
  "Success: Transaction confirmed.",
  "Receipt: https://explorer.solana.com/tx/..."
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [terminalLine, setTerminalLine] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Terminal animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalLine((prev) => (prev + 1) % terminalLines.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShake(false);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Authentication failed. Please check your credentials.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-sipheron-base text-sipheron-text-primary flex font-sans overflow-hidden">
      {/* GitHub Toast */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-sipheron-surface/90 backdrop-blur-md border border-sipheron-purple/30 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <Zap className="w-4 h-4 text-sipheron-purple" />
          <span className="text-sm font-medium text-white">GitHub integration coming soon.</span>
        </div>
      )}

      {/* Left Column (Desktop Only) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] lg:w-[50%] xl:w-[55%] p-12 lg:p-16 relative z-10 border-r border-white/[0.06]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)' }}
        />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-16 group">
            <div className="w-10 h-10 group-hover:scale-110 transition-transform duration-300">
              <img
                src="/sipheron_vdap_logo.png"
                alt="SipHeron Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(155,110,255,0.3)]"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SipHeron</span>
          </Link>
          <div className="mt-24 max-w-xl">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              The trust layer<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sipheron-purple to-sipheron-teal">
                for your documents.
              </span>
            </h1>
            <p className="mt-6 text-xl text-sipheron-text-secondary leading-relaxed font-light">
              Anchor document authenticity on Solana. <strong className="text-white font-medium">Immutable. Instant. Verifiable.</strong>
            </p>
          </div>

          {/* Animated Terminal */}
          <div className="mt-12 bg-black/60 backdrop-blur-md border border-white/[0.06] rounded-xl overflow-hidden shadow-2xl max-w-lg">
            <div className="bg-sipheron-elevated px-4 py-2 border-b border-white/[0.06] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sipheron-red/80" />
              <div className="w-3 h-3 rounded-full bg-sipheron-gold/80" />
              <div className="w-3 h-3 rounded-full bg-sipheron-green/80" />
              <span className="ml-2 text-xs text-sipheron-text-muted font-mono tracking-widest uppercase">Terminal — sipheron-cli</span>
            </div>
            <div className="p-5 font-mono text-sm h-[200px] overflow-hidden flex flex-col justify-end relative">
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none h-10" />
              <div className="space-y-2 relative z-0">
                {terminalLines.slice(0, terminalLine + 1).map((line, i) => (
                  <div
                    key={i}
                    className={line.startsWith('>') ? 'text-sipheron-teal' : line.startsWith('Success') ? 'text-sipheron-green' : 'text-sipheron-text-secondary'}
                  >
                    {line}
                  </div>
                ))}
                <div className="w-2 h-4 bg-sipheron-purple animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm text-sipheron-text-secondary font-medium bg-white/[0.02] px-4 py-2 rounded-xl border border-white/[0.06]">
              <Database className="w-4 h-4 text-sipheron-purple" />
              100% On-Chain
            </div>
            <div className="flex items-center gap-2 text-sm text-sipheron-text-secondary font-medium bg-white/[0.02] px-4 py-2 rounded-xl border border-white/[0.06]">
              <ShieldCheck className="w-4 h-4 text-sipheron-purple" />
              Zero File Upload
            </div>
            <div className="flex items-center gap-2 text-sm text-sipheron-text-secondary font-medium bg-white/[0.02] px-4 py-2 rounded-xl border border-white/[0.06]">
              <Terminal className="w-4 h-4 text-sipheron-purple" />
              Solana Devnet
            </div>
          </div>
          <Link to="/auth/register" className="inline-flex items-center text-sipheron-purple hover:text-white text-sm font-bold tracking-widest uppercase transition-colors group">
            Provision new profile <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Right Column - Form Area */}
      <div className="w-full lg:w-[55%] xl:w-[45%] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-sipheron-base">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-sipheron-purple/10 blur-[100px] rounded-full" />

        <div className="w-full max-w-[420px] relative z-10">
          {/* Form Card */}
          <div 
            className={`bg-sipheron-surface border border-white/[0.06] rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-transform ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sipheron-purple to-transparent opacity-50" />

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <img src="/sipheron_vdap_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold text-white tracking-tight">SipHeron</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Access Control</h2>
              <p className="text-sm text-sipheron-text-muted">Authenticate institutional credentials</p>
            </div>

            {error && (
              <div className="bg-sipheron-red/10 border border-sipheron-red/20 text-sipheron-red p-4 rounded-2xl text-sm flex items-start gap-3 overflow-hidden shadow-inner mb-6 animate-fade-in">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
                <span className="font-bold tracking-tight">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em] ml-1">Email Identity</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-sipheron-text-muted group-focus-within:text-sipheron-purple transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-sipheron-base border border-white/[0.06] rounded-xl text-sm text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:outline-none focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                    placeholder="admin@institution.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em]">Secret Key</label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-[10px] font-bold text-sipheron-text-muted hover:text-sipheron-purple transition-colors uppercase tracking-widest"
                  >
                    RECOVER ACCESS
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-sipheron-text-muted group-focus-within:text-sipheron-purple transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-sipheron-base border border-white/[0.06] rounded-xl text-sm text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:outline-none focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-sipheron-text-muted hover:text-white transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-2xl bg-gradient-to-r from-sipheron-purple to-sipheron-teal text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  {loading ? 'AUTHENTICATING...' : 'AUTHORIZE SESSION'}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold bg-sipheron-surface text-sipheron-text-muted relative z-10 w-fit">External Provider</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGithubClick}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-white/[0.06] rounded-xl shadow-inner bg-black/20 hover:bg-black/40 text-sm font-bold text-sipheron-text-secondary hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-sipheron-purple/50 group"
                >
                  <Github className="w-5 h-5 text-sipheron-text-muted group-hover:text-white transition-colors" />
                  Sign In with GitHub
                </button>
              </div>
            </div>
          </div>

          {/* Footer link for mobile/desktop right side */}
          <div className="mt-10 text-center lg:hidden relative z-10">
            <Link to="/auth/register" className="inline-block text-[11px] font-bold text-sipheron-text-muted hover:text-sipheron-purple uppercase tracking-[0.2em] border border-white/[0.06] px-6 py-3 rounded-full bg-sipheron-surface/50 backdrop-blur-md shadow-lg transition-all">
              PROVISION NEW PROFILE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
