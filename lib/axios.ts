import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid -> Logout user & Redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('auth-storage'); // Zustand persist key if we use it
                window.location.href = '/login';
            }
        }
        if (error.response?.status === 403) {
            // Forbidden (Role issues) -> Redirect to unauthorized page or dashboard
            if (typeof window !== 'undefined') {
                window.location.href = '/dashboard';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
