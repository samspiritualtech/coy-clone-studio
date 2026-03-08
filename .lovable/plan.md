

# Make Hidden Gems Banner Clickable with CTA Button

## Changes — `src/components/HiddenGemsSection.tsx`

1. **Wrap the left banner** (lines 52-67) in a `<Link to="/collections?category=instagram">` to make the entire banner clickable
2. **Add a small CTA button** below the subtitle (after line 65):
   - Text: "Explore Instagram"
   - Style: small, white outline/glass style, rounded-full, subtle hover glow
   - `e.stopPropagation()` not needed since both button and wrapper go to the same URL
3. Keep all existing images, text, hover zoom, and layout unchanged

