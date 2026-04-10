

# Fix Virtual Try-On End-to-End

## Root Cause

The Gradio Space consistently returns `SSE event: error null` because the edge function uploads images to the Space's local filesystem (`/tmp/gradio/...`), but the ZeroGPU worker that runs the model cannot access those files (they're on a different server). Every request gets an event_id but immediately fails with `null` error.

**Fix**: Pass image URLs directly to the Gradio API instead of uploading files. The Gradio `/call/tryon` endpoint accepts `url` fields in FileData objects, which the model worker can fetch directly.

Secondary issue: `tryon-images` bucket requires authentication for uploads, so unauthenticated users get a silent failure. We need to allow anonymous uploads or handle the error gracefully.

## Changes

### 1. Edge Function (`supabase/functions/virtual-tryon/index.ts`)
- Remove the `uploadToSpace` function entirely
- Instead of fetching images and uploading them, pass the original URLs directly in the Gradio payload using the `url` field (as shown in the Space's own `/info` example_input)
- Add detailed logging of the SSE error data (currently logs `null` without context)
- Keep the retry logic for 503/429

### 2. Storage Policy (SQL migration)
- Add an anonymous upload policy for `tryon-images` bucket so unauthenticated users can still upload their photos for try-on

### 3. Frontend Hook (`src/hooks/useVirtualTryOn.ts`)
- No structural changes needed; the hook already handles `success`, `loading`, and `error` responses correctly
- Add a log of the full SSE error data in the edge function so we can debug further if needed

### 4. Frontend UI (`src/components/VirtualTryOn.tsx`)
- No changes needed; button, timer, and result display logic are already correct

## Technical Detail

Current broken payload:
```json
{
  "data": [
    { "background": { "path": "/tmp/gradio/abc/human.jpg", "meta": {...} }, "layers": [], "composite": null },
    { "path": "/tmp/gradio/def/garment.jpg", "meta": {...} },
    ...
  ]
}
```

Fixed payload (using URLs directly):
```json
{
  "data": [
    { "background": { "url": "https://images.unsplash.com/...", "path": "human.jpg", "meta": {...}, "orig_name": "human.jpg" }, "layers": [], "composite": null },
    { "url": "https://example.com/garment.jpg", "path": "garment.jpg", "meta": {...}, "orig_name": "garment.jpg" },
    ...
  ]
}
```

## Files to Modify
- `supabase/functions/virtual-tryon/index.ts` — remove upload step, use URL-based FileData
- SQL migration — allow anonymous uploads to `tryon-images`

