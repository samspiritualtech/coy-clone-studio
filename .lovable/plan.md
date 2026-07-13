## Changes

### 1. Remove "A wall that breathes" section
- In `src/pages/Index.tsx`, delete the `<PinterestInspiredSection />` line inside the museum wrapper.
- Remove the now-unused `import { PinterestInspiredSection }` at the top.
- No spacing changes needed — the museum wrapper's children stack naturally, so the next section (`LuxuryTrustBadges`) simply moves up with no leftover gap.
- Leave `PinterestInspiredSection.tsx` and Pinterest supporting files on disk (still used elsewhere, e.g. product cards' Save-to-Pinterest button); only stop rendering the homepage section.

### 2. "Tops" section — add premium background image
Root cause: the current `backgroundImage` for the Tops tile in `src/components/CategoryShowcase.tsx` points at Unsplash photo `1583391265196-53c5e5e92b0d`, which now returns **HTTP 404**. That's why the Tops section (and the Chanderi Shine card, which uses the same URL) looks empty/dark.

- Generate a new luxury editorial image of women's tops (silk blouse, soft studio lighting, warm neutral palette) via `imagegen--generate_image` at `src/assets/tops-hero.jpg` (1920×1200, `premium` tier for print-grade fidelity).
- Update the `tops` entry in `src/components/CategoryShowcase.tsx` to import that asset and use it as `backgroundImage`.
- Keep the existing `FullWidthImageSection` component untouched — it already renders the image via `background-size: cover; background-position: center` and applies a `medium` gradient overlay for text readability. Label ("ESSENTIALS"), title ("Tops"), subtitle, CTA button, height (`50vh`), spacing, typography, animations and responsiveness remain identical.

### 3. Fix broken "Chanderi Shine" card
- Generate a matching editorial image of a woman in a chanderi silk saree/kurta (soft gold light, luxury studio) at `src/assets/chanderi-shine.jpg` (600×800, `standard` tier).
- Update the `Chanderi Shine` entry in `src/components/HiddenGemsSection.tsx` to import and use the new asset.
- The card already uses `object-cover`, same `aspect-[3/4]`, same border radius, and same hover scale animation as the other 5 brand cards — no styling changes.

### 4. Validation
- Run the dev preview via Playwright and screenshot the homepage top-to-bottom to confirm:
  - Pinterest section is gone with no whitespace gap.
  - Tops tile shows the new background with readable text overlay.
  - Chanderi Shine card shows the new image with no broken-icon.
- Check console logs and network requests for 404s/errors on the homepage.
- Confirm no other section changed (visual diff by scrolling through screenshots).

### Files touched
- `src/pages/Index.tsx` — remove Pinterest import + render.
- `src/components/CategoryShowcase.tsx` — update Tops `backgroundImage` to new asset.
- `src/components/HiddenGemsSection.tsx` — update Chanderi Shine `image` to new asset.
- `src/assets/tops-hero.jpg` — new (generated).
- `src/assets/chanderi-shine.jpg` — new (generated).
