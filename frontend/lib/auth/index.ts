/**
 * Auth entry point: selects the active provider and exposes the Data Access
 * Layer used by account pages and server actions.
 *
 * Provider selection:
 *   AUTH_MODE=wp | mock   → explicit
 *   otherwise             → "mock" in development, "wp" in production
 *
 * The mock lets the UI be built/tested before the WordPress JWT plugin is live;
 * production defaults to real WP auth (no fake auth ever ships).
 */

import { cache } from "react";
import { redirect } from "next/navigation";
import { readSession } from "./session";
import { wpProvider } from "./wp-provider";
import { mockProvider } from "./mock-provider";
import type { AuthProvider, SessionData, Viewer } from "./types";

export function activeProvider(): AuthProvider {
  const mode = process.env.AUTH_MODE?.toLowerCase();
  const isProd = process.env.NODE_ENV === "production";
  if (mode === "wp") return wpProvider;
  if (mode === "mock") {
    // The mock accepts a demo password for any email — never allow it in prod.
    if (isProd) throw new Error("AUTH_MODE=mock is not permitted in production.");
    return mockProvider;
  }
  return isProd ? wpProvider : mockProvider;
}

/** Read + validate the session once per render pass. */
export const getSession = cache(async (): Promise<SessionData | null> => {
  return readSession();
});

/** Current customer from the session cookie (no network round-trip). */
export const currentViewer = cache(async (): Promise<Viewer | null> => {
  const session = await getSession();
  return session?.user ?? null;
});

/** Redirect to /login if not authenticated; otherwise return the session. */
export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export type { AuthProvider, SessionData, Viewer } from "./types";
