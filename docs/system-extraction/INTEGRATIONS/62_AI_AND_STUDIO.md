# 62 — AI & "Studio" Features

## Feature: Virtual Try-On
USER (uploads/selects human+garment image) → FRONTEND (`useVirtualTryOn.ts`, `VirtualTryOn.tsx`, `VirtualTryOnDialog.tsx`) uploads file to Supabase Storage bucket `tryon-images` (public bucket, migration `20251108170146_...sql`) → gets public URL → BACKEND `supabase/functions/virtual-tryon/index.ts` → AI PROVIDER: Hugging Face Space `yisol/idm-vton` via Gradio SSE queue protocol, `fn_index:2`, params `auto-masking=true, is_checked_crop=false, denoise_steps=30, seed=42` (all hardcoded, not user-tunable) → RESPONSE: base64 PNG streamed back → VALIDATION: none beyond checking `output.data[0]` exists → STORAGE: [MISSING] the generated try-on image is **not persisted** anywhere (no upload of the result back to `tryon-images` or any bucket) → DATABASE: [MISSING] **no `tryon_history` table exists** in migrations (only the storage bucket + RLS policies for uploads were found: `20251108170146` and `20251108171434`). A `TryOnHistory.tsx` component exists in `src/components/` but has no backing table to read from — [CONFLICT]: the component name implies persisted history, but no schema supports it, meaning it likely reads from local/component state only or is non-functional. → CREDIT ACCOUNTING: [MISSING] no credits/quota system limits try-on usage. → UI: result shown via `TryOnResult.tsx`, retried with a 90s client-side polling loop (`RETRY_DELAY_MS=3000`) that treats HF cold-start/quota errors as "loading" and retries in-place.

Failure handling: `isLoadingMessage()` regex-matches `/loading|warming|busy|queue|starting|cold start|503|timeout/i` to distinguish transient states from hard failures; hard failures surface a destructive toast.

## Feature: AI Recommendations
USER browses a product/brand/search/category → FRONTEND calls `supabase.functions.invoke('ai-recommendations', ...)` (call sites not exhaustively enumerated in this pass, e.g. `RecommendationCarousel.tsx`) → BACKEND `ai-recommendations/index.ts` builds one of four prompts (similar/brand/search/category) → AI PROVIDER: Lovable AI Gateway, model **`google/gemini-2.5-flash`** → RESPONSE: freeform text expected to contain a JSON array → VALIDATION: regex-extracts `[...]` and `JSON.parse`s it, falling back to `[]` on failure → STORAGE/DATABASE: none — purely request/response, nothing persisted → CREDIT ACCOUNTING: [MISSING] → UI: `RecommendationCarousel` renders matched products (skeleton loader `RecommendationSkeleton.tsx` while pending).

Exact prompt (search example, `ai-recommendations/index.ts:83-90`):
```
You are a fashion recommendation AI. A user searched for: "${query}"
From this product catalog, select the 8 most relevant products that match the search intent...
Response format: ["id1", "id2", "id3", ...]
```

## Feature: Image Analysis (visual search)
USER uploads a photo (`ImageUploadZone.tsx`, `ImageSearchDialog.tsx`) → FRONTEND base64-encodes and invokes `image-analysis` → BACKEND makes **two sequential** Lovable AI Gateway calls, both model `google/gemini-2.5-flash`: (1) multimodal analysis extracting `{category, colors, style, pattern, material}` from the image; (2) text-only matching against the product catalog using those attributes → RESPONSE parsed with regex+JSON.parse, defaulting to `{category:'dresses', colors:['black'], style:'casual', pattern:'solid', material:'cotton'}` on parse failure → no storage/DB/credit accounting → UI renders matched products.

## Feature: Generate Banner Image
CALLER: `LaunchStudio`/admin banner tooling (exact frontend call site not traced further in this pass) → BACKEND `generate-banner-image/index.ts` → AI PROVIDER: Lovable AI Gateway, model **`google/gemini-2.5-flash-image-preview`**, `modalities:["image","text"]` → RESPONSE: `choices[0].message.images[0].image_url.url` → returned directly to caller; **not saved to Storage or DB** by this function itself (any persistence would be the caller's responsibility, not confirmed here) → explicit 429/402 handling (402 = "Payment required. Please add credits." — implies Lovable AI Gateway has its own platform-level credit metering, but this app does not surface or track that per-user).

## Comparison against the "OGURA Studio: 8 generation modes, brand profile/brand fetch, media library, marketplace push, credits" concept

| Documented/expected concept | Actual implementation | Verdict |
|---|---|---|
| 8 generation modes | Only 4 distinct AI-backed capabilities exist in code: virtual try-on, ai-recommendations, image-analysis, generate-banner-image | [MISSING]/[CONFLICT] — no evidence of 8 modes; no mode-switcher UI or generation-type enum beyond `type: 'similar'|'brand'|'search'|'category'` inside ai-recommendations (a routing parameter, not "generation modes") |
| Brand profile / brand fetch | No edge function or table for brand-profile ingestion/fetching was found (`brands` concept exists only as a display/browse feature — `Brands.tsx`, `BrandDetail.tsx` — not an AI brand-profile builder) | [MISSING] |
| Media library | No `media_library` table or asset-management UI/API found | [MISSING] |
| Marketplace push | No integration pushes AI-generated assets to any external marketplace | [MISSING] |
| Credits (accounting) | No credits table, no per-user/per-seller quota, no debit/consumption tracking anywhere in the codebase for any AI feature | [MISSING] — **there is no credit accounting in this application at all.** The only "credits" concept surfaced is the *platform-level* Lovable AI Gateway 402 response text, which is not tied to any in-app ledger. |

**Conclusion**: the "OGURA Studio" concept as described is **not implemented**. What exists is four narrow, independent AI-assisted features (try-on, recommendations, visual search, banner generation) wired directly to Lovable AI Gateway / Hugging Face, with no unifying "Studio" UI, no credits, no brand-profile pipeline, and no marketplace-push mechanism.
