# PPP Toolkit — Widget Specs

Exact values lifted from the V2 prototypes. All colors/timings final. `--acc` = accent (`#F69311` default), `--r` = base radius (12px), `--ink` = `#17150F`, `--line` = `#ECEAE4`. Fonts: Archivo (headings), Lexend (everything else).

---

## 1. `ppp_product_grid` — Product Card + Grid

Reference: `V2ProductCard` / `V2ProductSection` in `ppp-components-v2.jsx`; quick-add variant `CatCard` in `ppp-category-v2.jsx`.

### Grid
- `display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:18px` (columns control: 2–5; 2 on mobile)
- Section padding 56px 0; optional header row: overline (accent, 0.72rem/700, letter-spacing 0.14em, uppercase, 10px below-margin) + H2 (`clamp(1.6rem,2.6vw,2.15rem)`, letter-spacing −0.025em) + right-aligned "View all →" link button (0.82rem/500 `#6E6B64`, hover ink)

### Card
- Shell: white bg, `1px solid var(--line)`, `border-radius: var(--r)`, overflow hidden, cursor pointer
- Hover: `translateY(-4px)`; shadow `0 18px 44px rgba(30,24,8,0.09)`; border `#DEDBD3`; transition 0.25s
- **Image well**: margin 8px, `border-radius: calc(var(--r) - 4px)`, `aspect-ratio: 5/4` (1/1 on category page), bg `#F1EFEA`, overflow hidden
  - `<img>` object-fit cover; hover `scale(1.05)`, transition `transform 0.45s ease`
  - **Category badge** top-left 10px: `rgba(255,255,255,0.92)` + blur(4px), `#3A3833` text, 0.6rem/700, letter-spacing 0.1em, uppercase, pill (radius 100px), padding 5px 11px
- **Body** padding `12px 16px 16px`:
  - Row 1: product name H3 (1rem, line-height 1.25, letter-spacing −0.015em, Archivo 700) ↔ price right-aligned (`#6E6B64`, 0.82rem/500, nowrap), baseline-aligned, gap 10, margin-bottom 10
  - Row 2: swatch dots — 13px circles, product attribute colors, `inset 0 0 0 1px rgba(0,0,0,0.1)`, gap 6 + caption "Multiple sizes" (`#A5A29A` 0.7rem); margin-bottom 14. Source swatches from a product attribute (e.g. `pa_colour` term meta) or ACF; hide row if none.
  - Row 3: full-width button (see Card button token). Label: simple product → "Add to basket", variable → "Select options" (links to product)

### Quick-add behavior (simple products)
- POST `?wc-ajax=add_to_cart`; disable button during request
- Success: label → "Added ✓" (accent bg) for 1.6s, refresh Woo cart fragments, update header badge, **open cart drawer**
- Category-page variant shows the button on card hover only (desktop); always visible on touch

### Elementor controls
Query (source: recent / best selling / sale / manual selection / current query for archives; category filter; count), columns, show badge, show swatches, image ratio (5:4 / 1:1), accent override, header row on/off (overline, title, link).

### Skeleton state (archive/filter use)
Shimmer blocks matching card geometry — see `SkeletonCard` + `.cat-shimmer` in `ppp-category-v2.jsx`.

---

## 2. `ppp_category_carousel` — Category tile track

Reference: `V2Categories` in `ppp-components-v2.jsx`.

- Header row (same pattern as grid) + two arrow buttons (34px circles) that `scrollBy({left:±240, behavior:'smooth'})`
- **Track**: `display:flex; gap:14px; overflow-x:auto`, hidden scrollbar, touch momentum. Edge-bleed alignment: horizontal padding `max(20px, calc((100vw - 1360px)/2 + 32px))` so the first tile aligns with `.v2-wrap` content but the track bleeds to viewport edge. Padding top 4 / bottom 18.
- **Tile**: `flex: 0 0 200px; height:150px; border-radius: var(--r); padding:16px 18px`, column flex, space-between, cursor pointer
  - Background: `linear-gradient(150deg, {c1}E8, {c2}C8)` — c1/c2 from term meta (color pickers in a repeater or term fields); include sensible defaults per top-level category
  - Optional tag pill top-left: `rgba(0,0,0,0.35)` + blur(4px), white, 0.56rem/700, letter-spacing 0.12em, uppercase, pill, padding 4px 10px (term meta text, e.g. "Popular")
  - Bottom row: category name (white, 1.02rem, Archivo 700, line-height 1.15, letter-spacing −0.015em, text-shadow `0 2px 12px rgba(0,0,0,0.35)`, supports 2-line names) ↔ arrow chip 30px circle `rgba(255,255,255,0.2)` + blur(4px), white "→" 0.8rem
  - Hover: tile `translateY(-4px)` + shadow `0 18px 44px rgba(30,24,8,0.18)`; arrow chip bg → `rgba(255,255,255,0.35)`
