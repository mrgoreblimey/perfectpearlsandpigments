import { NextResponse } from "next/server";
import { quoteCart, cartLineToQuoteLine } from "@/lib/woo-cart";
import { getStripe } from "@/lib/stripe-server";
import { CURRENCY, toMinorUnits } from "@/lib/checkout";
import type { CartLine } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Authoritative price quote for the basket (subtotal, tax, coupon discount,
 * destination shipping) AND the Stripe PaymentIntent in one round-trip.
 *
 * Pass `cartToken` from the previous response to reuse the Woo cart (fast for
 * delivery/coupon changes), and `paymentIntentId` to update the existing intent
 * in place — so the amount stays current without recreating the intent or
 * remounting the payment form.
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
    cartToken?: string;
    paymentIntentId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const lines = (body.items ?? []).map(cartLineToQuoteLine).filter((l): l is NonNullable<typeof l> => l !== null);
  if (!lines.length && !body.cartToken) {
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  }

  const quote = await quoteCart({
    lines,
    couponCode: body.couponCode,
    destination: body.country
      ? { country: body.country, state: body.state, postcode: body.postcode, city: body.city }
      : undefined,
    shippingRateId: body.shippingRateId,
    cartToken: body.cartToken,
  });

  // Create or update the Stripe intent for the authoritative total. Updating the
  // existing intent keeps the same client_secret, so the payment form is mounted
  // once and only the amount changes.
  let clientSecret: string | null = null;
  let paymentIntentId = body.paymentIntentId;
  const stripe = getStripe();
  const amount = toMinorUnits(quote.total);
  if (stripe && quote.ok && amount >= 30) {
    const params = { amount, currency: CURRENCY };
    try {
      if (paymentIntentId) {
        const updated = await stripe.paymentIntents.update(paymentIntentId, params);
        clientSecret = updated.client_secret;
      } else {
        const intent = await stripe.paymentIntents.create({
          ...params,
          automatic_payment_methods: { enabled: true },
          metadata: { source: "ppp-headless-checkout" },
        });
        clientSecret = intent.client_secret;
        paymentIntentId = intent.id;
      }
    } catch (err) {
      // The intent may be in a non-updatable state — mint a fresh one.
      console.error("intent create/update failed:", err);
      try {
        const intent = await stripe.paymentIntents.create({
          ...params,
          automatic_payment_methods: { enabled: true },
          metadata: { source: "ppp-headless-checkout" },
        });
        clientSecret = intent.client_secret;
        paymentIntentId = intent.id;
      } catch (err2) {
        console.error("intent create fallback failed:", err2);
        paymentIntentId = undefined;
      }
    }
  }

  return NextResponse.json({ ...quote, clientSecret, paymentIntentId }, { headers: { "cache-control": "no-store" } });
}
