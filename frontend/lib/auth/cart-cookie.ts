/**
 * Sealed-cookie cart store used by the mock provider (dev). Stands in for a
 * real server store so the merge-on-login flow is fully testable without a
 * backend. Per-browser (not cross-device) — the wp provider uses the real
 * WooGraphQL cart for genuine cross-device persistence.
 */

import { cookies } from "next/headers";
import { seal, unseal } from "./seal";
import { sanitizeCart } from "@/lib/cart-merge";
import type { CartLine } from "@/lib/types";

const COOKIE = "ppp_cart_store";
const MAX_AGE = 60 * 60 * 24 * 30;

export async function readCartCookie(): Promise<CartLine[]> {
  const token = (await cookies()).get(COOKIE)?.value;
  const data = unseal<{ v: 1; lines: unknown }>(token);
  return sanitizeCart(data?.lines);
}

export async function writeCartCookie(lines: CartLine[]): Promise<void> {
  (await cookies()).set(COOKIE, seal({ v: 1, lines }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}
