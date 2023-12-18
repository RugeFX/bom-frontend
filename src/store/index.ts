import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ThemeSlice, createThemeSlice } from "./slices/themeSlice";

export const useStore = create<ThemeSlice>()(
  persist(
    (...a) => ({
      ...createThemeSlice(...a),
    }),
    {
      name: "user-info",
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

// Theme store hooks
export const useTheme = () => useStore((state) => state.theme);
export const useSetTheme = () => useStore((state) => state.setTheme);
