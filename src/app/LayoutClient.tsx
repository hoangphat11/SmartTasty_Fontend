"use client";

import Providers from "@/components/commons/Providers";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
