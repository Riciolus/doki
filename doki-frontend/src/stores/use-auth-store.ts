import { authService } from "@/services/auth.service";
import { User } from "@/types/auth.type";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await authService.getMe();
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (err) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }

    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
