"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getSupportedLocales, defaultLocale } from "@/middleware/localeHelper";

type LocaleContextType = {
  locale: string;
  messages: Record<string, string>;
  changeLocale: (newLocale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<string>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="));
    if (storedLocale) {
      setLocale(storedLocale.split("=")[1]);
    }
  }, []);

  useEffect(() => {
    const loadMessages = async (locale: string) => {
      const response = await fetch(`/locales/${locale}.json`);
      const data = await response.json();
      setMessages(data);
    };

    loadMessages(locale);
  }, [locale]);

  const changeLocale = (newLocale: string) => {
    if (!getSupportedLocales().includes(newLocale as never)) {
      return;
    }

    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    setLocale(newLocale);
    window.location.reload();
  };

  return (
    <LocaleContext.Provider value={{ locale, messages, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
