

# Add Login/Signup Auth Modal to Join Page

## What Changes
Add "Login" and "Signup" buttons next to the existing "Apply to Join Ogura" CTA, and a Dialog modal with email/password + Google sign-in. No visual, text, or layout changes to the existing page.

## Changes

### 1. Modify `src/pages/JoinUs.tsx`
- Import `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `Input`, `Label`, `GoogleSignInButton`, `useAuth`, `useNavigate`, and `useState`
- Add two buttons ("Login" and "Signup") below the existing "Apply to Join Ogura" button, styled with `variant="outline"` and matching `size="lg"` to blend in
- Add a `Dialog` that opens when either button is clicked, with a `mode` state (`"login"` | `"signup"`) controlling the title and submit action
- Modal contents: Email input, Password input, submit button, `GoogleSignInButton`, and a toggle link to switch between login/signup modes
- On successful auth: `navigate("/seller/dashboard")`
- Add `useEffect` to redirect to `/seller/dashboard` if already authenticated

### 2. No other files change
The seller dashboard is already protected by `SellerAuthRoute` in `SellerApp.tsx`. No routing or layout changes needed.

## Files
- **Modify**: `src/pages/JoinUs.tsx`

