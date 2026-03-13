/**
 * @file ResetPasswordPage.tsx
 * @description Reset password page for SipHeron VDR
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import api from '@/utils/api';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get(`/auth/reset-password/validate/${token}`);
        setValidToken(true);
      } catch {
        setValidToken(false);
        setError('Invalid or expired reset token. Please request a new one.');
      } finally {
        setValidating(false);
      }
    };
    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 12) {
      setError('Password must be at least 12 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-sipheron-base flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sipheron-base text-sipheron-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-sipheron-surface border border-white/[0.06] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sipheron-purple to-transparent opacity-50" />

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Reset Password</h2>
            <p className="text-sm text-sipheron-text-muted">
              Create a new secure password for your account
            </p>
          </div>

          {error && (
            <div className="bg-sipheron-red/10 border border-sipheron-red/20 text-sipheron-red p-4 rounded-2xl text-sm flex items-start gap-3 mb-6 animate-fade-in">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
              <span className="font-bold tracking-tight">{error}</span>
            </div>
          )}

          {!validToken ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-sipheron-red/10 border border-sipheron-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-sipheron-red" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Invalid Token</h3>
              <p className="text-sm text-sipheron-text-muted mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Link to="/auth/forgot-password" className="text-sipheron-purple hover:text-sipheron-teal transition-colors text-sm font-bold uppercase tracking-widest">
                Request New Link
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-sipheron-green/10 border border-sipheron-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-sipheron-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Password Reset</h3>
              <p className="text-sm text-sipheron-text-muted mb-6">
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em] ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-sipheron-text-muted group-focus-within:text-sipheron-purple transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={12}
                    className="w-full pl-12 pr-12 py-3.5 bg-sipheron-base border border-white/[0.06] rounded-xl text-sm text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:outline-none focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                    placeholder="Min 12 characters"
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

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-sipheron-text-muted uppercase tracking-[0.2em] ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-sipheron-text-muted group-focus-within:text-sipheron-purple transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-sipheron-base border border-white/[0.06] rounded-xl text-sm text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:outline-none focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password.trim() || !confirmPassword.trim()}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-2xl bg-gradient-to-r from-sipheron-purple to-sipheron-teal text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {loading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
