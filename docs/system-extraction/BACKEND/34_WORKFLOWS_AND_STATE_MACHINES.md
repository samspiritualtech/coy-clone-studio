# 34 — Workflows and State Machines

## seller_applications.status
```text
[pending] --admin UPDATE--> [approved]
   |                \--admin UPDATE--> [rejected]
```
States: `pending`(default) → `approved`|`rejected`. No CHECK constraint found on this column (unlike `sellers.application_status`) — value is free text at DB level; only app-layer (Admin UI) writes it. Actor: admin only (RLS UPDATE gated by `has_role admin`). No side effects/triggers on this table's status (distinct from `sellers.application_status`, which does trigger role grant). No rollback/timeout. Manual only. [CONFIRMED schema+RLS / INFERRED absence of CHECK constraint since not listed in `db.txt "=== CONSTRAINTS ==="`]

## sellers.application_status / is_verified / is_active
```text
[pending] --admin sets 'approved'--> [approved]  == triggers handle_seller_approval -> INSERT user_roles('seller')
[pending] --admin sets 'rejected'--> [rejected]
[approved] --admin sets 'pending'/'rejected'--> (role NOT revoked; MISSING)
```
CHECK: `application_status IN ('pending','approved','rejected')` (DB-enforced). `is_verified`/`is_active` are independent booleans (default `false`/`true`) with no observed constraint linking them to `application_status` — e.g. a `pending` seller could have `is_active=true` (default) and appear live if any UI reads `is_active` without also checking `application_status`. [INFERRED gap — not independently tested against actual UI queries]. Actor: admin (`ALL` policy) or seller (`UPDATE own` policy — a seller could in principle update their own `application_status` back to `approved` if RLS doesn't restrict which columns UPDATE can touch; Postgres RLS is row-level not column-level, so **a seller's own "Sellers can update own profile" UPDATE policy has no column restriction, meaning a seller could set their own `application_status` directly to `'approved'` without admin involvement**, self-granting eligibility for the trigger to fire and insert their own `seller` role). [SECURITY-SENSITIVE — HIGH, CONFIRMED via RLS policy inspection: `sellers` UPDATE policy `qual: auth.uid()=user_id`, no `with_check` restricting columns] Trigger side effect: `handle_seller_approval` (`pending→approved` or `rejected→approved` edge) inserts `user_roles(user_id,'seller')` idempotently. Downgrade transitions have no reverse trigger — role persists. Timeout: none. DB-enforced value set; DB-enforced side effect (role grant); **actor restriction (admin-only) is NOT DB-enforced** — this is the most significant state-machine gap found.

