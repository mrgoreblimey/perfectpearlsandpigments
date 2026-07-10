# PPP — Import Templates One at a Time

The reliable path. Each `.json` file in this folder imports cleanly via Elementor's standard **Saved Templates** importer.

---

## How to import

1. WP admin → **Elementor → Templates → Saved Templates**
2. Click **Import Templates** (top of page)
3. Drag in the `.json` file
4. Repeat for each file

---

## Order to import (recommended)

| File | What it is | Where it lands |
|---|---|---|
| `01-header.json` | Site-wide sticky header | Templates → Saved Templates |
| `02-footer.json` | Site-wide footer | Templates → Saved Templates |
| `03-single-product.json` | WooCommerce single product template | Templates → Saved Templates |
| `04-product-archive.json` | WooCommerce shop / category archive | Templates → Saved Templates |
| `05-homepage.json` | Full homepage with all sections | Templates → Saved Templates |

---

## After importing

### Promote header + footer to Theme Builder

1. **Elementor → Templates → Theme Builder**
2. Click **Add New Template** → **Header** → close the modal that opens
3. From the bottom-right corner of the empty header editor, click **Add Template** → search for *PPP — Header* → **Insert**
4. **Publish** → set Conditions → *Include · Entire Site*
5. Repeat for **Footer**

> If your version of Elementor Pro shows imported headers/footers directly in Theme Builder (newer builds), just open them there and click **Publish** + Conditions.

### Promote single-product + archive to Theme Builder

Same process:
- **Add New Template → Single Product** → insert *PPP — Single Product* → Conditions: *Include · All Products*
- **Add New Template → Products Archive** → insert *PPP — Product Archive* → Conditions: *Include · All Product Archives*

### Promote homepage

1. WordPress **Pages → Add New** — title it "Home"
2. Click **Edit with Elementor**
3. Click the folder icon (top-center "Add Template") → **My Templates** tab → find *PPP — Homepage* → **Insert**
4. **Publish**
5. **Settings → Reading** → "Your homepage displays" → A static page → Homepage = Home

---

## Troubleshooting

### "Some widgets are missing"

Re-add the warned widget from the Elementor panel. The Container's styling is preserved — only the inner widget needs a click to recreate. This happens when WooCommerce widget IDs differ between Elementor Pro versions.

### "Unsupported template type"

If `single-product` or `product-archive` imports fail, you don't have **Elementor Pro + WooCommerce** active. Both are required for those two templates only — homepage / header / footer work without WooCommerce.

### Fonts look wrong after import

You haven't completed the Site Settings setup yet — see `SITE-SETTINGS-MANUAL.md`. The templates reference global typography slots; until those slots exist, they fall back to Elementor defaults.

### Colors look wrong after import

Same as above — set up Global Colors first.

---

## Why not the kit format?

The Kit ZIP format (Site Settings → Import/Export Kit) requires the manifest at the **zip root** and a strict schema. AI-generated kits frequently fail on schema validation. This per-template path uses a simpler, more forgiving JSON format that Elementor has supported since v2.x.
