

# Improve Virtual Try-On Button UX & Fix Silent Failures

## Changes

### 1. `src/components/VirtualTryOn.tsx`
- Add hint text above button when disabled: "Select a model or upload your photo to try this outfit"
- Add `cursor-not-allowed opacity-60` styling when disabled
- Add `title` tooltip attribute on disabled button
- Add `console.log("Try-On button clicked")` at start of `handleGenerate`
- Wrap batch/single generation blocks in try/catch with toast error for upload failures
- Add `Loader2` spinning icon when generating

### 2. `src/hooks/useVirtualTryOn.ts`
- Add `console.log` before and after `supabase.functions.invoke` call
- When `error` is returned from invoke, attempt to parse the response context — check for "loading" keyword and show specific toast: "Model is starting up, please wait 30-60 seconds"
- Add `console.log` for upload requests
- Improve error messages to distinguish upload failures, edge function errors, and model loading (503)
- Check for `data?.image` in addition to `data?.output` to handle the updated edge function response format

## Files to Modify
- `src/components/VirtualTryOn.tsx`
- `src/hooks/useVirtualTryOn.ts`

