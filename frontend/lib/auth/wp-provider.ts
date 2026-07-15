/**
 * Real auth provider: WPGraphQL + wp-graphql-jwt-authentication + WooGraphQL.
 *
 * Session stores the long-lived refreshToken; a short-lived authToken is minted
 * per request via `refreshJwtAuthToken` and used as a Bearer for customer data.
 * Requires the `wp-graphql-jwt-authentication` plugin on WordPress (the `login`
 * mutation). Until that's enabled, `index.ts` selects the mock provider instead.
 */

import { authGql, firstError } from "./graphql";
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

function parseMoney(s: string | null | undefined): number {
  if (!s) return 0;
  return Number(String(s).replace(/[^0-9.]/g, "")) || 0;
}

interface JwtUser {
  databaseId: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

function toViewer(u: JwtUser): Viewer {
  const firstName = u.firstName ?? "";
  const lastName = u.lastName ?? "";
  return {
    id: u.databaseId,
    email: u.email,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`.trim() || u.email,
  };
}

async function mintAuthToken(session: SessionData): Promise<string | null> {
  if (!session.refreshToken) return null;
  const res = await authGql<{ refreshJwtAuthToken: { authToken: string } }>(
    `mutation Refresh($t: String!) {
      refreshJwtAuthToken(input: { jwtRefreshToken: $t }) { authToken }
    }`,
    { t: session.refreshToken }
  );
  return res.data?.refreshJwtAuthToken?.authToken ?? null;
}

function mapAddress(a: Record<string, unknown> | null | undefined): Address | null {
  if (!a) return null;
  const anyFilled = ["address1", "city", "postcode", "firstName"].some(
    (k) => (a[k] as string)?.trim()
  );
  if (!anyFilled) return null;
  return {
    firstName: (a.firstName as string) ?? "",
    lastName: (a.lastName as string) ?? "",
    company: (a.company as string) ?? "",
    address1: (a.address1 as string) ?? "",
    address2: (a.address2 as string) ?? "",
    city: (a.city as string) ?? "",
    state: (a.state as string) ?? "",
    postcode: (a.postcode as string) ?? "",
    country: (a.country as string) ?? "GB",
    phone: (a.phone as string) ?? "",
    email: (a.email as string) ?? undefined,
  };
}

const CUSTOMER_FIELDS = `
  databaseId email firstName lastName displayName
  billing { firstName lastName company address1 address2 city state postcode country phone email }
  shipping { firstName lastName company address1 address2 city state postcode country phone }
`;

export const wpProvider: AuthProvider = {
  name: "wp",

  async login(email, password): Promise<AuthResult> {
    const res = await authGql<{
      login: { authToken: string; refreshToken: string; user: JwtUser };
    }>(
      `mutation Login($username: String!, $password: String!) {
        login(input: { username: $username, password: $password }) {
          authToken refreshToken
          user { databaseId email firstName lastName }
        }
      }`,
      { username: email, password }
    );
    const payload = res.data?.login;
    if (!payload?.refreshToken) {
      // Log the real reason (e.g. JWT misconfig) but never leak whether the
      // account exists / which field was wrong — always a generic message.
      if (res.errors?.length) console.error("login failed:", firstError(res));
      return { ok: false, error: "Invalid email or password." };
    }
    return {
      ok: true,
      session: { v: 1, provider: "wp", user: toViewer(payload.user), refreshToken: payload.refreshToken },
    };
  },

  async register({ email, password, firstName, lastName }): Promise<AuthResult> {
    const res = await authGql<{
      registerCustomer: { authToken: string; refreshToken: string; customer: JwtUser };
    }>(
      `mutation Register($email: String!, $password: String!, $first: String!, $last: String!) {
        registerCustomer(input: {
          username: $email, email: $email, password: $password,
          firstName: $first, lastName: $last
        }) {
          authToken refreshToken
          customer { databaseId email firstName lastName }
        }
      }`,
      { email, password, first: firstName, last: lastName }
    );
    const payload = res.data?.registerCustomer;
    if (!payload?.refreshToken) {
      // registerCustomer without JWT plugin returns no tokens → fall back to login.
      if (res.data?.registerCustomer?.customer?.databaseId) {
        return wpProvider.login(email, password);
      }
      return { ok: false, error: firstError(res, "Could not create your account.") };
    }
    return {
      ok: true,
      session: { v: 1, provider: "wp", user: toViewer(payload.customer), refreshToken: payload.refreshToken },
    };
  },

  async getViewer(session): Promise<Viewer | null> {
    const token = await mintAuthToken(session);
    if (!token) return null;
    const res = await authGql<{ customer: JwtUser & { displayName: string } }>(
      `query Me { customer { databaseId email firstName lastName displayName } }`,
      {},
      token
    );
    const c = res.data?.customer;
    if (!c?.email) return null;
    return toViewer(c);
  },

  async getOrders(session): Promise<OrderSummary[]> {
    const token = await mintAuthToken(session);
    if (!token) return [];
    const res = await authGql<{
      customer: {
        orders: {
          nodes: {
            databaseId: number;
            orderNumber: string;
            date: string;
            status: string;
            total: string;
            lineItems: { nodes: { quantity: number }[] };
          }[];
        };
      };
    }>(
      `query Orders {
        customer {
          orders(first: 50) {
            nodes {
              databaseId orderNumber date status total
              lineItems { nodes { quantity } }
            }
          }
        }
      }`,
      {},
      token
    );
    const nodes = res.data?.customer?.orders?.nodes ?? [];
    return nodes.map((o) => ({
      id: String(o.databaseId),
      number: o.orderNumber || String(o.databaseId),
      date: o.date,
      status: o.status,
      total: o.total,
      itemCount: o.lineItems.nodes.reduce((n, li) => n + (li.quantity || 0), 0),
    }));
  },

  async getOrder(session, id): Promise<OrderDetail | null> {
    const token = await mintAuthToken(session);
    if (!token) return null;
    const res = await authGql<{
      order: {
        databaseId: number;
        orderNumber: string;
        date: string;
        status: string;
        total: string;
        subtotal: string;
        shippingTotal: string;
        discountTotal: string;
        paymentMethodTitle: string;
        customer: { databaseId: number } | null;
        billing: Record<string, unknown>;
        shipping: Record<string, unknown>;
        lineItems: {
          nodes: {
            quantity: number;
            total: string;
            product: { node: { name: string; slug: string; image: { sourceUrl: string } | null } } | null;
          }[];
        };
      };
    }>(
      `query Order($id: ID!) {
        order(id: $id, idType: DATABASE_ID) {
          databaseId orderNumber date status total subtotal shippingTotal discountTotal paymentMethodTitle
          customer { databaseId }
          billing { firstName lastName company address1 address2 city state postcode country phone email }
          shipping { firstName lastName company address1 address2 city state postcode country phone }
          lineItems { nodes { quantity total product { node { name slug image { sourceUrl } } } } }
        }
      }`,
      { id },
      token
    );
    const o = res.data?.order;
    if (!o) return null;
    // Defence in depth: never return an order that isn't this customer's, even
    // if the backend would have. (Customer-scoped tokens already restrict this.)
    if (o.customer?.databaseId && o.customer.databaseId !== session.user.id) return null;
    const lines = o.lineItems.nodes.map((li) => ({
      name: li.product?.node?.name ?? "Item",
      quantity: li.quantity,
      total: li.total,
      productSlug: li.product?.node?.slug,
      image: li.product?.node?.image?.sourceUrl,
    }));
    return {
      id: String(o.databaseId),
      number: o.orderNumber || String(o.databaseId),
      date: o.date,
      status: o.status,
      total: o.total,
      subtotal: o.subtotal,
      shippingTotal: o.shippingTotal,
      discountTotal: o.discountTotal,
      paymentMethod: o.paymentMethodTitle,
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      lines,
      billing: mapAddress(o.billing),
      shipping: mapAddress(o.shipping),
    };
  },

  async getAddresses(session) {
    const token = await mintAuthToken(session);
    if (!token) return { billing: null, shipping: null };
    const res = await authGql<{ customer: Record<string, Record<string, unknown>> }>(
      `query Addr { customer { ${CUSTOMER_FIELDS} } }`,
      {},
      token
    );
    const c = res.data?.customer;
    return { billing: mapAddress(c?.billing), shipping: mapAddress(c?.shipping) };
  },

  async updateAddress(session, kind, address) {
    const token = await mintAuthToken(session);
    if (!token) return { ok: false, error: "Your session has expired. Please sign in again." };
    const field = kind === "billing" ? "billing" : "shipping";
    const res = await authGql<{ updateCustomer: { customer: { databaseId: number } } }>(
      `mutation UpdateAddr($input: ${field === "billing" ? "CustomerAddressInput" : "CustomerAddressInput"}!) {
        updateCustomer(input: { ${field}: $input }) { customer { databaseId } }
      }`,
      {
        input: {
          firstName: address.firstName,
          lastName: address.lastName,
          company: address.company,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          state: address.state,
          postcode: address.postcode,
          country: address.country,
          phone: address.phone,
          ...(field === "billing" ? { email: address.email } : {}),
        },
      },
      token
    );
    if (!res.data?.updateCustomer) return { ok: false, error: firstError(res, "Could not save address.") };
    return { ok: true };
  },

  async updateAccount(session, input) {
    const token = await mintAuthToken(session);
    if (!token) return { ok: false, error: "Your session has expired. Please sign in again." };
    const res = await authGql<{ updateCustomer: { customer: JwtUser } }>(
      `mutation UpdateAccount($first: String!, $last: String!, $email: String!) {
        updateCustomer(input: { firstName: $first, lastName: $last, email: $email }) {
          customer { databaseId email firstName lastName }
        }
      }`,
      { first: input.firstName, last: input.lastName, email: input.email },
      token
    );
    const c = res.data?.updateCustomer?.customer;
    if (!c) return { ok: false, error: firstError(res, "Could not update your details.") };
    return { ok: true, user: toViewer(c) };
  },

  async changePassword(session, input) {
    // Re-authenticate with the current password before allowing a change.
    const reauth = await wpProvider.login(session.user.email, input.currentPassword);
    if (!reauth.ok) return { ok: false, error: "Your current password is incorrect." };
    const token = await mintAuthToken(session);
    if (!token) return { ok: false, error: "Your session has expired. Please sign in again." };
    const res = await authGql<{ updateCustomer: { customer: { databaseId: number } } }>(
      `mutation ChangePw($password: String!) {
        updateCustomer(input: { password: $password }) { customer { databaseId } }
      }`,
      { password: input.newPassword },
      token
    );
    if (!res.data?.updateCustomer) return { ok: false, error: firstError(res, "Could not change your password.") };
    return { ok: true };
  },

  // NOTE: cart persistence uses the WooGraphQL cart bound to the authenticated
  // customer (authToken as Bearer). Untested end-to-end until GRAPHQL_JWT_AUTH_
  // SECRET_KEY is set on WordPress. Lines without a wooProductId can't be pushed
  // to Woo and are skipped (they persist only in the local device cart).
  async getSavedCart(session): Promise<CartLine[]> {
    const token = await mintAuthToken(session);
    if (!token) return [];
    const res = await authGql<{
      cart: {
        contents: {
          nodes: {
            quantity: number;
            subtotal: string;
            product: { node: { databaseId: number; name: string; slug: string; image: { sourceUrl: string } | null } } | null;
            variation: { node: { databaseId: number } } | null;
          }[];
        };
      };
    }>(
      `query SavedCart {
        cart {
          contents {
            nodes {
              quantity subtotal
              product { node { databaseId name slug image { sourceUrl } } }
              variation { node { databaseId } }
            }
          }
        }
      }`,
      {},
      token
    );
    const nodes = res.data?.cart?.contents?.nodes ?? [];
    return nodes
      .filter((n) => n.product?.node)
      .map((n) => {
        const p = n.product!.node;
        const variationId = n.variation?.node?.databaseId;
        return {
          id: variationId ? `${p.slug}-${variationId}` : p.slug,
          productSlug: p.slug,
          wooProductId: p.databaseId,
          wooVariationId: variationId,
          name: p.name,
          unitPrice: n.quantity ? parseMoney(n.subtotal) / n.quantity : parseMoney(n.subtotal),
          qty: n.quantity,
          img: p.image?.sourceUrl ?? "",
          swatches: [],
        };
      });
  },

  async saveCart(session, lines): Promise<void> {
    const token = await mintAuthToken(session);
    if (!token) return;
    // Replace the customer's cart with the merged set.
    await authGql(`mutation { emptyCart(input: {}) { cart { isEmpty } } }`, {}, token);
    for (const line of lines) {
      if (!line.wooProductId) continue;
      await authGql(
        `mutation Add($p: Int!, $q: Int!, $v: Int) {
          addToCart(input: { productId: $p, quantity: $q, variationId: $v }) { cart { contents { itemCount } } }
        }`,
        { p: line.wooProductId, q: line.qty, v: line.wooVariationId ?? null },
        token
      );
    }
  },
};
