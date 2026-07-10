/** Shared checkout constants + helpers (client + server). */

export const FREE_SHIP_OVER = 50;
export const SHIP_STD = 3.95;
export const SHIP_EXPRESS = 6.95;
export const CURRENCY = "gbp";

/** Discount codes → fraction off the subtotal. */
export const COUPONS: Record<string, number> = { PEARL10: 0.1 };

export interface ShipMethod {
  id: string;
  label: string;
  desc: string;
  price: number;
}

export function shippingMethods(freeStd: boolean): ShipMethod[] {
  return [
    { id: "std", label: "Standard delivery", desc: "2–3 working days", price: freeStd ? 0 : SHIP_STD },
    { id: "exp", label: "Express delivery", desc: "Next working day — order by 2pm", price: SHIP_EXPRESS },
    { id: "col", label: "Click & collect", desc: "Brampton Hall Farm, Colchester", price: 0 },
  ];
}

export const money = (n: number) => "£" + n.toFixed(2);

/** Parse a display price like "From £13.00" or "£2.99" to a number. */
export function parseMoney(s: string): number {
  const m = s.replace(/[^0-9.]/g, "");
  const n = parseFloat(m);
  return Number.isFinite(n) ? n : 0;
}

/** Round to pennies and convert to integer minor units for Stripe. */
export const toMinorUnits = (n: number) => Math.round(n * 100);
