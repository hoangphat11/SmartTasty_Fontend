import { create } from "zustand";

interface UiStore {
  maintenanceMode: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (value: boolean) => void;
  setMaintenanceMode: (value: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  maintenanceMode: false,
  sidebarOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  setMaintenanceMode: (value) => set({ maintenanceMode: value }),
}));
