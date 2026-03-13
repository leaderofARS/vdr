import React, { useState } from 'react';
import { Plus, Mail, MoreHorizontal, Clock, UserX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar: string;
  joinedAt: string;
  lastActive: string;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  expiresIn: string;
}

const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@arslabs.io',
    role: 'owner',
    avatar: 'JD',
    joinedAt: '2024-01-15',
    lastActive: 'Just now',
  },
  {
    id: '2',
    name: 'Sarah Kim',
    email: 'sarah@arslabs.io',
    role: 'admin',
    avatar: 'SK',
    joinedAt: '2024-02-01',
    lastActive: '5 minutes ago',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@arslabs.io',
    role: 'member',
    avatar: 'MC',
    joinedAt: '2024-03-10',
    lastActive: '2 hours ago',
  },
  {
    id: '4',
    name: 'Lisa Wang',
    email: 'lisa@arslabs.io',
    role: 'viewer',
    avatar: 'LW',
    joinedAt: '2024-04-05',
    lastActive: '1 day ago',
  },
];

const mockPending: PendingInvite[] = [
  {
    id: '1',
    email: 'tom@arslabs.io',
    role: 'member',
    expiresIn: '6 days',
  },
];

const roleColors: Record<string, string> = {
  owner: 'bg-sipheron-gold/10 text-sipheron-gold border-sipheron-gold/20',
  admin: 'bg-sipheron-purple/10 text-sipheron-purple border-sipheron-purple/20',
  member: 'bg-sipheron-teal/10 text-sipheron-teal border-sipheron-teal/20',
  viewer: 'bg-sipheron-text-muted/10 text-sipheron-text-muted border-sipheron-text-muted/20',
};

export const TeamPage: React.FC = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [showInviteForm, setShowInviteForm] = useState(false);

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
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-sipheron-base border border-white/[0.06] text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
              />
            </div>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-4 py-2 rounded-lg bg-sipheron-base border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              onClick={() => {
                setInviteEmail('');
                setShowInviteForm(false);
              }}
              className="btn-primary"
            >
              Send Invite
            </button>
          </div>
        </div>
      )}

      {/* Pending Invites */}
      {mockPending.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-sipheron-text-muted mb-3">
            Pending Invites ({mockPending.length})
          </h3>
          <div className="space-y-2">
            {mockPending.map((invite) => (
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
                  <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-red transition-colors">
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockMembers.map((member) => (
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
                  <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted">
                    <MoreHorizontal className="w-4 h-4" />
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
                  <DropdownMenuItem className="cursor-pointer text-sipheron-red focus:bg-white/[0.03]">
                    Remove Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${roleColors[member.role]}`}>
                    {member.role.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-sipheron-text-muted">Last active</div>
                  <div className="text-xs text-sipheron-text-secondary">{member.lastActive}</div>
                </div>
              </div>
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
