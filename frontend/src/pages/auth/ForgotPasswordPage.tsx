/**
 * @file ForgotPasswordPage.tsx
 * @description Forgot password page for SipHeron VDR
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '@/utils/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sipheron-base text-sipheron-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-sipheron-surface border border-white/[0.06] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sipheron-purple to-transparent opacity-50" />

          <Link to="/auth/login" className="inline-flex items-center text-sm text-sipheron-text-muted hover:text-sipheron-purple transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Recover Access</h2>
            <p className="text-sm text-sipheron-text-muted">
              Enter your email to receive a password reset link
            </p>
          </div>

          {error && (
            <div className="bg-sipheron-red/10 border border-sipheron-red/20 text-sipheron-red p-4 rounded-2xl text-sm flex items-start gap-3 mb-6 animate-fade-in">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
              <span className="font-bold tracking-tight">{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-sipheron-green/10 border border-sipheron-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-sipheron-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
              <p className="text-sm text-sipheron-text-muted mb-6">
                We've sent a password reset link to <span className="text-sipheron-purple">{email}</span>
              </p>
              <Link to="/auth/login" className="text-sipheron-purple hover:text-sipheron-teal transition-colors text-sm font-bold uppercase tracking-widest">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em] ml-1">
                  Email Address
                </label>
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

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-2xl bg-gradient-to-r from-sipheron-purple to-sipheron-teal text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
