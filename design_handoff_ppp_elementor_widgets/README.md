# Handoff: PPP Elementor Companion Plugin ("PPP Toolkit")

## Overview

Perfect Pearls & Pigments (PPP) is a UK specialty-pigment WooCommerce store. A full redesign ("V2" — light theme) has been prototyped in HTML/React and partially rebuilt as native Elementor Pro templates. This handoff asks you to build the pieces Elementor Pro **cannot** express natively: a small WordPress companion plugin (`ppp-toolkit`) registering custom Elementor widgets, so the live site reaches 1:1 fidelity with the V2 prototype while everything stays editable in the Elementor visual UI.

## Target environment

- WordPress 6.x + WooCommerce 8+
- Elementor **and Elementor Pro 3.23+** (Containers/flexbox enabled; Theme Builder + Loop Builder available)
- Theme: Hello Elementor (or any thin Elementor-compatible theme)
- The plugin must work alongside the existing imported templates in `reference/elementor-templates/` (header, footer, single product, archive, homepage)

## About the design files

Files in `reference/` are **design references created in HTML/React** — prototypes showing intended look and behavior, NOT production code to copy. Your task is to recreate their look/behavior as **PHP Elementor widgets + one CSS/JS bundle** using WordPress/WooCommerce/Elementor conventions (escaping, i18n, AJAX endpoints, cart fragments). Open the `.html` files in a browser to see live behavior; read the `.jsx` files for exact values.

**Source of truth is the V2 design** (`PPP Redesign v2.html` + `ppp-components-v2.jsx` + `ppp-sections-v2.jsx`, plus category/product pages). ⚠️ The existing Elementor template JSONs in `reference/elementor-templates/` were built against the older V1 dark theme (Staatliches font, black, square corners) — treat them as import scaffolding only; **restyle everything to V2 tokens** (Archivo/Lexend, light `#FAF9F7`, 12px radius).

## Fidelity

**High-fidelity.** Colors, spacing, typography, radii, shadows, and transition timings in the prototypes are final. Recreate pixel-perfectly. Product/category imagery in the prototypes uses generated gradient placeholders — real product photos come from WooCommerce.

## What to build (the plugin)

Five widgets + one shared asset bundle. Full per-widget specs in `WIDGET-SPECS.md`.

1. **PPP Product Card / Grid** (`ppp_product_grid`) — query-driven product grid rendering the V2 card: image zoom on hover, category badge pill, swatch dots, price, "Select options / Add to basket" button with AJAX quick-add + "Added ✓" state.
2. **PPP Category Carousel** (`ppp_category_carousel`) — edge-bleed horizontal scroll-snap track of gradient category tiles with arrow controls, driven by product-category terms + term meta (2 gradient colors, optional tag).
3. **PPP Cart Drawer** (`ppp_cart_drawer`) — site-wide slide-in basket (right side, floating card style) wired to WooCommerce cart fragments; opens from header cart icon and after quick-add.
4. **PPP Sticky ATC** (`ppp_sticky_atc`) — single-product sticky add-to-cart bar that slides up when the main buy box scrolls out of view.
5. **PPP Mega Menu Panel** (`ppp_mega_panel`) — optional; only if Elementor Pro's Mega Menu widget can't reproduce the 3-column dropdown with color-dot items (try native first).

### Plugin scaffold

```
ppp-toolkit/
├── ppp-toolkit.php                  # bootstrap: version check, register category "PPP", enqueue
├── includes/
│   ├── class-widgets-loader.php     # registers widgets on elementor/widgets/register
│   ├── widgets/
│   │   ├── class-product-grid.php
│   │   ├── class-category-carousel.php
│   │   ├── class-cart-drawer.php
│   │   └── class-sticky-atc.php
│   └── ajax.php                     # quick-add endpoint (use native ?wc-ajax=add_to_cart where possible)
└── assets/
    ├── css/ppp-toolkit.css          # tokens + all component styles (see Design Tokens)
    └── js/ppp-toolkit.js            # drawer open/close, carousel arrows, sticky ATC observer, quick-add
```

Widget conventions:
- Extend `\Elementor\Widget_Base`, category `ppp`, proper `get_keywords()`
- Expose controls: accent color (default Global secondary `#F69311`), corner radius (default 12), query args (count, category, orderby) for the grid, columns (default 4)
- Render server-side PHP (escaped); must preview correctly inside the Elementor editor
- Use IntersectionObserver for sticky ATC; `wc_add_to_cart_params` + cart fragments for drawer/count refresh; no jQuery beyond what Woo requires

## What NOT to build (stays native Elementor Pro)

- Header/announce bar, hero (3 layout variants), USP row, showcase, stats, reviews, newsletter panel, footer → Containers + Heading/Text/Button/Icon List widgets
- Newsletter form → Elementor Pro **Form** widget (replace the HTML-widget placeholder in the old kit)
- Header dropdowns → try Elementor Pro **Mega Menu** widget first
- Product page gallery/tabs → Woo Product Images + Pro Accordion, styled via the token CSS
- Category page faceted filters → recommend **FacetWP** (checkbox facets with counts, dual-range price slider, active-filter chips) skinned with the token CSS; only hand-build if FacetWP is rejected. Reference UX: `ppp-category-v2.jsx` (CheckRow, FacetGroup, PriceFacet, ActiveChips, SkeletonCard shimmer while filtering).

