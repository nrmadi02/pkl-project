import { StateCreator } from "zustand";

export interface SidebarSlice {
  isShow: boolean;
  isOpen: boolean;
  show: () => void;
  hide: () => void;
  open: () => void;
  close: () => void;
}

export const createSidebarSlice: StateCreator<SidebarSlice> = (set, get) => ({
  isShow: true,
  isOpen: false,
  hide: () => {
    set({ isShow: false });
  },
  show: () => {
    set({ isShow: true });
  },
  open: () => {
    set({ isOpen: true });
  },
  close: () => {
    set({ isOpen: false });
  },
});