- Whole tile links to the term archive

### Elementor controls
Term source (product_cat, include/exclude, order), tile width (default 200), show tag pills, per-term gradient overrides (repeater fallback if term meta absent).

---

## 3. `ppp_cart_drawer` — Slide-in basket

Reference: `V2CartDrawer` in `ppp-sections-v2.jsx`.

- **Overlay**: fixed inset 0, `rgba(15,12,5,0.4)` + `backdrop-filter: blur(2px)`, z-index 450, fade 0.3s; click closes
- **Panel**: fixed `top:12px; right:12px; bottom:12px; width:400px` (mobile: `width: calc(100vw - 24px)`), white, radius 16px, shadow `0 30px 80px rgba(20,15,5,0.25)`, z-index 500, column flex
  - Closed: `translateX(calc(100% + 24px))`; open: 0; transition `transform 0.32s cubic-bezier(0.4,0,0.2,1)`
- **Header** padding 22px 26px, bottom border `#F0EEE9`: "Your basket" (1rem Archivo 700) + "{n} item(s)" (`#A5A29A` 0.75rem) ↔ close: 32px circle, `#F4F2ED` bg, ✕
- **Items** (scrollable, padding 16px 26px): rows `gap:14px; padding:16px 0`, bottom border `#F0EEE9` — 58px thumb (radius 10, `#F1EFEA` bg) · name (0.85rem/600) + price (`#6E6B64` 0.78rem) · remove ✕ (`#C0BDB5`)
  - Empty state: centered `◎` glyph (`#D8D5CE` 2.4rem) + "Your basket is empty" (`#8A877F` 0.88rem)
- **Footer** (only with items) padding 20px 26px, top border `#F0EEE9`: Subtotal row (label `#8A877F` 0.84rem; value Archivo 700) + full-width primary button "Checkout →" → `/checkout/`
- **Wiring**: render via `wp_footer` (widget placed in header template OR auto-injected via plugin setting). Openers: header cart icon (intercept Menu Cart click or provide `ppp-cart-toggle` class), and quick-add success. Content refreshes from Woo cart fragments (`woocommerce_add_to_cart_fragments` filter supplies the items HTML + count). Esc closes; body scroll-lock while open; focus trap.
- Qty is not editable in-drawer (matches prototype); remove = `wc-ajax remove_from_cart` or fragment refresh.

### Elementor controls
Checkout vs cart button target, accent, free-shipping threshold note (optional text line), auto-open on add (toggle).

---

## 4. `ppp_sticky_atc` — Single-product sticky bar

Reference: `V2StickyATC` in `ppp-product-v2.jsx`.

- Fixed bottom, full-width, z-index 400: `rgba(13,13,13,0.97)` + `backdrop-filter: blur(10px)`, top border `#232323`
- Inner `.v2-wrap` row, padding 12px 32px, space-between: left = product name (white, 0.9rem/600) + selected size · price (muted); right = qty stepper + primary ATC button (compact padding)
- Hidden by default (`translateY(100%)`); slides in (`transform 0.3s`) when the buy-box ATC scrolls above viewport — IntersectionObserver on the native ATC form, `rootMargin: '-80px 0px 0px 0px'`
- On variable products reflect chosen variation; disable until valid selection
- Mobile: name truncates, qty stepper hidden

### Elementor controls
Show product image thumb (toggle), background (dark default / light), offset threshold.

---

## 5. Native-Elementor styling notes (goes in `ppp-toolkit.css`, no widget needed)

