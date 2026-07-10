import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe-server";
import { priceOrder } from "@/lib/order-pricing";
import { toMinorUnits } from "@/lib/checkout";
import { createWooOrder, type CustomerDetails } from "@/lib/woocommerce-rest";
import type { CartLine } from "@/lib/types";

interface ConfirmBody {
  items: CartLine[];
  shippingId: string;
  couponCode?: string;
  customer: CustomerDetails;
  paymentIntentId?: string;
  demo?: boolean;
}

export async function POST(req: Request) {
  let body: ConfirmBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { items, shippingId, couponCode, customer, paymentIntentId, demo } = body;
  if (!items?.length || !customer?.email) {
    return NextResponse.json({ error: "invalid_order" }, { status: 400 });
  }

  const priced = priceOrder({ items, shippingId, couponCode });
  const stripe = getStripe();

  // Verify the payment actually succeeded for the amount we expect — never
  // trust the client that the charge went through.
  if (!demo) {
    if (!stripe || !paymentIntentId) {
      return NextResponse.json({ error: "payment_unverified" }, { status: 400 });
    }
    try {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== "succeeded") {
        return NextResponse.json({ error: "payment_not_succeeded" }, { status: 402 });
      }
      if (intent.amount !== toMinorUnits(priced.total)) {
        return NextResponse.json({ error: "amount_mismatch" }, { status: 400 });
      }
    } catch (err) {
      console.error("payment verification failed:", err);
      return NextResponse.json({ error: "verification_failed" }, { status: 500 });
    }
  }

  try {
    const order = await createWooOrder(items, customer, priced, shippingId, paymentIntentId);
    return NextResponse.json({
      orderNumber: order.number,
      simulated: order.simulated,
      email: customer.email,
      name: `${customer.firstName} ${customer.lastName}`.trim(),
      customer,
      items,
      priced,
      shippingId,
    });
  } catch (err) {
    console.error("order creation failed:", err);
    // Payment already captured — surface a clear error so the customer can be
    // reconciled manually rather than losing the sale silently.
    return NextResponse.json({ error: "order_creation_failed", paymentIntentId }, { status: 500 });
  }
}
