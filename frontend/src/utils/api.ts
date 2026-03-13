/**
 * @file api.ts
 * @description Frontend API client for SipHeron VDR
 * Ported from web/dashboard/src/utils/api.js
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.sipheron.com';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // sends HttpOnly cookie vdr_token automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach CSRF token from localStorage if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sipheron_csrf_token');
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    }
  }
  return config;
});

// Token refresh queue management
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(undefined);
    }
  });
  failedQueue = [];
}

// Global 401 handler - attempt token refresh, but DON'T auto-redirect
// Let ProtectedRoute handle redirects to avoid redirecting on public pages
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Don't auto-redirect here - let ProtectedRoute handle it
        // This prevents redirect loops and allows public pages to work
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth helper functions
export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  if (data.csrfToken && typeof window !== 'undefined') {
    localStorage.setItem('sipheron_csrf_token', data.csrfToken);
  }
  return data;
};

export const register = async (name: string, email: string, password: string, organizationName?: string) => {
  const { data } = await api.post('/auth/register', { 
    name, 
    email, 
    password, 
    organizationName 
  });
  return data;
};

export const isAuthenticated = async () => {
  try {
    // Hit the health-like endpoint that requires auth; any 2xx means valid session
    await api.get('/api/org');
    return true;
  } catch (error) {
    // Only invalidate session strictly on 401/403
    if ((error as { response?: { status: number } }).response?.status === 401 || 
        (error as { response?: { status: number } }).response?.status === 403) {
      return false;
    }
    // On 500/Timeout we assume backend is struggling but session is legally stored 
    return true;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem('sipheron_csrf_token');
    window.location.href = '/auth/login';
  }
};

export default api;
