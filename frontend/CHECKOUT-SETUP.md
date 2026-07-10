# Checkout & Stripe setup

The storefront has a full custom checkout: **/cart → /checkout → /order-confirmed**, with card payments taken by **Stripe** (Payment Element) and the order written to **WooCommerce** after payment succeeds.

It degrades gracefully: with no keys set, the checkout shows a "Place test order" button so the flow can be previewed, and orders are simulated.

## 1. Stripe keys (card payments)

1. In the Stripe Dashboard (Developers → API keys), copy your **test** keys.
2. Add to Vercel (Settings → Environment Variables) and/or `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   STRIPE_SECRET_KEY=sk_test_xxx
   ```
   The publishable key is public (browser); the secret key is server-only and never sent to the client.
3. Redeploy. The checkout now shows the real card form. Test with Stripe's `4242 4242 4242 4242`, any future expiry, any CVC.

Go live later by swapping test keys for live keys (`pk_live_…` / `sk_live_…`).

## 2. WooCommerce order creation

After a successful payment, the order is created in WooCommerce → Orders via the REST API.

1. WooCommerce → Settings → Advanced → REST API → **Add key** (Read/Write). Copy the consumer key/secret.
2. Add to Vercel / `.env.local`:
   ```
   WOOCOMMERCE_STORE_URL=https://staging.perfectpearlsandpigments.co.uk
   WOOCOMMERCE_CONSUMER_KEY=ck_xxx
   WOOCOMMERCE_CONSUMER_SECRET=cs_xxx
   ```
3. Orders now appear in WooCommerce → Orders, marked paid, with the Stripe PaymentIntent id in order meta.

## How it works

- `POST /api/checkout/create-intent` — recomputes the order total **server-side** (`lib/order-pricing.ts`) and creates a Stripe PaymentIntent. The client total is never trusted.
- Stripe Payment Element confirms the card (handles 3-D Secure).
- `POST /api/checkout/confirm` — re-verifies with Stripe that the PaymentIntent **succeeded** for the exact amount, then creates the WooCommerce order.

## Known limitations to close before real payments

1. **Prices are still seed-based.** `order-pricing.ts` computes totals from the cart's unit prices (seed catalog). Once the storefront is wired to live WooGraphQL products, price each line from WooCommerce there so totals can't be tampered with and match store pricing exactly.
2. **Product line items.** Order lines resolve a WooCommerce product by slug; unresolved items fall back to a named fee line. When the catalog carries real `wooProductId`s (and variation ids for sizes), pass those directly for clean line items and correct stock/reporting.
3. **Tax.** Woo recalculates tax per store settings; confirm your VAT config (inclusive pricing) matches the displayed "VAT included" totals.
4. **Webhook backstop.** Consider a Stripe webhook (`payment_intent.succeeded`) as a safety net so an order is still recorded if the browser drops after payment.
5. **PayPal / Apple Pay / Google Pay** — the Payment Element can enable wallets once configured in Stripe; PayPal from the design is not wired.