## Design tokens (V2 — install as CSS custom properties AND Elementor Globals)

```css
:root {
  --ppp-acc:  #F69311;   /* accent — tweakable; alternates: #00C2E0, #E8452C, #8B5CF6 */
  --ppp-r:    12px;      /* base radius — cards use var(--ppp-r); panels/hero +8px; buttons 10px */
  --ppp-ink:  #17150F;   /* primary text */
  --ppp-line: #ECEAE4;   /* borders on light */
}
```

- **Backgrounds** — page `#FAF9F7`; cards/white sections `#FFFFFF`; product-image well `#F1EFEA`
- **Dark surfaces** — footer `#0A0A0A`; showcase & newsletter panels `#0D0D0D`; hero split panel `#101010`; announce bar `#111111`; header `rgba(16,16,16,0.94)` + `backdrop-filter: blur(12px)`; dark borders `#232323`/`#262626`/`#1E1E1E`/`#2A2A2A`
- **Muted text on light** — `#45433E` (review body), `#55534E`, `#6E6B64`, `#8A877F`, `#A5A29A`
- **Muted text on dark** — `#B4B1AA` (hero sub), `#8D8A83`, `#77746D`, `#5E5B55`, `#4A4844`
- **Star gold** — `#F2B01E`
- **Type** — Headings: `Archivo` 700 (load 500–800); Body/UI: `Lexend` (load 300–700). Google Fonts.
- **Container** — `.v2-wrap`: max-width `1360px`, padding `0 32px`, margin auto
- **Buttons**
  - Primary: accent bg, `#17150F` text, radius 10px, padding `15px 30px`, Lexend 0.88rem/600; hover `brightness(1.08)` + `translateY(-1px)`, 0.2s
  - Ghost (on dark): transparent, `1px solid rgba(255,255,255,0.28)`, white text, padding `14px 26px`; hover border `rgba(255,255,255,0.6)` + bg `rgba(255,255,255,0.06)`
  - Card button: white bg, `1px solid #DEDBD3`, radius 9px, padding 11px, 0.8rem/600; hover inverts to ink bg / white text
  - Arrow button: 34px circle, white, `1px solid #DEDBD3`, `#55534E` glyph; hover ink border/glyph
- **Card hover** — `translateY(-4px)`, shadow `0 18px 44px rgba(30,24,8,0.09)`, border→`#DEDBD3`, 0.25s
- **Entrance** — fadeUp 0.7s ease, staggered delays 0.10/0.22/0.34/0.46s (hero); respect `prefers-reduced-motion`

## Screens (reference files render these live)

1. **Homepage** — `PPP Redesign v2.html`: announce → sticky dark header w/ mega menu → hero (3 tweakable layouts: Inset panel / Full-bleed / Split) → USP row → category carousel → Best sellers grid (4-col) → dark UltraShift showcase → New in grid → stats band → reviews (4-col) → dark newsletter panel → footer → cart drawer.
2. **Category page** — `PPP Category Page v2.html`: breadcrumb + category header → facet sidebar (checkbox groups w/ counts, dual-range price, clear-all) → active chips → product grid w/ quick-add + skeleton loading states.
3. **Product page** — `PPP Product Page v2.html`: gallery (thumbs left or bottom, zoom) → buy box (size pills, qty stepper, ATC, USP list) → accordions → related products row → sticky ATC bar.

## State management

- **Cart** — WooCommerce session is the store. Quick-add posts to `?wc-ajax=add_to_cart`; on success refresh cart fragments, update header count badge, open drawer. Button shows "Added ✓" ~1.6s. Variable products link to the product page instead (button label "Select options").
- **Drawer** — open/close state in JS only; body scroll-lock while open; Esc + overlay click close.
- **Sticky ATC** — visible when the buy-box ATC button is above the viewport (IntersectionObserver).
- **Accent/radius** — CSS custom properties; the prototype exposes them as live tweaks. In WP these become Elementor Global Color/site-settings so a single edit re-themes everything.

## Assets

- Logo: `https://perfectpearlsandpigments.co.uk/wp-content/uploads/2021/03/PPP-Logo.png` (white version, used on dark header/footer)
- Hero/showcase imagery: `reference/uploads/*.png` (client-provided pigment shots — placeholders for final photography)
- Product/category images: from WooCommerce; prototypes generate gradient placeholders where photos are missing
- Icons: inline SVG, `stroke="currentColor"`, stroke-width 2 (search/account/basket 17×17, checkmarks 13×13). Do not use icon fonts.

## Files in this bundle

- `README.md` — this brief
- `WIDGET-SPECS.md` — precise per-widget specs (layout, values, states, controls)
- `reference/PPP Redesign v2.html` + `ppp-components-v2.jsx`, `ppp-sections-v2.jsx` — homepage (SOURCE OF TRUTH for shared components)
- `reference/PPP Category Page v2.html` + `ppp-category-v2.jsx` — category page
- `reference/PPP Product Page v2.html` + `ppp-product-v2.jsx` — product page
- `reference/ppp-data.js` — nav structure, categories, products, reviews sample data
- `reference/tweaks-panel.jsx` — prototype-only tweaks UI (ignore; do not port)
- `reference/uploads/` — imagery used by the prototypes
- `reference/elementor-templates/` — existing V1-styled Elementor template JSONs + import guide (context for what's already importable)
