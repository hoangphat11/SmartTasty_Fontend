"use client";

import Providers from "@/components/commons/Providers/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Providers>
  );
}
