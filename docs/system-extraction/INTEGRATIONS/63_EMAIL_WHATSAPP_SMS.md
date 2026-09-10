# 63 — Email / WhatsApp / SMS Messaging Surfaces

## OTP (SMS) — `send-otp` / `verify-otp`
- **Provider used**: [CONFIRMED] **none — simulated.** `supabase/functions/send-otp/index.ts:94-104` generates a 6-digit OTP, hashes it (SHA-256 of `otp+phone`), stores it in `otp_verifications`, and **returns the plaintext OTP directly in the API response** as `demoOtp: otp`, with an explicit code comment: `// In production, integrate with SMS provider here: // await sendSMS(phone, ...)`. **No SMS is ever actually sent.** [SECURITY-SENSITIVE — CRITICAL: any client calling this endpoint receives the valid OTP in the JSON response, making phone-number "verification" not a proof of phone possession at all.]
- Rate limiting: 60-second cooldown between requests per phone (checked via `otp_verifications` table).
- Verification (`verify-otp/index.ts`): SHA-256 hash comparison, 5-minute expiry, max 5 attempts before forcing a new OTP. On success, creates/looks up a Supabase Auth user keyed by a synthetic email `${phone}@ogura.phone.auth`, and signs them in via a one-time `generateLink({type:'magiclink'})` + `verifyOtp({type:'magiclink'})` exchange — a real Supabase session is issued despite no real SMS delivery ever having occurred.
- **CRITICALITY**: hard dependency for the phone-login flow as coded, but is a stub/demo implementation, not production SMS delivery. [MISSING] any real SMS provider (Twilio/MSG91/etc.).

## WhatsApp deep links (`wa.me`)
All are `https://wa.me/...` links opened via `window.open`/`<a href>` — no WhatsApp Business API integration, just prefilled-chat links:
- `src/pages/Stores.tsx:62` — `https://wa.me/${store.whatsapp}` (per-store number from `src/data/stores.ts`, e.g. `+919876543210`), no prefilled text.
- `src/pages/BrandWaitlist.tsx:451,468` — `https://wa.me/917742698970?text=${encodeURIComponent("Hi Ogura, I'd like to join the Seller Program.")}`.
- `src/components/SocialShareButtons.tsx:20` — generic share link `https://wa.me/?text=...` (opens WhatsApp with no fixed recipient, standard share-to-WhatsApp pattern).
- `src/components/waitlist/WaitlistForm.tsx:58-60` — `whatsappHref()` builds `https://wa.me/${WHATSAPP_NUMBER}?text=...` (constant not shown in this pass; likely same `+91 77426 98970` seller-program number).

## Mailto links
- `brands@ogura.in` — `src/pages/Contact.tsx:52,80` (prefilled subject/body from a contact form's fields).
- `careers@ogura.in`: **not found under this exact address** — instead `src/pages/Careers.tsx:589,652,835` uses a `CAREERS_EMAIL` constant (value not resolved in this pass; verify it equals `careers@ogura.in` before relying on this in other docs) [UNKNOWN — constant value not directly viewed].
- `foundercares@ogura.in` — `src/pages/PrivacyPolicy.tsx:57,73` (privacy contact, not brands/careers as the task brief assumed) [CONFLICT with brief's assumed address list — an additional address, `foundercares@ogura.in`, exists that wasn't in the brief].
- Per-designer `mailto:${designer.email}` — `src/pages/DesignerProfilePage.tsx:151`, `src/pages/DesignerDetail.tsx:125` (dynamic, from designer records, not a fixed OGURA address).
- Generic share mailto — `src/components/SocialShareButtons.tsx:38`.

## Make.com social posting
See `61_INTEGRATIONS.md` §9 / `socialPostService.ts` for full detail. Two event types trigger it: `custom_design_created`, `custom_order_confirmed`, both fired from Made-to-Order design flows, both fire-and-forget with no retry.

## Transactional email
[MISSING] — no email-sending provider (Resend/SendGrid/Postmark/SES/Supabase built-in SMTP) integration was found anywhere in `supabase/functions/` or `src/`. Order confirmations, shipping notifications, password resets (beyond Supabase Auth's own default email templates, which are platform-managed and not customized in this repo) all appear to have **no custom transactional email**.

## Notification templates
[MISSING] — no notification-template table or templating system exists. The only "template-like" text found is the hardcoded OTP log line `` `OTP for +91${phone}: ${otp}` `` (server console only, never emailed/texted) and the Make.com social payload field mapping (not a message template per se, just a data payload for an external automation to format).
