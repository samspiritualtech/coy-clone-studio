

# Clean Up Instagram Brands Banner

## Change — `src/components/CategoryShowcase.tsx`

Replace the `FullWidthImageSection` usage for the first item (index 0) with a custom minimal banner that shows only the background image and a small "OGURA SOCIAL" label in the corner. Remove the large title, subtitle, and CTA button overlay.

**What the first item render will become:**

```tsx
if (index === 0) {
  return (
    <Link
      key={category.id}
      to={category.ctaLink}
      className="block rounded-2xl overflow-hidden mx-4 md:mx-8 my-6 shadow-lg hover:shadow-2xl transition-shadow duration-500 group"
    >
      <div className="relative w-full h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${category.backgroundImage})` }}
        />
        {/* Small subtle label */}
        <span className="absolute top-5 left-5 text-white/70 text-xs uppercase tracking-[0.3em] z-10">
          OGURA SOCIAL
        </span>
      </div>
    </Link>
  );
}
```

No gradient overlay, no large text, no CTA button — just the clean image with a subtle corner label. All existing hover effects (zoom, shadow transition) and clickable redirect preserved.

