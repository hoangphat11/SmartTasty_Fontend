"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import { useLocale } from "@/context/Locale";

interface CarebyItem {
  CAREBY: string;
  BROKERNAME: string;
}

export default function CarebyPage() {
  const { messages } = useLocale();
  const t = (key: string) => messages[key] || key;
  const [loading, setLoading] = useState(false);
  const [carebyData, setCarebyData] = useState<CarebyItem[]>([]);

  useEffect(() => {
    const fetchCareby = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/careby`, {
          method: "GET",
          credentials: "include",
        });
        const result = await res.json();
        setCarebyData(result.data?.careby || []);
      } catch (e) {
        console.error("Error fetching careby:", e);
      }
      setLoading(false);
    };

    fetchCareby();
  }, []);

  return (
    <div className="text-center">
      {/* Loading */}
      {loading && (
        <div className="mt-8">
          <CircularProgress size={50} color="error" />
          <div className="mt-4 font-bold text-gray-700 dark:text-white">
            {t("loading") || "Loading..."}
          </div>
        </div>
      )}

      {/* Image */}
      <div className="mx-auto max-w-[550px] w-full">
        <Image
          src="/img/commons/content.svg"
          alt="Content"
          width={550}
          height={300}
          className="w-full h-auto"
        />
      </div>

      {/* Careby list */}
      {carebyData.length > 0 && (
        <ul className="divide-y divide-gray-200 mt-6">
          {carebyData.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between py-3.5 px-3.5 hover:bg-gray-300 dark:hover:bg-slate-700"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                  {item.CAREBY}
                </p>
              </div>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm text-gray-900 dark:text-gray-300">
                  {item.BROKERNAME}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
