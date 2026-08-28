# 18 — ASSETS INVENTORY

## 1. `src/assets/**` (bundled, Vite-processed, build-time imports)

Two categories exist: raw binary files committed to the repo, and Lovable CDN-externalized assets represented by a `<file>.asset.json` sidecar (the actual binary lives on Lovable's R2/CDN and is fetched at build time via the `url` field; the `.asset.json` itself is what's in git).

### 1a. Raw files (not asset.json-backed)
| Path | Type | Source | Usage | Public/Private | Dynamic/Static |
|---|---|---|---|---|---|
| src/assets/bags-hero.jpg | jpg | static import | CategoryShowcase/Hero sections (bags category) [OBSERVED] | public (bundled) | static |
| src/assets/bottoms-hero.jpg | jpg | static import | bottoms category hero [OBSERVED] | public | static |
| src/assets/chanderi-shine.jpg | jpg | static import | collection/editorial section [OBSERVED] | public | static |
| src/assets/dresses-hero.jpg | jpg | static import | dresses category hero [OBSERVED] | public | static |
| src/assets/footwear-hero.jpg | jpg | static import | footwear category hero [OBSERVED] | public | static |
| src/assets/hidden-gems-hero.jpg | jpg | static import | HiddenGemsSection.tsx [INFERRED] | public | static |
| src/assets/indie-vogue.jpg | jpg | static import | editorial/collection grid [INFERRED] | public | static |
| src/assets/insta-loved.jpg | jpg | static import | InstagramModelsBanner-adjacent grid [INFERRED] | public | static |
| src/assets/made-to-order-lehenga.jpg | jpg | static import | MTOHeroSection / Made-to-Order marketing [INFERRED] | public | static |
| src/assets/outerwear-hero.jpg | jpg | static import | outerwear category hero [OBSERVED] | public | static |
| src/assets/saree-society.jpg | jpg | static import | editorial section [INFERRED] | public | static |
| src/assets/tops-hero.jpg | jpg | static import | tops category hero [OBSERVED] | public | static |
| src/assets/urban-loom.jpg | jpg | static import | editorial section [INFERRED] | public | static |

All the above are referenced via `import x from "@/assets/..."` and get hashed filenames + content-based cache-busting by Vite at build (`[name]-[hash].ext`). [INFERRED from Vite defaults]

### 1b. `.asset.json` CDN-externalized assets (Lovable platform mechanism)
Each `.asset.json` is a pointer; Lovable's build tooling resolves the `url` to the actual file content from R2 storage at build time and the import resolves to that CDN path in the emitted bundle. **These are not raw pixel files in the repo** — no dimensions available from metadata; only size/content-type. [OBSERVED]

