import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';
import { authApi } from '../services/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(email, password);
          if (response.success && response.user) {
            set({
              user: response.user,
              token: response.token ?? null,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(data);
          if (response.success && response.user) {
            set({
              user: response.user,
              token: response.token ?? null,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          await new Promise<void>((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
              if (!firebaseUser) {
                set({
                  user: null,
                  token: null,
                  isAuthenticated: false,
                  isLoading: false,
                });
                unsubscribe();
                resolve();
                return;
              }

              const response = await authApi.getMe();
              if (response.success && response.user) {
                set({
                  user: response.user,
                  token: response.token ?? null,
                  isAuthenticated: true,
                  isLoading: false,
                });
              }
              unsubscribe();
              resolve();
            });
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateProfile: async (data) => {
        const response = await authApi.updateProfile(data);
        if (response.success && response.user) {
          set({ user: response.user });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

