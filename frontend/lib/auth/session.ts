/**
 * Session cookie read/write. The token is an AES-GCM-sealed `SessionData`.
 *
 * Cookie is httpOnly + secure + sameSite=lax so it is never readable by client
 * JS (XSS-safe) and only travels to our own origin. All reads/writes happen on
 * the server (Server Components read; Server Actions / Route Handlers write).
 */

import { cookies } from "next/headers";
import { seal, unseal } from "./seal";
import { SESSION_COOKIE } from "./constants";
import type { SessionData } from "./types";

export { SESSION_COOKIE };
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function readSession(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const data = unseal<SessionData>(token);
  if (!data || data.v !== 1 || !data.user?.email) return null;
  return data;
}

/** Must be called from a Server Action or Route Handler. */
export async function writeSession(data: SessionData): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, seal(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Must be called from a Server Action or Route Handler. */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
