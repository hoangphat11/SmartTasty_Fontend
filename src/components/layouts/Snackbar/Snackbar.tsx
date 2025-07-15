"use client";

import { Snackbar as MuiSnackbar, Alert } from "@mui/material";
import { useAlertStore } from "@/store/notification/useAlertStore";

export default function Snackbar() {
  const { active, message, variant, clear } = useAlertStore();

  return (
    <MuiSnackbar
      open={active}
      autoHideDuration={4000}
      onClose={clear}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        severity={variant === "default" ? "info" : variant}
        onClose={clear}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
}
