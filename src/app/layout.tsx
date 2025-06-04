"use client";

import { Roboto } from "next/font/google";
import { Dancing_Script } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import Providers from "@/redux/providers/Providers";
import { usePathname } from "next/navigation";

import "./globals.css";

// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dancing-script",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //Nao lam Login thi them vao, de go header vaf footer
  // const pathname = usePathname();
  // const isAuthPage =
  //   pathname === "/AuthenticationPage";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className} suppressHydrationWarning>
        <AntdRegistry>
          <ToastContainer />
          <ConfigProvider>
            <Providers>
              {/* {!isAuthPage && <Header />} */}
              {children}
              {/* {!isAuthPage && <Footer />} */}
            </Providers>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
