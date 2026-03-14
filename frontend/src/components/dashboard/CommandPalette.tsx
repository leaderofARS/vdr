import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import {
  Search,
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
  FileText,
  User,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  section: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentHashes, setRecentHashes] = useState<Array<{hash: string; metadata: string}>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      inputRef.current?.focus();
      fetchRecentHashes();
    }
  }, [isOpen]);

  // Fetch recent hashes
  const fetchRecentHashes = useCallback(async () => {
    try {
      const { data } = await api.get('/api/hashes', { params: { limit: 3 } });
      const hashes = (data.data || []).slice(0, 3);
      setRecentHashes(hashes);
    } catch {
      // Silently fail - recent hashes are optional
      setRecentHashes([]);
    }
  }, []);

  // Navigation helper
  const goTo = (path: string) => {
    navigate(path);
    onClose();
  };

  // Open anchor modal on hashes page
  const openAnchorModal = () => {
    window.dispatchEvent(new CustomEvent('open-anchor-modal'));
    navigate('/dashboard/hashes');
    onClose();
  };

  // Build dynamic recent commands
  const recentCommands: CommandItem[] = recentHashes.length > 0 
    ? recentHashes.map((h, i) => ({
        id: `recent-${i}`,
        title: h.metadata || 'Untitled Document',
        subtitle: `Hash: ${h.hash.slice(0, 16)}...`,
        icon: FileText,
        section: 'Recent',
        action: () => goTo(`/dashboard/hashes/${h.hash}`),
      }))
    : [
        { id: 'recent-empty', title: 'No recent documents', icon: FileText, section: 'Recent', action: () => goTo('/dashboard/hashes') },
      ];

  // Define all commands
  const allCommands: CommandItem[] = [
    // Pages
    { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard, section: 'Pages', action: () => goTo('/dashboard') },
    { id: 'hashes', title: 'Hashes', icon: Hash, section: 'Pages', action: () => goTo('/dashboard/hashes') },
    { id: 'bulk-verify', title: 'Bulk Verify', icon: Zap, section: 'Pages', action: () => goTo('/dashboard/bulk-verify') },
    { id: 'analytics', title: 'Analytics', icon: BarChart3, section: 'Pages', action: () => goTo('/dashboard/analytics') },
    { id: 'api-keys', title: 'API Keys', icon: Key, section: 'Pages', action: () => goTo('/dashboard/keys') },
    { id: 'team', title: 'Team', icon: Users, section: 'Pages', action: () => goTo('/dashboard/team') },
    { id: 'webhooks', title: 'Webhooks', icon: Webhook, section: 'Pages', action: () => goTo('/dashboard/webhooks') },
    { id: 'audit-log', title: 'Audit Log', icon: ClipboardList, section: 'Pages', action: () => goTo('/dashboard/audit') },
    { id: 'playground', title: 'Playground', icon: FlaskConical, section: 'Pages', action: () => goTo('/dashboard/playground') },
    { id: 'embed', title: 'Embed & Share', icon: Share2, section: 'Pages', action: () => goTo('/dashboard/embed') },
    { id: 'usage', title: 'Usage', icon: PieChart, section: 'Pages', action: () => goTo('/dashboard/usage') },
    { id: 'settings', title: 'Settings', icon: Settings, section: 'Pages', action: () => goTo('/dashboard/settings') },
    { id: 'billing', title: 'Billing', icon: CreditCard, section: 'Pages', action: () => goTo('/dashboard/billing') },
    { id: 'notifications', title: 'Notifications', icon: Bell, section: 'Pages', action: () => goTo('/dashboard/notifications') },

    // Recent
    ...recentCommands,

    // Actions
    { id: 'action-anchor', title: 'Anchor New Document', icon: Plus, shortcut: 'N', section: 'Actions', action: openAnchorModal },
    { id: 'action-verify', title: 'Verify Hash', icon: ExternalLink, section: 'Actions', action: () => goTo('/dashboard/bulk-verify') },
    { id: 'action-profile', title: 'View Profile', icon: User, section: 'Actions', action: () => goTo('/dashboard/settings') },

    // Docs
    { id: 'docs-api', title: 'API Documentation', icon: ExternalLink, section: 'Documentation', action: () => window.open('/docs/api', '_blank') },
    { id: 'docs-cli', title: 'CLI Reference', icon: ExternalLink, section: 'Documentation', action: () => window.open('/docs/cli', '_blank') },
  ];

  // Filter commands based on search
  const filteredCommands = searchQuery
    ? allCommands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCommands;

  // Group by section
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.section]) acc[cmd.section] = [];
    acc[cmd.section].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const sections = Object.keys(groupedCommands);
  const flatCommands = sections.flatMap((section) => groupedCommands[section]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatCommands.length) % flatCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        flatCommands[selectedIndex]?.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-sipheron-surface border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
          <Search className="w-5 h-5 text-sipheron-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search pages, hashes, team members..."
            className="flex-1 bg-transparent text-sipheron-text-primary placeholder:text-sipheron-text-muted outline-none"
          />
          <kbd className="px-2 py-1 rounded bg-white/[0.05] text-xs text-sipheron-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {sections.map((section) => (
            <div key={section}>
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-sipheron-text-muted/50">
                {section}
              </div>
              {groupedCommands[section].map((cmd) => {
                const globalIdx = flatCommands.findIndex((c) => c.id === cmd.id);
                const isSelected = globalIdx === selectedIndex;
                const Icon = cmd.icon;

                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5
                      transition-colors duration-150
                      ${isSelected ? 'bg-sipheron-purple/10' : 'hover:bg-white/[0.03]'}
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? 'text-sipheron-purple' : 'text-sipheron-text-muted'
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <div
                        className={`text-sm ${
                          isSelected
                            ? 'text-sipheron-text-primary'
                            : 'text-sipheron-text-secondary'
                        }`}
                      >
                        {cmd.title}
                      </div>
                      {cmd.subtitle && (
                        <div className="text-xs text-sipheron-text-muted">
                          {cmd.subtitle}
                        </div>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-sipheron-text-muted">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-sipheron-text-muted">
              No results found for &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-4 text-[10px] text-sipheron-text-muted">
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-white/[0.05]">↑</kbd>
              <kbd className="px-1 rounded bg-white/[0.05]">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-white/[0.05]">↵</kbd>
              to select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
