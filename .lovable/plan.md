

# Update Instagram Brands Section & Add Hidden Gems

## Changes

### 1. Copy uploaded image to project
- Copy `user-uploads://ChatGPT_Image_Mar_8_2026_03_41_40_PM.png` to `public/instagram-brands-hero.png`

### 2. Replace Instagram Brands hero image (`src/components/CategoryShowcase.tsx`)
- Update the `backgroundImage` for the first category entry to use `/instagram-brands-hero.png`

### 3. Remove video banner (`src/pages/Index.tsx`)
- Remove `InstagramModelsBanner` import and usage
- Add a new `HiddenGemsSection` component between `Premium3DCategorySection` and `CategoryShowcase`

### 4. Create `src/components/HiddenGemsSection.tsx`
New premium editorial section inspired by the reference image:

- **Container**: Deep maroon/wine background (`bg-[#2A0A14]`), generous padding
- **Header**: "Instagram Brands" title + subtitle centered at top, elegant serif font
- **Split layout** (desktop side-by-side, mobile stacked):
  - **Left**: Large fashion banner image (aspect 3:4) with "HIDDEN GEMS" overlay text and subtitle "Niche, homegrown labels discovered from Instagram creators"
  - **Right**: 2-column grid of 6 brand cards, each with a fashion image, brand name below, rounded corners, soft shadow, hover zoom
- Brand cards use curated Unsplash fashion images with names: Chanderi Shine, Insta Loved, Indie Vogue, Urban Loom, Saree Society, Velvet Threads
- Hover effects: subtle scale-up on cards, smooth transitions

### 5. Final homepage layout order
```
LuxuryHero
Premium3DCategorySection (Shop by Categories)
HiddenGemsSection (new)
CategoryShowcase (Instagram Brands banner + other categories)
DesignersSpotlight
...rest
```

