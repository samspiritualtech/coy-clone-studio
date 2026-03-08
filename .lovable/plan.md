

# Update Join Us Page: Remove Hero Video, Add "How Ogura Works" Video Section

## Changes — Single file: `src/pages/JoinUs.tsx`

### 1. Hero Section (lines 44-56)
- Remove the `<video>` element and its container from the hero background
- Replace with a clean background (solid or subtle gradient) — no video, no image
- Keep all existing text, badge, and CTA button untouched

### 2. New "How Ogura Works" Section
- Insert a new section between the hero and `<JourneyTimeline />`
- Centered heading: "How Ogura Works"
- Card container (`rounded-2xl`, border, shadow) with a `<video>` element inside
- Video uses the same Cloudinary URL with `controls` attribute (no autoplay)
- Responsive: `w-full`, `max-w-4xl`, centered with `mx-auto`
- Proper vertical spacing (`py-16 md:py-24`)

### Layout Order
```text
Hero (text only, no video)
  ↓
How Ogura Works (video with controls in card)
  ↓
JourneyTimeline
  ↓
... rest of page
```

