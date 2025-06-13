"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientOnly from "@/components/ClientOnly";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <InnerLayout>{children}</InnerLayout>
    </ClientOnly>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeaderFooter = ["/login", "/register"].includes(pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