## products.status
```text
        (seller insert)                (seller/admin UPDATE - no transition guard)
[draft] ------------------> [draft] <--------------------------------------+
   |  (seller/admin UPDATE, any value in set)                              |
   +--> [submitted] --> [under_review] --> [live] --> [disabled]           |
   |         |                 |              |            |              |
   |         +--> [rejected] <-+              +------------+--------------+
   |                                            (any->any transition
   |                                             actually permitted by DB)
```
CHECK: `status IN ('draft','submitted','under_review','live','rejected','disabled')`. No transition-guard trigger exists — **any actor with row UPDATE rights (seller-owner or admin) can set the column to any of the six values in one step**, e.g. `draft→live` directly, or `live→draft` (silently de-listing a live product without going through `disabled`). Visibility consequence (`status='live' AND is_available=true`) is enforced separately by RLS SELECT policy, not by this state machine. Actor: seller (own row, no value restriction) or admin (`ALL`). Trigger: none. Rollback: none (direct overwrite). Timeout: none (no auto-expiry of `submitted`/`under_review`). Enforcement: value-set DB-enforced (CHECK); transition/actor-per-value NOT DB-enforced — app-code convention only (not verified that seller UI ever exposes a `status` selector reaching `live` — if it doesn't, the gap is theoretical but the DB permits it either way). [CONFIRMED constraint; INFERRED risk from absence of transition trigger, cross-ref RULE-PRODUCT-STATUS-LIFECYCLE in 33]

## orders.status (+ timestamp columns)
```text
[new] --seller UPDATE--> [accepted] (sets accepted_at)
                 [accepted] --> [packed] (packed_at)
                       [packed] --> [shipped] (shipped_at)
                             [shipped] --> [delivered] (delivered_at)
[new|accepted|packed] --> [cancelled] (cancelled_at)   (shipped/delivered->cancelled not blocked by DB)
```
CHECK: `status IN ('new','accepted','packed','shipped','delivered','cancelled')`. Timestamp columns (`accepted_at, packed_at, shipped_at, delivered_at, cancelled_at`) are nullable and **not automatically populated by any trigger found** (no `pg_proc` function sets them) — they must be set by application code alongside the `status` UPDATE (seller dashboard `SellerOrders.tsx`, not independently line-audited in this pass for whether it actually sets the matching timestamp on each transition — [UNKNOWN/INFERRED, could not confirm the app code populates these columns atomically with status]). No DB CHECK enforces monotonic timestamp ordering or that `status` and the "latest" timestamp column stay consistent (e.g. nothing stops `status='delivered'` with `shipped_at IS NULL`). Actor: seller (`UPDATE` where `seller_id IN own sellers.id` — but see RULE-ORDER-SELLER-FALLBACK in 33: orders created via `razorpay-verify-payment` have `seller_id=customer_id`, so in practice **no real seller can ever match and transition these orders** — a functional dead-end in the state machine as currently wired). No transition-order guard — DB permits `new→delivered` in one UPDATE, or `new→cancelled` after `shipped`. Enforcement: value-set DB-enforced; sequencing/timestamp-consistency NOT DB-enforced.

## discounts.status
```text
[active] --seller UPDATE--> [inactive/expired/other free-text value]
```
Column is free text, no CHECK constraint found (unlike `orders`/`products`/`sellers`). RLS "Anyone can view active discounts" additionally requires `end_date IS NULL OR end_date > now()`, so a discount can become practically inactive purely by date passing without any status write at all — i.e. there are two independent "inactive" mechanisms (`status` column and `end_date` expiry) that are not reconciled by any trigger (an expired-by-date discount keeps `status='active'` forever unless a seller manually changes it). `usage_count`/`usage_limit` similarly are never auto-updated (see 33 RULE-PRICING-DISCOUNT) — the "used up" state is unreachable in practice. [CONFIRMED absence of constraint/trigger; MISSING lifecycle automation]

## payouts.status
```text
[pending] -> [processing] -> [completed]
    \-> [failed]
```
CHECK: `status IN ('pending','processing','completed','failed')`. No app code, edge function, or trigger writing to `payouts` was found anywhere in the reviewed grep of `src/**`/`supabase/functions/**` — the table and its state machine exist in the schema but appear to have **no implemented producer/consumer** in this codebase. [MISSING — see `35_BACKGROUND_JOBS.md` payout-processing register entry]

## support_tickets.status
```text
[open] -> [in_progress] -> [resolved]
```
CHECK: `status IN ('open','in_progress','resolved')`. No UI/edge-function write path found in reviewed grep — likely admin-only tooling not captured in the routes/code extract. [UNKNOWN — table exists, workflow driver not located]

## otp_verifications.verified / attempts
```text
[unverified, attempts=0] --wrong OTP--> [unverified, attempts+1] (up to 5)
        |                                        |
        | correct OTP + session created          | attempts>=5 or expired
        v                                        v
   [verified=true]                          [row DELETED]
```
Enforcement is entirely inside `verify-otp`'s procedural code (service role), not DB triggers/constraints (no CHECK on `attempts`/`verified` found). Deletion-on-exhaustion/expiry is a manual `DELETE` call in the function, not a scheduled job (see 35). Timeout: 5-minute `expires_at`, checked lazily on next verify attempt only — an expired-but-unverified row is not proactively cleaned until either (a) someone tries to verify with that phone again, or (b) the unrelated `cleanup_expired_otps` trigger fires (see below). Automatic vs manual: the *expiry check* is automatic (time-based comparison) but *cleanup* is reactive/manual (only on next relevant DB operation), not a true background sweep — see 35 for the mechanism gap.

## profiles.is_onboarded
```text
[false] (set by handle_new_user on signup) --user completes /onboarding--> [true]
```
Trigger-set default (`handle_new_user`, always `false` on first insert regardless of signup method). Transition to `true` presumed to happen in `src/pages/Onboarding.tsx` (route `/onboarding`, `ProtectedRoute`) via a direct `profiles` UPDATE — not independently line-audited in this pass. [INFERRED — component exists, exact write not re-confirmed]. No DB trigger reverses `is_onboarded` back to `false`. No timeout/expiry.

## Virtual try-on job lifecycle (not a DB-tracked state machine — in-memory/HTTP only)
```text
[idle] --user submits photos--> [queued] (Gradio queue/join)
   [queued] --SSE process_starts--> [processing]
       [processing] --process_completed success--> [done] (base64 image returned)
       [processing] --process_completed failure / quota / queue_full--> [loading=true] (client retries)
       [processing] --90s timeout (AbortError)--> [loading=true] (client retries)
```
This state machine exists only for the duration of a single edge-function invocation (no DB row tracks in-progress try-on jobs); persistence only happens post-hoc on success via a client-side `tryon_history` insert — a failed/abandoned job leaves **no DB trace at all** (not even a "failed" `tryon_history` row), so there's no way to audit failed generations or their volume. [CONFIRMED absence of a persisted job table; behavior inferred from `virtual-tryon/index.ts` control flow]

## brand_waitlist_applications
```text
[submitted] (terminal — no status column at all)
```
Table has no `status` column (unlike `seller_applications`) — it is a pure append-only submission log, readable only by admins, with no observed downstream promotion into `sellers`/`seller_applications`. [CONFIRMED via schema — no status column present]

---

### Enforcement legend applied above
- **DB-enforced value set**: `products`, `orders`, `sellers.application_status`, `payouts`, `support_tickets`, `user_addresses.address_type` all have CHECK constraints restricting allowed values.
- **NOT DB-enforced (app-code/RLS-ownership only)**: transition *sequencing* for every one of the above state machines; **actor-role restriction for `sellers.application_status` writes is the most severe gap** (a seller can self-approve, per RLS column-blindness noted above); `discounts.status`/`seller_applications.status` have no CHECK at all.
