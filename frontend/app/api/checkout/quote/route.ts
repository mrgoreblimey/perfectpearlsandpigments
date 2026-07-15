import { NextResponse } from "next/server";
import { quoteCart, cartLineToQuoteLine } from "@/lib/woo-cart";
import type { CartLine } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Authoritative price quote for the current basket: real subtotal, tax, coupon
 * discount and destination-based shipping rates from WooCommerce. The checkout
 * calls this to render totals + shipping options and to validate coupons — the
 * charged amount always comes from `total` here, never from the client.
 */
export async function POST(req: Request) {
  let body: {
    items?: CartLine[];
    couponCode?: string;
    country?: string;
    state?: string;
    postcode?: string;
    city?: string;
    shippingRateId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const lines = (body.items ?? []).map(cartLineToQuoteLine).filter((l): l is NonNullable<typeof l> => l !== null);
  if (!lines.length) {
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  }

  const quote = await quoteCart({
    lines,
    couponCode: body.couponCode,
    destination: body.country
      ? { country: body.country, state: body.state, postcode: body.postcode, city: body.city }
      : undefined,
    shippingRateId: body.shippingRateId,
  });

  return NextResponse.json(quote, { headers: { "cache-control": "no-store" } });
}
