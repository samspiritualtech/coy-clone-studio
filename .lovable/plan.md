## Changes

### 1. Generate 6 premium editorial images
Use `imagegen--generate_image` (`standard` tier) to produce cohesive luxury fashion photography that fits the dark editorial theme. Save to `src/assets/`:

| Slug | File | Dimensions | Prompt focus |
| --- | --- | --- | --- |
| bottoms | `src/assets/bottoms-hero.jpg` | 1920×1200 | Tailored high-waisted silk trousers, warm neutral palette, cinematic studio |
| outerwear | `src/assets/outerwear-hero.jpg` | 1920×1200 | Structured wool coat, editorial low-key lighting, warm brown backdrop |
| insta-loved | `src/assets/insta-loved.jpg` | 600×800 | Contemporary Indian designer kurta, soft moody light, warm tones |
| indie-vogue | `src/assets/indie-vogue.jpg` | 600×800 | Avant-garde Indian fusion couture, cinematic side-lit portrait |
| urban-loom | `src/assets/urban-loom.jpg` | 600×800 | Handloom weave modern silhouette, warm gold light |
| saree-society | `src/assets/saree-society.jpg` | 600×800 | Elegant heritage silk saree, refined studio lighting, warm brown backdrop |

All cards already use `object-cover` and preserved aspect ratios — no styling changes.

### 2. Wire imports & make cards navigate to `/collections/<slug>`
The route `/collections/:category` already exists in `src/apps/CustomerApp.tsx` (renders `Collections`) — no new pages needed. Update link targets:

- **`src/components/CategoryShowcase.tsx`** — replace `backgroundImage` for the `bottoms` and `outerwear` entries with the new imported assets; change their `ctaLink` from `/collections?category=<slug>` to `/collections/<slug>`. The `FullWidthImageSection` already wraps the whole tile in a clickable link, so the whole card stays clickable.
- **`src/components/HiddenGemsSection.tsx`** — replace the `image` fields for Insta Loved, Indie Vogue, Urban Loom, Saree Society with the new imported assets; change the `Link to={...}` from `` `/collections?brand=${brand.slug}` `` to `` `/collections/${brand.slug}` ``. The `<Link>` already wraps each card so it's fully clickable.

Leave Chanderi Shine (just updated) and Velvet Threads untouched — user didn't list them.

### 3. Validation
- Run Playwright on `/`, screenshot the Hidden Gems and Bottoms/Outerwear tiles.
- Check console/network for 404s.
- Click one card to confirm it navigates to `/collections/<slug>` and the Collections page renders (existing page already handles unknown slugs by showing all products).

### Files touched
- `src/components/CategoryShowcase.tsx`
- `src/components/HiddenGemsSection.tsx`
- 6 new assets in `src/assets/`
