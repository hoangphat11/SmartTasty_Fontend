import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
  getSupportedLocales,
  defaultLocale,
  AppLocale,
} from "./src/middleware/localeHelper";

export function middleware(req: NextRequest) {
  const cookieLocale = req.cookies.get("locale")?.value;
  let locale = cookieLocale ?? defaultLocale;

  if (!getSupportedLocales().includes(locale as AppLocale)) {
    locale = defaultLocale;
  }

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
