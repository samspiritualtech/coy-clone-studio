
# Museum-Grade Transformation of Homepage Sections

Bring the exact visual language of `ogura-museum.html` onto the existing homepage. Hero, header, Shop By Categories, footer, and all routing/business logic remain untouched. Everything below Shop By Categories adopts the museum's mood: deep espresso background, volumetric gold lighting, glass cards with gold hairlines, cinematic grain + vignette, italic Cormorant display type, gold eyebrow rules, dramatic reveals, parallax depth, and cursor spotlights.

## Scope

**Transform (museum aesthetic, ecommerce content preserved):**
- HiddenGemsSection
- FullWidthImageSection (Dresses / Tops / Bottoms / Accessories banners)
- LuxuryBrands
- PinterestInspiredSection
- LuxuryStoreLocator
- LuxuryTrustBadges + LuxuryGiftCard + DesignersSpotlight (so the band reads as one continuous exhibition rather than breaking back to white)

**Untouched:** LuxuryHeader, LuxuryHero, Premium3DCategorySection (Shop By Categories), LuxuryFooter, all routes, products, images, brands, store data, Pinterest functionality, links, CTAs, section order, cart, wishlist, auth.

## Visual System (from ogura-museum.html)

Promote the reference palette to project-scoped utility vars in `src/index.css` (utility layer, not semantic tokens, so dark-mode and shadcn theming stay intact):

```
--museum-bg: #08070a
--museum-espresso: #15110d
--museum-gold: #c9a56b
--museum-gold-bright: #e9d4a3
--museum-ivory: #f4efe6
--museum-glass: rgba(244,239,230,0.04)
--museum-glass-line: rgba(233,212,163,0.18)
--ease-museum: cubic-bezier(.16,1,.3,1)
```

New utility classes (extend the existing "LUXURY 3D ENHANCEMENT LAYER" block, replacing the too-subtle versions):

- `.museum-surface` — espresso background, ivory text, used as the wrapping band so all transformed sections share one continuous dark atmosphere.
- `.museum-vignette-strong` — radial darkening to ~0.75 (vs current 0.55), `mix-blend-mode: multiply`, full-section absolute overlay.
- `.museum-grain-strong` — SVG fractal noise at 0.10 opacity (vs current 0.06), 6-step animation, respects reduced-motion.
- `.museum-gold-glow` — fixed/absolute radial gold halo (`radial-gradient(ellipse at top, rgba(201,165,107,.18), transparent 60%)`) layered behind content for that "atelier of light" warmth.
- `.museum-eyebrow` — italic Cormorant, gold `#c9a56b`, `letter-spacing: .42em`, flanked by 36px gradient hairlines (matches `.eyebrow` in reference).
- `.museum-display` — Cormorant Garamond 300, line-height .96, italic gold span via `<em>` for accent words; sizes `clamp(40px, 6.4vw, 96px)` for section headings, `clamp(28px, 3.4vw, 52px)` for card headings.
- `.museum-lede` — Manrope 300, ivory at 66% opacity, max 42ch.
- `.museum-glass` — `background: var(--museum-glass)`, `backdrop-filter: blur(18px) saturate(140%)`, `border: 1px solid var(--museum-glass-line)`, `box-shadow: 0 24px 60px -30px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.06)`, radius 18px.
- `.museum-card` — glass + hover lift (-6px) + gold border brighten + inner gold spotlight following cursor.
- `.museum-hairline-gold` — `border: 1px solid rgba(201,165,107,.28)` + inset gold glow (stronger than current).
- `.museum-cta` — pill `padding: 16px 40px`, glass, gold border on hover, 11px tracking .32em uppercase (matches `.cta` in reference).
- `.museum-meta` — key/value pairs with `.k` gold caps eyebrow + `.val` ivory body, used inside glass cards for tags like "Season — Resort '26".

Load `Manrope` 300/400/500/600 alongside the already-added Cormorant Garamond via `index.html` (preconnect already present).

## Motion System

Existing infra reused: `useGsapReveal`, `ParallaxLayer`, `Tilt3D`, `useLenis`. Increase intensity:

- `useGsapReveal` defaults bumped at call sites: `y: 60`, `duration: 1.2`, `stagger: 0.14`, `clip` true, plus a new `blur` option that animates `filter: blur(12px) → 0` for cinematic focus-in. Add the option to the hook (non-breaking; default off).
- `ParallaxLayer` calls upgraded to `speed: 80–120` for backgrounds, `40–60` for foreground cards, producing real depth offset.
- New cursor-following gold spotlight wrapper class `.museum-spotlight` (replaces current weak `.luxury-spotlight`): 700px radial of `rgba(233,212,163,.22)` at `--mx/--my`, screen blend, always-on at 0.4 opacity, ramps to 1 on hover. Each transformed section sets `--mx/--my` from a single shared `onMouseMove` handler.
- `Tilt3D` usage broadened on Brands tiles, Pinterest cards, Store cards; `max: 10`, `scale: 1.03`, glare strengthened (already in `.luxury-tilt-glare`, raise opacity to 0.3).
- `useLenis` already wired — no change.

All motion respects `prefers-reduced-motion` (already handled in hooks).

## Per-Section Plan

