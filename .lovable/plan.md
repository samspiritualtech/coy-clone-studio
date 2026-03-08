

# Replace "New Arrivals" Banner with Instagram Brands Banner

## What changes

Replace the first category ("New Arrivals") in `CategoryShowcase.tsx` with a premium "Instagram Brands" banner, and make the entire banner clickable with luxury hover effects.

## Changes

### 1. `src/components/CategoryShowcase.tsx`
- Replace the first category entry's content:
  - label: `"OGURA SOCIAL"`
  - title: `"INSTAGRAM BRANDS"`
  - subtitle: `"Discover trending fashion labels from Instagram creators"`
  - ctaText: `"Explore Instagram Brands"`
  - ctaLink: `/collections?category=instagram`
  - Use a stylish editorial fashion model image (Unsplash)
- Wrap that first entry in a `<Link>` so the entire banner is clickable
- Add hover group classes for zoom + shadow transition on that banner

### 2. `src/components/FullWidthImageSection.tsx` (minor)
- No structural changes needed — it already supports `enableZoom` (hover scale on background image), overlay, and CTA button
- The zoom and overlay are already built in

The CategoryShowcase component will render the first item wrapped in a clickable `Link` with `group` hover classes for subtle shadow and smooth transitions, while the remaining categories render as before.

