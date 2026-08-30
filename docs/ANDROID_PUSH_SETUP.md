# OGURA Android Push Notifications — Setup & Handoff

Everything server-side and web-side is already implemented in this repo. The steps
below are the parts that must run on your own machine (Android Studio / Firebase),
because Lovable cannot build native binaries.

## What already exists

| Piece | Where |
|---|---|
| Firebase connection (service account held server-side) | Lovable connector `firebase_messaging`, project `ogura-9f141` |
| `collections`, `device_tokens`, `notifications` tables + RLS | database |
| Token registration API | `supabase/functions/register-device-token` |
| Push sender (admin-only, invalid-token cleanup) | `supabase/functions/send-collection-notification` |
| Admin UI (create collection, Publish & notify, history) | `/admin/collections` |
| Collection landing page (deep-link target) | `/collection/:slug` |
| Native registration, token refresh, tap-to-navigate | `src/hooks/usePushNotifications.ts` |
| Permission opt-in card (Android 13+ runtime prompt) | Profile page → Notifications |
| Capacitor config | `capacitor.config.ts` |

No Firebase private key exists anywhere in the frontend bundle. The edge function
sends through the Lovable Firebase gateway using server-only environment values.

## 1. Export and install

1. Push this project to your GitHub repo (Export to GitHub), then `git pull` locally.
2. `npm install`

## 2. Add the Android platform

```bash
npx cap add android
npx cap update android
npm run build
npx cap sync
```

## 3. Register the app in Firebase

1. In the Firebase console open project **ogura-9f141** → *Add app* → **Android**.
2. Package name must match `capacitor.config.ts` → `appId`:
   `app.lovable.d42693406a04445b9b9ca83ba6ae72f8`
   (If you prefer a real package id such as `in.ogura.app`, change `appId` in
   `capacitor.config.ts` **before** `npx cap add android` and use the same value here.)
3. Download **`google-services.json`** and place it at `android/app/google-services.json`.
4. Confirm `android/build.gradle` has the Google services classpath and
   `android/app/build.gradle` applies the plugin — Capacitor 8 adds both when the
   push plugin is present; if missing, add:

   ```gradle
   // android/build.gradle → buildscript.dependencies
   classpath 'com.google.gms:google-services:4.4.2'

   // android/app/build.gradle → bottom of file
   apply plugin: 'com.google.gms.google-services'
   ```

## 4. Manifest permission (Android 13+)

Add to `android/app/src/main/AndroidManifest.xml` inside `<manifest>`:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

The runtime prompt itself is already handled in JS (`PushNotifications.requestPermissions()`),
triggered from the *Enable notifications* button on the Profile page.

Optional — default icon/colour for the tray notification, inside `<application>`:

```xml
<meta-data android:name="com.google.firebase.messaging.default_notification_icon"
           android:resource="@mipmap/ic_launcher" />
<meta-data android:name="com.google.firebase.messaging.default_notification_channel_id"
           android:value="ogura_collections" />
```

The `ogura_collections` channel is created from JS on first opt-in.

## 5. Run it

```bash
npx cap run android
```

Sign in inside the app → Profile → **Enable notifications**. The token is posted to
`register-device-token` and appears in the admin device count.

## 6. Send a real push

1. Open `https://ogura.in/admin/collections` (admin role required).
2. Create a collection (title, description, cover image URL).
3. Press **Publish & notify**.

Payload delivered:

```json
{
  "notification": { "title": "New Collection is Live ✨",
                    "body": "Discover OGURA's latest collection now." },
  "data": { "path": "/collection/<slug>", "type": "new_collection" },
  "android": { "priority": "HIGH", "notification": { "channel_id": "ogura_collections" } }
}
```

Because `notification` is present, Android's system tray shows it even when the app
is backgrounded or fully closed. Tapping it launches the app and
`pushNotificationActionPerformed` routes to `/collection/<slug>`.

## Behaviour notes

- **Multiple devices per user:** `device_tokens` is keyed by token, so each phone gets
  its own row and all of them receive the push.
- **Token refresh:** FCM re-fires the `registration` listener; the row is upserted on
  the token, and the previously cached token is deactivated.
- **Invalid/expired tokens:** a `404 UNREGISTERED` or `400 INVALID_ARGUMENT` from FCM
  flips `is_active` to `false`; those rows are skipped on the next send.
- **Web build:** all push code is behind `Capacitor.isNativePlatform()`, so the website,
  auth, Razorpay and every existing flow are unchanged.
- **After any code change:** `git pull`, `npm run build`, `npx cap sync`.

## Live-reload vs store build

`capacitor.config.ts` currently points `server.url` at the Lovable sandbox for
hot-reload during development. **Remove the whole `server` block before building a
release APK/AAB** so the app loads the bundled `dist` assets instead.
