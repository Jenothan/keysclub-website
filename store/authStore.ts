import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'Super Admin' | 'Admin' | 'user' | null;

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: Role;
  created_at?: string;
}

export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

interface AuthState {
  user: User | null;
  token: string | null;
  loggedInAt: number | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loggedInAt: null,
      isHydrated: false,
      setAuth: (user, token) => {
        const now = Date.now();
        set({ user, token, loggedInAt: now, isHydrated: true });
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
      },
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null, token: null, loggedInAt: null, isHydrated: true });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('auth-storage');
        }
      },
      setHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.loggedInAt && (Date.now() - state.loggedInAt > TWENTY_FOUR_HOURS_MS)) {
            state.logout();
          }
        }
        useAuthStore.setState({ isHydrated: true });
      }
    }
  )
);
