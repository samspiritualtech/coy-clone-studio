

# Enhance Join Page Auth Modal — Email OTP + Google Fix

## Changes

### 1. Modify `src/pages/JoinUs.tsx`
Replace password-based auth with email OTP flow using Supabase's built-in `signInWithOtp` and `verifyOtp`:

- **Remove** password state and field
- **Add** `otpSent` boolean state and `otp` string state
- **Step 1**: User enters email, clicks "Send OTP" → calls `supabase.auth.signInWithOtp({ email })` (works for both new and existing users)
- **Step 2**: Show 6-digit OTP input field + "Verify OTP" button → calls `supabase.auth.verifyOtp({ email, token: otp, type: 'email' })`
- On success: toast, close modal, redirect to `/seller/dashboard`
- Add "Back" / "Change email" link to go back to email entry step
- Remove the login/signup mode toggle (OTP handles both cases seamlessly — single "Continue with Email" flow)

### 2. Google Sign-In already works
The `GoogleSignInButton` uses `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })` which is correct for Lovable Cloud managed OAuth. No changes needed.

### 3. No other files change
- `AuthContext` `onAuthStateChange` listener will pick up the new session from OTP verification automatically
- `SellerAuthRoute` protection remains intact

## UI (kept identical)
- Same Dialog, same styling, same spacing
- Email input stays the same
- Password field replaced with: "Send OTP" button → then OTP input + "Verify" button
- Google sign-in button stays below the divider
- Modal title changes to just "Sign in to Ogura" (no login/signup distinction needed)

## File
- **Modify**: `src/pages/JoinUs.tsx`

