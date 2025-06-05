import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                try {
                    set({ isLoading: true });
                    const response = await api.post('/auth/login', { email, password });
                    const { user, token } = response.data.data;

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({ isLoading: false });
                    throw new Error(error.response?.data?.message || 'Login failed');
                }
            },

            register: async (name: string, email: string, password: string) => {
                try {
                    set({ isLoading: true });
                    const response = await api.post('/auth/register', { name, email, password });
                    const { user, token } = response.data.data;

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({ isLoading: false });
                    throw new Error(error.response?.data?.message || 'Registration failed');
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                });
            },

            checkAuth: async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        set({ isAuthenticated: false });
                        return;
                    }

                    const response = await api.get('/auth/me');
                    const user = response.data.data;

                    set({
                        user,
                        token,
                        isAuthenticated: true
                    });
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
