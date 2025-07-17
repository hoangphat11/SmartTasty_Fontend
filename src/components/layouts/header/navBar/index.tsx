"use client";

import { useState } from "react";
import { useBrokerStore } from "@/store/auth/useBrokerStore";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ThemeToggleButton from "@/components/layouts/themeToggleButton";
import LanguageSelector from "@/components/layouts/languageSelector";
import { useUiStore } from "@/store/UI/useUiStore";
import { useLocale } from "@/context/locale";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function NavBar() {
  const { broker, isLoggedIn, logout } = useBrokerStore();
  const { messages } = useLocale();
  const { toggleSidebar } = useUiStore();
  const [showUserInfo, setShowUserInfo] = useState(false);

  const t = (key: string) => messages[key] || key;

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 bg-background border-b border-border transition-colors relative z-50">
      <div className="flex flex-wrap items-center justify-between py-3 gap-4">
        {/* Sidebar toggle (mobile only) */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-text text-2xl"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        {/* User Info - Desktop */}
        {isLoggedIn && broker && (
          <div className="hidden md:flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8 text-sm border border-border px-4 py-3 rounded bg-button text-text">
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

        {/* User Info Toggle - Mobile */}
        {isLoggedIn && broker && (
          <div className="block md:hidden">
            <button
              onClick={() => setShowUserInfo((prev) => !prev)}
              className="p-2 rounded bg-button text-text border border-border"
              title={t("broker_info_title") || "Thông tin người dùng"}
            >
              <AccountCircleIcon fontSize="medium" />
            </button>
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

      {/* Mobile broker info popup */}
      {showUserInfo && isLoggedIn && broker && (
        <div className="absolute top-full right-4 mt-2 bg-background border border-border p-4 rounded shadow-lg z-50 w-[90vw] max-w-sm md:hidden">
          <div className="flex flex-col gap-2 text-sm">
            <div>
              <span className="opacity-70">{t("broker_name_label")}:</span>{" "}
              <span className="font-medium text-link">{broker.name}</span>
            </div>
            <div>
              <span className="opacity-70">{t("broker_location_label")}:</span>{" "}
              <span className="font-medium text-link">
                {broker.branch?.label}
              </span>
            </div>
            <div>
              <span className="opacity-70">{t("broker_code_label")}:</span>{" "}
              <span className="font-medium text-link">{broker.code}</span>
            </div>
            <button
              onClick={() => setShowUserInfo(false)}
              className="mt-2 text-sm underline text-link self-end"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
