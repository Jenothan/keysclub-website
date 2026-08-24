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

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,
      setAuth: (user, token) => {
        set({ user, token });
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
      },
      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
      },
      setHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
