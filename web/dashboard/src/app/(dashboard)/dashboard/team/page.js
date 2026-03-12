'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/utils/api';

const ROLE_COLORS = {
    owner: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    admin: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    member: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
};

const ROLE_BADGE = ({ role }) => (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${ROLE_COLORS[role] || ROLE_COLORS.member}`}>
        {role}
    </span>
);

export default function TeamPage() {
    const [members, setMembers] = useState([]);
    const [invites, setInvites] = useState([]);
    const [myRole, setMyRole] = useState('member');
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [inviting, setInviting] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmRemove, setConfirmRemove] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchAll = useCallback(async () => {
        try {
            const [membersRes, invitesRes, roleRes] = await Promise.allSettled([
                api.get('/api/members'),
                api.get('/api/members/invites'),
                api.get('/api/members/me/role')
            ]);

            if (membersRes.status === 'fulfilled') setMembers(membersRes.value.data.members || []);
            if (invitesRes.status === 'fulfilled') setInvites(invitesRes.value.data.invites || []);
            if (roleRes.status === 'fulfilled') setMyRole(roleRes.value.data.role || 'member');
        } catch (err) {
            console.error('Failed to fetch team data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const canManage = myRole === 'owner' || myRole === 'admin';
    const isOwner = myRole === 'owner';

    const handleInvite = async () => {
        if (!inviteEmail.trim()) return;
        setInviting(true);
        try {
            await api.post('/api/members/invite', { email: inviteEmail.trim(), role: inviteRole });
            showToast(`Invitation sent to ${inviteEmail}`);
            setInviteEmail('');
            setInviteRole('member');
            fetchAll();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to send invite', 'error');
        }
        setInviting(false);
    };

    const handleRemoveMember = async (memberId, memberEmail) => {
        if (confirmRemove !== memberId) {
            setConfirmRemove(memberId);
            setTimeout(() => setConfirmRemove(null), 3000);
            return;
        }
        try {
            await api.delete(`/api/members/${memberId}`);
            showToast(`${memberEmail} removed from org`);
            fetchAll();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to remove member', 'error');
        }
        setConfirmRemove(null);
    };

    const handleChangeRole = async (memberId, newRole) => {
        try {
            await api.patch(`/api/members/${memberId}/role`, { role: newRole });
            showToast('Role updated');
            fetchAll();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to update role', 'error');
        }
    };

    const handleCancelInvite = async (inviteId, email) => {
        try {
            await api.delete(`/api/members/invites/${inviteId}`);
            showToast(`Invite to ${email} cancelled`);
            fetchAll();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to cancel invite', 'error');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl transition-all ${
                    toast.type === 'error'
                        ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                        : 'bg-green-500/20 border border-green-500/30 text-green-300'
                }`}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Team</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Manage members and invitations for your organization.
                    Your role: <ROLE_BADGE role={myRole} />
                </p>
            </div>

            {/* Invite Section — admin/owner only */}
            {canManage && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
                        Invite Member
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="colleague@company.com"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleInvite()}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        />
                        <select
                            value={inviteRole}
                            onChange={e => setInviteRole(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                        >
                            <option value="member">Member</option>
                            {isOwner && <option value="admin">Admin</option>}
                        </select>
                        <button
                            onClick={handleInvite}
                            disabled={inviting || !inviteEmail.trim()}
                            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            {inviting ? 'Sending...' : 'Send Invite'}
                        </button>
                    </div>

                    {/* Role explanation */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-500">
                        <div className="bg-black/20 rounded-lg p-3">
                            <span className="text-yellow-400 font-bold">Owner</span> — Full control, billing, delete org
                        </div>
                        <div className="bg-black/20 rounded-lg p-3">
                            <span className="text-purple-400 font-bold">Admin</span> — Manage members, keys, webhooks
                        </div>
                        <div className="bg-black/20 rounded-lg p-3">
                            <span className="text-blue-400 font-bold">Member</span> — Anchor and verify documents
                        </div>
                    </div>
                </div>
            )}

            {/* Members List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                        Members
                    </h2>
                    <span className="text-xs text-gray-500">{members.length} total</span>
                </div>

                <div className="divide-y divide-white/5">
                    {members.map(member => (
                        <div key={member.id} className="px-6 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-300 text-xs font-bold">
                                        {(member.name || member.email).charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-white font-medium truncate">
                                        {member.name || member.email}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                                <ROLE_BADGE role={member.role} />

                                {/* Role change — owner only, not for themselves or other owners */}
                                {isOwner && !member.isOwner && (
                                    <select
                                        value={member.role}
                                        onChange={e => handleChangeRole(member.id, e.target.value)}
                                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                )}

                                {/* Remove — admin/owner, not for owner */}
                                {canManage && !member.isOwner && (
                                    <button
                                        onClick={() => handleRemoveMember(member.id, member.email)}
                                        className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                                            confirmRemove === member.id
                                                ? 'border-red-500/50 bg-red-500/20 text-red-300'
                                                : 'border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/30'
                                        }`}
                                    >
                                        {confirmRemove === member.id ? 'Confirm?' : 'Remove'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending Invites — admin/owner only */}
            {canManage && invites.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                            Pending Invites
                        </h2>
                        <span className="text-xs text-gray-500">{invites.length} pending</span>
                    </div>

                    <div className="divide-y divide-white/5">
                        {invites.map(invite => (
                            <div key={invite.id} className="px-6 py-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-gray-500/20 border border-gray-500/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-gray-400 text-xs font-bold">
                                            {invite.email.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-white truncate">{invite.email}</p>
                                        <p className="text-xs text-gray-500">
                                            Expires {new Date(invite.expiresAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <ROLE_BADGE role={invite.role} />
                                    <span className="text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-1 rounded-full font-bold uppercase tracking-widest">
                                        Pending
                                    </span>
                                    <button
                                        onClick={() => handleCancelInvite(invite.id, invite.email)}
                                        className="text-xs px-3 py-1 rounded-lg border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty invites state */}
            {canManage && invites.length === 0 && (
                <p className="text-center text-gray-600 text-sm py-4">No pending invitations</p>
            )}
        </div>
    );
}
