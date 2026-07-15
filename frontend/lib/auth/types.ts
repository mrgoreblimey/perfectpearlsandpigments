/**
 * Customer account types + the auth provider contract.
 *
 * Two providers implement `AuthProvider`:
 *   - wp-provider   → real WPGraphQL + wp-graphql-jwt-authentication
 *   - mock-provider → dev fallback with sample data (no backend needed)
 *
 * The active provider is chosen in `index.ts` by AUTH_MODE / NODE_ENV.
 */

export interface Viewer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  /** Billing only. */
  email?: string;
}

export interface OrderLine {
  name: string;
  quantity: number;
  total: string;
  productSlug?: string;
  image?: string;
}

export interface OrderSummary {
  id: string;
  number: string;
  date: string;
  status: string;
  total: string;
  itemCount: number;
}

export interface OrderDetail extends OrderSummary {
  subtotal: string;
  shippingTotal: string;
  discountTotal: string;
  lines: OrderLine[];
  billing: Address | null;
  shipping: Address | null;
  paymentMethod: string;
}

/** What the sealed session cookie carries. `refreshToken` is provider-specific. */
export interface SessionData {
  v: 1;
  provider: "wp" | "mock";
  user: Viewer;
  refreshToken?: string;
}

export interface AuthResult {
  ok: boolean;
  /** User-facing error message when ok === false. */
  error?: string;
  session?: SessionData;
}

import type { CartLine } from "@/lib/types";

export interface AuthProvider {
  readonly name: "wp" | "mock";
  login(email: string, password: string): Promise<AuthResult>;
  register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResult>;
  /** Re-fetch the current customer from the session (fresh data). */
  getViewer(session: SessionData): Promise<Viewer | null>;
  getOrders(session: SessionData): Promise<OrderSummary[]>;
  getOrder(session: SessionData, id: string): Promise<OrderDetail | null>;
  getAddresses(
    session: SessionData
  ): Promise<{ billing: Address | null; shipping: Address | null }>;
  updateAddress(
    session: SessionData,
    kind: "billing" | "shipping",
    address: Address
  ): Promise<{ ok: boolean; error?: string }>;
  updateAccount(
    session: SessionData,
    input: { firstName: string; lastName: string; email: string }
  ): Promise<{ ok: boolean; error?: string; user?: Viewer }>;
  changePassword(
    session: SessionData,
    input: { currentPassword: string; newPassword: string }
  ): Promise<{ ok: boolean; error?: string }>;
  /** The customer's server-persisted cart (empty array if none). */
  getSavedCart(session: SessionData): Promise<CartLine[]>;
  /** Overwrite the customer's server-persisted cart. */
  saveCart(session: SessionData, lines: CartLine[]): Promise<void>;
}

export const emptyAddress: Address = {
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  country: "GB",
  phone: "",
};