| Sidecar path | CDN URL | original_filename | size (bytes) | content_type | created_at | Usage |
|---|---|---|---|---|---|---|
| src/assets/designers/anamika-khanna.jpg.asset.json | /__l5e/assets-v1/74ee1438-eb0c-46ee-817f-d8316c187b90/anamika-khanna.jpg | anamika-khanna.jpg | 81092 | image/jpeg | 2026-07-13T17:44:58Z | Designer spotlight card (AzaDesignerCard/DesignersSpotlight) [INFERRED] |
| src/assets/designers/anita-dongre.jpg.asset.json | /__l5e/assets-v1/c108a610-370e-4e10-9084-be1846477332/anita-dongre.jpg | anita-dongre.jpg | 136048 | image/jpeg | 2026-07-13T17:44:51Z | Designer spotlight card [INFERRED] |
| src/assets/designers/aseem-kapoor.jpg.asset.json | /__l5e/assets-v1/a401cc07-6fd8-4843-bb0d-b75873d1d346/aseem-kapoor.jpg | aseem-kapoor.jpg | 59761 | image/jpeg | 2026-07-13T17:44:44Z | Designer spotlight card [INFERRED] |
| src/assets/designers/gauri-nainika.jpg.asset.json | /__l5e/assets-v1/3e134417-c269-40d4-9226-5bc6ec98e261/gauri-nainika.jpg | gauri-nainika.jpg | 106167 | image/jpeg | 2026-07-13T17:44:40Z | Designer spotlight card [INFERRED] |
| src/assets/designers/ka-sha.jpg.asset.json | /__l5e/assets-v1/eaf1a3ef-4d66-4a98-b48b-0aedb4c19ce7/ka-sha.jpg | ka-sha.jpg | 148350 | image/jpeg | 2026-07-13T17:45:02Z | Designer spotlight card [INFERRED] |
| src/assets/designers/punit-balana.jpg.asset.json | /__l5e/assets-v1/d942dedf-2014-4714-b10e-40ecc2c51ceb/punit-balana.jpg | punit-balana.jpg | 116585 | image/jpeg | 2026-07-13T17:44:37Z | Designer spotlight card [INFERRED] |
| src/assets/designers/rajiramniq.jpg.asset.json | /__l5e/assets-v1/e7930fed-ffca-46b8-813f-583ab442fa8a/rajiramniq.jpg | rajiramniq.jpg | 123479 | image/jpeg | 2026-07-13T17:44:47Z | Designer spotlight card [INFERRED] |
| src/assets/designers/roshi.jpg.asset.json | /__l5e/assets-v1/59ec30bf-93cc-49e3-9e75-155801d957b8/roshi.jpg | roshi.jpg | 65001 | image/jpeg | 2026-07-13T17:44:33Z | Designer spotlight card; note also duplicated as static product photos under public/roshi/ [OBSERVED] |
| src/assets/designers/tarun-tahiliani.jpg.asset.json | /__l5e/assets-v1/9c802cec-9735-420f-8a35-1dc6344c4bf6/tarun-tahiliani.jpg | tarun-tahiliani.jpg | 92449 | image/jpeg | 2026-07-13T17:44:54Z | Designer spotlight card [INFERRED] |
| src/assets/ogura-logo.png.asset.json | /__l5e/assets-v1/8fd62990-93af-40f4-bd92-2685c5d42633/ogura-logo.png | ogura-logo.png | 92462 | image/png | 2026-08-17T19:59:44Z | Header/LuxuryHeader/Footer logo [INFERRED — imported wherever brand logo is rendered] |
| src/assets/waitlist/wl-ai-studio.png.asset.json | /__l5e/assets-v1/745a04b5-b8b9-4c67-ab21-285db9aea827/ogura-studio.png | ogura-studio.png | 145626 | image/webp (mismatched: `.png` filename, `content_type: image/webp`) [CONFLICT] | 2026-08-25T13:24:43Z | BrandWaitlist page AI-studio teaser [INFERRED] |
| src/assets/waitlist/wl-brand-1.png.asset.json | /__l5e/assets-v1/477b9f55-c508-4ffe-ac0a-35718b341e40/waitlist-brand-1.png | waitlist-brand-1.png | 640240 | image/png | 2026-08-25T13:24:32Z | BrandWaitlist page brand showcase [INFERRED] |
| src/assets/waitlist/wl-brand-2.png.asset.json | /__l5e/assets-v1/56726882-aa82-40ce-a890-618bc9dfba7c/waitlist-brand-2.png | waitlist-brand-2.png | 747649 | image/png | 2026-08-25T13:24:37Z | BrandWaitlist page brand showcase [INFERRED] |

No dimensions are recorded in any `.asset.json` — width/height are [UNKNOWN] for all CDN-externalized images.

## 2. `public/**` (served verbatim, no hashing, no cache-busting unless via query string)

| Path | Type | Usage | Public/Private | Notes |
|---|---|---|---|---|
| public/favicon.png | png | index.html:6-7 `<link rel="icon">` / apple-touch-icon | public | **No cache-busting version query** on favicon links [OBSERVED][CONFLICT — og-image has `?v=4`, favicon does not] |
| public/og-image.jpg | jpg | index.html:22-23,34 og:image / twitter:image, referenced with `?v=4` cache-busting query | public | Static 1200×630 (declared via `og:image:width`/`height` meta, not verified against actual file) [OBSERVED] |
| public/placeholder.svg | svg | Generic fallback image (used by OptimizedImage / product cards on error) [INFERRED] | public | fallback asset |
| public/robots.txt | txt | crawler policy | public | static |
| public/instagram-brands-hero.png | png | InstagramModelsBanner or FeaturedBrands hero [INFERRED] | public | static |
| public/bags/collection-hero.jpg | jpg | Bags collection page hero [INFERRED] | public | static |
| public/bags/buckle-shoulder-burgundy.webp | webp | static demo product image, referenced from src/data/products.ts (hardcoded catalog) [INFERRED] | public | static |
| public/bags/classic-crossbody-black.webp | webp | same as above | public | static |
| public/bags/fringe-hobo-brown.webp | webp | same as above | public | static |
| public/bags/moon-crescent-blue.webp | webp | same as above | public | static |
| public/bags/striped-canvas-tote.webp | webp | same as above | public | static |
| public/bags/vanity-top-handle-black.webp | webp | same as above | public | static |
| public/bags/woven-hobo-brown.webp | webp | same as above | public | static |
| public/bags/woven-hobo-burgundy.webp | webp | same as above | public | static |
| public/bags/woven-tote-cream.webp | webp | same as above | public | static |
| public/indigo/product-1.jpg … product-5.jpg | jpg (5 files) | Static demo "Indigo" brand product set, src/data/products.ts or src/data/stores.ts [INFERRED] | public | static |
| public/roshi/product-1.jpg … product-10.jpg | jpg (10 files) | Static demo "Roshi" designer product set, src/data/products.ts [INFERRED] | public | static |

