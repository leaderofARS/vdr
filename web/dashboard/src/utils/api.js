import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: API_BASE,
});

// Request interceptor to add JWT
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('vdr_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) localStorage.setItem('vdr_token', data.token);
    return data;
};

export const registerAdmin = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    return data;
};

export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('vdr_token');
    }
};
