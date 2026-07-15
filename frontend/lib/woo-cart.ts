/**
 * Server-only WooCommerce Store API cart — the authoritative source for pricing,
 * coupons, taxes and destination-based shipping. We never trust client totals:
 * the checkout re-quotes here (prices come from the catalog, tax + shipping from
 * the real store config), and the charged amount is always `total`.
 *
 * Flow (all verified live against staging): GET /cart (mint Cart-Token + Nonce)
 * → POST /cart/add-item per line → optional apply-coupon → update-customer with
 * the destination (→ shipping_rates) → optional select-shipping-rate. Both simple
 * products (by product id) and variations (by variation id) add via `id`.
 *
 * Import only from server code (route handlers / server actions).
 */

import type { CartLine } from "./types";

const GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL || "https://staging.perfectpearlsandpigments.co.uk/graphql";
// Store API lives at the same origin as the GraphQL endpoint.
const STORE_BASE = new URL(GRAPHQL_URL).origin + "/wp-json/wc/store/v1";

export interface Destination {
  country?: string; // ISO alpha-2, e.g. "GB"
  state?: string; // ISO state code where applicable
  postcode?: string;
  city?: string;
}

export interface WooShippingRate {
  rateId: string; // e.g. "flat_rate:4"
  name: string;
  price: number; // major units (£)
  selected: boolean;
}

export interface WooCartQuote {
  ok: boolean;
  cartToken?: string;
  itemsCount: number;
  currency: string; // "GBP"
  subtotal: number; // line items (major units)
  discount: number;
  tax: number;
  shipping: number; // chosen shipping cost (major units)
  total: number; // grand total charged (major units)
  needsShipping: boolean;
  shippingRates: WooShippingRate[];
  chosenRateId?: string;
  appliedCoupons: { code: string; discount: number }[];
  couponError?: string; // Woo's message when a requested coupon can't be applied
  unavailableLines: number[]; // line ids that failed to add (out of stock / not purchasable / unresolved)
  error?: string;
}

/** A Store-API-addable line: `id` is the variation id when present, else the product id. */
export interface QuoteLine {
  id: number;
  quantity: number;
}

/** Map a cart line to a Store API line; null when it has no real Woo id (seed-only). */
export function cartLineToQuoteLine(line: CartLine): QuoteLine | null {
  const id = line.wooVariationId ?? line.wooProductId;
  if (!id) return null;
  return { id, quantity: Math.max(1, line.qty) };
}

