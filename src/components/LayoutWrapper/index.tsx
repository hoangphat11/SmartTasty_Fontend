"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ClientOnly from "@/components/ClientOnly";

// Hàm loại bỏ locale (ví dụ: /en, /vi) ra khỏi pathname
function removeLocale(pathname: string) {
  const segments = pathname.split("/");
  if (segments.length > 2 && segments[1].length === 2) {
    segments.splice(1, 1); // loại bỏ phần locale
    return segments.join("/") || "/";
  }
  return pathname;
}

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientOnly>
      <InnerLayout>{children}</InnerLayout>
    </ClientOnly>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathWithoutLocale = removeLocale(pathname);

  const hideHeaderFooter = [
    "/login",
    "/register",
    "/register-business",
  ].includes(pathWithoutLocale);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