## 3. Fonts

index.html:9-10 preconnects to `fonts.googleapis.com`/`fonts.gstatic.com`; index.html:11 loads Google Fonts stylesheet:
`Cormorant+Garamond` (weights 300–700, italics), `Manrope` (300–800), `Playfair+Display` (400–700, italics). [CONFIRMED, index.html:11]
No local `@font-face` declarations found in `src/App.css` or Tailwind config search performed; fonts are 100% Google Fonts CDN, loaded render-blocking-free via `display=swap`. [OBSERVED]

## 4. Icons

Icon system is exclusively `lucide-react` — 151 files import from `"lucide-react"` [OBSERVED, code.txt]. No custom SVG icon sprite system found. Icons are inlined React components, tree-shaken per import, no separate network asset.

## 5. Hardcoded remote/CDN media URLs in components/data (file:line + URL)

### Videos (Cloudinary, category hero/card videos)
All in `src/data/oguraCategories.ts` (heroVideo/cardVideo pairs, same URL repeated for hero+card per category):
- :70,74 `https://res.cloudinary.com/dow8lbkui/video/upload/v1768726916/19ygmntpw5rmy0cvt1arvsffr0_result__be5kbh.mp4`
- :121,125 `https://res.cloudinary.com/dpnosz8im/video/upload/v1768723510/nvfa3tvknnrmy0cvt0gbe0nd5r_result__q3spyc.mp4`
- :185,189 `https://res.cloudinary.com/dow8lbkui/video/upload/v1768728765/ekk60tp1qhrmt0cvt1s9gz5xtw_result__kgwj0e.mp4`
- :236,240 `https://res.cloudinary.com/dpnosz8im/video/upload/v1768725355/t88wqe2hy5rmy0cvt0z8c534s8_result__flnqjk.mp4`
- :288,292 `https://res.cloudinary.com/dpnosz8im/video/upload/v1768726004/g7h46ecqsdrmw0cvt14985g7fr_result__dctjte.mp4`
- :347,351 `https://res.cloudinary.com/dow8lbkui/video/upload/v1768726481/n074nvqgt9rmw0cvt1696aag3w_result__r9ng7h.mp4`
- :398,402 `https://res.cloudinary.com/dow8lbkui/video/upload/v1768727437/pdc7kwtt9nrmt0cvt1f9jmjmyw_result__c49r5p.mp4`
- :457,461 `https://res.cloudinary.com/dow8lbkui/video/upload/v1768727700/ypkv23106xrmw0cvt1h8ddvvhc_result__ffbnha.mp4`

`src/components/made-to-order/MTOHeroSection.tsx:5` reuses the same first Cloudinary URL as a hardcoded constant (duplication with oguraCategories.ts:70). [OBSERVED][CONFLICT — duplicated hardcoded literal instead of shared import]

`src/components/InstagramModelsBanner.tsx:11` — `https://res.cloudinary.com/dow8lbkui/video/upload/v1772960567/Ogura_fashion_brand_reel_d936ed2c10_y9kikd.mp4`

`src/data/menuData.ts:26` — `https://videos.pexels.com/video-files/4125383/4125383-uhd_2560_1440_30fps.mp4` (mega-menu preview video)

`src/components/LoveOguraSection.tsx:9-13` — 5 Pexels video URLs + matching Unsplash poster images (hardcoded array, static, not from DB despite the component also querying `influencer_videos` table via react-query — see §7 conflict below):
- :9 video `videos.pexels.com/video-files/4778602/...mp4`, poster `images.unsplash.com/photo-1617137968427-...`
- :10 video `.../5480459/...mp4`, poster `.../photo-1515886657613-...`
- :11 video `.../4536558/...mp4`, poster `.../photo-1539008835657-...`
- :12 video `.../5480711/...mp4`, poster `.../photo-1496747611176-...`
- :13 video `.../4765917/...mp4`, poster `.../photo-1509631179647-...`

### GIFs
`src/components/RoundCategorySection.tsx:9,15,21,27,33` — hardcoded `https://ogura.in/assets/gifs/{dresses,tops,bottoms,outerwear,accessories}-loop.gif`. **These point at the production domain's own `/assets/gifs/` path, which does not exist anywhere in `public/` or `src/assets/` in this repo** — [MISSING] referenced-but-missing asset. In local/preview environments these 404.

