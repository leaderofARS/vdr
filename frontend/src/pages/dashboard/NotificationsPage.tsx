import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  CheckCircle2,
  XCircle,
  Zap,
  Key,
  Users,
  CreditCard,
  RefreshCw,
  Filter,
  Archive,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import api from '@/utils/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const notificationIcons: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  anchor_success: { icon: CheckCircle2, color: 'text-sipheron-green', bgColor: 'bg-sipheron-green/10 border-sipheron-green/20' },
  anchor_failed: { icon: XCircle, color: 'text-sipheron-red', bgColor: 'bg-sipheron-red/10 border-sipheron-red/20' },
  key_created: { icon: Key, color: 'text-sipheron-purple', bgColor: 'bg-sipheron-purple/10 border-sipheron-purple/20' },
  key_revoked: { icon: Key, color: 'text-sipheron-orange', bgColor: 'bg-sipheron-orange/10 border-sipheron-orange/20' },
  low_balance: { icon: CreditCard, color: 'text-sipheron-gold', bgColor: 'bg-sipheron-gold/10 border-sipheron-gold/20' },
  team_invite: { icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  billing: { icon: CreditCard, color: 'text-sipheron-teal', bgColor: 'bg-sipheron-teal/10 border-sipheron-teal/20' },
  system: { icon: Zap, color: 'text-sipheron-purple', bgColor: 'bg-sipheron-purple/10 border-sipheron-purple/20' },
};

