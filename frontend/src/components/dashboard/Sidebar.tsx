/**
 * @file Sidebar.tsx
 * @description Sidebar component for dashboard
 * Updated to use user data from AuthContext
 */

import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Hash,
  Zap,
  BarChart3,
  Key,
  Users,
  Webhook,
  ClipboardList,
  FlaskConical,
  Share2,
  PieChart,
  Settings,
  CreditCard,
  Bell,
  ChevronLeft,
  ChevronRight,
  Settings2,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Hash, label: 'Hashes', href: '/dashboard/hashes' },
      { icon: Zap, label: 'Bulk Verify', href: '/dashboard/bulk-verify' },
      { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    ],
  },
  {
    title: 'MANAGE',
    items: [
      { icon: Key, label: 'API Keys', href: '/dashboard/keys' },
      { icon: Users, label: 'Team', href: '/dashboard/team' },
      { icon: Webhook, label: 'Webhooks', href: '/dashboard/webhooks' },
      { icon: ClipboardList, label: 'Audit Log', href: '/dashboard/audit' },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { icon: FlaskConical, label: 'Playground', href: '/dashboard/playground' },
      { icon: Share2, label: 'Embed & Share', href: '/dashboard/embed' },
      { icon: PieChart, label: 'Usage', href: '/dashboard/usage' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
      { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
      { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  user?: {
    name?: string;
    email?: string;
    organization?: {
      name?: string;
      plan?: string;
    };
  } | null;
}

export const Sidebar: FC<SidebarProps> = ({ isCollapsed, onToggle, user }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  // Get user initials for avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const userInitials = getInitials(user?.name, user?.email);
  const displayName = user?.name || user?.email || 'User';
  const orgName = user?.organization?.name || 'Organization';
  const planName = user?.organization?.plan || 'Free';

  return (
    <aside
      className={`
        fixed left-0 top-0 bottom-0 z-40
        bg-sipheron-surface border-r border-white/[0.06]
        transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06]">
        <Link to="/" className="flex items-center gap-2 overflow-hidden group">
          <div className="w-8 h-8 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <img
              src="/sipheron_vdap_logo.png"
              alt="SipHeron Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(155,110,255,0.3)]"
            />
          </div>
          {!isCollapsed && (
            <>
              <span className="text-sm font-semibold text-sipheron-text-primary whitespace-nowrap">
                SipHeron
              </span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-sipheron-purple/20 text-sipheron-purple font-medium">
                VDR
              </span>
            </>
          )}
        </Link>
        {!isCollapsed && (
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-white/5 text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapse Button (when collapsed) */}
      {isCollapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sipheron-surface border border-white/[0.06] flex items-center justify-center text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      )}

      {/* Navigation */}
      <nav className="p-3 space-y-6 overflow-y-auto h-[calc(100%-200px)]">
        {navSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-widest text-sipheron-text-muted/50 px-3 mb-2">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg
                      transition-all duration-200
                      ${active
                        ? 'bg-sipheron-purple/10 text-sipheron-text-primary border-l-2 border-sipheron-purple'
                        : 'text-sipheron-text-muted hover:text-sipheron-text-primary hover:bg-white/[0.03]'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        active ? 'text-sipheron-purple' : ''
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/[0.06] bg-sipheron-surface">
        {/* Org Info */}
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-3 px-3">
            <span className="text-xs text-sipheron-text-muted truncate">
              {orgName}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sipheron-green/10 text-sipheron-green capitalize">
              {planName}
            </span>
          </div>
        )}

        {/* User */}
        <div className="group">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sipheron-purple to-sipheron-teal flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
              {userInitials}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs text-sipheron-text-primary truncate">
                  {displayName}
                </div>
                <div className="text-[10px] text-sipheron-text-muted truncate">
                  {user?.email}
                </div>
              </div>
            )}
            {!isCollapsed && (
              <Settings2 className="w-3.5 h-3.5 text-sipheron-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>

          {/* Logout button - visible on hover or when expanded */}
          {!isCollapsed && (
            <button
              onClick={logout}
              className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sipheron-text-muted hover:text-sipheron-red hover:bg-sipheron-red/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
