
# Fix: Seller product descriptions not visible on consumer PDP

## What the investigation showed

- The Seller Portal **does** write to our Lovable Cloud `products` table with a real `description` value. Verified directly:
  - `ABC` → description `"acjwsc"`, status `submitted`
  - `tshirt` → description `"ggod bro"`, status `submitted`
  - `Navy Blue Structured Knit Set` → description `"Sophisticated..."`, status `live`
- The consumer PDP already reads from the local DB first. Console for the navy-blue product confirms:
  ```
  [PDP] DB product row: {... description: "Sophisticated..." ...}
  [PDP] mapped description: Sophisticated structured knit set...
  ```
- `ProductDetailsAccordion` renders `{product.description || "No description available."}`. With a non-empty mapped description, it renders correctly.

**The mapping layer is not the bug.** Two real issues remain:

1. Seller products are saved with `status = 'submitted'`, but the consumer Collections grid only shows `status = 'live'` (RLS + filter). So sellers never see their own products on the consumer site → they assume the PDP is broken.
2. There's no visible on-screen verification (raw JSON) confirming what the PDP fetched, so debugging is guesswork.

## Changes

### 1. `src/pages/ProductDetail.tsx` — add visible debug + raw log

- Add `console.log("PDP RAW DATA", row)` right after the local DB fetch (in addition to the existing `[PDP] DB product row` log) so it matches the contract the user asked for.
- Render a temporary debug block at the top of the PDP (behind a `?debug=1` query param, so it doesn't leak to production users):
  ```tsx
  {new URLSearchParams(window.location.search).get("debug") === "1" && (
    <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64">
      {JSON.stringify(currentProduct, null, 2)}
    </pre>
  )}
  ```
  Visit `/product/<id>?debug=1` to confirm `description` is on the resolved object.

### 2. `src/pages/Collections.tsx` — show submitted products too (dev visibility)

- Change the local DB query from `.eq("status", "live")` to `.in("status", ["live", "submitted"])` so seller-added products appear on the consumer grid immediately and you can click into their PDP without typing the URL.
- (Long-term, "submitted" should require admin approval — that's the existing workflow. This is intentional for now so the seller can verify their listing end-to-end. We can revert to live-only once approvals are wired up.)

### 3. `src/components/ProductDetailsAccordion.tsx` — tighter empty-check

- Replace `product.description || "No description available."` with a trim-aware check so whitespace-only strings still fall back:
  ```tsx
  {product.description?.trim() ? product.description : "No description available."}
  ```

### 4. Cleanup

- Leave the temporary `?debug=1` JSON block in place until you confirm the fix. Will remove it in a follow-up.

## Files to modify

- `src/pages/ProductDetail.tsx`
- `src/pages/Collections.tsx`
- `src/components/ProductDetailsAccordion.tsx`

## Out of scope

- Approval-workflow changes for `submitted` → `live` (separate task).
- Touching the external `pyesltzkemtranachpne` API (different project).

## How to verify after build

1. Open `/collections` — your seller-added items (`ABC`, `tshirt`, etc.) now appear.
2. Click one → land on `/product/<id>?debug=1`.
3. The JSON block at the top shows `"description": "acjwsc"` (or whatever you saved).
4. Scroll to the Product Description accordion → it shows the real text, not the fallback.
