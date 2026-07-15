import type { CartLine } from "./types";
import { quoteCart, cartLineToQuoteLine, type Destination } from "./woo-cart";

export interface PricedOrder {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  shippingLabel: string;
  shippingRateId?: string;
  total: number;
  couponCode?: string;
  couponError?: string;
  unavailable: boolean;
}

export interface OrderPriceInput {
  items: CartLine[];
  couponCode?: string;
  destination?: Destination;
  shippingRateId?: string;
}

/**
 * Authoritative order price from the live WooCommerce cart — the single source
 * of truth for the amount charged and the order. Prices, tax, discounts and
 * shipping all come from Woo (so any Discount Rules / Conditional Shipping /
 * weight-based rules apply automatically); the client total is never trusted.
 * Returns null when nothing in the basket resolves to a real Woo product.
 */
export async function priceOrderFromWoo(input: OrderPriceInput): Promise<PricedOrder | null> {
  const lines = input.items.map(cartLineToQuoteLine).filter((l): l is NonNullable<typeof l> => l !== null);
  if (!lines.length) return null;

  const q = await quoteCart({
    lines,
    couponCode: input.couponCode,
    destination: input.destination,
    shippingRateId: input.shippingRateId,
  });
  if (!q.ok) return null;

  const chosen = q.shippingRates.find((r) => r.rateId === q.chosenRateId);
  return {
    subtotal: q.subtotal,
    discount: q.discount,
    tax: q.tax,
    shipping: q.shipping,
    shippingLabel: chosen?.name ?? "Delivery",
    shippingRateId: q.chosenRateId,
    total: q.total,
    couponCode: q.appliedCoupons[0]?.code,
    couponError: q.couponError,
    unavailable: q.unavailableLines.length > 0,
  };
}
