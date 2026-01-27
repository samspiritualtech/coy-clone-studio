
# Made to Order: Designer-Led Customization Journey

## Overview

Transform the current generic category page into a premium, designer-led customization experience that guides users through co-creating bespoke outfits with fashion designers. The design maintains OGURA's luxury editorial aesthetic while emphasizing human craftsmanship over technology.

---

## Architecture

Create a dedicated Made to Order page structure that replaces the generic CategoryPage content for the `made-to-order` slug:

```text
src/pages/MadeToOrderPage.tsx (new - main page)
src/components/made-to-order/
  - MTOHeroSection.tsx
  - MTOEntryPaths.tsx
  - MTOInspirationUpload.tsx
  - MTODesignerSelector.tsx
  - MTOBaseDesignGallery.tsx
  - MTOCustomizationPanel.tsx
  - MTOAIDesignPreview.tsx
  - MTODesignComparison.tsx
  - MTODesignerReview.tsx
  - MTOOrderSummary.tsx
  - MTOProgressIndicator.tsx
```

---

## Section-by-Section Implementation

### 1. Hero Section

**Location**: Top of page, full-width cinematic

**Design**:
- Reuse existing video background from Made to Order category
- Headline: "Designed With Fashion Designers" (gold gradient typography)
- Subtext: "Co-create your outfit with expert boutique designers. Every design is personally reviewed and approved."
- Primary CTA button: "Design With a Fashion Designer"

**Component**: `MTOHeroSection.tsx`
- Props: none (uses existing category video)
- Styling: Full viewport height on desktop, 70vh on mobile
- Gold gradient text (`from-[#F5E6C8] via-[#D4AF37] to-[#F5E6C8]`)

---

### 2. Entry Paths Section

**Location**: Below hero

**Design**: Three elegant cards presenting entry options

| Path | Icon | Title | Description |
|------|------|-------|-------------|
| Inspiration | Upload icon | Start from Inspiration | Upload reference images and let our designers bring your vision to life |
| Designer-Led | Users icon | Start with a Designer | Browse our curated designers and begin your journey with an expert |
| Base Design | Grid icon | Start from a Base Design | Customize one of our signature designs with your personal touches |

**Component**: `MTOEntryPaths.tsx`
- Three cards in a row (stacked on mobile)
- Hover effects with subtle scale and shadow
- Each card navigates to corresponding section/step
- Premium beige/cream gradient background

---

### 3. Inspiration Upload Section

**Location**: Shown when "Start from Inspiration" selected

**Features**:
- Image upload zone (reuse existing `ImageUploadZone` component)
- Form fields:
  - Occasion dropdown (Wedding, Reception, Festive, Cocktail, etc.)
  - Budget range slider (Rs 25K - Rs 5L+)
  - Notes textarea for special requirements
- "Style Cues Detected" badge (pre-filled from image analysis - placeholder for now)

**Component**: `MTOInspirationUpload.tsx`
- Uses existing upload component
- Form with Occasion, Budget, Notes
- CTA: "Find Matching Designers"

---

### 4. Designer Selector Section

**Location**: After inspiration upload OR when "Start with a Designer" selected

**Design**:
- Horizontal scroll carousel of designer cards (reuse `AzaDesignerCarousel` pattern)
- Filter pills: Category, City, Price Range
- Each card shows: Profile image, Brand name, City, Category, "View Portfolio" button
- Selected designer highlighted with gold border

**Component**: `MTODesignerSelector.tsx`
- Fetches designers from Supabase using `useDesigners` hook
- Filter by category (Bridal, Couture, etc.)
- Card click expands to show portfolio preview

---

### 5. Base Design Gallery

**Location**: When "Start from a Base Design" selected

**Design**:
- Grid of base design cards (4 columns desktop, 2 mobile)
- Each card: Product image, Name, Starting price, "Customize" button
- Filter by dress type (Lehenga, Saree, Gown, Suit)

**Component**: `MTOBaseDesignGallery.tsx`
- Displays curated base designs (can use static data initially)
- "Customize This" button starts customization flow

---

### 6. Customization Panel

**Location**: Main customization interface

**Design** (split layout):
- Left: Live preview area (60%)
- Right: Customization controls (40%)

**Customization Options**:

| Option | Type | Values |
|--------|------|--------|
| Dress Type | Tabs | Lehenga, Saree, Gown, Anarkali, Suit |
| Fabric | Dropdown | Silk, Velvet, Georgette, Organza, Net (designer-approved only) |
| Color Palette | Color swatches | Curated palette (12-16 colors) |
| Embroidery Level | Slider | Minimal, Moderate, Heavy, Royal |

**Live Price Range**: Updates dynamically based on selections
- Format: "Estimated: Rs 45,000 - Rs 65,000"
- Note: "Final price confirmed by designer"

**Component**: `MTOCustomizationPanel.tsx`
- State management for all selections
- Price calculation logic
- Real-time updates

---

### 7. AI-Assisted Design Preview

**Location**: Within customization panel

**Design**:
- Button: "Generate Design Variations" (subtle, secondary styling)
- Shows 2-3 AI-generated mockup thumbnails
- Clear label: "AI-Assisted Preview" with info icon
- Disclaimer: "These are conceptual previews. Final design reviewed by your designer."

**Component**: `MTOAIDesignPreview.tsx`
- Integrates with Lovable AI (google/gemini-2.5-flash-image for image generation)
- Loading state with shimmer
- Generated images displayed in a row
- "Select as Reference" button on each

---

### 8. Design Comparison View

**Location**: After selecting variations

