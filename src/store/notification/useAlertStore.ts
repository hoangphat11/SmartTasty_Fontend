import { create } from "zustand";

export type AlertVariant = "default" | "error" | "success" | "warning" | "info";

interface AlertStore {
  active: boolean;
  variant: AlertVariant;
  message: string;

  show: (message: string, variant?: AlertVariant) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  clear: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  active: false,
  variant: "default",
  message: "",

  show: (message, variant = "default") =>
    set({ active: true, variant, message }),

  showError: (message) => set({ active: true, variant: "error", message }),

  showSuccess: (message) => set({ active: true, variant: "success", message }),

  clear: () => set({ active: false, message: "", variant: "default" }),
}));
