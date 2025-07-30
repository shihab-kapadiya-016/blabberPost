import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Protected routes (authenticated only)
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/write", "/blog"];

// Auth pages (unauthenticated only)
const authPages = ["/signin", "/signup"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 🔒 Block access to protected routes if not logged in
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const signInUrl = new URL("/signin", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // 🚫 Prevent logged-in users from visiting /signin or /signup
  if (authPages.includes(pathname)) {
    if (token) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Optionally, you can attach token info to the request header for downstream use
  const response = NextResponse.next();
  if (token) {
    response.headers.set("x-user-id", token.id ?? "");
    response.headers.set("x-user-email", token.email ?? "");
    response.headers.set("x-user-username", token.username ?? ""); // if added to token callback
  }

  return response;
}

export const config = {
  matcher: ["/dashboard", "/signin", "/signup", "/write", "/blog"],
};
