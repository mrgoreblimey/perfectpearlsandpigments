# Perfect Pearls & Pigments — Frontend

Next.js 16 (App Router, TypeScript, Turbopack) frontend for a **headless WordPress** setup. Implements the `PPP Redesign v2` homepage.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static prerender)
```

The site runs standalone out of the box on built-in seed data (`lib/fallback-data.ts`), so no WordPress instance is required for development.

## Headless WordPress wiring

Products are fetched at build/ISR time from WordPress via GraphQL.

1. On the WordPress install, activate **WPGraphQL** and **WPGraphQL for WooCommerce (WooGraphQL)**.
2. Copy `.env.example` to `.env.local` and set:
   ```
   WORDPRESS_GRAPHQL_URL=https://cms.perfectpearlsandpigments.co.uk/graphql
   ```
3. Restart. `lib/wordpress.ts` now pulls **Best sellers** (by total sales) and **New in** (by date) live, revalidating every 5 minutes (ISR). If the endpoint is unset or unreachable, it silently falls back to seed data.

### What's live vs. seed
- **Products** (Best sellers, New in) — from WooGraphQL when configured.
- **Nav menu, category tiles, reviews** — currently design-managed in `lib/fallback-data.ts`. Swap these for WP menus / product categories / a reviews plugin as a follow-up (each has a marked note in `getHomeData`).

## Structure

- `app/` — layout (fonts, cart provider, metadata) and the homepage.
- `components/` — one component per design section (Header, Hero, Categories, ProductCard, Showcase, Stats, Reviews, Newsletter, Footer, CartDrawer).
- `context/CartContext.tsx` — client cart state, persisted to `localStorage`.
- `lib/` — types, WordPress data layer, seed data.

Design tokens (accent `#F69311`, radius, fonts Archivo/Lexend) live as CSS variables in `app/globals.css`.
