import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '@/api/client';
import type { User, UserRole, PartnerStatus } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // Actions
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setupRole: (role: UserRole) => Promise<void>;
  toggleActiveRole: () => Promise<void>;
  refreshUser: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: true,
      isAuthenticated: false,
      isInitialized: false,

      login: async (phone: string) => {
        set({ isLoading: true });
        try {
          await apiClient.post('/auth/otp/send', { phone });
        } finally {
          set({ isLoading: false });
        }
      },

      // Initialize auth from storage
      initialize: () => {
        const token = localStorage.getItem('nb_token');
        const userStr = localStorage.getItem('nb_user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
          } catch {
            localStorage.removeItem('nb_token');
            localStorage.removeItem('nb_user');
            set({ isLoading: false, isInitialized: true });
          }
        } else {
          set({ isLoading: false, isInitialized: true });
        }
      },

      verifyOtp: async (phone: string, otp: string) => {
        set({ isLoading: true });
        try {
          const { data } = await apiClient.post('/auth/otp/verify', { phone, otp });

          const { user, token, refreshToken } = data.data;

          localStorage.setItem('nb_token', token);
          localStorage.setItem('nb_refresh_token', refreshToken);

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          console.error('OTP verification failed:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('nb_token');
        localStorage.removeItem('nb_refresh_token');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      setupRole: async (role: UserRole) => {
        const { data } = await apiClient.post('/users/role', { role });
        set({ user: data.data });
      },

      toggleActiveRole: async () => {
        const currentUser = get().user;
        if (!currentUser || currentUser.roles.length < 2) return;

        const newRole = currentUser.activeRole === 'consumer' ? 'partner' : 'consumer';
        await get().setupRole(newRole);
      },

      refreshUser: async () => {
        try {
          const { data } = await apiClient.get('/users/me');
          set({ user: data.data });
        } catch (error) {
          console.error('Failed to refresh user:', error);
        }
      },
    }),
    {
      name: 'nb-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
