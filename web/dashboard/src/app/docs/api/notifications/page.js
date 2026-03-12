import DocLayout from '../../components/DocLayout';
import { Bell, List, Trash2, CheckSquare, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'overview', title: 'Notifications API Overview', level: 2 },
    { id: 'list-notifications', title: 'List Notifications', level: 2 },
    { id: 'mark-read', title: 'Mark as Read', level: 2 },
    { id: 'delete-notification', title: 'Delete Notification', level: 2 },
    { id: 'schema', title: 'Notification Schema', level: 2 },
];

export default function ApiNotificationsPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Notifications API</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Manage in-app notifications for your organization's users programmatically.
                </p>

                <h2 id="overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Overview
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    The Notifications API allows you to fetch and manage the alert stream shown in the SipHeron Dashboard's bell icon. This is useful for synchronizing read states with your own internal management tools.
                </p>

                <h2 id="list-notifications" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    List Notifications
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-blue-400 font-bold mr-2">GET</span> /api/notifications
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <pre className="font-mono">
{`{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "title": "Anchor Confirmed",
      "message": "Hash 85e1... confirmed on Mainnet",
      "read": false,
      "createdAt": "2026-03-12T14:20:00Z"
    }
  ]
}`}
                    </pre>
                </div>

                <h2 id="mark-read" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Mark as Read
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-purple-400 font-bold mr-2">PATCH</span> /api/notifications/:id
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto mb-8 text-xs text-purple-200">
                    <pre className="font-mono">
{`{
  "read": true
}`}
                    </pre>
                </div>

                <h2 id="delete-notification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Delete Notification
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/10">
                    <span className="text-red-500 font-bold mr-2">DELETE</span> /api/notifications/:id
                </p>
                <p className="text-gray-300 mb-16">
                    Permanently removes the notification from the user's history.
                </p>

                <h2 id="schema" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Notification Schema
                </h2>
                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto mb-16 text-xs text-purple-200">
                    <code className="font-mono">
{`interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}`}
                    </code>
                </pre>
            </div>
        </DocLayout>
    );
}
