

# Holi Dhamaka Sale Section

A vibrant, self-contained Holi festival sale banner placed directly after `LuxuryHero` on the homepage. No global CSS changes, no modifications to existing components.

## New File: `src/components/HoliDhamakaSale.tsx`

A fully self-contained component with:

### Visual Design
- **Background**: Inline/scoped Tailwind gradient from light pink (`pink-50`) to lavender (`purple-50`) with subtle animated floating color particles (pink, yellow, blue, purple circles using scoped CSS keyframes in a `<style>` tag within the component)
- **Layout**: Centered content container, stacked on mobile, side-by-side on desktop (text left, timer/CTAs right)
- **Glassmorphism card**: `backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-2xl`

### Content
- **Badge**: "Limited Time Holi Offer" pill at the top
- **Headline**: "Holi Dhamaka Sale is LIVE" with rainbow gradient text
- **Subheading**: "Buy 1 Get 1 FREE + Flat 200 OFF on First Order"
- **Coupon section**: Dashed border box with `FIRST200` code and a copy button (uses `navigator.clipboard` + `sonner` toast for feedback)
- **Countdown timer**: 24-hour countdown from mount using `useState` + `useEffect` with `setInterval`. Displays HH:MM:SS in individual glassmorphism boxes
- **CTAs**: Two buttons using `react-router-dom` `Link` to `/collections`:
  1. "Shop Now" -- solid gradient (pink to purple)
  2. "Grab BOGO Deal" -- outline with gradient border
  Both have hover scale + shadow effects via Tailwind
- **Free Shipping badge**: Small pill "Free Shipping Above 999"

### Animations
- Floating particles: 8-10 absolutely-positioned colored circles with scoped CSS `@keyframes float` animation (different delays/durations), contained within the section (using `overflow-hidden` on the section wrapper)
- Entrance: Tailwind `animate-fade-in` on the main content card

### Technical Details
- All styles are scoped Tailwind classes or component-level `<style>` tags -- no changes to `index.css`
- Uses `position: relative` only, no overlapping with hero
- Imports: `useState`, `useEffect` from React, `Link` from `react-router-dom`, `toast` from `sonner`, `Copy`/`Check`/`Truck`/`Gift` icons from `lucide-react`

## Modified File: `src/pages/Index.tsx`

Only two changes:
1. Add import: `import HoliDhamakaSale from "@/components/HoliDhamakaSale"`
2. Insert `<HoliDhamakaSale />` between `<LuxuryHero />` and `<Premium3DCategorySection />`

No components removed or reordered. Structure becomes:
```text
LuxuryHero
HoliDhamakaSale   <-- new
Premium3DCategorySection
CategoryShowcase
... (rest unchanged)
```

