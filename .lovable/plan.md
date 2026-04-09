

# Upgrade Virtual Try-On to Hugging Face IDM-VTON

## Current State
The project already has a fully functional Virtual Try-On system:
- Edge function (`supabase/functions/virtual-tryon/index.ts`) calls Replicate API with the IDM-VTON model
- Frontend hook (`useVirtualTryOn.ts`) handles uploads, generation, and polling
- Dialog UI (`VirtualTryOnDialog.tsx`) with upload zone, model gallery, result display, and history
- Result component (`TryOnResult.tsx`) with download/share/reset + "Before vs After" is missing
- Already wired into `ProductDetail.tsx` on line 405

The user wants to switch from **Replicate** to **Hugging Face Inference API** for the same IDM-VTON model, and add a Before vs After comparison modal.

## What Needs to Change

### 1. Add Hugging Face API secret
A `HUGGINGFACE_API_TOKEN` secret is needed. Will use the `add_secret` tool to request it from the user.

### 2. Rewrite `supabase/functions/virtual-tryon/index.ts`
- Remove Replicate SDK dependency
- Call the Hugging Face Inference API at `https://api-inference.huggingface.co/models/yisol/IDM-VTON`
- Send the human image and garment image as the request payload
- Since IDM-VTON on HF Inference takes two images, use the multipart approach or the API's JSON input format
- Read `HUGGINGFACE_API_TOKEN` from `Deno.env`
- Return the generated image as base64 or upload to storage and return URL
- Keep CORS headers and error handling

### 3. Update `src/hooks/useVirtualTryOn.ts`
- Simplify response handling — HF Inference returns the image directly (no polling needed)
- Handle the new response format (binary image blob vs URL)

### 4. Enhance `src/components/TryOnResult.tsx` — Add Before vs After modal
- Add a "Before vs After" comparison view showing the original product image alongside the try-on result
- Side-by-side layout on desktop, stacked on mobile
- Wrap in a Dialog for full-screen viewing

### 5. Update `src/components/VirtualTryOn.tsx`
- Pass `productImageUrl` to `TryOnResult` for the Before vs After comparison

## Files to Modify
- **Add secret**: `HUGGINGFACE_API_TOKEN`
- **Rewrite**: `supabase/functions/virtual-tryon/index.ts` — switch from Replicate to HF Inference API
- **Update**: `src/hooks/useVirtualTryOn.ts` — handle direct image response (no polling)
- **Update**: `src/components/TryOnResult.tsx` — add Before vs After modal
- **Update**: `src/components/VirtualTryOn.tsx` — pass product image to result component

