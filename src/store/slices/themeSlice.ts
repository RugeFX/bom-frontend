import type { StateCreator } from "zustand";

export type Theme = "dark" | "light" | "system";

export interface ThemeSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
  theme: "system",
  setTheme(theme) {
    set(() => ({ theme }));
  },
});
