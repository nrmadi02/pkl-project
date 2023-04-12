import { SidebarSlice, createSidebarSlice } from "./sidebarSlice";
import { create } from "zustand";

type StoreState = SidebarSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createSidebarSlice(...a),
}));
