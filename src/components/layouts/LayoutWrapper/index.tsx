"use client";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function BrokerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background transition-colors min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
