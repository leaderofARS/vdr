/**
 * @file DashboardLayout.tsx
 * @description Dashboard layout with auth protection
 * Updated to use AuthContext and Outlet for React Router
 */

import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';

export const DashboardLayout: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        <Topbar 
          onSearchClick={() => setIsCommandPaletteOpen(true)} 
          user={user}
        />
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
    </div>
  );
};

export default DashboardLayout;
