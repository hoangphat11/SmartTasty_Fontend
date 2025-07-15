"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppConfigStore } from "@/store/config/useAppConfigStore";

export function FeatT0LimitGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { featT0Limit } = useAppConfigStore();

  useEffect(() => {
    if (pathname.startsWith("/account/t0-limit") && !featT0Limit) {
      router.replace("/account");
    }
  }, [pathname, featT0Limit, router]);

  return <>{children}</>;
}
