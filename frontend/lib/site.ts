/**
 * Canonical site identity for metadata, canonical links, sitemap and JSON-LD.
 * Override the base URL with NEXT_PUBLIC_SITE_URL (no trailing slash) — it should
 * be the customer-facing production domain the storefront is served from.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://perfectpearlsandpigments.co.uk").replace(/\/$/, "");
export const SITE_NAME = "Perfect Pearls & Pigments";
export const SITE_DESCRIPTION =
  "Chameleon pigments, candy concentrates, glow & metallic effects — the UK's most complete specialty pigment range.";
export const DEFAULT_OG_IMAGE = "/images/hero.png";

/** Absolute URL for a path (or pass through an already-absolute URL). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}
