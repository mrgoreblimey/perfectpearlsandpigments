/**
 * Proxy (Next.js 16's renamed Middleware). Optimistic route protection only —
 * the real auth check happens in each account page via `requireSession()`.
 *
 * - /account/*  → redirect to /login (with return path) when no valid session
 * - /login,/register → redirect to /account when already signed in
 *
 * We validate by decrypting the cookie (cheap, no network) so an invalid/stale
 * cookie can't cause a redirect loop between /login and /account.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unseal } from "@/lib/auth/seal";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import type { SessionData } from "@/lib/auth/types";

function hasValidSession(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const data = unseal<SessionData>(token);
  return !!(data && data.v === 1 && data.user?.email);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = hasValidSession(req);

  if (pathname.startsWith("/account")) {
    if (!authed) {
      const url = new URL("/login", req.nextUrl);
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/register") {
    if (authed) return NextResponse.redirect(new URL("/account", req.nextUrl));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/login", "/register"],
};
