import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  CheckCheck,
  CheckCircle2,
  XCircle,
  Zap,
  Key,
  Users,
  Hash,
  CreditCard,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'anchor_success' | 'anchor_failed' | 'key_created' | 'key_revoked' | 'low_balance' | 'team_invite' | 'billing' | 'system';
  isRead: boolean;
  createdAt: string;
  metadata?: {
    hash?: string;
    keyName?: string;
    amount?: string;
    inviteeEmail?: string;
  };
}

const notificationIcons: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  anchor_success: { icon: CheckCircle2, color: 'text-sipheron-green', bgColor: 'bg-sipheron-green/10' },
  anchor_failed: { icon: XCircle, color: 'text-sipheron-red', bgColor: 'bg-sipheron-red/10' },
  key_created: { icon: Key, color: 'text-sipheron-purple', bgColor: 'bg-sipheron-purple/10' },
  key_revoked: { icon: Key, color: 'text-sipheron-orange', bgColor: 'bg-sipheron-orange/10' },
  low_balance: { icon: CreditCard, color: 'text-sipheron-gold', bgColor: 'bg-sipheron-gold/10' },
  team_invite: { icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  billing: { icon: CreditCard, color: 'text-sipheron-teal', bgColor: 'bg-sipheron-teal/10' },
  system: { icon: Zap, color: 'text-sipheron-purple', bgColor: 'bg-sipheron-purple/10' },
};

