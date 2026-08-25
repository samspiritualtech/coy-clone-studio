# Join Waitlist Landing Page for Instagram Brands & Boutiques

A new standalone, conversion-focused landing page using the exact copy provided, designed as a product designer would: one typographic system, centered hero, generous rhythm, and a few brand/garment images used only where they earn their place.

## Route & entry points

- New page at `/waitlist` (plus alias `/apply-to-join` pointing to the same page).
- Minimal page-specific nav: OGURA logo (left) + "Apply to join" button (right) — not the full store header, so the page stays focused.
- Every "Apply to join" / "Claim your spot" button smooth-scrolls to the form. "See what you get" scrolls to the What You Get section.

## Section order (copy used verbatim)

```text
Nav (logo + Apply to join)
Hero — centered: eyebrow tag, headline, subheading, 2 buttons, note
Scrolling strip (marquee)
The Problem
Vision & Mission
Why Ogura Exists
What Is Ogura / Who It Is For (4-point checklist)
What You Get (01-06 grid + 07 AI Studio featured full-width card)
Why Join Now (5 benefits + "50 founding spots" counter block + Claim your spot)
How It Works (4 steps)
Application Form
Closing CTA
Footer (OGURA / Curated designerwear. Original brands only. ogura.in)
```

## Design system (uniform, no drift)

- Type: one scale reused everywhere — hero display, section heading, kicker (uppercase, letter-spaced, pink), body, small note. Manrope for headings/UI, existing serif only for the hero headline accent. No new fonts.
- Colors: existing semantic tokens plus the existing `--ogura-pink` accent for kickers, counters, and primary buttons. Light, editorial background; no new palette.
- Layout: max-width 72ch reading column for text sections, wider grid for cards. Consistent section padding, consistent card radius/border/shadow.
- Motion: reuse `useScrollAnimation` fade-up on section entry; marquee strip loops on CSS animation. Respects reduced motion.
- Images: 4 generated luxury/editorial garment images used as (a) a slim hero-adjacent image trio, (b) one image inside the AI Studio featured card, (c) a background accent in the Closing CTA. Text-free images.
- Fully responsive; single column on mobile with the same type scale scaled down.

## Application form

Fields exactly as specified: brand name, Instagram/website, what you make, city (dropdown with the given list), brand age (tap/pill options), where you sell today (tap options, multi-select), monthly orders estimate, contact number (+91).

- Client-side validation with zod; inline errors.
- "Submit application" writes to the backend, then shows an inline success state ("We review every application and respond within 48 hours").
- "Apply on WhatsApp" opens wa.me for +91 9897014111 with a prefilled message.

## Technical details

- New file `src/pages/BrandWaitlist.tsx`, section components under `src/components/waitlist/`.
- Routes added in `src/apps/CustomerApp.tsx`.
- New backend table `brand_waitlist_applications` (brand_name, handle_or_website, what_you_make, city, brand_age, sell_channels text[], monthly_orders, phone, created_at) with GRANTs, RLS enabled, an insert policy for public submissions, and no public read (admin/service role only).
- Page-level SEO: title, meta description, single H1, semantic sections, alt text, JSON-LD.
- No changes to existing pages or the current `/join` flow.
