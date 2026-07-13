## What the "New Arrivals" carousel actually is

`AzaDesignerCarousel` (rendered via `DesignersSpotlight` on the homepage) — its heading is literally "New Arrivals". Cards come from the `designers` table's `profile_image` column. The 9 cards to refresh: Roshi, Punit Balana, Gauri & Nainika, Aseem Kapoor, Rajiramniq, Anita Dongre, Tarun Tahiliani, Anamika Khanna, KA-Sha. Current images are stale Unsplash URLs plus one broken `/roshi/product-1.jpg` repo path.

Note: the uploaded screenshot shows the Hidden Gems section, but the copy names designer brands and asks to "keep the existing layout" of a carousel — that unambiguously matches the New Arrivals designer carousel, not Hidden Gems. Hidden Gems will not be touched.

## 1. Generate 9 premium editorial images

Standard tier, portrait 900×1200, warm neutral / champagne / caramel grading, editorial magazine mood, generic prompts (no brand names — imagegen safety rejects them). Each prompt tuned to the designer's specialty:

- Roshi — modern minimalist womenswear
- Punit Balana — printed contemporary Indian couture
- Gauri & Nainika — ethereal evening gown
- Aseem Kapoor — refined luxury menswear
- Rajiramniq — jewel-tone bridal lehenga
- Anita Dongre — pastel floral resort couture
- Tarun Tahiliani — draped ivory couture
- Anamika Khanna — architectural avant-garde silhouette
- KA-Sha — textured artisanal handloom

Files saved to `src/assets/designers/<slug>.jpg`.

## 2. Serve them at stable URLs the DB can reference

Run `lovable-assets create --file src/assets/designers/<slug>.jpg` for each; write the returned `.asset.json` alongside; delete the raw `.jpg`. This yields `/__l5e/assets-v1/…/<slug>.jpg` CDN URLs suitable for the `designers.profile_image` string column.

## 3. Update the DB

Single migration updating `profile_image` for each of the 9 designers by `slug` to its new CDN URL. No schema changes, no RLS/grants touched.

## 4. Premium hover on the card (component only)

Edit `src/components/AzaDesignerCarousel.tsx` card wrapper:

- Add `perspective` container + `[transform-style:preserve-3d]` on the card.
- On hover: `translateY(-10px)`, `rotateY(5deg)`, `shadow-[0_30px_60px_-20px_rgba(20,14,6,0.45)]`, `transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]`, `will-change-transform`.
- Bump the image hover from `scale-105` → `scale-[1.08]` with `duration-[500ms]`.
- Add a subtle "glass reflection" overlay: absolute-positioned div with `bg-gradient-to-tr from-white/0 via-white/10 to-white/0`, `opacity-0 group-hover:opacity-100`, `mix-blend-screen`, `pointer-events-none`, `transition-opacity duration-300`.

No changes to card size, aspect, carousel opts, arrows, typography, spacing, or responsiveness.

## Files touched

- New: `src/assets/designers/{roshi,punit-balana,gauri-nainika,aseem-kapoor,rajiramniq,anita-dongre,tarun-tahiliani,anamika-khanna,ka-sha}.jpg.asset.json` (9)
- Edited: `src/components/AzaDesignerCarousel.tsx`
- New migration: updates `designers.profile_image` for the 9 slugs
