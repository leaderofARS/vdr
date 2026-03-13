/**
 * @file AuthContext.tsx
 * @description Authentication context for SipHeron VDR
 * Provides user state, login, register, logout, and refresh functionality
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api, { login as apiLogin, register as apiRegister, logout as apiLogout, isAuthenticated } from '../utils/api';

interface Organization {
  id: string;
  name: string;
  plan: string;
  slug?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  organization?: Organization;
  orgRole?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, organizationName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setAuthChecked] = useState(false);

  const refreshUser = async () => {
    try {
      // Try to get user data from /api/org which returns org + user info
      const { data } = await api.get('/api/org');
      if (data.user) {
        setUser(data.user);
      } else if (data.organization) {
        // Fallback: construct user from org data if available
        setUser({
          id: data.user?.id || 'unknown',
          email: data.user?.email || 'unknown',
          name: data.user?.name || 'User',
          organization: data.organization,
          orgRole: data.user?.role || 'member',
        });
      }
    } catch {
      setUser(null);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          await refreshUser();
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
      // Suppress unused warning - authChecked is for future auth state persistence
      void setAuthChecked;
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    if (data.user) {
      setUser(data.user);
    } else {
      // Fallback: refresh user from API
      await refreshUser();
    }
  };

  const register = async (name: string, email: string, password: string, organizationName?: string) => {
    const data = await apiRegister(name, email, password, organizationName);
    if (data.user) {
      setUser(data.user);
    } else {
      await refreshUser();
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated: !!user,
        login, 
        register, 
        logout, 
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
