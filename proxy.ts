import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16: middleware is now `proxy`. Optimistic guard only — checks for the
// presence of the Better Auth session cookie, no DB call. Real role/scope
// authorisation happens in every server action and dashboard page via
// lib/auth/guards. Logged-out users hitting /admin/* go to sign-in.

export function proxy(request: NextRequest) {
  const hasSession =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  if (!hasSession) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
