# 54 — Data Privacy

## 1. PII Inventory

| Table.column | PII type | Who can read (RLS) | Retention/Deletion |
|---|---|---|---|
| profiles.name/email/phone/avatar_url/city/state/country/pincode/lat/lng | Identity + precise location | Owner only (`auth.uid()=id`); **no admin SELECT policy** [MISSING] | No deletion/retention logic found (no cron/edge function purges profiles). [MISSING] |
| user_addresses.full_name/mobile/pincode/address_line/city/state/landmark | Full postal address + phone | Owner only | No retention policy; addresses persist indefinitely, no soft-delete/anonymization on account deletion (no account-deletion flow found at all). [MISSING] |
| seller_applications.full_name/email/phone/city/portfolio_link/sample_images | Applicant identity/contact | Admin (SELECT), applicant cannot read own submission (no owner-SELECT policy) — applicants cannot see status of their own application via API without an admin) [OBSERVED anomaly] | No retention/deletion policy. [MISSING] |
| brand_waitlist_applications.brand_name/phone/handle_or_website/city | Contact info | Admin only (SELECT); submitter cannot re-read | No retention/deletion. [MISSING] |
| sellers.gstin/pan_number/bank_account_number/bank_ifsc/bank_name | **Financial/government ID (highly sensitive)** | Owner (seller) SELECT/UPDATE own; Admin ALL | Stored in plaintext columns (no encryption-at-rest abstraction visible beyond Postgres default); no masking on read (owner sees full PAN/account number back on every SELECT *). No retention policy. [SECURITY-SENSITIVE][MISSING retention] |
| otp_verifications.phone/otp_hash/attempts | Phone number + hashed OTP | No RLS policy found in dump (table likely has RLS disabled or is service-role-only, matching it being written exclusively via edge functions with service role) — **[UNKNOWN]** whether RLS is enabled on this table at all; if RLS is off and no policy restricts it, and if it were ever reachable via anon key, phone numbers would be exposed. Needs confirmation via `RLS ENABLED` dump (table not listed in the truncated section captured). [UNKNOWN — flag for follow-up] | OTP rows are deleted on: expiry-detected read, max-attempts exceeded, and on issuing a new OTP for the same phone (`send-otp` deletes prior unverified rows). No general TTL/cron sweep of stale rows. |
| orders.shipping_address (jsonb: full_name, mobile, address_line, city, state, pincode, landmark) | Full name + phone + postal address, denormalized per order | Customer (own), Seller (their orders) | No redaction/retention; permanent copy independent of `user_addresses` lifecycle (i.e., deleting an address does not touch historical orders — acceptable for order history, but no documented retention/deletion policy exists for old orders either). [MISSING] |
| tryon_history.model_image_url/product_image_url/result_image_url | User-uploaded photos (potentially biometric/likeness data — a person's photo used for virtual try-on) | Owner (`auth.uid()=user_id`) SELECT/INSERT/DELETE | User can self-delete rows; underlying Storage objects in `tryon-images` bucket are **publicly readable** (`Public can view try-on images` policy) regardless of the `tryon_history` row's RLS — i.e., **the row metadata is private but the actual image file is publicly fetchable by anyone who knows/guesses the URL**. [SECURITY-SENSITIVE] Images uploaded by guests (`user_id=null`) cannot be deleted by the "owner" at all (no identity to match), effectively **undeletable PII images**. [MISSING deletion path for guest images] |

## 2. Consent & Legal Copy

- **[OBSERVED]** Routes exist for `/privacy` (`PrivacyPolicy.tsx`) and `/terms` (`TermsOfUse.tsx`) (`CustomerApp.tsx:63-64`) — presence confirmed via routing; content not reviewed in this pass. **[UNKNOWN]** whether the policy text accurately reflects actual third-party sharing (Algolia, Make.com, Replicate/Lovable AI, Pinterest, Razorpay) enumerated below.
- **[MISSING]** No cookie-consent banner or explicit consent capture mechanism found in routes/components inventory.
- **[MISSING]** No visible "download my data" / "delete my account" self-service flow in any reviewed route.

## 3. Third-party data sharing

| Third party | Data shared | Mechanism | Governance observed |
|---|---|---|---|
| Razorpay | Customer email, mobile, order amount, order items | `razorpay-create-order`/`razorpay-verify-payment` edge functions, server-to-server | Necessary for payment processing; standard PCI-scope offload (card data never touches OGURA servers — Razorpay Checkout.js handles card entry) |
| Algolia | Product catalog (and possibly other indexed fields) via `sync-algolia`; customer-side search queries go directly from browser to Algolia using client search key (typical react-instantsearch pattern) | Edge function push (admin key) + client-side search calls | **[UNKNOWN]** whether any customer PII is inadvertently included in indexed records; not verified from `sync-algolia` body (not fully read) |
| Replicate / Lovable AI Gateway (`LOVABLE_API_KEY`) | Uploaded try-on images (`model_image_url`, `product_image_url`), possibly containing a user's photo/likeness, sent to `virtual-tryon`/`image-analysis` functions for processing | Edge function → external AI API | No consent capture specific to AI image processing beyond assumed generic ToS/Privacy Policy coverage — **[MISSING]** explicit AI-processing disclosure not confirmed in reviewed code |
| Pinterest | OAuth authorization code + client secret exchanged server-side; likely publishes/reads Pinterest account data for seller marketing features | `pinterest-token-exchange` function | Standard OAuth pattern |
| Make.com | Social post content pushed via `social-post-webhook`/`socialPostService.ts` | Outbound webhook, `MAKE_WEBHOOK_URL` | No signing/verification observed on the outbound or inbound path |

## 4. Cross-border processing

- **[INFERRED]** Supabase project (`project_id` in `config.toml`) region not determined from code; Razorpay is India-focused (amounts in INR, Indian phone/pincode formats hardcoded), suggesting primary user base is India, but Supabase/Algolia/Replicate/Lovable AI Gateway infrastructure region is **[UNKNOWN]** and could process Indian PII (including bank/GST/PAN data) outside India with no documented data-residency control in code.

## 5. Privacy gaps summary

1. **[MISSING]** No account/data deletion flow anywhere in the app for `profiles`, `user_addresses`, `orders`, `sellers` financial fields, or `tryon_history` (guest images especially — undeletable).
2. **[SECURITY-SENSITIVE]** `tryon-images` and `product-images` storage buckets are fully public-read; any URL leak (log, referrer, share) exposes a user's uploaded photo permanently, with no expiry.
3. **[SECURITY-SENSITIVE]** Seller bank/GST/PAN data stored in plaintext relational columns, readable in full by the seller themselves on every fetch (no server-side masking such as showing only last 4 digits).
4. **[MISSING]** No retention policy/expiry on `otp_verifications`, `seller_applications`, `brand_waitlist_applications` — indefinite retention of contact PII for people who may never become customers/sellers.
5. **[MISSING]** No documented/implemented consent capture for AI image processing of user photos.
6. No admin SELECT policy on `profiles` or `orders` broadly — while this *limits* exposure (good for privacy), it also means the admin panel (`AdminApp.tsx` — `AdminSellers`, `AdminProducts`, etc.) likely relies on service-role edge functions or Supabase dashboard access for any customer-order support, a path not captured/audited in these docs. **[UNKNOWN — needs check of Admin* pages' data access method]**.
