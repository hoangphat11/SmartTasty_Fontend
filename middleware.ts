// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtDecode } from "jwt-decode";

// interface JwtPayload {
//   role: string;
//   exp: number;
// }

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;

//   if (!token) {
//     console.log("⛔ Không có token");
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   try {
//     const decoded = jwtDecode<JwtPayload>(token);
//     const role = decoded.role;
//     const pathname = request.nextUrl.pathname;

//     console.log("🔍 PATH:", pathname, "ROLE:", role);

//     if (pathname.startsWith("/admin") && role !== "admin") {
//       return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }

//     if (pathname.startsWith("/restaurant") && role !== "business") {
//       return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }

//     return NextResponse.next();
//   } catch (e) {
//     console.log("⚠️ Token decode thất bại", e);
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

// export const config = {
//   matcher: ["/admin/:path*", "/restaurant/:path*"],
// };
