"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "@/context/locale";
import BppForceSellProcessing from "@/components/features/forcesell/processing";
import BppForceSellHistory from "@/components/features/forcesell/history";

export default function ForceSellPage() {
  const { messages } = useLocale();
  const t = (key: string) => messages[key] || key;

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "process";
  const [activeTab, setActiveTab] = useState<"process" | "history">(
    currentTab === "history" ? "history" : "process"
  );

  const changeTab = (tab: "process" | "history") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    if (tab === "process") {
      params.set("pageA", "1"); // Reset trang
    } else {
      params.set("pageH", "1");
    }
    router.push(`?${params.toString()}`);
    setActiveTab(tab);
  };

  useEffect(() => {
    if (currentTab !== activeTab) {
      setActiveTab(currentTab === "history" ? "history" : "process");
    }
  }, [activeTab, currentTab]);

  return (
    <div>
      {/* Tab headers */}
      <div className="flex border-b border-gray-300 dark:border-slate-600">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "process"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
          onClick={() => changeTab("process")}
          title={t("forcesell_process_subtitle")}
        >
          {t("forcesell_tab_process")}
        </button>
        <button
          className={`ml-4 px-4 py-2 font-semibold ${
            activeTab === "history"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
          onClick={() => changeTab("history")}
          title={t("forcesell_history_subtitle")}
        >
          {t("forcesell_tab_history")}
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "process" && <BppForceSellProcessing />}
        {activeTab === "history" && <BppForceSellHistory />}
      </div>
    </div>
  );
}
