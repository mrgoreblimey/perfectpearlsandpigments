/**
 * GraphQL transport for authenticated (per-customer) requests.
 *
 * Unlike the catalog wrappers (which ISR-cache with `revalidate`), account
 * data must never be cached across users — always `cache: "no-store"`. The
 * auth token is attached server-side as a Bearer header and never reaches the
 * browser.
 */

const WP_GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL ||
  "https://staging.perfectpearlsandpigments.co.uk/graphql";

export interface GqlResult<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function authGql<T>(
  query: string,
  variables: Record<string, unknown> = {},
  authToken?: string
): Promise<GqlResult<T>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
    const json = (await res.json()) as GqlResult<T>;
    return json;
  } catch (err) {
    return { errors: [{ message: err instanceof Error ? err.message : "Network error" }] };
  }
}

/** First GraphQL error message, or a fallback. */
export function firstError(result: GqlResult<unknown>, fallback = "Something went wrong"): string {
  return result.errors?.[0]?.message?.trim() || fallback;
}
