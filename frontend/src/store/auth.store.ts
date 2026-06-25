"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Profile } from "@/types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setProfile: (profile: Profile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("cf_token", token);
        }
        set({ user, token, isAuthenticated: true });
      },

      setProfile: (profile) => set({ profile }),

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cf_token");
        }
        set({ user: null, profile: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "cf-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
