# 35 — Background Jobs / Async & Scheduled Processing

There is **no scheduler** (no `pg_cron`, no Supabase Scheduled Function config found in `supabase/config.toml`, no external cron referenced in code). [CONFIRMED — absence]. All "background-ish" behavior in this system is either (a) a DB trigger that fires synchronously inside another transaction, or (b) long-polling/SSE done entirely within the lifetime of a single HTTP request from an edge function. There are no durable queues, no retry workers, and no job table.

## Implemented "background" mechanisms

### JOB-OTP-CLEANUP — `cleanup_expired_otps` trigger
- TRIGGER: fires as a **DB trigger**, not a schedule — attached to `otp_verifications` (per `pg_proc`, function body is `DELETE FROM otp_verifications WHERE expires_at < now(); RETURN NEW;`); given the `RETURN NEW` pattern it is a `BEFORE`/`AFTER` trigger on INSERT (most likely `BEFORE INSERT ON otp_verifications`, consistent with "clean up old rows every time a new OTP is requested" — not independently confirmed which trigger event fires it, but it is bound to table activity, not a clock). [CONFIRMED function body; INFERRED exact trigger-event binding]
- SCHEDULE: none — purely reactive to new OTP inserts (i.e., only runs when `send-otp` is called). If nobody requests an OTP, expired rows accumulate indefinitely.
- FUNCTION: `public.cleanup_expired_otps()`.
- INPUT: none (uses `now()`).
- PROCESS: single `DELETE ... WHERE expires_at < now()`.
- DB READ: `otp_verifications.expires_at`.
- DB WRITE: `DELETE` on `otp_verifications`.
- EXTERNAL CALL: none.
- SUCCESS/FAILURE: implicit — runs inside the same transaction as the triggering INSERT; if it fails, the whole INSERT fails (fails closed).
- RETRY: none needed (deterministic idempotent delete).
- IDEMPOTENCY: yes (delete-by-condition, safe to re-run).
- TIMEOUT: none (bounded by table size at trigger time — could be slow if the table grows very large, but no expected large volume given OTPs self-limit via manual delete on verify failure too).
- LOCKING: standard row locks for the DELETE, no explicit lock/advisory-lock usage.
- DUPLICATION RISK: none.

### JOB-VIRTUAL-TRYON-POLL — long-poll/SSE inside `virtual-tryon` edge function
- TRIGGER: single HTTP invocation from `useVirtualTryOn.ts:137`.
- SCHEDULE: none — synchronous within the request; "polling" is actually the client hook re-invoking the function (client-side setInterval/retry logic in `useVirtualTryOn.ts`, not independently re-verified line-by-line) when the response comes back `{loading:true}`.
- FUNCTION: `supabase/functions/virtual-tryon/index.ts`.
- PROCESS: joins a Gradio SSE queue, reads events for up to `MAX_WAIT_MS=90_000`ms, then returns whatever state it reached (done, still-loading, or error).
- EXTERNAL CALL: Hugging Face Space (`yisol-idm-vton.hf.space`), bearer-token authenticated.
- SUCCESS: base64 image returned to client; client then does its own `tryon_history` insert.
- FAILURE: various soft-fail (`loading:true`) vs hard-fail (`error` string) outcomes as detailed in 33/31.
- RETRY: delegated entirely to the client hook re-calling the function — no server-side retry or backoff logic, no server-side job record, so if the client gives up (closes tab), the Gradio Space job (if still running remotely) has no cleanup/cancellation call made.
- IDEMPOTENCY: each invocation creates a *new* Gradio `session_hash` — retries are not deduplicated against a possibly-still-running prior job, so a user hitting "try again" repeatedly could stack multiple concurrent generations against the same HF quota.
- TIMEOUT: hard 90s abort via `AbortController`.
- LOCKING/DUPLICATION RISK: no request coalescing — concurrent/duplicate try-on requests for the same image pair are not detected or merged, driving unnecessary cost against the (secret-gated but unauthenticated-endpoint) HF token.

### JOB-SOCIAL-WEBHOOK-RELAY — synchronous outbound webhook
- TRIGGER: single HTTP call from `socialPostService.ts:82` → `social-post-webhook` edge function → single `fetch(MAKE_WEBHOOK_URL, ...)`.
- SCHEDULE: none, fully synchronous request/response.
- RETRY: none — a single failed `fetch` to Make.com surfaces as a 502 to the browser (`{success:false,error,status}`) with no server-side retry/backoff/dead-letter queue.
- IDEMPOTENCY: none — a client retry after a timeout could double-post to the same Make.com scenario.
- DUPLICATION RISK: real — no idempotency key is generated or checked.