const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return past.toLocaleDateString();
};

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: pagination.page,
        limit: 20,
      };
      if (filter === 'unread') params.unreadOnly = 'true';
      if (typeFilter !== 'all') params.type = typeFilter;

      const { data } = await api.get('/api/notifications', { params });
      setNotifications(data.data || data.notifications || (Array.isArray(data) ? data : []));
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filter, typeFilter]);

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark single notification as read
  const markAsRead = async (notification: Notification) => {
    if (notification.isRead) {
      handleNotificationClick(notification);
      return;
    }

    const prevNotifications = [...notifications];
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await api.put('/api/notifications/read', { ids: [notification.id] });
      handleNotificationClick(notification);
    } catch (error) {
      setNotifications(prevNotifications);
      setUnreadCount(prev => prev + 1);
      toast.error('Failed to mark as read');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const prevNotifications = [...notifications];
    const prevUnreadCount = unreadCount;
    
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
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

  // Mark selected as read
  const markSelectedAsRead = async () => {
    if (selectedIds.length === 0) return;

    const prevNotifications = [...notifications];
    setNotifications(notifications.map(n => 
      selectedIds.includes(n.id) ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - selectedIds.filter(id => 
      notifications.find(n => n.id === id && !n.isRead)
    ).length));
    setSelectedIds([]);

    try {
      await api.put('/api/notifications/read', { ids: selectedIds });
      toast.success(`${selectedIds.length} notifications marked as read`);
    } catch (error) {
      setNotifications(prevNotifications);
      toast.error('Failed to mark as read');
    }
  };

  // Delete notification
  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const prevNotifications = [...notifications];
    const deleted = notifications.find(n => n.id === id);
    
    setNotifications(notifications.filter(n => n.id !== id));
    if (deleted && !deleted.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    try {
      await api.delete(`/api/notifications/${id}`);
      toast.success('Notification deleted');
    } catch (error) {
      setNotifications(prevNotifications);
      toast.error('Failed to delete notification');
    }
  };

  // Handle notification click - navigate based on type
  const handleNotificationClick = (notification: Notification) => {
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
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select all visible
  const selectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  const getNotificationIcon = (type: string) => {
    const config = notificationIcons[type] || notificationIcons.system;
    const Icon = config.icon;
    return (
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${config.bgColor}`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
    );
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary flex items-center gap-2">
            <Bell className="w-5 h-5 text-sipheron-purple" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-sipheron-purple/10 text-sipheron-purple border border-sipheron-purple/20">
                {unreadCount} unread
              </span>
            )}
          </h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Stay updated on your document anchoring activity
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {filter === 'all' ? 'All Notifications' : 'Unread Only'}
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-sipheron-surface border-white/[0.06]">
              <DropdownMenuItem onClick={() => setFilter('all')} className="cursor-pointer">
                All Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('unread')} className="cursor-pointer">
                Unread Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
          >
            <option value="all">All Types</option>
            <option value="anchor_success">Anchor Success</option>
            <option value="anchor_failed">Anchor Failed</option>
            <option value="key_created">API Key Created</option>
            <option value="low_balance">Low Balance</option>
            <option value="team_invite">Team Invite</option>
          </select>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-2 rounded-lg bg-sipheron-purple/10 text-sipheron-purple text-sm hover:bg-sipheron-purple/20 transition-colors flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}

          <button
            onClick={fetchNotifications}
            className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-sipheron-purple/5 border border-sipheron-purple/20">
          <span className="text-sm text-sipheron-text-primary">
            {selectedIds.length} selected
          </span>
          <button
            onClick={markSelectedAsRead}
            className="text-sm text-sipheron-purple hover:text-sipheron-teal transition-colors flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            Mark as read
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-sm text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        {/* List Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="w-4 h-4 rounded border border-sipheron-text-muted flex items-center justify-center"
            >
              {selectedIds.length === notifications.length && notifications.length > 0 && (
                <Check className="w-3 h-3 text-sipheron-purple" />
              )}
            </button>
            <span className="text-xs text-sipheron-text-muted uppercase tracking-wider">
              Select all
            </span>
          </div>
          <span className="text-xs text-sipheron-text-muted">
            {pagination.total} total
          </span>
        </div>

        {/* Loading State */}
        {loading && notifications.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-sipheron-purple animate-spin mb-4" />
            <p className="text-sm text-sipheron-text-muted">Loading notifications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-sipheron-purple/10 flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-sipheron-purple" />
            </div>
            <h3 className="text-lg font-medium text-sipheron-text-primary mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-sm text-sipheron-text-muted max-w-sm">
              {filter === 'unread' 
                ? 'You\'re all caught up! Check back later for updates.' 
                : 'Notifications about your document anchoring activity will appear here.'}
            </p>
          </div>
        )}

        {/* Notifications */}
        <div className="divide-y divide-white/[0.04]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification)}
              className={`
                p-4 hover:bg-white/[0.02] cursor-pointer transition-all group
                flex items-start gap-4
                ${!notification.isRead ? 'bg-sipheron-purple/[0.02]' : ''}
                ${selectedIds.includes(notification.id) ? 'bg-sipheron-purple/5' : ''}
              `}
            >
              {/* Checkbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection(notification.id);
                }}
                className="mt-1 w-4 h-4 rounded border border-sipheron-text-muted flex items-center justify-center flex-shrink-0"
              >
                {selectedIds.includes(notification.id) && (
                  <Check className="w-3 h-3 text-sipheron-purple" />
                )}
              </button>

              {/* Unread indicator */}
              <div className="mt-3 flex-shrink-0">
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-sipheron-purple" />
                )}
                {notification.isRead && <div className="w-2 h-2" />}
              </div>

              {/* Icon */}
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-sipheron-text-primary' : 'text-sipheron-text-secondary'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-sipheron-text-muted mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-sipheron-text-muted/50">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-sipheron-purple/10 text-sipheron-purple border border-sipheron-purple/20">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification);
                        }}
                        className="p-2 rounded-lg hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-green transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => deleteNotification(e, notification.id)}
                      className="p-2 rounded-lg hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-red transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notification);
                      }}
                      className="p-2 rounded-lg hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-purple transition-colors"
                      title="View"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <span className="text-xs text-sipheron-text-muted">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-sipheron-text-muted text-xs hover:bg-white/[0.05] transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-sipheron-text-muted text-xs hover:bg-white/[0.05] transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <h3 className="text-sm font-medium text-sipheron-text-primary mb-2 flex items-center gap-2">
          <Archive className="w-4 h-4 text-sipheron-purple" />
          Notification Preferences
        </h3>
        <p className="text-xs text-sipheron-text-muted mb-3">
          Configure which events trigger notifications
        </p>
        <div className="flex flex-wrap gap-2">
          {['Hash Confirmations', 'API Key Changes', 'Team Activity', 'Billing Alerts'].map((pref) => (
            <label key={pref} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] cursor-pointer hover:bg-white/[0.05] transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-sipheron-text-muted text-sipheron-purple focus:ring-sipheron-purple/20" />
              <span className="text-xs text-sipheron-text-secondary">{pref}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
