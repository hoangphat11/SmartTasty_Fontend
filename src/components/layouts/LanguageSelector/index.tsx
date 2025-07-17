"use client";

import { useState } from "react";
import { useLocale } from "@/context/locale";
import LanguageIcon from "@mui/icons-material/Language";

export default function LanguageSelector() {
  const { changeLocale } = useLocale();
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  const handleSelect = (lang: string) => {
    changeLocale(lang);
    setOpen(false);
  };

  const languages = [
    { label: "English", value: "en" },
    { label: "Tiếng Việt", value: "vi" },
    { label: "中文", value: "zh" },
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-button text-text border border-border hover:bg-button-hover transition"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <LanguageIcon className="text-text" />
      </button>

      {open && (
        <ul className="absolute mt-1 w-28 bg-transparent text-text z-50">
          {languages.map((lang) => (
            <li key={lang.value}>
              <button
                onClick={() => handleSelect(lang.value)}
                className="block w-full text-left my-1 px-4 py-2 hover:bg-button-hover text-sm transition"
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
