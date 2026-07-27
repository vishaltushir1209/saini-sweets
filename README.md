# Saini Sweets — Next.js Website

Production-ready, multi-page Next.js (App Router) site for Saini Sweets.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** — brand tokens in `tailwind.config.ts`
- **shadcn/ui pattern** — `components/ui/button.tsx`, `components.json`, `cn()` in `lib/utils.ts`
- **Framer Motion** — section reveal/hover animations
- **Lucide Icons** — all iconography

## ⚠️ Placeholder Content Notice

This build uses **generic placeholder images and sample text** throughout, as agreed:

- All images live in `/public/images/*-placeholder.*` — replace the files directly
  (keep the same filename) once real photography is available.
- `data/reviews.ts` contains **sample testimonials**, clearly marked — replace with
  real customer reviews before launch.
- `data/business.ts` has placeholder address/phone/hours/map — search for `TODO`
  comments and fill in real details.
- The logo is a plain placeholder mark — swap `public/images/logo-placeholder.png`.

## Product Management (/admin/products)

Full CRUD for the mithai menu, gated behind the admin login.

**⚠️ Persistence model — read this before deploying:**
Products are stored in `data/products.json` and read/written directly via Node's
`fs` module (see `lib/products-store.ts`), and uploaded photos are written to
`public/uploads/products/` (see `lib/product-image-upload.ts`). This works
correctly on a traditional Node.js server (`next start` on a VPS, Docker, etc.)
where the filesystem persists between requests. **It will not reliably persist
on ephemeral/serverless platforms** (e.g. Vercel's default runtime, where each
invocation can get a fresh filesystem) — deploying there would need swapping
these two modules for a real database + object storage (e.g. Postgres +
S3/Cloudinary) without changing anything else, since both already expose a
small, self-contained async API.

**What's implemented:**
- Listing with live search (by name/category), a responsive table
- Add / Edit product — shared `ProductForm`, with inline validation (name, price, unit, category, description length, icon, image type/size)
- Delete — accessible confirmation dialog (native `<dialog>`, no extra dependency) before anything is removed
- Photo upload — JPEG/PNG/WebP, 5MB max, falls back to a vector icon when no photo is set
- Featured / Available — quick-toggle switches directly in the list, and checkboxes in the form
- Categories — fixed list in `types/index.ts` (`PRODUCT_CATEGORIES`)

**Public site integration:** the homepage's Featured Products and the `/menu`
rate-list board now read from this same store (`getProducts()`), server-side,
via `app/(site)/page.tsx` and `app/(site)/menu/page.tsx` — so changes made in
`/admin/products` show up on the live site immediately. Unavailable products
are automatically hidden from both.

## Admin Authentication

A single hardcoded admin account protects `/admin/*` — there is no signup page, no user database, and no multi-user support by design.

**Setup (one-time):**
1. Copy `.env.local.example` to `.env.local`.
2. Generate a session secret: `npx auth secret` (or use the fallback command in the example file) and put it in `AUTH_SECRET`.
3. Set `ADMIN_EMAIL` to the one admin's login email.
4. Generate a bcrypt password hash: `node scripts/generate-admin-hash.mjs "your-chosen-password"`, then paste the output into `ADMIN_PASSWORD_HASH`.
5. Never commit `.env.local` (already gitignored) and never store the plain password anywhere in the repo.

**How it works:**
- `auth.config.ts` — edge-safe config (used by `middleware.ts`) that decides which routes require a session; contains no bcrypt/Node-only code.
- `auth.ts` — full config (Node runtime only) with the Credentials provider that compares the submitted password against `ADMIN_PASSWORD_HASH` via `bcryptjs`.
- `middleware.ts` — protects every `/admin/*` route except `/admin/login`, redirecting signed-out visitors to the login page and signed-in visitors away from it.
- `/admin/login` — email/password form (Server Action, `useActionState` for pending/error UI).
- `/admin/dashboard` — protected placeholder; double-checks the session server-side in addition to middleware (defense in depth) and includes the Logout action.
- `/admin` — redirects to `/dashboard` or `/login` depending on session state.

