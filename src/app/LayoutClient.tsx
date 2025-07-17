"use client";

import Providers from "@/components/layouts/providers";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
