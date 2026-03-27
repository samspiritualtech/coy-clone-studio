

# Pinterest Integration — "Inspired by Pinterest" Section

## Overview
Add a Pinterest-inspired section to the homepage that displays curated fashion pins in a masonry grid, with "Shop This Look" overlays, "Save to Pinterest" buttons on product cards, and an optional "Connect Pinterest" feature. Since Pinterest doesn't have a Lovable connector, we'll use the Pinterest Widget Builder (pinit.js) for embeds and the Pinterest Web Intent URL for save buttons.

## Approach
Pinterest's API requires OAuth app approval and API keys. For a clean, production-ready approach:
- **Board display**: Use a custom curated grid (not the raw Pinterest embed widget, which has limited styling control). Map pins to existing products.
- **Save to Pinterest**: Use Pinterest's web intent URL (`https://www.pinterest.com/pin/create/button/`) — no API key needed.
- **Connect Pinterest**: This requires a Pinterest developer app with OAuth credentials. We'll build the UI shell and note that a Pinterest API key would need to be added later for full functionality.

## Technical Design

### 1. Create `src/components/PinterestInspiredSection.tsx`
A homepage section with:
- Header: "Inspired by Pinterest" with Pinterest icon
- Masonry-style grid (3 cols desktop, 2 cols tablet, 1 col mobile) using CSS columns
- Each card shows a product image with hover overlay ("Shop This Look" → links to `/product/:id`)
- Small Pinterest "Save" button on each card using web intent URL
- Data sourced from existing `products` array (first 8–10 items)

### 2. Create `src/components/SaveToPinterestButton.tsx`
Reusable button component that opens Pinterest's create pin URL in a popup:
```
https://www.pinterest.com/pin/create/button/?url={productUrl}&media={imageUrl}&description={text}
```
Props: `productUrl`, `imageUrl`, `description`

### 3. Update `src/pages/Index.tsx`
Add `<PinterestInspiredSection />` between DesignersSpotlight and LuxuryTrustBadges.

### 4. Update product cards (`PLPProductCard.tsx`, `DesignerProductCard.tsx`)
Add the `SaveToPinterestButton` to each product card (small icon in bottom-right on hover).

### Files to create
- `src/components/PinterestInspiredSection.tsx`
- `src/components/SaveToPinterestButton.tsx`

### Files to modify
- `src/pages/Index.tsx` — add section
- `src/components/PLPProductCard.tsx` — add save button
- `src/components/DesignerProductCard.tsx` — add save button

### Not included (would need Pinterest API credentials)
- Full Pinterest OAuth connect flow
- Fetching user's saved boards/pins
- These can be added later with a Pinterest developer app key

