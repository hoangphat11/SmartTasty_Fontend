import { create } from "zustand";

export type ThemeMode = "light" | "dark";

interface ThemeStore {
  themeMode: ThemeMode;
  initTheme: () => void;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const LOCAL_STORAGE_THEME_KEY = "theme";

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themeMode: "light",

  initTheme: () => {
    if (typeof window === "undefined") return;

    let theme = localStorage.getItem(
      LOCAL_STORAGE_THEME_KEY
    ) as ThemeMode | null;

    if (theme !== "dark" && theme !== "light") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      theme = prefersDark ? "dark" : "light";
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    }

    document.documentElement.setAttribute("data-theme", theme);

    set({ themeMode: theme });
  },

  toggleTheme: () => {
    const current = get().themeMode;
    const newTheme = current === "light" ? "dark" : "light";

    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);

    document.documentElement.setAttribute("data-theme", newTheme);

    set({ themeMode: newTheme });
  },

  setTheme: (mode: ThemeMode) => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, mode);

    document.documentElement.setAttribute("data-theme", mode);

    set({ themeMode: mode });
  },
}));
