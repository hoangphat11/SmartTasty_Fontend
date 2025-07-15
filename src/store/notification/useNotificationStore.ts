import { create } from "zustand";

interface NotificationStore {
  fsNotification: boolean | null;
  setFsNotification: (value: boolean | null) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  fsNotification: false,
  setFsNotification: (value) => set({ fsNotification: value }),
}));
