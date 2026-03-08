

# Add Instagram Models Video Banner Below Shop by Categories

## Overview
Create a new `InstagramModelsBanner` component with a stylish Nykaa-style video banner and place it right after `Premium3DCategorySection` on the homepage.

## New File: `src/components/InstagramModelsBanner.tsx`
- Full-width section with responsive padding and rounded corners
- Autoplay, muted, looping video using the provided Cloudinary URL
- Dark gradient overlay for text readability
- Centered overlay text with elegant typography:
  - Small uppercase tracking heading: "OGURA FASHION"
  - Large bold main heading: "INSTAGRAM MODELS"
  - Light subtext: "Discover trending fashion looks"
- White text with `text-shadow` for contrast
- Rounded corners (`rounded-2xl`) with container padding to match premium aesthetic

## Modified File: `src/pages/Index.tsx`
- Import `InstagramModelsBanner`
- Place it between `<Premium3DCategorySection />` and `<CategoryShowcase />`

## Files Changed
1. `src/components/InstagramModelsBanner.tsx` (new)
2. `src/pages/Index.tsx` (add import + component placement)

