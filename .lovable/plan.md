# Plan — Luxury refinement of Hidden Gems / OGURA Social

Rebuild only `src/components/HiddenGemsSection.tsx` to match the selected prototype (glass name plates + gilded frame), plus the mouse-follow 3D tilt and gold light sweep the request calls for. No other files, no new sections, no route/copy/link changes.

## Scope

- File touched: `src/components/HiddenGemsSection.tsx` only.
- Uses existing images already on disk: `hidden-gems-hero.jpg`, `chanderi-shine.jpg`, `insta-loved.jpg`, `indie-vogue.jpg`, `urban-loom.jpg`.
- Existing routes preserved: left card → `/collections?category=instagram`; grid → `/collections/{slug}`.
- Existing copy preserved verbatim: "OGURA SOCIAL", "HIDDEN GEMS", "Niche, homegrown labels discovered from Instagram creators", and the four card labels.

## Visual changes (from selected direction)

Left large card (col-span 3/5, aspect 3/4):
- Ring `ring-1 ring-white/10` → `hover:ring-[#c9a56b]/40`, `shadow-2xl`.
- Image scale 1.00 → 1.05 on hover (1000ms).
- Overlays: bottom-to-top black gradient + radial vignette centered top.
- Type stack (bottom padded): eyebrow `OGURA SOCIAL` (Montserrat, tracking [0.5em], #e9d4a3), display "HIDDEN / GEMS" (Cormorant Garamond, italic GEMS with soft gold glow), tagline in serif.
- Whole type block lifts `-translate-y-4` on hover.
- Inset gilded frame `absolute inset-4 border border-[#c9a56b]/10` fades in on hover.

Right 2×2 grid (col-span 2/5, gap-6):
- Each card aspect-[3/4], `ring-1 ring-white/5` → `hover:ring-[#c9a56b]/30`.
- Image scale 1.00 → 1.10 (700ms).
- Bottom label swap: default serif white label; on hover a glass plate (`backdrop-blur-md bg-white/5 border-l-2 border-[#c9a56b]`) with #e9d4a3 uppercase tracked label slides up and the default label fades out.
- Preserve tagline "Niche, homegrown labels…" small hint text under the grid only if it currently exists (keep whatever chrome already lives outside the card grid untouched).

## Interaction layer (added on top of prototype)

- Mouse-follow 3D tilt on all 5 cards: card wrapper gets `[perspective:1200px]`; inner `transform-gpu` element applies `rotateX` / `rotateY` derived from cursor position (max ±5° X, ±7° Y for grid; ±4° X, ±6° Y for hero), plus `translateY(-10px)` on hover for hero and `-12px` for grid, `scale(1.02)` / `scale(1.04)`, easing `cubic-bezier(0.22,1,0.36,1)` 500ms. Reset to 0 on mouse leave. Implement with a small local `useTiltHandlers` hook inside the file (no new dependency).
- Gold light sweep on hover: absolutely positioned diagonal gradient div (`bg-gradient-to-tr from-transparent via-[#e9d4a3]/25 to-transparent`) translated from `-100%` to `100%` in 1.1s on group-hover, `mix-blend-screen`, `pointer-events-none`.
- Subtle floating idle: existing `animate-fade-in` on section entrance preserved; add `animate-[float_6s_ease-in-out_infinite]` (already in `index.css`, was added in earlier turn) at very low amplitude on the hero card only.
- `prefers-reduced-motion`: tilt/sweep/float disabled via `motion-safe:` prefixes.

## Colors and tokens

- Gold accents use `#c9a56b` / `#e9d4a3` inline hex to match the selected prototype exactly (as instructed by redesign skill: copy direction tokens verbatim). These sit alongside the existing brand gold — no token file changes.
- Surface behind the section stays the current bronze/mahogany background (no page-level color change).

## Performance / a11y

- All motion via `transform` and `opacity` on `will-change-transform` layers; no layout-affecting properties animated → no CLS.
- Images keep existing width/height/`loading="lazy"` attributes.
- Links keep their `aria-label`s and text; cards remain single `<a>` targets.

## Technical notes

- File is a single client component; tilt state kept in refs + `requestAnimationFrame` throttle so re-renders don't fire per mouse move.
- No new packages, no route changes, no DB or edge function changes.
- No changes to `New Arrivals`, header, footer, or any other section.
