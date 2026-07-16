import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/", "/patient", "/doctor", "/medications", "/schedule"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => path === "/" ? pathname === "/" : pathname.startsWith(path));
  if (!isProtected || request.cookies.has("mm_access")) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/", "/patient/:path*", "/doctor/:path*", "/medications/:path*", "/schedule/:path*"] };
