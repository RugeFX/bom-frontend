import type { MenuGroup, User } from "@/types/user";
import type { StateCreator } from "zustand";

export interface AuthSlice {
  accessToken?: string;
  userData?: User;
  privileges?: MenuGroup[];
  authActions: {
    setAccessToken: (accessToken?: string) => void;
    setUserData: (userData?: User) => void;
    setPrivileges: (privileges?: MenuGroup[]) => void;
    clearUserInfo: () => void;
  };
}

const initialState: Omit<AuthSlice, "authActions"> = {
  accessToken: undefined,
  userData: undefined,
  privileges: undefined,
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  ...initialState,
  authActions: {
    setAccessToken(accessToken) {
      set(() => ({ accessToken }));
    },
    setUserData(userData) {
      set(() => ({ userData }));
    },
    setPrivileges(privileges) {
      set(() => ({ privileges }));
    },
    clearUserInfo() {
      set(() => initialState);
    },
  },
});
