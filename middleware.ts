import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const redirectToError = () =>
    NextResponse.rewrite(new URL("/ErrorPages/notfound", request.url));

  if (!token) {
    console.warn("🚫 Không có token:", path);
    return redirectToError();
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const { role, exp } = decoded;

    const now = Math.floor(Date.now() / 1000);
    if (exp < now) {
      console.warn("⏰ Token hết hạn:", exp);
      return redirectToError();
    }

    if (path.startsWith("/admin") && role !== "admin") {
      console.warn("🚫 Role không hợp lệ vào /admin:", role);
      return redirectToError();
    }

    if (path.startsWith("/business") && role !== "business") {
      console.warn("🚫 Role không hợp lệ vào /business:", role);
      return redirectToError();
    }

    return NextResponse.next();
  } catch (err) {
    console.error("❌ Lỗi decode token:", err);
    return redirectToError();
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/business", "/business/:path*"],
};
