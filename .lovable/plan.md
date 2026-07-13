## Replace Hidden Gems large featured image only

Swap the current large featured image in the Hidden Gems / OGURA Social section for a new premium luxury editorial fashion photograph. Everything else in the section remains untouched.

### What will change
- The large left card image (`src/assets/hidden-gems-hero.jpg`) will be replaced with a new high-resolution editorial image.
- The import in `src/components/HiddenGemsSection.tsx` will point to the new asset.

### What stays exactly the same
- Hidden Gems title, OGURA Social eyebrow, description, CTA.
- Card size, layout, typography, border radius, hover animations, responsiveness.
- All four right-side brand cards and their behavior.

### Implementation steps
1. Generate a new luxury editorial fashion image matching the existing warm palette (gold, brown, champagne, beige, black) and cinematic lighting.
2. Upload the image as a Lovable asset and create `src/assets/hidden-gems-hero.jpg.asset.json`.
3. Delete the old `src/assets/hidden-gems-hero.jpg` binary.
4. Update `src/components/HiddenGemsSection.tsx` to import and use the new asset URL.
5. Run the build to verify no errors and confirm the section renders correctly.