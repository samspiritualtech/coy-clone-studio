## Changes

Generate 3 luxury editorial images (standard tier) and swap them into the corresponding `categories` entries in `src/components/CategoryShowcase.tsx`. Layout, `FullWidthImageSection`, overlays, height, text, and CTAs remain untouched.

### Assets to generate
| Section | File | Dimensions | Prompt |
| --- | --- | --- | --- |
| Dresses | `src/assets/dresses-hero.jpg` | 1920×1200 | Elegant model in a luxury evening gown, editorial couture photography, rich cinematic lighting, warm brown/burgundy backdrop |
| Footwear | `src/assets/footwear-hero.jpg` | 1920×1200 | Luxury designer high heels on a minimal editorial set, premium campaign lighting, warm neutral backdrop |
| Bags | `src/assets/bags-hero.jpg` | 1920×1200 | Luxury designer handbag styled on a soft-lit surface, high-end editorial product photography, warm elegant tones |

### Wire-up
In `src/components/CategoryShowcase.tsx`:
- Add 3 ES6 imports for the new assets.
- Replace `backgroundImage` on the `dresses`, `footwear`, and `bags` entries with the imports.
- Leave every other field (label, title, subtitle, ctaText, ctaLink, height) untouched.
- Do not touch the `instagram-brands`, `tops`, `bottoms`, `outerwear`, or `accessories` entries.

### Validation
- Confirm the build has no missing-asset errors and the three tiles render with the new backgrounds and existing gradient overlay intact.

### Files touched
- `src/components/CategoryShowcase.tsx`
- 3 new assets in `src/assets/`
