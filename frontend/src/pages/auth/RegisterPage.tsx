/**
 * @file RegisterPage.tsx
 * @description Registration page for SipHeron VDR
 * Ported from web/dashboard/src/app/auth/register/page.js
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, User, Eye, EyeOff, Terminal, CheckCircle2, Copy, Check, AlertCircle, ChevronRight, Target, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const steps = ['Install', 'Link', 'Anchor', 'Verify'];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Active animated step
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Password strength logic
  const getPasswordStrength = (pwd: string) => {
    if (!pwd || pwd.length < 12) return { score: 1, label: "Weak", color: "bg-sipheron-red", text: "text-sipheron-red" };

    let hasUpperCase = /[A-Z]/.test(pwd);
    let hasNumber = /\d/.test(pwd);
    let hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    if (hasUpperCase && hasNumber && hasSpecial) return { score: 4, label: "Very Strong", color: "bg-sipheron-purple", text: "text-sipheron-purple" };
    if (hasUpperCase && hasNumber) return { score: 3, label: "Strong", color: "bg-sipheron-green", text: "text-sipheron-green" };
    return { score: 2, label: "Fair", color: "bg-sipheron-gold", text: "text-sipheron-gold" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShake(false);

    if (password !== confirmPassword) {
      setError('Cryptographic secrets do not match');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the protocol governance terms');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, orgName);
      setIsSuccess(true);
    } catch (err) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Initialization failed. Please verify parameters.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install -g sipheron-vdr');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-sipheron-base text-sipheron-text-primary flex font-sans overflow-hidden">
      {/* Left Column (Desktop Only) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] lg:w-[50%] xl:w-[55%] p-12 lg:p-16 relative z-10 border-r border-white/[0.06]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div 
          className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
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
              Start anchoring documents <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sipheron-purple to-sipheron-teal">
                in minutes.
              </span>
            </h1>

            {/* Feature Highlights */}
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-4 text-sm font-bold text-sipheron-text-secondary uppercase tracking-widest bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-sipheron-green/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-sipheron-green" />
                </div>
                Fundamental Tier Free on Devnet
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-sipheron-text-secondary uppercase tracking-widest bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.06]">
                <div className="w-8 h-8 group-hover:scale-110 transition-all duration-300">
                  <img src="/sipheron_vdap_logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                No Settlement Method Required
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-sipheron-text-secondary uppercase tracking-widest bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-sipheron-teal/10 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-sipheron-teal" />
                </div>
                Command Interface Ready in 2 Minutes
              </div>
            </div>
          </div>

          {/* Animated Step Counter */}
          <div className="mt-16 max-w-lg">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/[0.06] -z-10" />
              {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center gap-3 bg-sipheron-base">
                  <div
                    className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                      activeStep === idx 
                        ? 'bg-sipheron-purple border-sipheron-purple shadow-[0_0_15px_rgba(108,99,255,0.4)] scale-110' 
                        : 'bg-sipheron-surface border-white/[0.06]'
                    }`}
                  >
                    <span className={`text-sm font-bold ${activeStep === idx ? 'text-white' : 'text-sipheron-text-muted'}`}>
                      {idx + 1}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 ${
                    activeStep === idx ? 'text-sipheron-purple' : 'text-sipheron-text-muted'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8">
          <Link to="/auth/login" className="inline-flex items-center text-sipheron-text-muted hover:text-white font-bold text-sm tracking-widest uppercase transition-colors group">
            Return to Authentication <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Right Column - Form Area */}
      <div className="w-full lg:w-[55%] xl:w-[45%] flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-sipheron-base">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-sipheron-purple/10 blur-[100px] rounded-full" />

        <div className="w-full max-w-[440px] relative z-10 py-10">
          {!isSuccess ? (
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
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Provision Identity</h2>
                <p className="text-sm text-sipheron-text-muted">Initialize your cryptographic foundation</p>
              </div>

              {error && (
                <div className="bg-sipheron-red/10 border border-sipheron-red/20 text-sipheron-red p-4 rounded-2xl text-sm flex items-start gap-3 overflow-hidden shadow-inner mb-6 animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
                  <span className="font-bold tracking-tight">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em] ml-1">Administrator Alias</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-sipheron-text-muted group-focus-within:text-sipheron-purple transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-sipheron-base border border-white/[0.06] rounded-xl text-sm text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:outline-none focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                      placeholder="Satoshi Nakamoto"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em] ml-1">Transmission Email</label>
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

                {/* Organization Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 ml-1">
                    <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em]">Institutional Designation</label>
                    <div className="group/tooltip relative flex items-center">
                      <Target className="w-3.5 h-3.5 text-sipheron-text-muted cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-sipheron-surface border border-sipheron-purple/30 text-[10px] font-bold uppercase tracking-widest text-sipheron-purple rounded-xl shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all text-center">
                        Cryptographic Registry Index
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-sipheron-text-muted group-focus-within:text-sipheron-purple transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-sipheron-base border border-white/[0.06] rounded-xl text-sm text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:outline-none focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                      placeholder="Cipher Dynamics LLC"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em] ml-1">Secret Key Generation</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-sipheron-text-muted group-focus-within:text-sipheron-purple transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-sipheron-base border border-white/[0.06] rounded-xl text-sm text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:outline-none focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                      placeholder="Min 12 Character Entropy"
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

                  {/* Strength Indicator */}
                  {password.length > 0 && (
                    <div className="pt-2 px-1 animate-fade-in">
                      <div className="flex gap-1.5 mb-2">
                        {[1, 2, 3, 4].map((level) => (
                          <div key={level} className="h-1 flex-1 rounded-full bg-black/60 overflow-hidden shadow-inner">
                            <div
                              className={`h-full ${strength.color} transition-all duration-300`}
                              style={{ width: strength.score >= level ? '100%' : '0%' }}
                            />
                          </div>
                        ))}
                      </div>
                      <p className={`text-[9px] font-bold uppercase tracking-[0.2em] text-right ${strength.text}`}>
                        Entropy Level: {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em] ml-1">Verify Secret Key</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ShieldCheck className="h-5 w-5 text-sipheron-text-muted group-focus-within:text-sipheron-purple transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-sipheron-base border border-white/[0.06] rounded-xl text-sm text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:outline-none focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                      placeholder="Confirm Entropy"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="pt-3 flex items-start gap-3">
                  <div className="relative flex items-center pt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div 
                      className="w-5 h-5 border-2 border-white/[0.1] rounded-lg bg-black/40 peer-checked:bg-sipheron-purple peer-checked:border-sipheron-purple transition-all flex items-center justify-center cursor-pointer shadow-inner peer-checked:shadow-[0_0_10px_rgba(108,99,255,0.4)]"
                      onClick={() => setAgreeTerms(!agreeTerms)}
                    >
                      <Check className={`w-3.5 h-3.5 text-white ${agreeTerms ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} transition-all`} />
                    </div>
                  </div>
                  <label htmlFor="terms" className="text-[11px] font-bold text-sipheron-text-muted cursor-pointer leading-tight uppercase tracking-tight mt-0.5">
                    I acknowledge the <Link to="/legal/terms" className="text-sipheron-purple hover:text-white transition-colors">Governance Protocol</Link> and <Link to="/legal/privacy" className="text-sipheron-purple hover:text-white transition-colors">Data Ethics</Link> mandates
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-2xl bg-gradient-to-r from-sipheron-purple to-sipheron-teal text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {loading ? 'INITIALIZING...' : 'INITIALIZE DATOSPHERE'}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center lg:hidden relative z-10">
                <Link to="/auth/login" className="inline-block text-[11px] font-bold text-sipheron-text-muted hover:text-sipheron-purple uppercase tracking-[0.2em] border border-white/[0.06] px-6 py-3 rounded-full bg-sipheron-surface/50 backdrop-blur-md shadow-lg transition-all">
                  RESTORE SESSION
                </Link>
              </div>
            </div>
          ) : (
            // SUCCESS SCREEN
            <div className="bg-sipheron-surface border border-white/[0.06] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sipheron-green via-sipheron-purple to-sipheron-green opacity-50" />

              <div className="w-24 h-24 bg-sipheron-green/10 border border-sipheron-green/20 text-sipheron-green rounded-3xl flex items-center justify-center mx-auto mb-8 relative shadow-[0_0_30px_rgba(0,217,126,0.2)]">
                <div className="absolute inset-0 bg-sipheron-green/20 animate-ping rounded-3xl" style={{ animationDuration: '3s' }} />
                <CheckCircle2 className="w-12 h-12 relative z-10" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Identity Provisioned</h2>
              <p className="text-sm text-sipheron-text-muted mb-8 leading-relaxed">
                Strategic clearance granted for <span className="text-sipheron-purple font-bold">{name || orgName || 'Operator'}</span>. The ledger is prepared.
              </p>

              <div className="bg-black/60 border border-white/[0.06] rounded-2xl p-6 text-left mb-10 relative group shadow-inner">
                <p className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-sipheron-purple" /> Execute Environment Setup:
                </p>
                <div className="flex items-center justify-between bg-sipheron-surface p-3.5 rounded-xl border border-white/[0.06] group-hover:border-sipheron-purple/30 transition-colors">
                  <code className="text-sipheron-purple text-sm font-mono tracking-tight">npm install -g sipheron-vdr</code>
                  <button
                    onClick={handleCopy}
                    className="text-sipheron-text-muted hover:text-white transition-colors p-2 bg-sipheron-purple/10 rounded-lg"
                    title="Copy command"
                  >
                    {copied ? <Check className="w-4 h-4 text-sipheron-green" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-sipheron-purple to-sipheron-teal text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                ENTER DASHBOARD PROTOCOL
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
