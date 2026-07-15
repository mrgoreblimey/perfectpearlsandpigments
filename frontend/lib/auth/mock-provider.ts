/**
 * Dev-only mock auth provider. Lets every account page be built and tested
 * without the WordPress JWT plugin. Selected by `index.ts` when AUTH_MODE=mock
 * (default in development). Never active in production unless explicitly set.
 *
 * Demo credentials: any email + password "demo1234".
 * Mutations return ok but do not persist (stateless mock).
 */

import { readCartCookie, writeCartCookie } from "./cart-cookie";
import type { CartLine } from "@/lib/types";
import type {
  Address,
  AuthProvider,
  AuthResult,
  OrderDetail,
  OrderSummary,
  SessionData,
  Viewer,
} from "./types";

const DEMO_PASSWORD = "demo1234";

function viewerFrom(email: string, firstName = "Alex", lastName = "Rivera"): Viewer {
  return {
    id: 1001,
    email,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`.trim() || email,
  };
}

const MOCK_BILLING: Address = {
  firstName: "Alex",
  lastName: "Rivera",
  company: "",
  address1: "14 Maltings Court",
  address2: "",
  city: "Colchester",
  state: "Essex",
  postcode: "CO2 8JR",
  country: "GB",
  phone: "07700 900123",
  email: "demo@perfectpearls.co.uk",
};

const MOCK_SHIPPING: Address = { ...MOCK_BILLING, email: undefined };

const MOCK_ORDERS: OrderDetail[] = [
  {
    id: "10482",
    number: "10482",
    date: "2026-06-28T10:14:00",
    status: "COMPLETED",
    total: "£47.98",
    subtotal: "£42.99",
    shippingTotal: "£4.99",
    discountTotal: "£0.00",
    paymentMethod: "Card (Stripe)",
    itemCount: 3,
    billing: MOCK_BILLING,
    shipping: MOCK_SHIPPING,
    lines: [
      { name: "Chameleon Pigment — Persia", quantity: 2, total: "£26.00", productSlug: "persia-chameleon" },
      { name: "Candy Concentrate — 24CT Gold", quantity: 1, total: "£16.99", productSlug: "candy-concentrate-24ct-gold" },
    ],
  },
  {
    id: "10391",
    number: "10391",
    date: "2026-05-11T16:42:00",
    status: "PROCESSING",
    total: "£23.98",
    subtotal: "£18.99",
    shippingTotal: "£4.99",
    discountTotal: "£0.00",
    paymentMethod: "Card (Stripe)",
    itemCount: 1,
    billing: MOCK_BILLING,
    shipping: MOCK_SHIPPING,
    lines: [
      { name: "Glow in the Dark Pigment — Aqua", quantity: 1, total: "£18.99", productSlug: "glow-in-the-dark-pigments" },
    ],
  },
  {
    id: "10233",
    number: "10233",
    date: "2026-03-02T09:05:00",
    status: "COMPLETED",
    total: "£64.97",
    subtotal: "£59.98",
    shippingTotal: "£4.99",
    discountTotal: "£10.00",
    paymentMethod: "Card (Stripe)",
    itemCount: 4,
    billing: MOCK_BILLING,
    shipping: MOCK_SHIPPING,
    lines: [
      { name: "UltraShift Alchemy — Nebula", quantity: 2, total: "£39.98", productSlug: "ultrashift-alchemy-pigments" },
      { name: "Fluorescent Pigment — Volt", quantity: 2, total: "£19.99", productSlug: "fluorescent-pigment-powder" },
    ],
  },
];

export const mockProvider: AuthProvider = {
  name: "mock",

  async login(email, password): Promise<AuthResult> {
    if (password !== DEMO_PASSWORD) {
      return { ok: false, error: "Invalid email or password. (Demo: any email + password “demo1234”.)" };
    }
    return { ok: true, session: { v: 1, provider: "mock", user: viewerFrom(email) } };
  },

  async register({ email, firstName, lastName }): Promise<AuthResult> {
    return { ok: true, session: { v: 1, provider: "mock", user: viewerFrom(email, firstName, lastName) } };
  },

  async getViewer(session): Promise<Viewer | null> {
    return session.user ?? null;
  },

  async getOrders(): Promise<OrderSummary[]> {
    return MOCK_ORDERS.map(({ lines: _lines, billing: _b, shipping: _s, ...summary }) => summary);
  },

  async getOrder(_session, id): Promise<OrderDetail | null> {
    return MOCK_ORDERS.find((o) => o.id === id) ?? null;
  },

  async getAddresses() {
    return { billing: MOCK_BILLING, shipping: MOCK_SHIPPING };
  },

  async updateAddress() {
    return { ok: true };
  },

  async updateAccount(session, input) {
    return {
      ok: true,
      user: viewerFrom(input.email, input.firstName, input.lastName),
    };
  },

  async changePassword(_session, input) {
    if (input.currentPassword !== DEMO_PASSWORD) {
      return { ok: false, error: "Your current password is incorrect." };
    }
    return { ok: true };
  },

  async getSavedCart(): Promise<CartLine[]> {
    return readCartCookie();
  },

  async saveCart(_session, lines): Promise<void> {
    await writeCartCookie(lines);
  },
};
