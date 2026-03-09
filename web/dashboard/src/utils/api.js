/**
 * @file api.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/utils/api.js
 * @description Frontend utility functions and API clients.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('sipheron_csrf_token');
        if (token) {
            config.headers['X-CSRF-Token'] = token;
        }
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });
    failedQueue = [];
}

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
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                    window.location.href = '/auth/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    // Fix 1.16: JWT is now set in HttpOnly cookie by server
    const { data } = await api.post('/auth/login', { email, password });
    if (data.csrfToken && typeof window !== 'undefined') {
        localStorage.setItem('sipheron_csrf_token', data.csrfToken);
    }
    return data;
};

export const registerAdmin = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    return data;
};

export const isAuthenticated = async () => {
    try {
        // Hit the health-like endpoint that requires auth; any 2xx means valid session
        await api.get('/organizations/my');
        return true;
    } catch (error) {
        // Only invalidate session strictly on 401/403
        if (error.response?.status === 401 || error.response?.status === 403) {
            return false;
        }
        // On 500/Timeout we assume backend is struggling but session is legally stored 
        return true;
    }
};

export const logout = async () => {
    // Fix 1.16: Call server logout endpoint to clear HttpOnly cookie
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    }

    if (typeof window !== 'undefined') {
        localStorage.removeItem('sipheron_csrf_token');
        // Redirect to login page
        window.location.href = '/auth/login';
    }
};
