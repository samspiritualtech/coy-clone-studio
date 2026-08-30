# Native Android Push Notifications for New Collections

## What exists today (verified)

- The site is a React/Vite web app with Lovable Cloud (Supabase) backend: auth, `profiles`, `user_roles` (consumer/seller/admin with `has_role`), products, orders, Razorpay edge functions.
- Admin panel exists at `/admin` with dashboard, approvals, products, sellers, settings — protected by an admin role guard.
- There is a customer-facing Collections page, but there is **no** collections table in the database and no admin screen to publish a collection.
- The project has **no Capacitor setup** (no `capacitor.config.ts`, no `android/` folder) and no push/FCM code anywhere.

So everything for push is new work; nothing existing gets replaced.

## What needs to be added

1. **Firebase connection** — connect Firebase Cloud Messaging so the server can send pushes without any private key living in code or in the app bundle.
2. **Database (3 new tables)**
   - `collections` — title, slug, description, cover image, status (draft/published), published_at. Public can read published ones; only admins create/edit/publish.
   - `device_tokens` — one row per device per user: FCM token, platform, last_seen, active flag. Each user can have many devices; a user only sees/manages their own tokens.
   - `notifications` — a record of every notification sent: title, body, deep-link path, related collection, sent/failure counts, timestamp. Admin-readable.
3. **Edge functions (server-side, credentials stay server-side)**
   - `register-device-token` — authenticated; upserts the caller's token so refreshes replace the old row instead of duplicating.
   - `send-collection-notification` — admin-only; loads active tokens, sends through Firebase, writes the `notifications` record, and deactivates tokens Firebase reports as unregistered/invalid.
4. **Admin UI** — a new "Collections" page in the admin panel: list collections, create one (title, description, cover image), and a **Publish** action that publishes and fires the push. Plus a small history of notifications sent.
5. **Customer UI** — a collection detail route (`/collections/:slug`) that the notification opens, and a notification-permission prompt for logged-in users on the Android app.
6. **Capacitor Android app** — add Capacitor + the Push Notifications plugin, configure the app id/name, register for push on login, handle token refresh, handle notification taps to navigate to the collection, and request the Android 13+ POST_NOTIFICATIONS permission at runtime.

## Deep link behaviour

Notification payload carries `path: /collections/<slug>`. On tap, the app reads that value and routes to the collection page. If the app was closed, the same handler runs after launch so the user still lands on the collection.

## Technical notes

- Sending goes through the Lovable Firebase gateway from the edge function using the project key + connection key read from server env; the Firebase service account is never in frontend code and never pasted into chat.
- Tokens are sent one message per token; a 404 UNREGISTERED or 400 INVALID_ARGUMENT response marks that row inactive rather than being retried.
- `device_tokens` and `notifications` get row-level security plus grants; token rows are scoped to `auth.uid()`, notification history to admins.
- Web stays unchanged: push code is guarded by a native-platform check, so the browser build behaves exactly as it does now. Razorpay, auth, existing tables and functions are untouched.
- Android build steps (Firebase `google-services.json`, `npx cap sync`, running on a device) will be provided as instructions — those run on your machine, not in Lovable.

## Order of work

1. Connect Firebase Cloud Messaging.
2. Migration for the three tables + policies.
3. Edge functions for token registration and sending.
4. Admin Collections page + publish action; collection detail page.
5. Capacitor setup, push registration hook, permission handling, tap navigation.
6. Android handoff instructions.
