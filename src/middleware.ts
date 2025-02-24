// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const locales = ["ru", "en", "ua", "pl"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Игнорируем статические файлы, _next, API и т.д.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Если URL не начинается с одного из локалей, определяем дефолтную локаль
  const hasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));
  if (!hasLocale) {
    // Проверяем наличие cookie с выбранной локалью
    const cookieLocale = req.cookies.get("locale")?.value;
    let defaultLocale: string;
    if (cookieLocale && locales.includes(cookieLocale)) {
      defaultLocale = cookieLocale;
    } else {
      // Если cookie отсутствует, определяем локаль по заголовку Accept-Language
      const acceptLang = req.headers.get("accept-language") || "";
      const browserLocale = acceptLang.split(",")[0].split("-")[0];
      defaultLocale = locales.includes(browserLocale) ? browserLocale : "ru";
    }

    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "/" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
