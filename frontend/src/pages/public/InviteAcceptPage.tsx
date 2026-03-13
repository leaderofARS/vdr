/**
 * @file InviteAcceptPage.tsx
 * @description Invite acceptance page for SipHeron VDR
 * Ported from web/dashboard/src/app/invite/accept/[token]/page.js
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2, Users } from 'lucide-react';
import api from '@/utils/api';

export const InviteAcceptPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<{ organizationName: string; email: string } | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const validateInvite = async () => {
      try {
        const { data } = await api.get(`/api/invites/validate/${token}`);
        setInviteData(data);
      } catch (err) {
        setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Invalid or expired invitation');
      } finally {
        setLoading(false);
      }
    };
    validateInvite();
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await api.post(`/api/invites/accept/${token}`);
      setAccepted(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sipheron-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sipheron-purple animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sipheron-base flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-sipheron-red/10 border border-sipheron-red/20 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-sipheron-red" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Invitation Error</h2>
        <p className="text-sipheron-text-muted text-center max-w-md mb-6">{error}</p>
        <Link to="/" className="text-sipheron-purple hover:text-sipheron-teal transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-sipheron-base flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-sipheron-green/10 border border-sipheron-green/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-sipheron-green" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Aboard!</h2>
        <p className="text-sipheron-text-muted text-center max-w-md mb-2">
          You've successfully joined <span className="text-sipheron-purple font-medium">{inviteData?.organizationName}</span>
        </p>
        <p className="text-sipheron-text-muted text-sm">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sipheron-base flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-sipheron-surface border border-white/[0.06] rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-sipheron-purple/10 border border-sipheron-purple/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-sipheron-purple" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Team Invitation</h2>
          <p className="text-sipheron-text-muted text-sm">
            You've been invited to join
          </p>
          <p className="text-sipheron-purple font-bold text-lg mt-1">{inviteData?.organizationName}</p>
        </div>

        <div className="bg-sipheron-base rounded-xl p-4 mb-6 border border-white/[0.06]">
          <p className="text-[10px] text-sipheron-text-muted uppercase tracking-widest mb-1">Email</p>
          <p className="text-sm text-white">{inviteData?.email}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full py-3 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-sipheron-purple to-sipheron-teal text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            {accepting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {accepting ? 'ACCEPTING...' : 'ACCEPT INVITATION'}
          </button>
          <Link
            to="/"
            className="block w-full py-3 text-sm font-bold text-sipheron-text-muted text-center hover:text-white transition-colors"
          >
            Decline
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InviteAcceptPage;