const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return past.toLocaleDateString();
};

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const quickActions = [
    { icon: Hash, label: 'Anchor Document', shortcut: '⌘H', action: () => navigate('/dashboard/hashes/new') },
    { icon: Key, label: 'Create API Key', shortcut: '⌘K', action: () => navigate('/dashboard/keys') },
    { icon: Users, label: 'Invite Team Member', shortcut: '⌘I', action: () => navigate('/dashboard/team') },
    { icon: Settings, label: 'Organization Settings', shortcut: '⌘S', action: () => navigate('/dashboard/settings') },
    { icon: ExternalLink, label: 'View API Docs', shortcut: '⌘D', action: () => window.open('/docs', '_blank') },
  ];

  // Poll unread count every 30s
  const pollUnreadCount = useCallback(async () => {
    try {
      const { data } = await api.get('/api/notifications?unreadOnly=true&limit=1');
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    pollUnreadCount();
    const interval = setInterval(pollUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [pollUnreadCount]);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (notificationOpen) {
      loadNotifications();
    }
  }, [notificationOpen]);

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const { data } = await api.get('/api/notifications?limit=10');
      setNotifications(data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (notification: Notification, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (notification.isRead) return;

    // Optimistic update
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await api.put('/api/notifications/read', { ids: [notification.id] });
    } catch (error) {
      // Revert on error
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, isRead: false } : n
      ));
      setUnreadCount(prev => prev + 1);
    }
  };

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevNotifications = [...notifications];
    const prevUnreadCount = unreadCount;
    
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await api.put('/api/notifications/read', { all: true });
      toast.success('All notifications marked as read');
    } catch (error) {
      setNotifications(prevNotifications);
      setUnreadCount(prevUnreadCount);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const prevNotifications = [...notifications];
    const deleted = notifications.find(n => n.id === id);
    
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (deleted && !deleted.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    try {
      await api.delete(`/api/notifications/${id}`);
    } catch (error) {
      setNotifications(prevNotifications);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification);
    const metadata = notification.metadata || {};
    switch (notification.type) {
      case 'anchor_success':
        if (metadata.hash) navigate(`/dashboard/hashes/${metadata.hash}`);
        break;
      case 'anchor_failed':
        navigate('/dashboard/hashes');
        break;
      case 'key_created':
      case 'key_revoked':
        navigate('/dashboard/keys');
        break;
      case 'low_balance':
        navigate('/dashboard/billing');
        break;
      case 'team_invite':
        navigate('/dashboard/team');
        break;
      case 'billing':
        navigate('/dashboard/billing');
        break;
      default:
        break;
    }
    setNotificationOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    const config = notificationIcons[type] || notificationIcons.system;
    const Icon = config.icon;
    return (
      <div className={`w-9 h-9 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/[0.06] bg-sipheron-bg/95 backdrop-blur-xl">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left: Mobile menu button and page title */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            {/* Mobile menu button - handled by parent */}
          </div>
        </div>

        {/* Right: Search, notifications, user */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] text-sipheron-text-muted text-sm transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Quick actions...</span>
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-white/[0.1] bg-white/[0.05] px-1.5 font-mono text-[10px] font-medium">
              <span>⌘</span>K
            </kbd>
          </button>

          {/* Notifications Dropdown */}
          <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                <Bell className="w-5 h-5 text-sipheron-text-secondary" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] rounded-full bg-sipheron-purple text-white text-[10px] font-medium flex items-center justify-center px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-[380px] bg-sipheron-surface border border-white/[0.06] shadow-2xl p-0 overflow-hidden"
              sideOffset={8}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-sipheron-text-primary">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sipheron-purple/20 text-sipheron-purple font-medium">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1.5 rounded-lg hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-purple transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <Link
                    to="/dashboard/notifications"
                    onClick={() => setNotificationOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
                    title="View all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto">
                {loadingNotifications && notifications.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center">
                    <div className="w-6 h-6 border-2 border-sipheron-purple/20 border-t-sipheron-purple rounded-full animate-spin mb-3" />
                    <p className="text-xs text-sipheron-text-muted">Loading...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-sipheron-purple/10 flex items-center justify-center mb-3">
                      <Bell className="w-6 h-6 text-sipheron-purple" />
                    </div>
                    <p className="text-sm text-sipheron-text-secondary font-medium">No notifications yet</p>
                    <p className="text-xs text-sipheron-text-muted mt-1">Check back later for updates</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`
                          flex items-start gap-3 p-3 hover:bg-white/[0.03] cursor-pointer transition-colors group
                          ${!notification.isRead ? 'bg-sipheron-purple/[0.02]' : ''}
                        `}
                      >
                        {/* Unread indicator */}
                        <div className="pt-1">
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-sipheron-purple" />
                          )}
                        </div>

                        {/* Icon */}
                        {getNotificationIcon(notification.type)}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${!notification.isRead ? 'font-medium text-sipheron-text-primary' : 'text-sipheron-text-secondary'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-sipheron-text-muted line-clamp-1 mt-0.5">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-sipheron-text-muted/60">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                            {!notification.isRead && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sipheron-purple/10 text-sipheron-purple">
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => markAsRead(notification, e)}
                              className="p-1 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-green transition-colors"
                              title="Mark as read"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => deleteNotification(e, notification.id)}
                            className="p-1 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-red transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.02]">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setNotificationOpen(false)}
                  className="flex items-center justify-center gap-2 text-xs text-sipheron-purple hover:text-sipheron-teal transition-colors py-1"
                >
                  View all notifications
                  <ChevronDown className="w-3 h-3 -rotate-90" />
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sipheron-purple to-sipheron-purple/60 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-sipheron-text-primary line-clamp-1 max-w-[120px]">
                    {user?.name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-sipheron-text-muted line-clamp-1 max-w-[120px]">
                    {user?.organization?.name || 'Personal'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-sipheron-text-muted hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-sipheron-surface border border-white/[0.06]" sideOffset={8}>
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <p className="text-sm font-medium text-sipheron-text-primary">{user?.name}</p>
                <p className="text-xs text-sipheron-text-muted truncate">{user?.email}</p>
              </div>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-sipheron-red focus:text-sipheron-red">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Command Dialog for Quick Actions */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.label}
                onSelect={() => {
                  setSearchOpen(false);
                  action.action();
                }}
              >
                <action.icon className="mr-2 h-4 w-4" />
                <span>{action.label}</span>
                {action.shortcut && (
                  <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                    {action.shortcut}
                  </kbd>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => { setSearchOpen(false); navigate('/dashboard'); }}>
              Dashboard Home
            </CommandItem>
            <CommandItem onSelect={() => { setSearchOpen(false); navigate('/dashboard/hashes'); }}>
              Document Hashes
            </CommandItem>
            <CommandItem onSelect={() => { setSearchOpen(false); navigate('/dashboard/analytics'); }}>
              Analytics
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
};

export default Topbar;
