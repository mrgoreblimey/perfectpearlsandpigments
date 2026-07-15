"use server";

/**
 * Server actions that bridge the localStorage device cart and the customer's
 * server-persisted cart.
 *
 *  - mergeDeviceCartIntoAccount → called from login/register: merges the device
 *    cart into the saved cart (once), and drops a short-lived flag so the client
 *    knows to adopt the merged result after the redirect.
 *  - pullSavedCart → client mount / post-login: returns login state + saved cart.
 *  - persistCart   → client debounced save while signed in.
 */

import { cookies } from "next/headers";
import { activeProvider, getSession } from "@/lib/auth";
import { mergeCarts, parseCart, sanitizeCart } from "@/lib/cart-merge";
import type { SessionData } from "@/lib/auth/types";
import type { CartLine } from "@/lib/types";

const PULL_FLAG = "ppp_cart_pull";

/** Merge the client's device cart into the customer's saved cart. */
export async function mergeDeviceCartIntoAccount(
  session: SessionData,
  deviceCartJson: string
): Promise<void> {
  const provider = activeProvider();
  const device = parseCart(deviceCartJson);
  const saved = await provider.getSavedCart(session);
  const merged = mergeCarts(saved, device);
  await provider.saveCart(session, merged);
  // Signal the client (after redirect) to adopt the merged cart. Readable by
  // client JS so it can cheaply detect the just-logged-in transition.
  (await cookies()).set(PULL_FLAG, "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 120,
  });
}

export interface CartSyncState {
  loggedIn: boolean;
  /** True right after login — the client should adopt `cart` outright. */
  pull: boolean;
  cart: CartLine[];
}

/** Read the customer's saved cart + whether a just-logged-in adopt is pending. */
export async function pullSavedCart(): Promise<CartSyncState> {
  const session = await getSession();
  if (!session) return { loggedIn: false, pull: false, cart: [] };
  const store = await cookies();
  const pull = store.get(PULL_FLAG)?.value === "1";
  if (pull) store.delete(PULL_FLAG);
  const cart = await activeProvider().getSavedCart(session);
  return { loggedIn: true, pull, cart };
}

/** Overwrite the customer's saved cart with the current device cart. */
export async function persistCart(lines: CartLine[]): Promise<void> {
  const session = await getSession();
  if (!session) return;
  await activeProvider().saveCart(session, sanitizeCart(lines));
}
