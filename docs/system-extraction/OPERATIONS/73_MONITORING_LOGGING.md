# 73 — Monitoring & Logging

## What logging exists
- **Edge functions**: every function uses `console.log`/`console.error` (counts per function, from a direct grep of `supabase/functions/*/index.ts`):
  - `virtual-tryon`: 11 (most verbose — logs request receipt, SSE messages, image URLs (truncated to 80 chars), success/failure).
  - `image-analysis`: 7.
  - `generate-banner-image`, `verify-otp`, `social-post-webhook`: 5 each.
  - `ai-recommendations`: 5.
  - `sync-algolia`, `razorpay-verify-payment`, `pinterest-token-exchange`: 4 each.
  - `ip-geolocation`, `send-otp`: 3–4.
  - `razorpay-create-order`: 2.
  - `pincode-lookup`: 1.
  - These are only visible via Supabase's Function Logs UI/CLI (`supabase functions logs`), not aggregated into any external log sink (no Logtail/Datadog/CloudWatch export configured).
- **Frontend**: scattered `console.log`/`console.error` in hooks like `useVirtualTryOn.ts` (upload metadata, edge-function request/response echoing) — visible only in the end-user's browser devtools, never transmitted to any server-side error tracker.
- **Supabase platform logs**: Postgres/Auth/Storage logs exist at the platform level (standard Supabase project logging) but nothing in this repo configures alerting or export from them.

## Risk of logging sensitive data [SECURITY-SENSITIVE]
- `supabase/functions/send-otp/index.ts:94`: `console.log(`OTP for +91${phone}: ${otp}`);` — **logs the plaintext OTP and the user's phone number together, server-side, on every OTP send.** Combined with the `demoOtp` field also being returned in the API response (see `63_EMAIL_WHATSAPP_SMS.md`), this makes the OTP fully visible both in logs and in the network response — a genuine, current secret-exposure pattern, not just a hypothetical.
- `useVirtualTryOn.ts` logs image URLs (truncated to 80 chars) and file metadata (`name, size, type`) — low sensitivity, but uploaded human photos' storage URLs are logged client-side, which is at least visible to anyone with devtools access on that browser session (not a server-side leak).
- `razorpay-verify-payment/index.ts` logs `console.error('Failed to save order:', orderError)` and `console.error('Payment verification error:', error)` — Supabase/Postgres error objects can include partial row data/constraint details; not confirmed to include full card/payment data (Razorpay itself never sends raw card data to this backend, so this risk is lower than the OTP case) but the **full `order_data` payload is never logged**, which is good practice, though also means failures are hard to debug without reproducing.
- No log redaction/scrubbing utility exists anywhere in the codebase — logging hygiene is ad hoc per function.

## Alerting
[MISSING] — no alerting system (PagerDuty, Slack webhook-on-error, email-on-failure) is wired to any of: payment verification failures, the `order_saved:false` partial-payment-state (`61_PAYMENT.md`), AI Gateway 429/402 responses, or Make.com webhook delivery failures. All of these currently fail silently from an operations standpoint — a human would only learn about them by manually reading Supabase function logs or via a customer complaint.

## Observability gaps (summary)
1. No error-tracking SDK (Sentry/Bugsnag) on frontend or edge functions.
2. No structured logging (all logs are ad hoc string interpolation, not JSON, making log-based querying/aggregation difficult even if exported).
3. No metrics/dashboards for payment success rate, AI feature latency/error rate, or OTP delivery (moot, since OTP "delivery" is simulated).
4. No uptime/synthetic monitoring for the external "Seller Center" API dependency (`pyesltzkemtranachpne.supabase.co`) — if that project goes down, four customer-facing pages fail with no proactive alert.
5. No audit log for admin/seller privileged actions (approvals, product edits, discount creation) beyond whatever `updated_at` timestamps exist implicitly in each table.
