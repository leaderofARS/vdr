/**
 * @file Topbar.tsx
 * @description Topbar component for dashboard
 * Updated to use user data from AuthContext
 */

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Command,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface TopbarProps {
  onSearchClick: () => void;
  user?: {
    name?: string;
    email?: string;
  } | null;
}

const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/hashes': 'Hashes',
    '/dashboard/bulk-verify': 'Bulk Verify',
    '/dashboard/analytics': 'Analytics',
    '/dashboard/keys': 'API Keys',
    '/dashboard/team': 'Team',
    '/dashboard/webhooks': 'Webhooks',
    '/dashboard/audit': 'Audit Log',
    '/dashboard/playground': 'Playground',
    '/dashboard/embed': 'Embed & Share',
    '/dashboard/usage': 'Usage',
    '/dashboard/settings': 'Settings',
    '/dashboard/billing': 'Billing',
    '/dashboard/notifications': 'Notifications',
  };
  return titles[pathname] || 'Dashboard';
};

export const Topbar: React.FC<TopbarProps> = ({ onSearchClick, user }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const pageTitle = getPageTitle(location.pathname);
  const greeting = currentTime.getHours() < 12 ? 'Good morning' : 
                   currentTime.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  // Get user initials
  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const userInitials = getInitials();

  return (
    <header
      className="
        fixed top-0 right-0 left-60 z-30
        h-16
        bg-sipheron-surface/80 backdrop-blur-xl
        border-b border-white/[0.06]
        transition-all duration-300
      "
      style={{ marginLeft: 'var(--sidebar-width, 240px)' }}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-sipheron-text-primary">
            {pageTitle}
          </h1>
          {location.pathname === '/dashboard' && (
            <p className="text-xs text-sipheron-text-muted">
              {greeting}, {user?.name || user?.email || 'User'}
            </p>
          )}
        </div>

        {/* Center: Search */}
        <button
          onClick={onSearchClick}
          className="
            hidden md:flex items-center gap-2
            px-4 py-2 rounded-lg
            bg-white/[0.03] border border-white/[0.06]
            text-sipheron-text-muted
            hover:bg-white/[0.05] hover:border-white/[0.1]
            transition-all duration-200
            min-w-[280px]
          "
        >
          <Search className="w-4 h-4" />
          <span className="text-sm flex-1 text-left">Search hashes, documents...</span>
          <div className="flex items-center gap-1 text-xs text-sipheron-text-muted/50">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-lg hover:bg-white/[0.03] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sipheron-red" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-sipheron-surface border-white/[0.06]"
            >
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <span className="text-sm font-medium text-sipheron-text-primary">
                  Notifications
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer focus:bg-white/[0.03]">
                  <div className="w-2 h-2 rounded-full bg-sipheron-purple mt-1.5" />
                  <div>
                    <p className="text-sm text-sipheron-text-primary">
                      New hash confirmed
                    </p>
                    <p className="text-xs text-sipheron-text-muted">
                      contract.pdf was anchored successfully
                    </p>
                    <p className="text-[10px] text-sipheron-text-muted/50 mt-1">
                      2 minutes ago
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer focus:bg-white/[0.03]">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <div>
                    <p className="text-sm text-sipheron-text-primary">
                      Team member added
                    </p>
                    <p className="text-xs text-sipheron-text-muted">
                      Sarah Kim joined your organization
                    </p>
                    <p className="text-[10px] text-sipheron-text-muted/50 mt-1">
                      1 hour ago
                    </p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem className="justify-center text-sipheron-purple cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Anchor Button */}
          <button className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Anchor</span>
          </button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sipheron-purple to-sipheron-teal flex items-center justify-center text-sm font-semibold text-white">
                  {userInitials}
                </div>
                <ChevronDown className="w-4 h-4 text-sipheron-text-muted hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-sipheron-surface border-white/[0.06]"
            >
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <p className="text-xs text-sipheron-text-muted">Signed in as</p>
                <p className="text-sm text-sipheron-text-primary font-medium truncate">
                  {user?.email || 'User'}
                </p>
              </div>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/[0.03]" asChild>
                <Link to="/dashboard/settings" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/[0.03]" asChild>
                <Link to="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem 
                className="cursor-pointer text-sipheron-red focus:bg-white/[0.03]"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
