## Scope

Only the Hidden Gems section on the homepage plus the shared `Tilt3D` hover polish. No layout, typography, color, copy, or section additions/removals.

## 1. Regenerate Hidden Gems imagery

Generate 5 new premium editorial images with consistent warm-neutral luxury color grading (soft golden light, ivory/champagne/caramel palette, magazine-quality):

- `src/assets/hidden-gems-hero.jpg` (1200×1600, standard tier) — elegant female model, designer couture, editorial magazine mood. Replaces the current Unsplash `photo-1469334031218…` URL used in the large left card.
- `src/assets/chanderi-shine.jpg` (900×1200) — regenerate: chanderi silk detail on model, warm champagne light.
- `src/assets/insta-loved.jpg` (900×1200) — regenerate: contemporary luxury kurta, warm neutral grading.
- `src/assets/indie-vogue.jpg` (900×1200) — regenerate: indie couture editorial, warm tones.
- `src/assets/urban-loom.jpg` (900×1200) — regenerate: handloom modern silhouette, warm campaign lighting.

`saree-society.jpg` and the last Velvet Threads Unsplash card are outside the user's list — leave both untouched.

## 2. Wire images into `src/components/HiddenGemsSection.tsx`

- Import the new `hiddenGemsHero` asset and swap the hard-coded Unsplash URL on line 55 for it.
- The four regenerated brand assets keep the same import paths, so no code change is needed for the grid; the new files replace the old ones.
- Add `loading="lazy"` and `decoding="async"` to the hero `<img>` (grid images already have `loading="lazy"`; add `decoding="async"` for consistency).

## 3. Premium 3D hover polish (shared)

Edit `src/index.css` `.luxury-tilt-inner` / `.luxury-tilt-root` rules so every card using `Tilt3D` (Hidden Gems left + grid, Category Showcase, Designers Spotlight, etc.) gets:

- `transform: perspective(1200px) rotateX(var(--rx,0)) rotateY(var(--ry,0)) translateY(var(--ty,0)) scale(var(--s,1));`
- On hover: `--ty: -10px;` and a softer luxury shadow (`0 30px 60px -20px rgba(20,14,6,0.45)`).
- `transition: transform 350ms cubic-bezier(0.16,1,0.3,1), box-shadow 350ms;`
- `will-change: transform;` for GPU acceleration.
- Inner `<img>` inside `.museum-card` gets a `group-hover:scale-[1.08]` equivalent via CSS (`.luxury-tilt-root:hover .museum-card img { transform: scale(1.08); }`) with `transition: transform 350ms`.
- Keep the existing glare layer as the "subtle glass reflection".

No changes to `Tilt3D.tsx` logic — only CSS tokens.

## 4. Verification

- Ripgrep to confirm no other file imports the regenerated asset paths in a way that breaks.
- Load `/` via Playwright, screenshot Hidden Gems, confirm no console/network errors and images render.

## Files touched

- New/replaced: `src/assets/hidden-gems-hero.jpg`, `chanderi-shine.jpg`, `insta-loved.jpg`, `indie-vogue.jpg`, `urban-loom.jpg`
- Edited: `src/components/HiddenGemsSection.tsx`, `src/index.css`
