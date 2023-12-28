import type { StateCreator } from "zustand";

type NavItems = { [key: string]: boolean };

export interface NavSlice {
  navItemsState: NavItems;
  navActions: {
    setItemState: (key: string, newState: boolean) => void;
    toggleItemState: (key: string) => void;
  };
}

export const createNavSlice: StateCreator<NavSlice> = (set) => ({
  navItemsState: {},
  navActions: {
    setItemState(key, newState) {
      set((state) => ({ navItemsState: { ...state.navItemsState, [key]: newState } }));
    },
    toggleItemState(key) {
      set((state) => ({
        navItemsState: { ...state.navItemsState, [key]: !state.navItemsState[key] },
      }));
    },
  },
});
