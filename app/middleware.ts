import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authtoken")?.value;
  const adminToken = req.cookies.get("admin_token")?.value;

  const { pathname, search } = req.nextUrl;

  // Normalize path by stripping /staging prefix (server rewrite artifact)
  const normalizedPath = pathname.replace(/^\/staging/, "");

  // User protected
  if (normalizedPath.startsWith("/user") && !token) {
    const returnUrl = normalizedPath + search;

    const loginUrl = new URL("/user/signin", req.url);
    loginUrl.searchParams.set("returnUrl", returnUrl);

    return NextResponse.redirect(loginUrl);
  }

  // Admin protected
  if (normalizedPath.startsWith("/admin") && normalizedPath !== "/admin" && !adminToken) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*" ,   "/staging/user/:path*",
    "/staging/admin/:path*",],
};
