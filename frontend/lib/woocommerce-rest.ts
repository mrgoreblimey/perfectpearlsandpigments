import type { CartLine } from "./types";
import type { PricedOrder } from "./order-pricing";

export interface CustomerDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
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
 */
export async function createWooOrder(
  items: CartLine[],
  customer: CustomerDetails,
  priced: PricedOrder,
  shippingId: string,
  paymentIntentId?: string,
): Promise<CreatedOrder> {
  const cfg = wooConfig();
  if (!cfg) {
    return { number: simRef(), id: null, simulated: true };
  }

  const lineItems: Record<string, unknown>[] = [];
  const feeLines: Record<string, unknown>[] = [];

  for (const it of items) {
    const lineTotal = (it.unitPrice * it.qty).toFixed(2);
    const pid = it.wooProductId ?? (await resolveProductId(cfg.url, cfg.auth, it.productSlug));
    if (pid) {
      lineItems.push({ product_id: pid, quantity: it.qty, subtotal: lineTotal, total: lineTotal });
    } else {
      // Unresolved product — record as a named fee so the order still balances.
      feeLines.push({ name: `${it.name}${it.size ? ` (${it.size})` : ""} ×${it.qty}`, total: lineTotal, tax_status: "taxable" });
    }
  }

  if (priced.discount > 0) {
    feeLines.push({ name: `Discount${priced.couponCode ? ` (${priced.couponCode})` : ""}`, total: (-priced.discount).toFixed(2), tax_status: "none" });
  }

  const [nameFirst, ...rest] = [customer.firstName, customer.lastName];
  const address = {
    first_name: nameFirst,
    last_name: rest.join(" "),
    address_1: customer.address,
    city: customer.city,
    postcode: customer.postcode,
    country: customer.country,
    email: customer.email,
  };

  const body = {
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
      { method_id: shippingId === "col" ? "local_pickup" : "flat_rate", method_title: priced.shippingLabel, total: priced.shipping.toFixed(2) },
    ],
    meta_data: paymentIntentId ? [{ key: "_stripe_intent_id", value: paymentIntentId }] : [],
  };

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
