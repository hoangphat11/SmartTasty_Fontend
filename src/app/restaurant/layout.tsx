"use client";

import Sidebar from "@/components/Admin/SideBar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  exp: number;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // hoặc từ cookie
    if (!token) {
      router.replace("/ErrorPage/notfound");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Kiểm tra quyền truy cập
      if (decoded.role !== "business") {
        router.replace("/ErrorPage/notfound");
      }
    } catch (error) {
      console.error("Invalid token", error);
      router.replace("/ErrorPage/notfound");
    }
  }, [router]);

  return (
    <div style={{ display: "flex", marginTop: "80px" }}>
      <div>
        <Sidebar />
      </div>
      <div style={{ width: "100%" }}>{children}</div>
    </div>
  );
}
