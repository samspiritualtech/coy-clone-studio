

# Update "How Ogura Works" Video Section

## Change — `src/pages/JoinUs.tsx` (lines 85-109)

Replace the current video player section with an autoplay background-style video banner with centered overlay text.

### What changes:
- Remove the heading/subtext above the video and the `controls` attribute
- Replace video URL with the new Cloudinary URL
- Add `autoPlay`, `muted`, `loop` attributes; keep `playsInline`
- Add a dark overlay (`bg-black/40`) for readability
- Add centered overlay text: "OGURA DESIGNERS" (small caps), "JOIN OGURA" (large heading), "Where India's designers meet customers" (subtext)
- Keep `rounded-2xl overflow-hidden` container with premium spacing
- Video uses `object-cover` to fill the container as a seamless banner

### Result layout:
```text
┌─────────────────────────────────────┐
│  (autoplay muted loop video bg)     │
│         dark overlay                │
│                                     │
│        OGURA DESIGNERS              │
│         JOIN OGURA                  │
│  Where India's designers meet...    │
│                                     │
└─────────────────────────────────────┘
```

