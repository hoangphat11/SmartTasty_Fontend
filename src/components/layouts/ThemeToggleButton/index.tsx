"use client";

import { useThemeStore } from "@/store/UI/useThemeStore";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeToggleButton = () => {
  const { themeMode, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-button border border-border text-text hover:bg-button-hover transition"
      title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
    >
      {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </button>
  );
};

export default ThemeToggleButton;
