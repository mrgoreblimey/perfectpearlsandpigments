# PPP — Site Settings (Manual Paste-In)

The kit import is fragile (Elementor's validator is strict and AI-generated kits often fail on schema). This 5-minute manual path is **100% reliable** — it just sets the Global Colours and Global Fonts by hand in Elementor's Site Settings panel.

> Same end result. You only do this once. After it's done, every section template you import below will inherit the right look.

---

## Step 1 — Open Site Settings

WordPress admin → **Elementor → Templates → Theme Builder** → click the **hamburger menu** (top-left) → **Site Settings** → **Design System**.

---

## Step 2 — Global Colors

Click **Global Colors**. Replace the 4 system slots, then click **+ Add Color** for each custom one.

### System (replace existing 4 slots)

| Slot | Name | Hex |
|---|---|---|
| Primary | Brand Black | `#0A0A0A` |
| Secondary | Brand Orange | `#F69311` |
| Text | Body Text | `#444444` |
| Accent | Muted Gray | `#888888` |

### Custom (click + Add Color → name + paste hex)

| Name | Hex |
|---|---|
| PPP / Dark 1 | `#0A0A0A` |
| PPP / Dark 2 | `#111111` |
| PPP / Dark 3 | `#1C1C1C` |
| PPP / Off-white | `#F6F6F6` |
| PPP / Gray 100 | `#E8E8E8` |
| PPP / Accent Orange | `#F69311` |
| PPP / Success | `#00CC66` |
| PPP / Star Gold | `#FFD700` |

Click **Update** (bottom of panel).

---

## Step 3 — Global Fonts

Back in **Site Settings → Design System → Global Fonts**.

### System (edit existing 4)

| Slot | Family | Weight | Size | Line Height | Letter Spacing | Transform |
|---|---|---|---|---|---|---|
| Primary | Staatliches | 400 | (default) | 1.05em | 0.01em | — |
| Secondary | Staatliches | 400 | (default) | 1em | -0.005em | — |
| Text | Lexend | 400 | 0.95rem | 1.7em | 0 | — |
| Accent | Lexend | 700 | 0.72rem | 1.2em | 0.18em | UPPERCASE |

### Custom — click + Add Style for each

| Name | Family | Weight | Size | Line H. | Letter Sp. | Transform |
|---|---|---|---|---|---|---|
| PPP / H1 Hero | Staatliches | 400 | 104px (mobile 56px) | 0.93em | -0.025em | UPPERCASE |
| PPP / H2 Section | Staatliches | 400 | 56px (mobile 36px) | 1em | 0.01em | — |
| PPP / H3 Card | Staatliches | 400 | 1.35rem | 1.1em | 0 | — |
| PPP / Eyebrow | Lexend | 700 | 0.72rem | 1.2em | 0.22em | UPPERCASE |
| PPP / Button | Lexend | 700 | 0.82rem | — | 0.12em | UPPERCASE |
| PPP / Price | Lexend | 700 | 2rem | — | -0.03em | — |

Click **Update**.

---

## Step 4 — Theme Style (heading + body defaults)

**Site Settings → Theme Style → Typography**:

- **Body**: Lexend / 400 / 1rem / line 1.7em / color `#0A0A0A`
- **H1**: Staatliches / 400 / 80px / line 1em / tracking -1.5%
- **H2**: Staatliches / 400 / 56px / line 1em
- **H3**: Staatliches / 400 / 36px / line 1.1em
- **H4**: Staatliches / 400 / 24px
- **H5**: Lexend / 700 / 18px / tracking 4% / UPPER
- **H6**: Lexend / 700 / 0.72rem / tracking 18% / UPPER

**Site Settings → Theme Style → Buttons**:

- BG: `#F69311` (or Brand Orange global)
- Text: `#000000`
- Typography: Lexend / 700 / 0.82rem / tracking 12% / UPPER
- Padding: 16px / 32px / 16px / 32px
- Border radius: 0

---

## Step 5 — Layout

**Site Settings → Layout**:

- Container Width: **1280**
- Widgets Space: **20**
- Breakpoints: Default (Mobile <768 · Tablet 768-1024 · Desktop ≥1025)

---

## Step 6 — Custom Code

**Site Settings → Custom CSS** — paste:

```css
/* PPP marquee */
.ppp-marquee { display: flex; width: max-content; animation: pppMarquee 32s linear infinite; }
.ppp-marquee:hover { animation-play-state: paused; }
@keyframes pppMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* PPP card hover lift */
.ppp-card { transition: transform .25s, box-shadow .25s; }
.ppp-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,0.10); }

/* PPP category card */
.ppp-cat-card { transition: transform .25s, box-shadow .25s; }
.ppp-cat-card:hover { transform: scale(1.018); box-shadow: 0 24px 60px rgba(0,0,0,0.22); }
```

**Elementor → Custom Code → \<head\>** — paste:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Staatliches&display=swap" rel="stylesheet">
```

---

✅ **Done with settings.** Now import the individual templates (see `IMPORT-TEMPLATES.md`).
