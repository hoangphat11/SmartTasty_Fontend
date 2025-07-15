import { headers } from "next/headers";
import { ReactNode } from "react";
import "./globals.css";
import { LocaleProvider } from "@/context/Locale";
import LayoutClient from "@/app/LayoutClient";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "PHS Broker Portal",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const locale = headerList.get("x-locale") || "vi";

  return (
    <html lang={locale} className={`${roboto.variable} font-sans`}>
      <body>
        <LocaleProvider>
          <LayoutClient>{children}</LayoutClient>
        </LocaleProvider>
      </body>
    </html>
  );
}
