import DocLayout from '../../components/DocLayout';
import { Users, UserPlus, Shield, UserMinus, Mail, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Members API Overview', level: 2 },
    { id: 'list-members', title: 'List Team Members', level: 2 },
    { id: 'invite-member', title: 'Invite New Member', level: 2 },
    { id: 'roles', title: 'Roles & Permissions', level: 2 },
    { id: 'remove-member', title: 'Remove Member', level: 2 },
    { id: 'invites', title: 'Manage Pending Invites', level: 2 },
];

export default function ApiMembersPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Members API</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Manage multi-user access to your organization. Invite teammates, assign roles, and control administrative permissions.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    Collaboration is key to SipHeron VDR. The Members API allows you to automate the onboarding of new developers or integrate your organization's internal identity management system with SipHeron.
                </p>

                <h2 id="list-members" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    List Team Members
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-blue-400 font-bold mr-2">GET</span> /api/members
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <code className="font-mono">
{`{
  "success": true,
  "data": [
    {
      "id": "user_123",
      "email": "dev@company.com",
      "role": "admin",
      "joinedAt": "2026-02-01T10:00:00Z"
    },
    {
      "id": "user_456",
      "email": "audit@company.com",
      "role": "viewer",
      "joinedAt": "2026-03-01T14:30:00Z"
    }
  ]
}`}
                    </code>
                </pre>

                <h2 id="invite-member" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Invite New Member
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-green-500 font-bold mr-2">POST</span> /api/members/invite
                </p>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400">
                                <th className="text-left py-2 pr-4 font-medium">Field</th>
                                <th className="text-left py-2 pr-4 font-medium">Type</th>
                                <th className="text-left py-2 pr-4 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            <tr>
                                <td className="py-2 pr-4 font-mono">email</td>
                                <td className="py-2 pr-4 italic">string</td>
                                <td className="py-2 pr-4">Valid email address of the invitee.</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4 font-mono">role</td>
                                <td className="py-2 pr-4 italic">string</td>
                                <td className="py-2 pr-4">Either <code className="text-purple-300">member</code> or <code className="text-purple-300">admin</code>.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-gray-400 text-sm mb-8">
                    An email will be sent automatically with a secure, 48-hour inclusion link.
                </p>

                <h2 id="roles" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Roles & Permissions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="font-bold text-white mb-2">Member</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Can anchor hashes, verify documents, and create their own API keys.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 border-purple-500/30">
                        <h4 className="font-bold text-white mb-2 text-purple-400">Admin</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Full control over organization settings, billing, and member management.</p>
                    </div>
                </div>

                <h2 id="remove-member" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Remove Member
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-red-500 font-bold mr-2">DELETE</span> /api/members/:id
                </p>
                <p className="text-gray-300 mb-8">
                    Revokes the user's access to the organization dashboard and invalidates any API keys created by that user.
                </p>

                <h2 id="invites" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Manage Pending Invites
                </h2>
                <p className="text-gray-300 mb-4">
                    You can view, resend, or cancel pending invitations:
                </p>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-16 text-xs text-purple-200">
                    <code className="font-mono">
{`// GET /api/members/invites
{
  "success": true,
  "data": [
    {
      "email": "partner@othercompany.com",
      "status": "pending",
      "expiresAt": "2026-03-14T14:20:00Z"
    }
  ]
}`}
                    </code>
                </pre>
            </div>
        </DocLayout>
    );
}
