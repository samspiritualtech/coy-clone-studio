

# Restore /join as Full Landing Page with Embedded Auth + Application Flow

## Overview
Rebuild `/join` from a simple login card into a single-page flow: Hero → Auth (hidden until "Apply" clicked) → Application Form (shown after login). All on one page with smooth transitions.

## Architecture

The page manages a `step` state machine:
1. **hero** — Landing hero visible, auth/form hidden
2. **auth** — Auth section revealed (scroll down), for unauthenticated users
3. **apply** — Application form shown, for authenticated users

```text
User lands → Hero section
  ↓ clicks "Apply to Join Ogura"
  ├─ NOT logged in → step="auth" (show login/signup tabs, scroll to them)
  └─ IS logged in  → step="apply" (show application form, scroll to it)
After login success → step="apply" (swap auth for form)
After form submit  → success message → redirect to /seller/dashboard
```

## Changes

### 1. Rewrite `src/pages/JoinUs.tsx`
- **Hero section**: Full-width hero with "Join Ogura as an Independent Fashion Designer" heading, descriptive subtext, and "Apply to Join Ogura" CTA button
- **Auth section**: Hidden by default (`step !== "auth"`). Contains Google sign-in + Login/Signup tabs with email/password. Uses existing `useAuth` context. On successful auth, transitions to `step="apply"`
- **Application section**: Hidden by default (`step !== "apply"`). Embeds the same form logic currently in `SellerApply.tsx` (name, brand, email, phone, city, category, portfolio, sample images). On submit, shows success and redirects to `/seller/dashboard`
- **Auto-detect**: If user is already authenticated on mount, clicking Apply goes directly to form
- **Smooth scroll**: Use `scrollIntoView({ behavior: 'smooth' })` via refs when transitioning steps
- Include `JourneyTimeline` component between hero and auth/form sections for context
- Use `LuxuryHeader` and `LuxuryFooter` for consistent page framing

### 2. No other file changes needed
- `SellerAuthRoute`, routing in `SellerApp.tsx`, and dashboard remain untouched
- `SellerApply.tsx` stays as a standalone fallback page (no changes)

## Files
- **Rewrite**: `src/pages/JoinUs.tsx`

