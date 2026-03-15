import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  fullname: string;
  roles: string[];
  address?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null; // Add this
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void; // Update this
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "gusto-auth-storage" },
  ),
);
