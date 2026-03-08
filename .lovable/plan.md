

# Replace Hero Background Image with Video on /join Page

## Change
**`src/pages/JoinUs.tsx`** — In the hero section (lines ~42-55), replace the `<img>` tag with a `<video>` element using the provided Cloudinary URL.

- Remove the `<img>` element and its `animate-kenburns` class
- Add `<video autoPlay muted loop playsInline className="w-full h-full object-cover" src="https://res.cloudinary.com/dow8lbkui/video/upload/v1772960567/Ogura_fashion_brand_reel_d936ed2c10_y9kikd.mp4" />`
- Keep the existing gradient overlay (`bg-gradient-to-r from-background via-background/95 to-background/80`) — this already provides sufficient text readability
- All existing text, badges, and buttons remain untouched

One file, one element swap.

