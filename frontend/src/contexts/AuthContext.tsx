/**
 * @file AuthContext.tsx
 * @description Authentication context for SipHeron VDR
 * Provides user state, login, register, logout, and refresh functionality
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api, { login as apiLogin, register as apiRegister, logout as apiLogout, isAuthenticated } from '../utils/api';
import { GlobalLoader } from '../components/shared/GlobalLoader';

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
      // Try to get org stats which includes user info
      const { data } = await api.get('/api/org/stats');
      if (data.user) {
        setUser({
          id: data.user.id || 'unknown',
          email: data.user.email || 'unknown',
          name: data.user.name || data.user.email?.split('@')[0] || 'User',
          role: data.user.role,
          organization: data.org ? {
            id: data.org.id,
            name: data.org.name,
            plan: 'standard'
          } : undefined,
        });
      } else if (data.org) {
        // Fallback: construct minimal user from org context
        setUser({
          id: 'unknown',
          email: data.user?.email || 'unknown',
          name: data.user?.name || 'User',
          organization: {
            id: data.org.id,
            name: data.org.name,
            plan: 'standard'
          },
        });
      }
    } catch (err: any) {
      // If we get a 401/403, definitely not authenticated
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
      }
      // For other errors, keep current user state (don't null it)
      // The API interceptor will handle token refresh
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
    };
    checkAuth();
  }, []);

  // Add event listener for storage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sipheron_csrf_token') {
        if (!e.newValue) {
          // Token was removed in another tab
          setUser(null);
        } else if (e.oldValue !== e.newValue && !user) {
          // Token was added in another tab, refresh user
          refreshUser();
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

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

  if (loading) {
    return <GlobalLoader />;
  }

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
