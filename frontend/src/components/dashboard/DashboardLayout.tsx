/**
 * @file DashboardLayout.tsx
 * @description Dashboard layout with auth protection
 * Updated to use AuthContext and Outlet for React Router
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

export const DashboardLayout: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [gKeyPressed, setGKeyPressed] = useState(false);

  // Navigation shortcuts
  const handleGotoShortcut = useCallback((key: string) => {
    const routes: Record<string, string> = {
      'h': '/dashboard/hashes',
      'a': '/dashboard/analytics',
      't': '/dashboard/team',
      'k': '/dashboard/keys',
      's': '/dashboard/settings',
      'b': '/dashboard/billing',
      'u': '/dashboard/usage',
      'n': '/dashboard/notifications',
      'd': '/dashboard',
    };
    
    if (routes[key]) {
      navigate(routes[key]);
      return true;
    }
    return false;
  }, [navigate]);

  // Handle keyboard shortcuts
  useEffect(() => {
    let gKeyTimeout: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input/textarea
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      // Escape to close modals
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setShowShortcutsHelp(false);
        setGKeyPressed(false);
        return;
      }

      // Cmd/Ctrl + K - Open Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      // ? - Show keyboard shortcuts help (when not typing)
      if (e.key === '?' && !isTyping) {
        e.preventDefault();
        setShowShortcutsHelp(true);
        return;
      }

      // / - Alternative shortcut for command palette (when not typing)
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      // N - New/Anchor (when not typing)
      if ((e.key === 'n' || e.key === 'N') && !isTyping) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-anchor-modal'));
        navigate('/dashboard/hashes');
        return;
      }

      // Go to shortcuts (g + key)
      if (e.key === 'g' && !isTyping) {
        e.preventDefault();
        setGKeyPressed(true);
        gKeyTimeout = setTimeout(() => setGKeyPressed(false), 1000);
        return;
      }

      // Handle second key after 'g'
      if (gKeyPressed && !isTyping) {
        if (handleGotoShortcut(e.key.toLowerCase())) {
          e.preventDefault();
          setGKeyPressed(false);
          clearTimeout(gKeyTimeout);
        }
      }
    };

    const handleOpenCommandPalette = () => {
      setIsCommandPaletteOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenCommandPalette);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenCommandPalette);
      clearTimeout(gKeyTimeout);
    };
  }, [gKeyPressed, handleGotoShortcut]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-sipheron-base flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-sipheron-base">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={user}
      />

      {/* Topbar */}
      <div
        style={{
          marginLeft: isSidebarCollapsed ? '64px' : '240px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Topbar />
      </div>

      {/* Main Content */}
      <main
        className="pt-16 min-h-screen"
        style={{
          marginLeft: isSidebarCollapsed ? '64px' : '240px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      {/* G key pressed indicator */}
      {gKeyPressed && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-sipheron-surface border border-sipheron-purple/30 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <span className="text-sm text-sipheron-text-secondary">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.1] text-sipheron-text-primary font-mono text-xs mx-1">H</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.1] text-sipheron-text-primary font-mono text-xs mx-1">A</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.1] text-sipheron-text-primary font-mono text-xs mx-1">T</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.1] text-sipheron-text-primary font-mono text-xs mx-1">S</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.1] text-sipheron-text-primary font-mono text-xs mx-1">...</kbd>
            to navigate
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