**Design**:
- Side-by-side comparison of 2-3 designs
- Toggle buttons to switch between views
- Each design shows:
  - Mockup image
  - Customization summary
  - Estimated price range
  - Estimated delivery time

**Component**: `MTODesignComparison.tsx`
- Compare up to 3 designs
- "Proceed with this design" CTA

---

### 9. Designer Review Section

**Location**: After design finalization

**Design**:
- Status badge system:
  - Pending Review (amber)
  - Approved (green)
  - Changes Suggested (blue)
- Designer profile mini-card
- Comments section (read-only initially)
- "Lock Design" button (only when approved)

**Component**: `MTODesignerReview.tsx`
- Shows current review status
- Designer comments display
- Final design lock confirmation

---

### 10. Order Summary

**Location**: Final step before checkout

**Design**:
- Final design snapshot (large image)
- Order details card:
  - Designer name with profile image
  - Customization details (Fabric, Color, Embroidery)
  - Final confirmed price
  - Estimated delivery (e.g., "8-10 weeks")
- Terms checkbox
- CTA: "Confirm Custom Order"

**Component**: `MTOOrderSummary.tsx`
- Summary of all selections
- Payment/checkout integration placeholder

---

### 11. Progress Indicator

**Location**: Fixed at top during journey

**Design**:
- Horizontal step indicator
- Steps: Inspiration, Designer, Customize, Preview, Review, Order
- Current step highlighted with gold
- Completed steps show checkmark

**Component**: `MTOProgressIndicator.tsx`
- Props: currentStep, totalSteps
- Animated transitions between steps

---

## State Management

Create a context to manage the Made-to-Order journey state:

**`src/contexts/MadeToOrderContext.tsx`**

```typescript
interface MTOState {
  currentStep: number;
  entryPath: 'inspiration' | 'designer' | 'base-design' | null;
  inspirationImages: File[];
  occasion: string;
  budget: [number, number];
  notes: string;
  selectedDesigner: Designer | null;
  selectedBaseDesign: BaseDesign | null;
  customizations: {
    dressType: string;
    fabric: string;
    color: string;
    embroideryLevel: string;
  };
  generatedPreviews: string[];
  selectedPreview: string | null;
  designerReviewStatus: 'pending' | 'approved' | 'changes-suggested';
  designerComments: string[];
  estimatedPrice: [number, number];
}
```

---

## Routing Update

Modify `App.tsx` to use dedicated page for made-to-order:

```typescript
// Update route
<Route path="/category/made-to-order" element={<MadeToOrderPage />} />
```

Or conditionally render in `CategoryPage.tsx`:

```typescript
if (slug === 'made-to-order') {
  return <MadeToOrderPage />;
}
```

---

## Visual Design Guidelines

| Element | Specification |
|---------|---------------|
| Background | Clean white / subtle cream gradients |
| Typography | Serif for headings, sans-serif for body |
| Gold accent | `#D4AF37` for CTAs, active states, highlights |
| Shadows | Soft (`shadow-black/5` to `shadow-black/10`) |
| Animations | Subtle 200-300ms transitions |
| Cards | Rounded corners (xl), generous padding |
| Spacing | Generous whitespace (py-12 to py-20 sections) |

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/MadeToOrderPage.tsx` | Main page component |
| `src/contexts/MadeToOrderContext.tsx` | Journey state management |
| `src/components/made-to-order/MTOHeroSection.tsx` | Hero with video background |
| `src/components/made-to-order/MTOEntryPaths.tsx` | Three entry path cards |
| `src/components/made-to-order/MTOInspirationUpload.tsx` | Upload + form |
| `src/components/made-to-order/MTODesignerSelector.tsx` | Designer carousel |
| `src/components/made-to-order/MTOBaseDesignGallery.tsx` | Base design grid |
| `src/components/made-to-order/MTOCustomizationPanel.tsx` | Customization controls |
| `src/components/made-to-order/MTOAIDesignPreview.tsx` | AI preview generation |
| `src/components/made-to-order/MTODesignComparison.tsx` | Compare designs |
| `src/components/made-to-order/MTODesignerReview.tsx` | Review status |
| `src/components/made-to-order/MTOOrderSummary.tsx` | Final order |
| `src/components/made-to-order/MTOProgressIndicator.tsx` | Step progress |
| `src/components/made-to-order/index.ts` | Export barrel |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/CategoryPage.tsx` | Add conditional redirect for made-to-order slug |
| `src/App.tsx` | Add route for MadeToOrderPage |

---

## Technical Considerations

1. **AI Image Generation**: Uses Lovable AI gateway with `google/gemini-2.5-flash-image` model for generating design variations. Requires edge function to handle the API call.

2. **Designer Data**: Fetches from existing Supabase `designers` table using `useDesigners` hook.

3. **File Storage**: Inspiration uploads will use Supabase Storage (existing `tryon-images` bucket or new bucket).

4. **Order Persistence**: Future phase - will require new database tables for custom orders.

---

## Implementation Phases

**Phase 1 (This Implementation)**:
- Hero section with new copy
- Entry paths section
- Inspiration upload form (UI only)
- Designer selector with real data
- Customization panel (UI only)
- Progress indicator

**Phase 2 (Future)**:
- AI design generation integration
- Designer review workflow (requires backend)
- Order submission and persistence
- Payment integration

---

## Summary

This implementation creates a complete designer-led customization journey that:
- Emphasizes human craftsmanship over technology
- Provides multiple entry points for different user needs
- Maintains OGURA's premium luxury aesthetic
- Uses existing components and patterns where possible
- Is extensible for future AI and backend integrations

