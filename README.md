# Sind Bearing Agency (SBA) — Website v3

Teal-on-black industrial theme, an animated bearing that assembles itself on the
landing page, WhatsApp on every page, and social icons ready to be wired up.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

Node 18.17+ required.

---

## What changed from v2

| | v2 | v3 |
|---|---|---|
| Palette | Amber on graphite | **Teal on near-black** |
| Hero | Static photo | **Animated bearing assembly** |
| Social | none | **Instagram + Facebook**, placeholder links |
| Phones | some | **Every number is a `tel:` link** |
| Landing | good | Feature row, credential bar, glow arcs |

Company data, addresses and the product catalogue are unchanged.

---

## The bearing assembly animation

`components/BearingAssembly.tsx` — the centrepiece of the landing page.

The outer race, the cage, nine balls and the inner race each start scattered off
in their own direction, fade in, converge into a fully assembled bearing, spin
together as one unit, then drift apart and loop. 11 seconds per cycle.

**How it works** — one CSS keyframe rule drives every part. Each part supplies
its own scattered position through custom properties:

```tsx
style={{ "--dx": "-230px", "--dy": "-200px", "--r": "-42deg", "--s": "0.8" }}
```

so they come from different places but land at exactly the same moment. The
balls carry small staggered delays so they cascade in rather than landing as one
lump.

Two details worth keeping:

- `transform-box: view-box` with a shared `transform-origin` — this is what keeps
  every part measured against the same SVG centre. Without it each element
  rotates about its own bounding box and the assembly tears apart.
- The cage and balls sit in a `.ba-orbit` group that turns the opposite way and
  slower than the races — roughly how a real bearing behaves, where the cage
  travels at about half shaft speed.

**Tuning:** timings live in `app/globals.css` under *Bearing assembly animation*.
Geometry (ball count, radii, race widths) lives in the constants at the top of
the component — change `BALLS` to 8 or 12 and the cage bridges reposition
themselves.

Under `prefers-reduced-motion: reduce` the whole thing renders as a static
assembled bearing. No movement at all.

---

## WhatsApp — +92 300 2028297

One place controls it: `company.whatsapp` in `lib/site.ts`.

```ts
whatsapp: "923002028297",        // digits only, international, no "+"
whatsappDisplay: "+92 300 2028297",
```

**Where it appears:** floating button on every page (authentic WhatsApp glyph,
pulse ring, chat panel with five quick-reply topics), header, footer, contact
page, 404, empty search results, and every product page — where the message
names that exact part:

> Hello SBA, I am interested in **30206** (Single-Row Tapered Roller Bearing)…

Links use `wa.me`, so they work on mobile, desktop app and WhatsApp Web.

### Every phone number is clickable

All numbers render as `tel:` links, so a tap dials on mobile:

- **+92 300 2028297** — WhatsApp / sales, in the header bar, hero, process
  section, CTA and mobile menu
- **042 3772 1168 / 042 3772 1177** — Lahore office, in the header bar,
  locations, footer and contact page

---

## Social icons

`components/Social.tsx` — Instagram and Facebook brand glyphs, drawn as single
paths.

**Links are deliberately `#` for now.** They're styled, hover correctly, and
carry `aria-disabled` plus a "coming soon" tooltip so screen readers aren't
promised a destination that doesn't exist yet.

To go live, edit one array in `lib/site.ts`:

```ts
export const socials: Social[] = [
  { name: "Instagram", href: "https://instagram.com/yourhandle", icon: "instagram" },
  { name: "Facebook",  href: "https://facebook.com/yourpage",    icon: "facebook" },
];
```

Every icon on the site — header bar, hero, footer, mobile menu — updates at once.
Adding a third network means adding its glyph to `ICONS` in `Social.tsx`.

---

## Palette

`tailwind.config.ts`.

```
brand-400  #2EE6D0   bright teal — headings, hover
brand-500  #14C8B4   primary accent, CTAs, cage in the animation
brand-600  #0FA394   pressed / deep
ink-950    #05090B   page background
ink-900    #0A1114   cards and raised sections
ink-800    #141E21   borders
ink-300/400          body text
whatsapp   #25D366   WhatsApp only — never as a general accent
```

**About the white product tiles:** the bearing photos were shot on white. Keying
that white out left grey artifacts from the original shadows, so every product
image sits on a white `.product-tile` inside the dark card. The SVG
illustrations have transparent backgrounds so they land on the same tile and the
grid stays consistent.

---

## The logo

`make_logo.py` — drawn from primitives, nothing traced. A bearing outer race
whose rolling elements sit on the same ring as a globe's latitude lines, with a
teal roller in the race gap and a trade arc sweeping out of it.