The admin section has its own layout (`app/admin/layout.tsx`) — it does not render the public site's Header/Footer. The public pages now live under the `app/(site)/` route group so they can share a different layout without affecting any URLs.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run the production build
```

## Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Home — Hero, About teaser, Featured Products, Why Choose Us, Festival Orders, Gallery preview, Testimonials, Map, Contact CTA |
| `/about` | `app/about/page.tsx` | Full story + Why Choose Us |
| `/menu` | `app/menu/page.tsx` | Full rate-list board + Festival Orders |
| `/gallery` | `app/gallery/page.tsx` | Full photo gallery |
| `/contact` | `app/contact/page.tsx` | Contact info cards + Map + Contact CTA |

Header and Footer render once in `app/(site)/layout.tsx` and are shared by every public page. The `/admin` section has its own separate layout (see Admin Authentication below).

## Project Structure

```
app/                     Routes + root layout (global shell only) + global CSS
  (site)/                 Route group for the public site — doesn't affect URLs
    layout.tsx              Public Header + Footer + skip link
    page.tsx, about/, menu/, gallery/, contact/    The 5 public pages
  admin/                   Protected admin section
    layout.tsx               Admin-only shell (no public Header/Footer)
    page.tsx                  /admin → redirects to /login or /dashboard
    login/                     /admin/login (page.tsx + Server Action)
    dashboard/                 /admin/dashboard (protected)
    actions.ts                 Logout Server Action
  api/auth/[...nextauth]/    Auth.js route handler
  loading.tsx               Site-wide branded route-transition loader
auth.ts                  Full Auth.js config (Node runtime, bcrypt Credentials provider)
auth.config.ts            Edge-safe Auth.js config (used by middleware.ts)
middleware.ts             Protects every /admin/* route

components/               One component per file, reused across pages
  Header.tsx               Sticky navbar (route-aware active link, mobile menu)
  Footer.tsx                Premium footer (nav, contact, socials)
  Hero.tsx                  Homepage hero
  About.tsx                 Story section — variant="teaser" (home) or "full" (/about)
  FeaturedProducts.tsx       Homepage product highlights (uses `featured: true` items)
  ProductCard.tsx             Single product card
  WhyChooseUs.tsx            Feature grid (home + /about)
  FeatureCard.tsx              Single feature card
  FestivalOrders.tsx         Festival/bulk order banner (home + /menu)
  Gallery.tsx                 Photo grid — `limit` + `showCta` props for home vs /gallery
  Testimonials.tsx           Review grid
  ReviewCard.tsx               Single review card
  GoogleMap.tsx               Embedded map
  ContactCTA.tsx              WhatsApp / Call banner
  Contact.tsx                 Address / phone / hours / email cards (/contact)
  MenuBoard.tsx               Full rate-list board (/menu)
  MenuRow.tsx                  Single menu row
  PageHeader.tsx               Shared banner for inner pages
  Monogram.tsx                  Reusable "S S" logo mark
  icons/MenuIcons.tsx            Vector medallions for products without a photo
  ui/button.tsx                   shadcn/ui-style Button (gold/secondary/whatsapp/call variants)

data/                     ALL editable content — no component code changes needed
  business.ts               Name, story, stats, contact, nav links, Why-Choose-Us, festivals
  products.ts                Menu items (name, price, icon/photo, featured flag)
  gallery.ts                  Gallery photo list
  reviews.ts                   Testimonials (currently sample placeholders)
  seo.ts                        Per-page <title>/description/keywords

lib/utils.ts               cn(), formatPrice(), whatsappLink(), telLink()
hooks/useScrollHeader.ts   Tracks scroll position for the sticky navbar
types/index.ts              Shared TypeScript interfaces
public/images/              All images (placeholders — see notice above)
```

## Not Implemented (by design)

Shopping cart, login, payments, an AI chatbot, and an admin dashboard were
intentionally left out of this phase. `ContactCTA`/`Contact` are built so a
cart or booking flow can be added later without restructuring the page.

## Editing Content

| What to change | File |
|---|---|
| Story, stats, contact info, nav links, Why Choose Us, festivals | `data/business.ts` |
| Products, prices, featured items | `/admin/products` (or `data/products.json` directly) |
| Gallery photos | `data/gallery.ts` |
| Testimonials | `data/reviews.ts` |
| Page titles/descriptions (SEO) | `data/seo.ts` |
| Any image | Replace the file in `public/images/` (same filename) |

## Accessibility

- Skip-to-content link, semantic landmarks (`header`/`main`/`nav`/`footer`)
- Visible focus states on every interactive element (2px gold outline)
- Descriptive `alt` text on all images; icon-only buttons carry `aria-label`
- Body text ≥16px, 1.6 line-height; decorative icons marked `aria-hidden`

## Note On Validation

This project was written and statically type-checked in an environment without
package-registry access, so `npm install` / `npm run build` could not be run
end-to-end here. All `@/` imports were manually verified to resolve, and a
`tsc --noEmit` pass was run with dependency-resolution errors filtered out —
no structural or syntax issues were found. Please run `npm install && npm run build`
locally and report back if anything surfaces.