function decodeEntities(s: string | undefined | null): string {
  return (s ?? "")
    .replace(/&quot;/gi, '"')
    .replace(/&#8211;/gi, "–")
    .replace(/&#8217;/gi, "’")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#0?38;/g, "&")
    .trim();
}

function toMajor(minor: string | number | undefined, dp = 2): number {
  const n = typeof minor === "string" ? parseInt(minor, 10) : minor;
  if (n == null || !Number.isFinite(n)) return 0;
  return n / Math.pow(10, dp);
}

interface StoreResult {
  ok: boolean;
  status: number;
  json: Record<string, unknown> | null;
  token?: string;
  nonce?: string;
}

async function storeFetch(
  path: string,
  opts: { token?: string; nonce?: string; method?: string; body?: unknown } = {},
): Promise<StoreResult> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.token) headers["Cart-Token"] = opts.token;
  if (opts.nonce) headers["Nonce"] = opts.nonce;
  const res = await fetch(STORE_BASE + path, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });
  let json: Record<string, unknown> | null = null;
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    /* non-JSON */
  }
  return {
    ok: res.ok,
    status: res.status,
    json,
    // Cart-Token is stable across the session; Nonce rotates per response.
    token: res.headers.get("cart-token") || opts.token,
    nonce: res.headers.get("nonce") || opts.nonce,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapCart(cart: any, token: string | undefined, couponError: string | undefined, unavailable: number[]): WooCartQuote {
  const totals = cart?.totals ?? {};
  const dp: number = totals.currency_minor_unit ?? 2;
  const rateGroups: any[] = cart?.shipping_rates ?? [];
  const rates: WooShippingRate[] = (rateGroups[0]?.shipping_rates ?? []).map((r: any) => ({
    rateId: r.rate_id,
    name: decodeEntities(r.name),
    price: toMajor(r.price, r.currency_minor_unit ?? dp),
    selected: !!r.selected,
  }));
  return {
    ok: true,
    cartToken: token,
    itemsCount: cart?.items_count ?? 0,
    currency: totals.currency_code ?? "GBP",
    subtotal: toMajor(totals.total_items, dp),
    discount: toMajor(totals.total_discount, dp),
    tax: toMajor(totals.total_tax, dp),
    shipping: toMajor(totals.total_shipping, dp),
    total: toMajor(totals.total_price, dp),
    needsShipping: !!cart?.needs_shipping,
    shippingRates: rates,
    chosenRateId: rates.find((r) => r.selected)?.rateId,
    appliedCoupons: (cart?.coupons ?? []).map((c: any) => ({
      code: c.code,
      discount: toMajor(c.totals?.total_discount, dp),
    })),
    couponError,
    unavailableLines: unavailable,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const EMPTY: WooCartQuote = {
  ok: false,
  itemsCount: 0,
  currency: "GBP",
  subtotal: 0,
  discount: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  needsShipping: false,
  shippingRates: [],
  appliedCoupons: [],
  unavailableLines: [],
};

/**
 * Return authoritative Woo pricing for the given lines. Pass `cartToken` from a
 * previous quote to REUSE that cart — we then skip re-adding every line and only
 * apply what changed (coupon/destination/rate), which makes changing delivery or
 * a coupon fast instead of rebuilding the whole cart each time. Omit the token
 * (or when the line-up changes) to mint a fresh cart and add the items.
 */
export async function quoteCart(opts: {
  lines: QuoteLine[];
  couponCode?: string;
  destination?: Destination;
  shippingRateId?: string;
  cartToken?: string;
}): Promise<WooCartQuote> {
  if (!opts.lines.length && !opts.cartToken) return { ...EMPTY, error: "empty_cart" };
  try {
    let token: string | undefined = opts.cartToken;
    let nonce: string | undefined;
    let cart: Record<string, unknown> | null = null;
    const unavailable: number[] = [];

    // Reuse the existing cart when a token is supplied and still valid.
    if (token) {
      const existing = await storeFetch("/cart", { token });
      if (existing.ok && existing.json) {
        token = existing.token;
        nonce = existing.nonce;
        cart = existing.json;
      } else {
        token = undefined; // expired/invalid → fall through to a fresh build
      }
    }

    // Fresh cart: mint a token and add each line.
    if (!token) {
      const init = await storeFetch("/cart");
      token = init.token;
      nonce = init.nonce;
      cart = init.json;
      if (!token) return { ...EMPTY, error: "cart_init_failed" };
      for (const line of opts.lines) {
        const r = await storeFetch("/cart/add-item", {
          token,
          nonce,
          method: "POST",
          body: { id: line.id, quantity: line.quantity },
        });
        token = r.token;
        nonce = r.nonce;
        if (r.ok) cart = r.json;
        else unavailable.push(line.id);
      }
    }

    // Coupon reconcile: drop any applied coupon that isn't wanted, apply the
    // wanted one if it isn't already on the cart. (No-op for the common no-coupon
    // case, and avoids "coupon already applied" errors on cart reuse.)
    let couponError: string | undefined;
    const wanted = opts.couponCode?.trim();
    const wantedLc = wanted?.toLowerCase();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const applied: string[] = ((cart as any)?.coupons ?? []).map((c: any) => String(c.code).toLowerCase());
    /* eslint-enable @typescript-eslint/no-explicit-any */
    for (const code of applied) {
      if (code !== wantedLc) {
        const rm = await storeFetch("/cart/remove-coupon", { token, nonce, method: "POST", body: { code } });
        token = rm.token;
        nonce = rm.nonce;
        if (rm.ok) cart = rm.json;
      }
    }
    if (wanted && !applied.includes(wantedLc!)) {
      const c = await storeFetch("/cart/apply-coupon", { token, nonce, method: "POST", body: { code: wanted } });
      token = c.token;
      nonce = c.nonce;
      if (c.ok) cart = c.json;
      else couponError = decodeEntities((c.json?.message as string) || "That coupon can’t be applied.");
    }

    // 4. Destination → shipping rates. Skip when the reused cart already has this
    // exact destination (recomputing rates is a full ~1s round-trip), so a plain
    // delivery-option change doesn't pay for it.
    if (opts.destination?.country) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const addr = ((cart as any)?.shipping_address ?? {}) as Record<string, string>;
      const sameDest =
        (addr.country ?? "") === opts.destination.country &&
        (addr.postcode ?? "") === (opts.destination.postcode ?? "") &&
        (addr.state ?? "") === (opts.destination.state ?? "") &&
        (addr.city ?? "") === (opts.destination.city ?? "");
      if (!sameDest) {
        const d = await storeFetch("/cart/update-customer", {
          token,
          nonce,
          method: "POST",
          body: {
            shipping_address: {
              country: opts.destination.country,
              state: opts.destination.state ?? "",
              postcode: opts.destination.postcode ?? "",
              city: opts.destination.city ?? "",
            },
          },
        });
        token = d.token;
        nonce = d.nonce;
        if (d.ok) cart = d.json;
      }
    }

    // 5. Choose a specific shipping rate (optional).
    if (opts.shippingRateId) {
      const sel = await storeFetch("/cart/select-shipping-rate", {
        token,
        nonce,
        method: "POST",
        body: { rate_id: opts.shippingRateId },
      });
      token = sel.token;
      nonce = sel.nonce;
      if (sel.ok) cart = sel.json;
    }

    return mapCart(cart, token, couponError, unavailable);
  } catch (err) {
    return { ...EMPTY, error: String(err) };
  }
}
