/** Shared checkout helpers (client + server). Pricing itself is authoritative
 *  from WooCommerce — see lib/woo-cart.ts. */

export const CURRENCY = "gbp";

export const money = (n: number) => "£" + n.toFixed(2);

/** Parse a display price like "From £13.00" or "£2.99" to a number. */
export function parseMoney(s: string): number {
  const m = s.replace(/[^0-9.]/g, "");
  const n = parseFloat(m);
  return Number.isFinite(n) ? n : 0;
}

/** Round to pennies and convert to integer minor units for Stripe. */
export const toMinorUnits = (n: number) => Math.round(n * 100);
