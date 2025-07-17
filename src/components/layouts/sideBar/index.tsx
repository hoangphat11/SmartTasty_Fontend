"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/context/locale";
import { useUiStore } from "@/store/UI/useUiStore";

// MUI Icons
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

const nav = [
  {
    iconComponent: <EmojiEventsIcon fontSize="small" />,
    title: "accomplishment_title",
    url: "/business-goal",
  },
  {
    iconComponent: <GroupIcon fontSize="small" />,
    title: "account_management",
    url: "/account",
  },
  {
    iconComponent: <TipsAndUpdatesIcon fontSize="small" />,
    title: "suggest",
    url: "#",
  },
  {
    iconComponent: <SupportAgentIcon fontSize="small" />,
    title: "support",
    url: "#",
  },
  {
    iconComponent: <CheckCircleOutline fontSize="small" />,
    title: "Test",
    url: "/test",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mini, setMini] = useState(false); // chỉ áp dụng cho desktop
  const [isMobile, setIsMobile] = useState(false);
  const { messages } = useLocale();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 1024;
      setIsMobile(isNowMobile);

      if (isNowMobile) {
        setMini(false); // mobile: always show full
      }
    };

    handleResize(); // init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeIndex = useMemo(() => {
    return nav.findIndex((item) => pathname === item.url);
  }, [pathname]);

  const t = (key: string) => messages[key] || key;

  return (
    <>
      {/* Backdrop overlay on mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        id="v-sidebar"
        className={cn(
          "z-40 print:hidden shadow transition-transform duration-300 bg-background",
          // Positioning
          "absolute lg:relative top-0 left-0 h-screen",
          // Width
          isMobile ? "w-[256px]" : mini ? "lg:w-14" : "lg:w-[256px]",
          // Slide-in effect
          sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex flex-col py-4 w-full text-text transition-all">
          <div className="flex items-center justify-between px-1">
            {!mini && (
              <Link href="/" className="my-4">
                <Image
                  src="/img/commons/logo-md-right.png"
                  alt="Phu Hung Logo"
                  width={153}
                  height={88}
                />
              </Link>
            )}
            {/* Only show mini toggle on desktop */}
            <button
              onClick={() => setMini(!mini)}
              className="hidden lg:inline-block text-text"
              title={t("homepage_btn_title")}
            >
              <MenuIcon fontSize="small" />
            </button>
          </div>

          <nav className="mt-4">
            {nav.map((item, i) => (
              <Link
                href={item.url}
                key={i}
                onClick={() => {
                  if (isMobile) setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-text transition-colors",
                  i === activeIndex
                    ? "bg-active-bg font-semibold"
                    : "hover:bg-button-hover"
                )}
              >
                <span className="text-text">{item.iconComponent}</span>

                {(!mini || isMobile) && (
                  <span className="text-sm font-medium">{t(item.title)}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