### JOB-ALGOLIA-SYNC — full catalog re-index (trigger source unconfirmed)
- TRIGGER: `sync-algolia` edge function — **no scheduled invocation found in this repo** (no cron entry, no `pg_cron` job, no client call site). Likely triggered manually via the Supabase dashboard, an external cron outside this repo, or ad hoc by a developer. [MISSING/UNKNOWN — the *mechanism* that keeps Algolia in sync with `products` changes over time could not be located]
- PROCESS: reads all products (service role, bypassing RLS — filter completeness not independently confirmed, see 33 RULE-PRODUCT-VISIBILITY) plus hardcoded demo data, upserts into Algolia index `ogura-products`.
- IDEMPOTENCY: `saveObjects`-style upsert is generally idempotent by Algolia `objectID`, but re-running does not *remove* Algolia objects for products that were deleted/hidden since the last sync unless the function explicitly diffs and deletes stale objects (not confirmed — file too large to fully audit in this pass). [UNKNOWN — potential for orphaned/stale search results if products are deleted or set non-live between syncs, i.e. **index/sync drift is a real, unmitigated risk** given there is no trigger-on-product-change and no confirmed schedule]
- DUPLICATION/DRIFT RISK: HIGH — because nothing triggers this automatically on product create/update/delete, the Algolia index can silently diverge from `products` for an unbounded period.

## Explicit [MISSING] register — background processing that does NOT exist but the domain implies it should

1. **Payment reconciliation** — [MISSING]. There is no job that cross-checks Razorpay's payment/order records against this app's `orders` table to catch: payments that succeeded at Razorpay but where the `orders` insert failed (`order_saved:false` case, see `36_ERROR_HANDLING.md`), duplicate order rows from retried verify calls, or payments captured but never verified (e.g. browser closed after Razorpay success before the `handler` callback ran). This matters because it is the single highest financial-integrity risk in the system — money can move with no corresponding, or a corrupted, order record, and nothing ever notices or fixes it.
2. **Stock reservation / expiry** — [MISSING]. `product_variants.stock_quantity` exists (CHECK `>=0`) but no code path decrements it on order placement, nor reserves stock during checkout, nor releases a reservation on cart abandonment/payment failure. This matters because overselling is possible under concurrent checkouts, and stock counts likely drift from reality indefinitely.
3. **Payout processing** — [MISSING]. `payouts` table + status CHECK exist with no producer/consumer found anywhere. This matters because sellers have no automated path to actually get paid out in this codebase as reviewed — either the feature is unbuilt, or it lives entirely outside this repo (e.g. a manual admin/finance process), which should be confirmed before assuming payouts function at all.
4. **Orphan asset cleanup** — [MISSING]. Storage buckets `product-images`/`tryon-images` accumulate uploads (`SellerAddProduct.tsx`, `DashboardAddProduct.tsx`, `useVirtualTryOn.ts`) with no observed deletion logic when a product is deleted/rejected or a try-on session ends. This matters for storage cost growth and potential leakage of stale-but-still-public image URLs after a product is taken down.
5. **OTP cleanup on a schedule (vs. insert-triggered only)** — [MISSING]. `cleanup_expired_otps` only runs when a *new* OTP is inserted (reactive, per JOB-OTP-CLEANUP above); there is no time-based sweep, so if OTP request volume is low or bursty, expired rows can sit in the table for a long time (minor storage/PII-retention concern — `otp_verifications` likely stores `phone` in plaintext, extending its exposure window).
6. **Abandoned cart handling** — [MISSING]. Since cart state is entirely client-local (`CartContext`, no DB table — see 33 RULE-CART), there is no server-side concept of an "abandoned cart" at all, and therefore no recovery email/notification job is possible without first persisting carts server-side. This matters for revenue recovery, a standard e-commerce capability that is architecturally absent here.
7. **Search/index sync drift** (`sync-algolia`) — [MISSING scheduled trigger, see JOB-ALGOLIA-SYNC above]. This matters because product edits, deletions, and status changes (`live→disabled`, price changes, stock-outs) will not propagate to search results until someone manually re-runs the function, producing customer-facing inconsistencies (buyable-looking search results for products that are actually gone/changed).
8. **Discount usage-count reconciliation** — [MISSING, cross-ref 33/34]. `discounts.usage_count` is never incremented anywhere, so `usage_limit` enforcement (checked client-side against a number that never changes) is permanently ineffective after the first-ever check — a discount with `usage_limit:1` can be used unlimited times.
9. **Seller-application → seller-record promotion** — [MISSING, cross-ref 33 RULE-SELLER-APPLICATION-LEGACY]. Nothing automatically turns an approved `seller_applications`/`brand_waitlist_applications` row into a real `sellers` row — presumed to be a fully manual admin process happening outside any code path found in this repo.
