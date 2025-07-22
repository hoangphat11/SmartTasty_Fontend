import { Roboto } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import Providers from "@/redux/providers/Providers";

import LayoutWrapper from "@/components/LayoutWrapper"; // 👈 Client layout wrapper

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className} suppressHydrationWarning>
        <AntdRegistry>
          <ToastContainer />
          <ConfigProvider>
            <Providers>
              <LayoutWrapper>{children}</LayoutWrapper>
            </Providers>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
