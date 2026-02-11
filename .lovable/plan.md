

# Plan: Dual Product Gallery with Lightbox

## Overview
Create a reusable `ProductGallery` component and a `ProductShowcase` page displaying two separate product design sections using the 8 uploaded images.

---

## Files to Create

### 1. `src/components/ProductGallery.tsx` -- Reusable Gallery Component

A self-contained gallery component that accepts `title` and `images` props.

**Props interface:**
- `title: string` -- section heading
- `images: string[]` -- array of image URLs

**Internal state:**
- `selectedIndex` -- currently active thumbnail/main image
- `lightboxOpen` -- whether fullscreen modal is shown
- `fadeKey` -- triggers fade transition on image change

**Main image area:**
- Displays the selected image at large size (aspect-[3/4])
- Fade transition: `transition-opacity duration-300 ease-in-out` using a key-based re-render with opacity toggle
- Click opens the lightbox
- Hover: `cursor-pointer`

**Thumbnail strip:**
- Horizontal row below main image
- `flex overflow-x-auto snap-x snap-mandatory gap-3` for mobile scroll
- Each thumbnail: `w-16 h-20 object-cover rounded-lg`
- Active thumbnail: ring-2 ring-primary
- Hover: `hover:scale-105 transition-transform duration-200 cursor-pointer`

**Lightbox modal (Radix Dialog):**
- Dark overlay: `bg-black/90`
- Centered image with `max-w-[90vw] max-h-[85vh]`
- Zoom-in entrance: `animate-scale-in` (already in tailwind config)
- Close button (X icon) top-right, white color
- Previous/Next arrows (ChevronLeft/ChevronRight) on left/right sides
- Keyboard navigation: ArrowLeft, ArrowRight, Escape (via useEffect keydown listener)
- Touch swipe: onTouchStart/onTouchEnd tracking deltaX to navigate
- Body scroll lock: `document.body.style.overflow = 'hidden'` when open, restored on close
- Image counter: "2 / 5" bottom center

**Container styling:**
- `bg-white rounded-2xl shadow-lg p-6`

### 2. `src/pages/ProductShowcase.tsx` -- Page with Two Galleries

**Layout:**
- Header at top, Footer at bottom
- Page title centered
- Two ProductGallery instances in a responsive grid:
  - `grid grid-cols-1 lg:grid-cols-2 gap-8`
- Container: `max-w-7xl mx-auto px-4 py-8`

**Image arrays:**
- Design A (5 images): The black and gold striped saree images
  - `imgi_58_jbl00937_1.jpg`, `imgi_59_jbl00946_1.jpg`, `imgi_60_jbl00940_2.jpg`, `imgi_61_jbl00929_1.jpg`, `imgi_62_jbl00940_2_1.jpg`
- Design B (3 images): The colorful print outfit images
  - `imgi_19_HASnCL0O_0064ba7d42224827b21bb798565d4b2e.jpg`, `imgi_20_v6kcUeDj_243f3eae7fca4b8c964b4843dff9418b.jpg`, `imgi_21_z2etZUrt_ec4bbb6073784d899f9c0d004236bbe7.jpg`

Images referenced from `/user-uploads/` paths (already uploaded to project).

### 3. `src/App.tsx` -- Add Route

Add a public route:
```
<Route path="/product-showcase" element={<ProductShowcase />} />
```

---

## Technical Details

### Fade Transition Approach
Use a state-driven opacity toggle:
1. On thumbnail click, set `isFading = true` (opacity-0)
2. After 150ms timeout, update `selectedIndex` and set `isFading = false` (opacity-100)
3. CSS: `transition-opacity duration-300 ease-in-out`

### Keyboard Navigation (Lightbox)
```text
useEffect with keydown listener when lightboxOpen is true:
- ArrowLeft: go to previous image
- ArrowRight: go to next image  
- Escape: close lightbox (handled by Radix Dialog automatically)
```

### Mobile Swipe Support (Lightbox)
```text
Track touch events:
- onTouchStart: record startX
- onTouchEnd: calculate deltaX
- If deltaX > 50px: next image
- If deltaX < -50px: previous image
```

### Body Scroll Lock
```text
useEffect watching lightboxOpen:
- open: document.body.style.overflow = 'hidden'
- close: document.body.style.overflow = ''
- cleanup: restore overflow on unmount
```

---

## Files Summary

| Action | File |
|--------|------|
| Create | `src/components/ProductGallery.tsx` |
| Create | `src/pages/ProductShowcase.tsx` |
| Modify | `src/App.tsx` (add 1 route + 1 import) |