### 1. Wrap the band
In `src/pages/Index.tsx`, group all post-Shop-By-Categories sections inside a single `<div className="museum-surface relative isolate">` with one fixed-position `.museum-gold-glow` and `.museum-grain-strong` overlay so the entire scroll feels like one continuous atelier rather than seven separate panels. Sections keep their own padding but lose any white backgrounds.

### 2. HiddenGemsSection
- Background: espresso `#15110d` (close to current `#2A0A14` but matched to reference); add `.museum-vignette-strong` + `.museum-grain-strong`.
- Header: replace current eyebrow + h2 with `.museum-eyebrow` ("Gallery 01 — Hidden Gems") and `.museum-display` ("Pieces that find you" with italic gold accent on "find you"). Keep existing "Hidden Gems" label visible as the eyebrow text per user's "keep content" rule — phrase as `Hidden Gems · Instagram Brands`. **Decision:** preserve original copy verbatim; only the typography/treatment changes.
- Left banner: `ParallaxLayer speed={100}`, `Tilt3D max={6}`, `.museum-card` framing, glass overlay band at bottom with `.museum-meta` (e.g. `Now showing — 24 curated objects` style but using existing copy).
- Right grid: each brand tile becomes a `.museum-card` with `Tilt3D`, gold hairline, glass caption strip, cursor spotlight.

### 3. FullWidthImageSection (Dresses / Tops / Bottoms / Accessories)
- Replace gradient overlay with darker `from-black/80 via-black/40` so gold accents read.
- Background image: `ParallaxLayer speed={120}` with `scale(1.2)` for deeper drift.
- Heading: `.museum-display` with italic gold accent on one word (e.g. "A runway in *still air*" pattern — but applied to the existing titles like "Dresses" via a small italic gold ornament rather than rewriting copy).
- Label: `.museum-eyebrow` styling.
- CTA: `.museum-cta`.
- Add a glass `.museum-meta` chip pair below subtitle (using existing subtitle data — no new copy invented; if absent, skip).
- Cursor spotlight strengthened to reference spec.

### 4. LuxuryBrands
- Section background transparent (inherits `.museum-surface`).
- Heading band: `.museum-eyebrow` + `.museum-display`.
- Brand tiles → `.museum-card` glass with gold hairline; `Tilt3D max={10}`; hover brings gold border to full `#c9a56b` and triggers inner sweep.
- Add a faint orbital ring SVG behind the grid (CSS-only, single ellipse with gold stroke at 0.15 opacity) to echo "Houses in orbit" without rebuilding the section.

### 5. PinterestInspiredSection
- Per-column `ParallaxLayer` speeds `60 / 90 / 120` for staggered depth (already attempted; intensify).
- Each pin → `.museum-card` glass frame, `Tilt3D` with varied depth, gold hairline.
- Section heading upgraded to museum typography.
- Pinterest connect button restyled with `.museum-cta` (functionality untouched).

### 6. LuxuryStoreLocator
- Background: parallax showroom image at `speed={100}` with espresso overlay.
- Store cards → `.museum-card` glass panels with `.museum-meta` showing City / By appointment (using existing data fields).
- Map / list interactions unchanged.

### 7. LuxuryTrustBadges, LuxuryGiftCard, DesignersSpotlight
Minimal touch so the dark band stays continuous:
- Backgrounds set to transparent on the dark wrapper, text color shifted to ivory via `.museum-surface` cascade, headings upgraded to `.museum-display`, eyebrows to `.museum-eyebrow`, any cards wrapped in `.museum-card`. No layout, copy, image, or link changes.

## Files

**New:** none.

**Edited:**
- `src/index.css` — extend luxury layer with all `.museum-*` utilities listed above; strengthen existing vignette/grain/spotlight variants alongside (keep old classes to avoid breaking other pages).
- `index.html` — add Manrope to the existing Google Fonts link.
- `src/hooks/useGsapReveal.ts` — add optional `blur` and bump default `y`/`duration`/`stagger`.
- `src/pages/Index.tsx` — wrap post-Shop-By-Categories sections in `.museum-surface` band with shared gold-glow + grain overlays and one mousemove handler that sets `--mx/--my` on the band.
- `src/components/HiddenGemsSection.tsx`
- `src/components/FullWidthImageSection.tsx`
- `src/components/LuxuryBrands.tsx`
- `src/components/PinterestInspiredSection.tsx`
- `src/components/LuxuryStoreLocator.tsx`
- `src/components/LuxuryTrustBadges.tsx` (style-only)
- `src/components/LuxuryGiftCard.tsx` (style-only)
- `src/components/DesignersSpotlight.tsx` (style-only)

## Guardrails

- No new routes, pages, or backend changes. No Three.js / fullscreen WebGL. No museum storytelling copy invented — only existing product/brand/store/pin content is shown.
- No semantic-token edits — gold and espresso live as utility-scoped CSS vars, so light/dark mode and shadcn components elsewhere stay intact.
- All motion gated by `prefers-reduced-motion`.
- Mobile: tilt + heavy parallax disabled (< 768px), grain opacity halved, glass blur reduced to 8px for perf.

## Out of Scope

Hero, header, Shop By Categories, footer, any other route, any backend/RLS/edge function, any copy rewriting, any product/brand/store data change.
