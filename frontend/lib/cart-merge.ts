import type { CartLine } from "@/lib/types";

/**
 * Merge two carts by line id (id is unique per product + size). Quantities for
 * a shared line are summed — the standard WooCommerce guest→customer merge.
 */
export function mergeCarts(a: CartLine[], b: CartLine[]): CartLine[] {
  const byId = new Map<string, CartLine>();
  for (const line of [...a, ...b]) {
    const existing = byId.get(line.id);
    if (existing) {
      byId.set(line.id, { ...existing, qty: existing.qty + line.qty });
    } else {
      byId.set(line.id, { ...line });
    }
  }
  return [...byId.values()];
}

const MAX_LINES = 100;
const MAX_QTY = 999;

/** Validate/normalise an untrusted cart (e.g. from the client or a cookie). */
export function sanitizeCart(input: unknown): CartLine[] {
  if (!Array.isArray(input)) return [];
  const out: CartLine[] = [];
  for (const raw of input.slice(0, MAX_LINES)) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id : "";
    const name = typeof r.name === "string" ? r.name : "";
    if (!id || !name) continue;
    const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(Number(r.qty) || 1)));
    const unitPrice = Math.max(0, Number(r.unitPrice) || 0);
    out.push({
      id,
      productSlug: typeof r.productSlug === "string" ? r.productSlug : id,
      wooProductId: typeof r.wooProductId === "number" ? r.wooProductId : undefined,
      wooVariationId: typeof r.wooVariationId === "number" ? r.wooVariationId : undefined,
      name,
      size: typeof r.size === "string" ? r.size : undefined,
      unitPrice,
      qty,
      img: typeof r.img === "string" ? r.img : "",
      swatches: Array.isArray(r.swatches) ? r.swatches.filter((s): s is string => typeof s === "string") : [],
    });
  }
  return out;
}

/** Parse a JSON string into a sanitized cart; empty on any error. */
export function parseCart(json: string | null | undefined): CartLine[] {
  if (!json) return [];
  try {
    return sanitizeCart(JSON.parse(json));
  } catch {
    return [];
  }
}
