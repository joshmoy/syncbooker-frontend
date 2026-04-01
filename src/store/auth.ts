import { create } from "zustand";
import { User } from "@/types/auth";
import { authService } from "@/lib/auth";

const DASHBOARD_INTELLIGENCE_STORAGE_KEY = "dashboard-intelligence-widget";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setToken: (token) =>
    set({
      token,
      isAuthenticated: !!token,
    }),

  logout: () => {
    authService.logout();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DASHBOARD_INTELLIGENCE_STORAGE_KEY);
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  initialize: () => {
    const user = authService.getCurrentUser();
    const token = authService.getToken();
    set({
      user,
      token,
      isAuthenticated: !!token,
      isLoading: false,
    });
  },
}));
