import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '@/api/client';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  // Actions
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setupRole: (role: UserRole) => Promise<void>;
  toggleActiveRole: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      login: async (phone: string) => {
        set({ isLoading: true });
        try {
          await apiClient.post('/auth/otp/send', { phone });
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOtp: async (phone: string, otp: string) => {
        set({ isLoading: true });
        try {
          const { data } = await apiClient.post('/auth/otp/verify', { phone, otp });

          const { user, token, refreshToken } = data.data;

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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Called when persist has rehydrated the store
        state?.setHasHydrated(true);
      },
    }
  )
);
