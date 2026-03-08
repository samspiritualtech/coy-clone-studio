

# Add Autoplay Video Banner to Join Us Page

## Change — `src/pages/JoinUs.tsx` (insert between lines 84 and 86)

Insert a new section with an autoplay, muted, looping video banner — no controls, no overlay text.

```tsx
<section className="py-12 md:py-16">
  <div className="container mx-auto px-4 max-w-5xl">
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full aspect-video object-cover"
        src="https://res.cloudinary.com/dow8lbkui/video/upload/v1772962550/cch7stxes9rmr0cwsjnamwb66w_result__gzzsip.mp4"
      />
    </div>
  </div>
</section>
```

Single insertion, one file.

