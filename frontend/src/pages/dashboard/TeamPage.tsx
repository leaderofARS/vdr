import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Mail, MoreHorizontal, Clock, UserX, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/utils/api';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string | 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  joinedAt: string;
  isOwner?: boolean;
  lastActive?: string;
  lastActiveAt?: string | null;
  anchorsCount?: number;
  apiKeys?: {
    id: string;
    name: string;
    scope: string;
    createdAt: string;
    lastUsedAt?: string | null;
  }[];
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  status: string;
  expiresIn?: string;
}

const roleColors: Record<string, string> = {
  owner: 'bg-sipheron-gold/10 text-sipheron-gold border-sipheron-gold/20',
  admin: 'bg-sipheron-purple/10 text-sipheron-purple border-sipheron-purple/20',
  member: 'bg-sipheron-teal/10 text-sipheron-teal border-sipheron-teal/20',
  viewer: 'bg-sipheron-text-muted/10 text-sipheron-text-muted border-sipheron-text-muted/20',
};

// Generate avatar initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Calculate time ago from date
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

function timeAgo(date: string): string {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 86400 * 7) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  });
}

// Calculate expires in from expiresAt
const getExpiresIn = (expiresAt: string): string => {
  const date = new Date(expiresAt);
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  if (diffInSeconds <= 0) return 'Expired';
  if (diffInSeconds < 86400) return `${Math.ceil(diffInSeconds / 3600)} hours`;
  return `${Math.ceil(diffInSeconds / 86400)} days`;
};

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  // Fetch members and invites
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [membersRes, invitesRes] = await Promise.all([
        api.get('/api/members'),
        api.get('/api/members/invites'),
      ]);

      const fetchedMembers = membersRes.data.members || [];
      const fetchedInvites = invitesRes.data.invites || [];

      // Process members to add avatar and lastActive
      const processedMembers = fetchedMembers.map((member: TeamMember) => ({
        ...member,
        avatar: getInitials(member.name || member.email),
        lastActive: member.lastActiveAt ? timeAgo(member.lastActiveAt) : 'Never active',
      }));

      // Process invites to add expiresIn
      const processedInvites = fetchedInvites.map((invite: PendingInvite) => ({
        ...invite,
        expiresIn: getExpiresIn(invite.expiresAt),
      }));

      setMembers(processedMembers);
      setPendingInvites(processedInvites);
    } catch (error) {
      toast.error('Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Invite member
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsInviting(true);
    try {
      const response = await api.post('/api/members/invite', {
        email: inviteEmail.trim(),
        role: inviteRole,
      });

      const newInvite = response.data.invite;
      setPendingInvites((prev) => [
        ...prev,
        {
          ...newInvite,
          expiresIn: getExpiresIn(newInvite.expiresAt),
        },
      ]);

      toast.success('Invitation sent successfully');
      setInviteEmail('');
      setInviteRole('member');
      setShowInviteForm(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send invitation';
      toast.error(message);
    } finally {
      setIsInviting(false);
    }
  };

  // Cancel invite
  const handleCancelInvite = async (inviteId: string) => {
    setIsCancelling(inviteId);
    try {
      await api.delete(`/api/members/invites/${inviteId}`);
      setPendingInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
      toast.success('Invitation cancelled');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel invitation';
      toast.error(message);
    } finally {
      setIsCancelling(null);
    }
  };

  // Remove member
  const handleRemoveMember = async (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member?.isOwner) {
      toast.error('Cannot remove the owner');
      return;
    }

    setIsRemoving(memberId);
    try {
      await api.delete(`/api/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success('Member removed successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
    } finally {
      setIsRemoving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sipheron-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">Team</h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Manage team members and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-sipheron-surface rounded-xl p-4 border border-white/[0.06] animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sipheron-text-muted" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                disabled={isInviting}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-sipheron-base border border-white/[0.06] text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all disabled:opacity-50"
              />
            </div>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              disabled={isInviting}
              className="px-4 py-2 rounded-lg bg-sipheron-base border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all disabled:opacity-50"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              onClick={handleInvite}
              disabled={isInviting}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {isInviting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Send Invite
            </button>
          </div>
        </div>
      )}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-sipheron-text-muted mb-3">
            Pending Invites ({pendingInvites.length})
          </h3>
          <div className="space-y-2">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-3 rounded-lg bg-sipheron-surface/50 border border-white/[0.06] border-dashed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-sipheron-text-muted" />
                  </div>
                  <div>
                    <div className="text-sm text-sipheron-text-primary">{invite.email}</div>
                    <div className="flex items-center gap-2 text-xs text-sipheron-text-muted">
                      <Clock className="w-3 h-3" />
                      Expires in {invite.expiresIn}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${roleColors[invite.role]}`}>
                    {invite.role.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    disabled={isCancelling === invite.id}
                    className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-red transition-colors disabled:opacity-50"
                  >
                    {isCancelling === invite.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserX className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-sipheron-surface rounded-xl p-5 border border-white/[0.06] hover:border-sipheron-purple/20 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, hsl(${240 + parseInt(member.id) * 30}, 70%, 60%), hsl(${240 + parseInt(member.id) * 30}, 70%, 40%))`,
                  }}
                >
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-sipheron-text-primary">
                    {member.name}
                  </h3>
                  <p className="text-xs text-sipheron-text-muted">{member.email}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    disabled={isRemoving === member.id}
                    className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted disabled:opacity-50"
                  >
                    {isRemoving === member.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="w-4 h-4" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-sipheron-surface border-white/[0.06]">
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/[0.03]">
                    Change Role
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/[0.03]">
                    View Activity
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/[0.06]" />
                  <DropdownMenuItem
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={member.isOwner}
                    className="cursor-pointer text-sipheron-red focus:bg-white/[0.03] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {member.isOwner ? 'Cannot Remove Owner' : 'Remove Member'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${roleColors[member.role] || 'bg-white/10 text-white/70 border-white/20'}`}>
                    {member.role.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Member stats row */}
              <div className="flex flex-wrap items-center gap-4 mt-2">

                {/* Last active */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${
                    member.lastActiveAt &&
                    Date.now() - new Date(member.lastActiveAt).getTime() < 24 * 60 * 60 * 1000
                      ? 'bg-[#00D97E]'       // active in last 24h — green
                      : member.lastActiveAt &&
                        Date.now() - new Date(member.lastActiveAt).getTime() < 7 * 24 * 60 * 60 * 1000
                        ? 'bg-[#FFD93D]'     // active in last 7d — yellow
                        : 'bg-[#44445A]'     // inactive — gray
                  }`} />
                  <span className="text-[10px] text-[#8888AA]">
                    {member.lastActiveAt
                      ? `Active ${timeAgo(member.lastActiveAt)}`
                      : 'Never active'}
                  </span>
                </div>

                {/* Anchor count */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8888AA]">
                    <span className="text-[#F0F0FF] font-semibold">
                      {(member.anchorsCount || 0).toLocaleString()}
                    </span>
                    {' '}anchors
                  </span>
                </div>

                {/* API keys count */}
                {member.apiKeys && member.apiKeys.length > 0 && (
                  <div 
                    className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 rounded px-1 -mx-1 transition-colors"
                    onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                  >
                    <span className="text-[10px] text-[#8888AA]">
                      <span className="text-[#F0F0FF] font-semibold">
                        {member.apiKeys.length}
                      </span>
                      {' '}API {member.apiKeys.length === 1 ? 'key' : 'keys'}
                    </span>
                  </div>
                )}

                {/* Member since */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#44445A]">
                    Joined {member.joinedAt
                      ? new Date(member.joinedAt).toLocaleDateString('en-US', {
                          month: 'short', year: 'numeric'
                        })
                      : '—'}
                  </span>
                </div>
              </div>

              {/* API Keys expandable section — shown on click/hover */}
              {member.apiKeys && member.apiKeys.length > 0 && expandedMember === member.id && (
                <div className="mt-3 bg-black/40 border border-white/[0.06]
                                rounded-xl p-3 space-y-2">
                  <p className="text-[10px] text-[#44445A] uppercase tracking-widest
                                 font-bold">
                    API Keys
                  </p>
                  {member.apiKeys.map(key => (
                    <div key={key.id}
                      className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5
                                           rounded border ${
                          key.scope === 'admin'
                            ? 'text-red-400 bg-red-400/10 border-red-400/20'
                            : key.scope === 'write'
                              ? 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                              : 'text-gray-400 bg-gray-400/10 border-gray-400/10'
                        }`}>
                          {key.scope.toUpperCase()}
                        </span>
                        <span className="text-xs text-[#F0F0FF]">{key.name}</span>
                      </div>
                      <span className="text-[10px] text-[#44445A]">
                        {key.lastUsedAt
                          ? `Used ${timeAgo(key.lastUsedAt)}`
                          : 'Never used'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Role Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { role: 'Owner', desc: 'Full access, billing control' },
          { role: 'Admin', desc: 'Manage team, all features' },
          { role: 'Member', desc: 'Anchor, verify, view' },
          { role: 'Viewer', desc: 'View only, no changes' },
        ].map((item) => (
          <div key={item.role} className="p-3 rounded-lg bg-white/[0.02]">
            <div className="text-xs font-medium text-sipheron-text-primary">{item.role}</div>
            <div className="text-[10px] text-sipheron-text-muted">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
