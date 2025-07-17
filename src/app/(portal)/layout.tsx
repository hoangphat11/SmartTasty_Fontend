"use client";

import Header from "@/components/layouts/header";
import Sidebar from "@/components/layouts/sideBar";
import AlertSnackbar from "@/components/layouts/snackBar";

export default function BrokerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background transition-colors min-h-screen">
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
