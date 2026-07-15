import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe-server";
import { priceOrderFromWoo } from "@/lib/order-pricing";
import { CURRENCY, toMinorUnits } from "@/lib/checkout";
import type { CartLine } from "@/lib/types";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 200 });
  }

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

  const items = body.items ?? [];
  if (!items.length) {
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  }

  // Price authoritatively from the live Woo cart — never from client totals.
  const priced = await priceOrderFromWoo({
    items,
    couponCode: body.couponCode,
    destination: body.country
      ? { country: body.country, state: body.state, postcode: body.postcode, city: body.city }
      : undefined,
    shippingRateId: body.shippingRateId,
  });
  if (!priced) {
    return NextResponse.json({ error: "pricing_failed" }, { status: 400 });
  }

  const amount = toMinorUnits(priced.total);
  if (amount < 30) {
    return NextResponse.json({ error: "amount_too_low" }, { status: 400 });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: CURRENCY,
      automatic_payment_methods: { enabled: true },
      metadata: { source: "ppp-headless-checkout" },
    });
    return NextResponse.json({ clientSecret: intent.client_secret, total: priced.total });
  } catch (err) {
    console.error("create-intent failed:", err);
    return NextResponse.json({ error: "intent_failed" }, { status: 500 });
  }
}
