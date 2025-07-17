"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBrokerStore } from "@/store/auth/useBrokerStore";
import { useLocale } from "@/context/locale";

export default function TokenLoginPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { loginAction } = useBrokerStore();
  const { messages } = useLocale();
  const router = useRouter();

  const t = (key: string) => messages[key] || key;

  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/app/init?token=${token}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();

        if (result.status === "success") {
          const broker = result.data?.broker;
          if (broker) {
            await loginAction(broker, token!, "/business-goal");
            router.push("/business-goal");
            return;
          }
        }
        setError(true);
      } catch (err) {
        console.error("Token login failed:", err);
        setError(true);
      }
    };

    if (token) {
      fetchInit();
    } else {
      setError(true);
    }
  }, [loginAction, router, token]);

  if (!error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold text-green-600 dark:text-white">
          {t("logging_in_title")}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-center px-4">
      <div className="border p-8 rounded shadow bg-white dark:bg-slate-800">
        <h1 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
          {t("error")}
        </h1>
        <Link
          href="/login"
          className="text-green-700 hover:underline text-lg dark:text-green-400"
        >
          {t("go_back_home")}
        </Link>
      </div>
    </div>
  );
}
