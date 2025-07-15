"use client";

import { useState } from "react";
import { useLocale } from "@/context/Locale";
import BppForceSellProcessing from "@/components/features/forcesell/processing";
import BppForceSellHistory from "@/components/features/forcesell/history";

export default function ForceSellPage() {
  const { messages } = useLocale();
  const t = (key: string) => messages[key] || key;

  const [activeTab, setActiveTab] = useState<"process" | "history">("process");

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
          onClick={() => setActiveTab("process")}
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
          onClick={() => setActiveTab("history")}
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
