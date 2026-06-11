
# Luxury 3D Enhancement Layer — Homepage Sections

Goal: bring the cinematic feeling from `ogura-museum.html` (gold-on-espresso light, glass, depth, smooth GSAP reveals, parallax) into the existing homepage sections **after Shop By Categories**, without changing layout, content, products, links, or routing. ~90% ecommerce / ~10% 3D polish.

## Scope (sections touched, in order)
1. Hidden Gems (`HiddenGemsSection.tsx`)
2. Dresses / Tops / Bottoms / Accessories banners (`FullWidthImageSection.tsx`, `CategoryShowcase.tsx`)
3. Brands (`LuxuryBrands.tsx`)
4. Pinterest Inspiration (`PinterestInspiredSection.tsx`)
5. Stores (`LuxuryStoreLocator.tsx`)

No other files, routes, or business logic change. Existing `Tilt3D`, `useLenis`, and luxury utility classes are kept and extended.

## What stays exactly the same
- All section order, copy, images, products, brands, links, CTAs, Pinterest functionality, store data.
- Header, Hero, Premium3DCategorySection, Designers, Trust Badges, Gift Card, Footer.
- Routing, auth, cart, wishlist, data sources.
- Light theme of the page overall (we are NOT turning the site dark). Cinematic dark/gold treatment is applied only within already-dark sections (Hidden Gems, Brands) and as subtle overlays elsewhere.

## Visual & motion language (from reference)
- Palette accents: gold `#C9A56B` / bright gold `#E9D4A3` / ivory `#F4EFE6` used as glow/spotlight/hairlines only (added as CSS vars, no semantic token changes).
- Typography accents: optional Cormorant Garamond for section eyebrows in the enhanced sections (loaded once in `index.html`), body unchanged.
- Motion: GSAP + ScrollTrigger for reveal-on-scroll (clip-path + y/opacity), Lenis already powering smooth scroll, Framer Motion `Tilt3D` for hover depth.
- Effects: glassmorphism (`luxury-glass`), gold spotlight (`luxury-spotlight`), light sweep (`luxury-sweep`), layered depth shadows (`luxury-depth`), fine grain overlay, vignette on dark sections.

## Per-section enhancements

### 1. Hidden Gems
- Add a soft vignette + faint film grain inside the section background (absolute overlays, pointer-events none).
- Large banner: stronger parallax on the image (translateY based on scroll progress via GSAP ScrollTrigger), gold hairline border, glass CTA pill with light sweep, animated eyebrow underline.
- Brand grid cards: increase `Tilt3D` depth, add staggered GSAP reveal (clip-path inset), gold spotlight on hover, hairline border, floating idle motion (subtle 6s yoyo translateY) only on hover.

### 2. Dresses / Tops / Bottoms / Accessories
- In `FullWidthImageSection.tsx`: keep banner; add a parallax wrapper (image translateY -8% → +8% across viewport via ScrollTrigger), cinematic gradient + gold-tinted radial spotlight following cursor (already partly in place — refine intensity), and a clip-path reveal for the heading/CTA on enter.
- In `CategoryShowcase.tsx` cards (Tops/Bottoms/Accessories tiles): wrap each tile in `Tilt3D`, add hover expansion (image scale 1.08 + caption rise), glass CTA with sweep, and depth shadow on hover.

### 3. Brands
- Keep dark background image and grid.
- Replace flat tiles with glass cards: thicker blur, gold hairline, light sweep on hover, `Tilt3D` perspective, scroll-triggered staggered fade-up. Section heading gets a thin animated gold underline.

### 4. Pinterest Inspiration
- Keep masonry. Vary `Tilt3D` `max` per column to suggest different depth planes. Add a ScrollTrigger that translates odd/even columns at slightly different speeds (subtle, ~20px range, disabled on mobile and on reduced-motion).
- Hover: keep current overlay; add gold spotlight and glass info chip.

### 5. Stores
- Add a subtle dark cinematic overlay on store imagery, glass info panel with gold hairline, `Tilt3D` on each store card, light sweep on CTA. Section eyebrow + heading get a clip-path reveal.

## New / changed files
- `src/index.css` — extend the existing "LUXURY 3D ENHANCEMENT LAYER" with:
  - `--gold`, `--gold-bright`, `--ivory` CSS vars (scoped to utilities, not the semantic token system).
  - `.luxury-vignette`, `.luxury-grain`, `.luxury-hairline-gold`, `.luxury-eyebrow-gold`, `.luxury-reveal` (clip-path base state), `.luxury-float-idle` (keyframes).
- `src/hooks/useGsapReveal.ts` (new) — small hook that registers ScrollTrigger and animates elements matching a ref/selector with stagger + clip-path reveal; respects `prefers-reduced-motion`. Uses already-installed `gsap` if present; otherwise add `gsap` via package install in build step.
- `src/components/luxury3d/ParallaxLayer.tsx` (new) — wrapper that translates children on scroll via GSAP ScrollTrigger (configurable speed). Mobile/reduced-motion → no-op.
- `src/components/HiddenGemsSection.tsx` — add vignette/grain, GSAP reveal on banner and grid, swap CTA to glass-sweep pill, idle float on hover.
- `src/components/FullWidthImageSection.tsx` — wrap image in `ParallaxLayer`, add clip-path reveal for heading/CTA, refine cursor spotlight intensity, glass CTA.
- `src/components/CategoryShowcase.tsx` — wrap tiles in `Tilt3D`, add hover expansion, glass CTA, GSAP staggered reveal.
- `src/components/LuxuryBrands.tsx` — glass card tiles with gold hairline + sweep, scroll stagger, animated underline on heading.
- `src/components/PinterestInspiredSection.tsx` — per-column parallax via `ParallaxLayer`, varied `Tilt3D` depth, glass chips.
- `src/components/LuxuryStoreLocator.tsx` — `Tilt3D` cards, glass info panel, gold hairline, clip-path reveal.
- `index.html` — add Cormorant Garamond `<link>` (used only for new eyebrow class).

Dependencies: install `gsap` if not already present (ScrollTrigger ships with it). `framer-motion`, `lenis` already installed.

## Guardrails
- No new pages, routes, or navigation.
- No changes to data sources, products, Pinterest API, or links.
- No fullscreen WebGL, no Three.js scenes, no orbiting/abstract objects, no exhibition storytelling.
- All effects respect `prefers-reduced-motion` and degrade gracefully on mobile (parallax disabled, tilt reduced).
- No semantic color token changes — gold accents are utility-scoped CSS vars to avoid breaking dark mode and other pages.

## Technical notes
- GSAP ScrollTrigger registered once in `useGsapReveal`. ScrollTrigger and Lenis are wired together via a small effect that calls `ScrollTrigger.update` from Lenis' scroll callback (added inside `useLenis` or the reveal hook).
- `Tilt3D` is reused; no new tilt engine.
- All overlays use `pointer-events: none` and `z-index` inside the section's stacking context so clicks/links remain intact.
- Idle float and grain animations pause when section is offscreen via ScrollTrigger toggleActions to save CPU.

## Out of scope
- Hero, header, footer, designers, trust badges, gift card.
- Any backend, RLS, or edge function changes.
- Replacing the light theme or current typography system-wide.
