"use client";

import Header from "@/components/layouts/Header/header";
import Sidebar from "@/components/layouts/SideBar/SideBar";
import AlertSnackbar from "@/components/layouts/Snackbar/Snackbar";

export default function BrokerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 transition-colors dark:bg-slate-900 min-h-screen">
      <Header />

      <main className="relative md:flex">
        <Sidebar />
        <div id="main-container" className="w-full overflow-hidden p-4">
          {children}
        </div>
        <AlertSnackbar />
      </main>
    </div>
  );
}
