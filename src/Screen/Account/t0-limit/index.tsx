"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBrokerStore } from "@/store/auth/useBrokerStore";
import { useAppConfigStore } from "@/store/config/useAppConfigStore";
import BppT0LimitForm from "@/components/features/t0Limit/form";

export default function T0LimitPage() {
  const router = useRouter();
  const { broker } = useBrokerStore();
  const { featT0Limit } = useAppConfigStore();

  useEffect(() => {
    if (!broker) {
      router.replace("/login");
    }

    if (!featT0Limit) {
      router.replace("/404");
    }
  }, [broker, featT0Limit, router]);

  if (!broker || !featT0Limit) return null;

  return <BppT0LimitForm />;
}
