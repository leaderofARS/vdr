import React, { useState } from 'react';
import { User, Building2, Shield, Bell, AlertTriangle } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-sipheron-text-primary">Settings</h2>
        <p className="text-sm text-sipheron-text-muted mt-1">
          Manage your account and organization settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-sipheron-purple/10 text-sipheron-purple border border-sipheron-purple/20'
                    : 'text-sipheron-text-secondary hover:text-sipheron-text-primary hover:bg-white/[0.03]'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="max-w-2xl">
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sipheron-purple to-sipheron-teal flex items-center justify-center text-xl font-semibold text-white">
                JD
              </div>
              <div>
                <button className="text-sm text-sipheron-purple hover:text-sipheron-teal transition-colors">
                  Change Avatar
                </button>
                <p className="text-xs text-sipheron-text-muted mt-1">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-sipheron-text-secondary mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="John"
                  className="w-full px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-sipheron-text-secondary mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Doe"
                  className="w-full px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-sipheron-text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="john@arslabs.io"
                className="w-full px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-sipheron-text-secondary mb-2">
                Timezone
              </label>
              <select className="w-full px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all">
                <option>UTC-08:00 Pacific Time</option>
                <option>UTC-05:00 Eastern Time</option>
                <option>UTC+00:00 UTC</option>
                <option>UTC+01:00 Central European Time</option>
              </select>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'organization' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm text-sipheron-text-secondary mb-2">
                Organization Name
              </label>
              <input
                type="text"
                defaultValue="ARS Labs"
                className="w-full px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-sipheron-text-secondary mb-2">
                Organization Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sipheron-text-muted">sipheron.com/</span>
                <input
                  type="text"
                  defaultValue="ars-labs"
                  className="flex-1 px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-sipheron-text-secondary mb-2">
                Website
              </label>
              <input
                type="url"
                defaultValue="https://arslabs.io"
                className="w-full px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
              />
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-medium text-sipheron-text-primary mb-4">
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-sipheron-text-secondary mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-sipheron-text-secondary mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-sipheron-text-secondary mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
                  />
                </div>
              </div>
              <button className="mt-4 btn-primary">Update Password</button>
            </div>

            <div className="pt-6 border-t border-white/[0.06]">
              <h3 className="text-sm font-medium text-sipheron-text-primary mb-4">
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between p-4 rounded-lg bg-sipheron-surface border border-white/[0.06]">
                <div>
                  <div className="text-sm text-sipheron-text-primary">
                    Authenticator App
                  </div>
                  <div className="text-xs text-sipheron-text-muted">
                    Not enabled
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-sipheron-purple/10 text-sipheron-purple text-sm hover:bg-sipheron-purple/20 transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-3">
              {[
                { label: 'Hash confirmations', desc: 'Get notified when your hashes are confirmed', default: true },
                { label: 'Team activity', desc: 'Notifications about team member actions', default: true },
                { label: 'Billing alerts', desc: 'Payment and subscription notifications', default: true },
                { label: 'Security alerts', desc: 'Login and security-related notifications', default: true },
                { label: 'Product updates', desc: 'New features and improvements', default: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 rounded-lg bg-sipheron-surface border border-white/[0.06]"
                >
                  <div>
                    <div className="text-sm text-sipheron-text-primary">{item.label}</div>
                    <div className="text-xs text-sipheron-text-muted">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={item.default}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sipheron-purple" />
                  </label>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="mt-12 pt-8 border-t border-white/[0.06]">
        <div className="p-6 rounded-xl border border-sipheron-red/30 bg-sipheron-red/5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-sipheron-red" />
            <h3 className="text-sm font-medium text-sipheron-red">Danger Zone</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-sipheron-text-primary">Leave Organization</div>
                <div className="text-xs text-sipheron-text-muted">
                  Remove yourself from this organization
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-sipheron-red/30 text-sipheron-red text-sm hover:bg-sipheron-red/10 transition-colors">
                Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
