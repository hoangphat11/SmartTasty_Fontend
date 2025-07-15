"use client";

import { useBrokerStore } from "@/store/auth/useBrokerStore";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ThemeToggleButton from "@/components/layouts/ThemeToggleButton";
import LanguageSelector from "@/components/layouts/LanguageSelector";
import { useLocale } from "@/context/Locale";

export default function NavBar() {
  const { broker, isLoggedIn, logout } = useBrokerStore();
  const { messages } = useLocale();

  const t = (key: string) => messages[key] || key;

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 bg-background border-b border-border transition-colors">
      <div className="flex flex-wrap items-center justify-between py-3 gap-4">
        {/* Sidebar toggle (mobile only) */}
        <button
          onClick={() => console.log("Toggle sidebar")}
          className="lg:hidden text-text text-2xl"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        {/* User Info */}
        {isLoggedIn && broker && (
          <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8 text-sm border border-border px-4 py-3 rounded bg-button text-text">
            <div className="flex items-center gap-2 min-w-[180px]">
              <span className="opacity-70">{t("broker_name_label")}:</span>
              <span className="text-link font-medium truncate max-w-[160px]">
                {broker.name}
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-[180px]">
              <span className="opacity-70">{t("broker_location_label")}:</span>
              <span className="text-link font-medium truncate max-w-[160px]">
                {broker.branch?.label}
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-[160px]">
              <span className="opacity-70">{t("broker_code_label")}:</span>
              <span className="text-link font-medium truncate max-w-[120px]">
                {broker.code}
              </span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggleButton />
          <LanguageSelector />
          <button
            onClick={() => logout(true)}
            className="p-2 rounded bg-button hover:bg-button-hover border border-border transition-colors"
            title={t("logout_btn_title") || "Đăng xuất"}
          >
            <LogoutOutlinedIcon className="w-5 h-5 text-text" />
          </button>
        </div>
      </div>
    </nav>
  );
}
