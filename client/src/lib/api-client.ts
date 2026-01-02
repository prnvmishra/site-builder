import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
    }
});

// Simple auth functions
export const signIn = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/sign-in', { email, password });
        return response.data;
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
};

export const signUp = async (email: string, password: string, name: string) => {
    try {
        const response = await api.post('/auth/sign-up', { email, password, name });
        return response.data;
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
};

export const getSession = async () => {
    try {
        const response = await api.get('/auth/session');
        return response.data;
    } catch (error) {
        console.error('Get session error:', error);
        throw error;
    }
};

export default api;
