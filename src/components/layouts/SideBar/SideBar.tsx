"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/context/Locale";

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
  const [mini, setMini] = useState(false);
  const { messages } = useLocale();

  useEffect(() => {
    const handleResize = () => {
      setMini(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeIndex = useMemo(() => {
    return nav.findIndex((item) => pathname === item.url);
  }, [pathname]);

  const t = (key: string) => messages[key] || key;

  return (
    <aside
      id="v-sidebar"
      className={cn(
        "z-10 flex shadow transition-all print:hidden lg:sticky lg:top-0 lg:h-screen lg:flex-none",
        mini ? "w-14" : "w-[256px]"
      )}
    >
      <div
        className={cn(
          "flex flex-col py-4 w-full bg-background text-text transition-all",
          mini ? "w-14" : "w-[256px]"
        )}
      >
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
          <button
            onClick={() => setMini(!mini)}
            className="text-text"
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
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-text transition-colors",
                i === activeIndex
                  ? "bg-active-bg font-semibold"
                  : "hover:bg-button-hover"
              )}
            >
              {item.iconComponent && (
                <span className="text-text">{item.iconComponent}</span>
              )}

              {!mini && (
                <span className="text-sm font-medium">{t(item.title)}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
