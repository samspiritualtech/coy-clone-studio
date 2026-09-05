# OGURA Wine Homepage Design Implementation

## Goal
Apply the uploaded wine-red OGURA design as faithfully as possible to the existing editorial homepage while preserving the current working marketplace, routes, data, and all video placements.

## Locked interpretation
- Copy the uploaded design’s Bordeaux/wine canvas, cream typography, Bodoni/Jost-style editorial hierarchy, borders, spacing, buttons, section treatments, and ornamental threadwork artwork.
- Keep the current homepage structure and functional content; this is a visual transformation, not a commerce or data rewrite.
- Preserve the hero video and all eight category videos exactly where they currently appear. Do not move, replace, duplicate, remove, regenerate, or change their URLs, crop behavior, playback behavior, or route destinations.
- Retain the existing one-boolean rollback switch so the legacy homepage remains untouched.

## Implementation
1. **Extract the approved visual language**
   - Recreate the uploaded design’s wine palette, cream text, muted rose neutrals, fine borders, low-radius controls, Bodoni-led editorial headings, and restrained sans-serif UI labels.
   - Scope every new token and class to the editorial homepage only.
   - Replace the current black/pink styling; avoid unrelated visual invention.

2. **Preserve video inventory and placement**
   - Keep the existing full-bleed hero video in the hero.
   - Keep the existing six category videos in “Explore OGURA.”
   - Keep the footwear and bags videos in “Accessories & Designer Footwear.”
   - Maintain one rendered instance per category video, stable wine fallback backgrounds, autoplay/muted/loop/playsInline behavior, and viewport-aware playback.

3. **Apply the uploaded artwork system**
   - Extract and reuse the decorative assets embedded in the supplied HTML through the project asset flow.
   - Place the floral/threadwork artwork in the same visual roles demonstrated by the reference: edge ornaments, section transitions, and subtle background layers.
   - Keep artwork non-interactive, behind content, softly masked, and responsive so it never blocks products, text, controls, or videos.
   - Recreate small geometric line motifs directly in scoped CSS only where the reference uses simple line art.

4. **Restyle existing homepage elements**
   - Update the editorial header, hero copy treatment, section headings, product cards, designer cards, campaign bands, location area, trust strip, and footer surroundings to match the supplied design.
   - Preserve current logo, search, account, wishlist, bag, location, product loading, designer loading, links, and handlers.
   - Keep real product/designer images and existing campaign imagery; introduce no mock products or replacement media.

5. **Responsive formatting**
   - Match the reference’s desktop and mobile compositions while keeping all content readable and tappable.
   - Prevent artwork from crowding cards on narrow screens; reduce or hide only decorative layers where necessary, never videos or commerce content.
   - Ensure media dimensions remain stable during loading.

## Technical boundaries
- Expected modifications: `src/components/editorial/OguraEditorialHomepage.tsx` and `src/components/editorial/editorial-homepage.css`.
- Expected additions: CDN asset-pointer files only for artwork extracted from the uploaded HTML.
- No changes to backend, database, authentication, queries, product records, prices, inventory, cart, checkout, seller/admin areas, routes, or dependencies.
- `src/config/homepage.ts` remains the exact rollback location; its behavior will not change.

## Verification
- Confirm the hero URL is byte-for-byte unchanged.
- Confirm all eight category video URLs are unchanged and each appears once.
- Confirm videos remain in their current sections and positions.
- Confirm no mock media/content or new remote stock assets were added.
- Check the homepage at 320, 360, 390, 430, 768, 1024, 1280, 1440, and 1920 px widths.
- Check video playback, header/search/menu, product/designer links, location controls, footer, console output, and reduced-motion behavior.
- Flip the editorial boolean off and verify the preserved legacy homepage still renders unchanged.
