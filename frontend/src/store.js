import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      backendUrl: import.meta.env.VITE_BACKEND_URL,
      isLoggedIn: false,
      userData: null,
      setIsLoggedIn: (value) => {
        set({ isLoggedIn: value });
      },
      setUserData: (data) => {
        set({ userData: data });
      },
    }),
    {
      name: "auth-store", // The key to use in localStorage
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userData: state.userData,
      }), // Only persist specific parts
    }
  )
);
