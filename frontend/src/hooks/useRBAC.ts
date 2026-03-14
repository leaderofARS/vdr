import { useState, useEffect } from 'react';
import api from '@/utils/api';

type UserRole = 'owner' | 'admin' | 'member';

interface RBACState {
  role: UserRole | null;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  loading: boolean;
  error: string | null;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 3,
  admin: 2,
  member: 1
};

export function useRBAC(): RBACState & {
  hasRole: (minRole: UserRole) => boolean;
  requireRole: (minRole: UserRole) => boolean;
} {
  const [state, setState] = useState<RBACState>({
    role: null,
    isOwner: false,
    isAdmin: false,
    isMember: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Get organization stats which includes user role
        const { data } = await api.get('/api/org/stats');
        
        // Determine role from response
        // If user can access this, they at least have member access
        // We need to infer role from the data or check member list
        const userRole: UserRole = data.user?.role?.toLowerCase() || 'member';
        
        setState({
          role: userRole,
          isOwner: userRole === 'owner',
          isAdmin: userRole === 'admin' || userRole === 'owner',
          isMember: true,
          loading: false,
          error: null
        });
      } catch (err: any) {
        setState({
          role: null,
          isOwner: false,
          isAdmin: false,
          isMember: false,
          loading: false,
          error: err?.response?.data?.error || 'Failed to load user permissions'
        });
      }
    };

    fetchUserRole();
  }, []);

  const hasRole = (minRole: UserRole): boolean => {
    if (!state.role) return false;
    return (ROLE_HIERARCHY[state.role] || 0) >= (ROLE_HIERARCHY[minRole] || 0);
  };

  const requireRole = (minRole: UserRole): boolean => {
    return hasRole(minRole);
  };

  return {
    ...state,
    hasRole,
    requireRole
  };
}

export default useRBAC;
