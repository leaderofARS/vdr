'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.sipheron.com';

export default function AcceptInvitePage() {
    const { token } = useParams();
    const router = useRouter();

    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE}/api/members/accept/${token}`)
            .then(r => r.json())
            .then(data => {
                if (data.valid) setInvite(data.invite);
                else setError(data.error || 'Invalid invitation');
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load invitation');
                setLoading(false);
            });
    }, [token]);

    const handleAccept = async () => {
        setAccepting(true);
        try {
            const res = await fetch(`${API_BASE}/api/members/accept/${token}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/dashboard'), 2000);
            } else {
                // If not logged in, redirect to login with return URL
                if (res.status === 401) {
                    router.push(`/auth/login?redirect=/invite/accept/${token}`);
                } else {
                    setError(data.error || 'Failed to accept invitation');
                }
            }
        } catch {
            setError('Failed to accept invitation');
        }
        setAccepting(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white">SipHeron VDR</h1>
                    <p className="text-gray-400 text-sm mt-1">Organization Invitation</p>
                </div>

                {error ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
                        <p className="text-red-400 font-medium mb-2">Invitation Invalid</p>
                        <p className="text-gray-400 text-sm">{error}</p>
                        <a href="/dashboard" className="mt-6 inline-block text-purple-400 text-sm hover:text-purple-300">
                            Go to Dashboard →
                        </a>
                    </div>
                ) : success ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-green-400 font-bold text-lg">You're in!</p>
                        <p className="text-gray-400 text-sm mt-2">Redirecting to dashboard...</p>
                    </div>
                ) : invite ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">You've been invited</h2>
                            <p className="text-gray-400 text-sm mt-2">
                                Join <span className="text-white font-medium">{invite.orgName}</span> as{' '}
                                <span className="text-purple-400 font-medium">{invite.role}</span>
                            </p>
                        </div>

                        <div className="bg-black/40 rounded-xl p-4 mb-6 text-sm text-gray-400">
                            <p>Invitation sent to: <span className="text-white">{invite.email}</span></p>
                            <p className="mt-1">Expires: <span className="text-white">{new Date(invite.expiresAt).toLocaleDateString()}</span></p>
                        </div>

                        <button
                            onClick={handleAccept}
                            disabled={accepting}
                            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
                        >
                            {accepting ? 'Accepting...' : 'Accept Invitation'}
                        </button>

                        <p className="text-center text-gray-500 text-xs mt-4">
                            You must be logged in with <span className="text-gray-300">{invite.email}</span> to accept
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