### Other hardcoded image domains referenced in data files (not fully enumerated line-by-line; representative)
- `src/data/products.ts:212,246` — external image URLs for demo catalog entries [OBSERVED, needs manual review for exact domain]
- `src/data/stores.ts:7,12,18,23,29,34,40,45` — external store logo/cover image URLs [OBSERVED]
- `src/pages/Stores.tsx:62`, `src/pages/BrandDetail.tsx:102`, `src/pages/Careers.tsx:903`, `src/pages/BrandWaitlist.tsx:451,468`, `src/pages/JoinUs.tsx:304`, `src/pages/SellerApply.tsx:224` — each contains one hardcoded `https://` literal (likely Unsplash/placeholder imagery or external form links); exact URL text not captured in this pass [UNKNOWN — requires per-file re-grep for full text]

## 6. Storage-bucket-backed media

| Bucket | Written from | DB column holding URL | Public/Private | URL generation |
|---|---|---|---|---|
| `product-images` | src/pages/seller/SellerAddProduct.tsx:113-122, src/pages/SellerApply.tsx:51-53, src/pages/JoinUs.tsx:108-110, src/components/seller-dashboard/pages/DashboardAddProduct.tsx:76-78 | `products.images` (jsonb array) [CONFIRMED, db.txt:130]; also seller-application photo fields on `seller_applications`/`sellers` [INFERRED] | Public — all call sites use `.getPublicUrl()`, no signed URL generation found | `supabase.storage.from("product-images").getPublicUrl(path)` after `.upload(path, file)` |
| `tryon-images` | src/hooks/useVirtualTryOn.ts:110-116 | Not a DB column directly — public URL is passed in-memory to `virtual-tryon` edge function invoke (useVirtualTryOn.ts:137) and/or stored to `tryon_history` table via VirtualTryOn.tsx:99,136 [INFERRED — column name not enumerated in db.txt excerpt] | Public — `.getPublicUrl()` | same pattern as above |
| `influencer-videos` (referenced by requirement, no direct `storage.from("influencer-videos")` call site found in the grepped `src` calls) | Not observed in client code — `influencer_videos` table (db.txt) stores `video_filename` + `poster_url` as **text columns**, not resolved via `storage.from()` in the client; likely resolved to a public bucket URL by convention/CDN base path in the consuming component (`LoveOguraSection.tsx` queries `influencer-videos` react-query key but renders hardcoded array — see conflict below) | `influencer_videos.video_filename`, `influencer_videos.poster_url` [CONFIRMED, db.txt] | [UNKNOWN] whether bucket is public | [UNKNOWN — no client-side URL construction found] |

No `.storage.from("influencer-videos")` or `.storage.from("tryon-images").upload` call outside the ones listed was found; storage bucket privacy (public vs. RLS-gated) is [UNKNOWN] beyond what `getPublicUrl()` implies (bucket must be public for that URL to resolve without a token).

## 7. Conflicts / anomalies

- [CONFLICT] `src/components/LoveOguraSection.tsx` fetches `influencer_videos` table via react-query key `['influencer-videos']` (code.txt) yet the component **also** defines a hardcoded array of 5 Pexels/Unsplash URLs at lines 9-13. Whether the hardcoded array is a fallback or the query result is actually used/replaced could not be fully confirmed without the full component body — flagged for review.
- [CONFLICT] `wl-ai-studio.png.asset.json` original_filename is `ogura-studio.png` but content_type is `image/webp` — filename/type mismatch.
- [MISSING] `RoundCategorySection.tsx` GIF URLs point to `https://ogura.in/assets/gifs/*.gif`, none of which exist in `public/assets/gifs/` in this repository.
- No favicon cache-busting version param exists, unlike `og-image.jpg?v=4` — inconsistent cache-invalidation strategy for icons vs. og-image [OBSERVED].

## 8. Orphaned / unused assets

Not independently verified by exhaustive cross-reference of every asset against every import in this pass; candidates suspected of narrow/single-purpose use with no cross-links found beyond one component: `public/instagram-brands-hero.png`, `src/assets/hidden-gems-hero.jpg`, `src/assets/indie-vogue.jpg`, `src/assets/insta-loved.jpg`, `src/assets/saree-society.jpg`, `src/assets/urban-loom.jpg` — [UNKNOWN, requires per-file `rg` confirmation not completed in this pass; do not treat as confirmed-orphaned].

## 9. Referenced-but-missing assets

- `https://ogura.in/assets/gifs/{category}-loop.gif` (5 files) — referenced in RoundCategorySection.tsx but absent from repo [MISSING].
