import type { CartLine } from "./types";
import { COUPONS, FREE_SHIP_OVER, shippingMethods } from "./checkout";

export interface OrderInput {
  items: CartLine[];
  shippingId: string;
  couponCode?: string;
}

export interface PricedOrder {
  subtotal: number;
  discount: number;
  shipping: number;
  shippingLabel: string;
  total: number;
  couponCode?: string;
}

/**
 * Recompute the order price server-side. This is the single source of truth for
 * the amount charged and the WooCommerce order — never trust a client total.
 *
 * NOTE: unit prices currently come from the request (seed catalog). Once the
 * storefront is wired to live WooGraphQL products, look each line up by
 * wooProductId/slug and price from WooCommerce here instead.
 */
export function priceOrder({ items, shippingId, couponCode }: OrderInput): PricedOrder {
  const subtotal = items.reduce((s, it) => s + Math.max(0, it.unitPrice) * Math.max(1, it.qty), 0);

  let discount = 0;
  let appliedCode: string | undefined;
  if (couponCode) {
    const pct = COUPONS[couponCode.trim().toUpperCase()];
    if (pct) {
      discount = subtotal * pct;
      appliedCode = couponCode.trim().toUpperCase();
    }
  }

  const freeStd = subtotal - discount >= FREE_SHIP_OVER;
  const method = shippingMethods(freeStd).find((m) => m.id === shippingId) ?? shippingMethods(freeStd)[0];
  const shipping = method.price;

  const total = Math.max(0, subtotal - discount + shipping);
  return { subtotal, discount, shipping, shippingLabel: method.label, total, couponCode: appliedCode };
}
