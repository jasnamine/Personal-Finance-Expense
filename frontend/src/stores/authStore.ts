import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "../models/Authetication";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (data: Partial<AuthState>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,

        setAuth: (data) =>
          set((state) => ({ ...state, ...data }), false, "auth/setAuth"),

        logout: () =>
          set(
            { user: null, accessToken: null, isAuthenticated: false },
            false,
            "auth/logout",
          ),
      }),
      {
        name: "auth-storage",
      },
    ),
    {
      name: "AuthStore",
    },
  ),
);
