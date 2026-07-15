import type { CartLine } from "./types";
import type { PricedOrder } from "./order-pricing";

export interface CustomerDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
  country: string; // ISO alpha-2
  state?: string; // ISO state code (where applicable)
}

export interface CreatedOrder {
  number: string;
  id: number | null;
  simulated: boolean;
}

function wooConfig() {
  const url = process.env.WOOCOMMERCE_STORE_URL?.replace(/\/$/, "");
  const ck = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const cs = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!url || !ck || !cs) return null;
  return { url, auth: "Basic " + Buffer.from(`${ck}:${cs}`).toString("base64") };
}

/** Resolve a WooCommerce product id from a slug (best effort). */
async function resolveProductId(url: string, auth: string, slug: string): Promise<number | null> {
  try {
    const res = await fetch(`${url}/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}&status=publish&_fields=id`, {
      headers: { Authorization: auth },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id: number }[];
    return data[0]?.id ?? null;
  } catch {
    return null;
  }
}

const simRef = () => "PPP-" + Date.now().toString().slice(-6);

/**
 * Create the WooCommerce order after a successful payment. Falls back to a
 * simulated order (so the flow completes) when Woo credentials aren't set.
 *
 * Line items are sent as product/variation/quantity only — Woo prices them and
 * computes VAT from store settings, so tax is recorded correctly. Real coupons
 * go through `coupon_lines` (Woo applies the discount + adjusts tax), and the
 * chosen shipping rate is written verbatim.
 */
export async function createWooOrder(
  items: CartLine[],
  customer: CustomerDetails,
  priced: PricedOrder,
  paymentIntentId?: string,
): Promise<CreatedOrder> {
  const cfg = wooConfig();
  if (!cfg) {
    return { number: simRef(), id: null, simulated: true };
  }

  const lineItems: Record<string, unknown>[] = [];
  const feeLines: Record<string, unknown>[] = [];

  for (const it of items) {
    const pid = it.wooProductId ?? (await resolveProductId(cfg.url, cfg.auth, it.productSlug));
    if (pid) {
      // No subtotal/total → Woo prices the line and computes tax itself.
      const li: Record<string, unknown> = { product_id: pid, quantity: it.qty };
      if (it.wooVariationId) li.variation_id = it.wooVariationId;
      lineItems.push(li);
    } else {
      // Unresolved product — record as a named fee so the order still balances.
      feeLines.push({ name: `${it.name}${it.size ? ` (${it.size})` : ""} ×${it.qty}`, total: (it.unitPrice * it.qty).toFixed(2), tax_status: "taxable" });
    }
  }

  const address = {
    first_name: customer.firstName,
    last_name: customer.lastName,
    address_1: customer.address,
    city: customer.city,
    state: customer.state ?? "",
    postcode: customer.postcode,
    country: customer.country, // ISO alpha-2
    email: customer.email,
  };

  // Shipping rate id like "flat_rate:4" → method_id "flat_rate".
  const methodId = priced.shippingRateId?.split(":")[0] || "flat_rate";

  const body: Record<string, unknown> = {
    payment_method: "stripe",
    payment_method_title: "Card (Stripe)",
    set_paid: true,
    status: "processing",
    currency: "GBP",
    billing: address,
    shipping: address,
    line_items: lineItems,
    fee_lines: feeLines,
    shipping_lines: [
      { method_id: methodId, method_title: priced.shippingLabel, total: priced.shipping.toFixed(2) },
    ],
    meta_data: paymentIntentId ? [{ key: "_stripe_intent_id", value: paymentIntentId }] : [],
  };
  // Real Woo coupon — let Woo apply the discount and adjust tax.
  if (priced.couponCode) body.coupon_lines = [{ code: priced.couponCode }];

  const res = await fetch(`${cfg.url}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: cfg.auth },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WooCommerce order creation failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const order = (await res.json()) as { id: number; number?: string };
  return { number: order.number ?? String(order.id), id: order.id, simulated: false };
}
