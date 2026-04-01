

# Refine Ogura Seller Dashboard UI (Visual Only)

## Scope
Pure CSS/className changes across 4 files. No logic, data, or structural changes.

## Changes

### 1. `SellerDashboardShowcase.tsx` — Full-width layout + background
- Remove the boxed container (`border rounded-xl`, fixed `85vh` height)
- Make it `min-h-screen` full-width
- Add a subtle fashion-themed background image with dark overlay on the main content area for a premium feel

### 2. `DashboardSidebar.tsx` — Gradient sidebar + refined hover/active states
- Add a subtle vertical gradient (`from-[#1A1A1A] via-[#1F1F1F] to-[#141414]`)
- Increase active item contrast with a left accent border and slightly brighter background
- Add `transition-all duration-200` for smoother hover animations
- Improve store name section with more padding and a subtle gold/warm accent on the brand name

### 3. `DashboardHeader.tsx` — Shadow + spacing
- Add `shadow-sm` and increase height slightly (`h-16`)
- Add `backdrop-blur-sm bg-background/95` for a frosted glass effect
- Improve search input styling with a subtle border on focus

### 4. `DashboardHome.tsx` — Enhanced cards + table
- KPI cards: add `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`, increase `rounded-xl`, add icon background circles with soft color tints
- Chart cards: add `rounded-xl` and `hover:shadow-md transition-all duration-200`
- Recent Orders card: same rounded + shadow treatment
- Add `backdrop-blur-sm` to cards for depth against the new background

### 5. `SellerDashboardLayout.tsx` — Match sidebar + content styling
- Add gradient background on the sidebar (`bg-gradient-to-b from-[#1A1A1A] to-[#141414]`)
- Active nav items: add left border accent + brighter bg
- Main content area: add subtle background pattern/overlay
- Sticky header: add `shadow-sm backdrop-blur-sm`

## Files to Modify
- `src/components/seller-dashboard/SellerDashboardShowcase.tsx`
- `src/components/seller-dashboard/DashboardSidebar.tsx`
- `src/components/seller-dashboard/DashboardHeader.tsx`
- `src/components/seller-dashboard/pages/DashboardHome.tsx`
- `src/layouts/SellerDashboardLayout.tsx`

