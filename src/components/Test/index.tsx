"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import LanguageIcon from "@mui/icons-material/Language";

const locales = ["en", "vi", "zh"];

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (locale: string) => {
    const segments = pathname.split("/");

    if (locales.includes(segments[1])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }

    router.replace(segments.join("/") || "/");
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out"
      >
        <LanguageIcon className="text-white" />
        <span>Language</span>
      </button>

      {isOpen && (
        <ul className="absolute mt-2 w-36 bg-white text-gray-800 z-50 rounded-lg shadow-lg border border-gray-200">
          {locales.map((lang) => (
            <li key={lang}>
              <button
                onClick={() => handleChange(lang)}
                className="block w-full text-left py-2 px-4 hover:bg-indigo-600 hover:text-white text-sm rounded-md transition duration-300"
              >
                {lang === "vi"
                  ? "Tiếng Việt"
                  : lang === "en"
                  ? "English"
                  : "中文"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
