import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ThemeSlice, createThemeSlice } from "./slices/themeSlice";
import { type AuthSlice, createAuthSlice } from "./slices/authSlice";
import { type NavSlice, createNavSlice } from "./slices/navSlice";

export const useStore = create<AuthSlice & ThemeSlice & NavSlice>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createThemeSlice(...a),
      ...createNavSlice(...a),
    }),
    {
      name: "user-info",
      partialize: (state) => ({
        accessToken: state.accessToken,
        userData: {
          id: state.userData?.id,
          username: state.userData?.username,
          staff_code: state.userData?.staff_code,
          role_code: state.userData?.staff?.role_code,
        },
        theme: state.theme,
        navItemsState: state.navItemsState,
      }),
    }
  )
);
// Auth store hooks
export const useAccessToken = () => useStore((state) => state.accessToken);
export const useUserData = () => useStore((state) => state.userData);
export const usePrivileges = () => useStore((state) => state.privileges);
export const useAuthActions = () => useStore((state) => state.authActions);

// Theme store hooks
export const useTheme = () => useStore((state) => state.theme);
export const useSetTheme = () => useStore((state) => state.setTheme);

// Nav store hooks
export const useNavItemsState = () => useStore((state) => state.navItemsState);
export const useNavActions = () => useStore((state) => state.navActions);