- **Header**: announce bar `#111`, text `#999` 0.74rem, padding 8px 24px, centered. Main bar 66px tall, `rgba(16,16,16,0.94)` + blur(12px), bottom border `#232323`, sticky top z-300. Nav buttons 0.85rem/500 `#B5B2AB`, padding 8px 13px radius 8; hover/open → white text on `rgba(255,255,255,0.09)`. Icon buttons 38px circles `#B5B2AB`, hover white on `rgba(255,255,255,0.09)`. Cart badge: 15px accent circle, `#111` 0.58rem/800 count, offset top/right 2px.
- **Mega dropdown** (Pro Mega Menu): panel `#141414`, border `#262626` (no top), radius `0 0 16px 16px`, shadow `0 30px 70px rgba(0,0,0,0.4)`, padding 30px 36px 34px, 3-col grid gap 4px 36px, entrance fade-down 0.18s, 180ms hover-out close delay. Item: 9px color dot + name (`#ECEAE4` 0.85rem/600) + desc (`#77746D` 0.75rem), padding 11px 12px radius 10, hover `rgba(255,255,255,0.05)`. Nav data model: `reference/ppp-data.js` → `nav`.
- **Hero (Inset panel default)**: section padding 18px 20px 0; panel `#0A0A0A`, radius `calc(var(--r) + 8px)`, min-height `min(640px,74vh)`, image cover (flipped) + overlay `linear-gradient(to right, rgba(8,8,8,0.92) 30%, rgba(8,8,8,0.62) 55%, rgba(8,8,8,0.05) 82%, transparent)`. Copy block: pill badge (bg `rgba(255,255,255,0.08)`, border `rgba(255,255,255,0.14)`, 7px accent dot, `#D8D5CE` 0.76rem) → H1 `clamp(3rem,5.4vw,4.9rem)`, line-height 1.02, letter-spacing −0.03em, white → sub `#B4B1AA` 1.06rem/1.7 Lexend 300 max-width 470 → primary + ghost buttons. Staggered fadeUp.
- **USP row**: centered flex wrap gap 12/48, bottom border `--line`, items 0.82rem `#55534E` with 13px accent check SVG.
- **Showcase panel**: `#0D0D0D`, padding 72px 0, 2-col grid gap 56; stat mini-grid cells top-border `#232323`, value white 1.05rem Archivo 700, label `#5E5B55` 0.7rem uppercase.
- **Stats band**: white, 64px 0, 4 cols divided by `--line` left borders; value 2.4rem Archivo 700 letter-spacing −0.04em; label `#8A877F` 0.76rem uppercase 0.08em.
- **Review card**: white, border `--line`, radius `--r`, padding 26px 24px; stars `#F2B01E` 0.82rem letter-spacing 3px; body `#45433E` 0.87rem/1.75; divider `#F0EEE9`; name 0.83rem/600; meta `#A5A29A` 0.73rem with accent product name.
- **Newsletter panel**: `#0D0D0D` radius `calc(var(--r)+8px)`, padding `clamp(48px,5vw,72px) 32px`, centered, max-width 520 inner; input `#1A1A1A` bg, border `#2C2C2C`, radius 10, padding 13px 18px, white text + primary Subscribe. Success line: accent "✓ You're in. Welcome to the family." (Pro Form widget: style to match.)
- **Footer**: `#0A0A0A`, padding 64px 0 36px; grid `2fr 1fr 1fr 1fr 1.4fr` gap 48; column titles white 0.78rem/600 uppercase 0.06em; links `#8D8A83` 0.83rem/300 hover white, 12px gap; social 36px circles border `#2A2A2A` hover accent; legal row top-border `#1E1E1E`, `#4A4844` 0.75rem. Contact: +44 (0)1206 645160 · info@perfectpearlsandpigments.co.uk · Brampton Hall Farm, Little Bentley, Colchester CO7 8TA.
- **Product page** (style native Woo widgets): size selector as pill buttons, qty stepper, accordions with `--line` top borders; gallery thumbs 76px column (left) or row (bottom). See `ppp-product-v2.jsx` for exact values.
- **Category filters** (FacetWP skin): checkbox rows with counts, collapsible groups (`--line` top borders, padding 18px 0), dual-range price slider (accent track), active chips row, results grid swaps to shimmer skeletons while filtering. See `ppp-category-v2.jsx`.

## Accessibility & performance

- All interactive elements keyboard-reachable; drawer focus-trapped with Esc close; carousel arrows have aria-labels; quick-add announces via `aria-live`
- Respect `prefers-reduced-motion` (disable fadeUp/hover-lift/drawer slide → fade)
- One CSS + one JS file, enqueued only where used (`Widget_Base::get_style_depends`/`get_script_depends`); no external JS libs
