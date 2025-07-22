"use client";

import { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { useThemeStore } from "@/store/UI/useThemeStore";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { getMuiTheme } from "@/lib/mui/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { themeMode, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const muiTheme = getMuiTheme(themeMode);

  return (
    <ReduxProvider store={store}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ReduxProvider>
  );
}