| File | Use |
|---|---|
| `logo.svg` | Light ink — dark backgrounds (header, footer) |
| `logo-dark.svg` | Dark ink — white backgrounds, print, invoices |
| `logo-mark.svg` / `logo-mark-dark.svg` | Icon only |
| `favicon.svg` | Rounded app icon |

Change the colour constants at the top and re-run `python3 make_logo.py`.

> Keep the `textLength` + `lengthAdjust` attributes on the wordmark. Without
> them, a machine missing Segoe UI substitutes a wider font and the text
> overflows the canvas.

---

## Company data

`lib/site.ts` is the single source of truth — header, footer, every page and the
JSON-LD read from it.

- **Established** 1982
- **Head Office** — 10, Green Terrace No. 2, Noman Street, Plaza Quarters, Karachi-74400, Pakistan
- **Lahore Office** — 17 - L.M.C. Market, Badami Bagh, Lahore · 042 3772 1168 / 042 3772 1177
- **WhatsApp** +92 300 2028297 · **Email** sba@ktntn.com · **Web** ktntn.com

### Still needed: two Karachi addresses

The profile says four sales centres but prints only two. `/locations` has a
marked panel saying so. Append two objects to the `locations` array and the
maps, footer and contact page pick them up automatically.

---

## Products

`lib/products.ts` — six categories (the exact six from the PDF) and 28 items with
standard ISO designations and nominal dimensions.

> These are realistic reference items, not your live stock list. Replace them
> with your own part numbers and check load ratings against the manufacturer's
> catalogue before going live.

**Search & filter** (`components/ProductExplorer.tsx`) runs entirely in the
browser: free text across designation, name, description, applications and
sizes; category radio with counts; max-bore slider; cage and sealing
checkboxes; sort; deep links via `/products?category=<slug>`.

---

## Contact form

Two routes, no backend needed: **Send on WhatsApp** packages the whole enquiry
into a chat, or **Send by email** opens the mail client. To make it a real form,
replace the handlers in `components/ContactForm.tsx` with a POST to your own API
route, or point them at Formspree / Web3Forms / Resend.

---

## Deploy

Vercel: push to Git, import, done.
Any Node host: `npm run build && npm start`.

Static export is not configured because `/products` reads a search param on the
server. Move that into the client component if you need a fully static site.

Set your real domain in `company.websiteUrl` — `metadataBase`, the sitemap and
robots all read from it.

---

## Verification

Built and served on Next.js 14.2.35 (the patched release):

- `next build` — compiles clean, TypeScript validates, **38 pages** generated
- All routes 200; unknown routes hit the custom 404; all 28 product pages render
- Animation classes and keyframes confirmed present in the built CSS
- Instagram + Facebook icons and `tel:` links confirmed on **every** page
- WhatsApp deep links carry the correct part designation
- All assets resolve through the image optimiser (svg, jpg, png)
- No amber left anywhere in the compiled stylesheet

---

## v7 — International B2B edition

**Design system:** Inter (body) + Manrope (headings), self-hosted via @fontsource. Navy / white / steel-grey,
light "catalogue" sections (`.light`), steel divider (`.rule-steel`), page fade transitions (`app/template.tsx`),
scroll reveals (`components/Reveal.tsx`), light hero parallax (`components/Parallax.tsx`). All motion is off for
reduced-motion users.

**New pages:** `/quote` (RFQ with line items → WhatsApp or email), `/quality` (supply, QC, certifications,
global supply), `/faq` (with FAQPage structured data), `/downloads` (PDF catalogue + datasheets),
`/stock/<part>` (506 part pages with Product structured data and a printable datasheet).

**Reusable sections:** `components/sections.tsx` (Head, Figures, RangeGrid, SupplyCapabilities, Certifications,
QcProcess, GlobalSupplyGrid, CatalogueBand, QuoteSection), `SpecTables`, `Faq`, `QuoteForm`, `ZoomImage`.

### Placeholders SBA must complete — `lib/content.ts`
Shown on the site as "To be confirmed". Each item says what proof/details are needed. Do not fill these with
claims that cannot be documented:
- `certifications` — certificate names, numbers, issuing bodies, PDFs
- `qcSteps` — the actual inspection steps
- `globalSupply` — export markets, Incoterms, payment terms, export documents
- `manufacturing` — SBA is an importer/stockist; list authorised brands (with logo permission)
- Facebook profile link in `lib/site.ts` (currently a search for "Sadiq Ameen")

### Product pictures
`render/bearing_render.py` renders the studio product pictures in `public/images/render/`
(`python3 render/bearing_render.py`). Replace with real photography when available, same file names.

### Catalogue PDF
After changing part numbers in `lib/stock.ts`:
```
node scripts/export-stock.js /tmp/stock.json && python3 scripts/make_catalogue.py /tmp/stock.json
```
