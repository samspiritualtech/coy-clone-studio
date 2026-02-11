

# Plan: Improve OAuth Error Handling

## Context

This project uses **Lovable Cloud managed Google OAuth**, which automatically handles:
- Site URL configuration
- Redirect URL allowlisting
- Google OAuth callback URLs

No manual Supabase or Google Console configuration is needed. The `redirect_uri: window.location.origin` in `AuthContext.tsx` already dynamically adapts to whatever domain the app runs on (localhost, preview, or production).

## What This Plan Addresses

Better error detection and user-facing messages when OAuth fails, including redirect URI mismatches.

---

## Changes

### 1. Improve Error Handling in AuthContext (`src/contexts/AuthContext.tsx`)

Update `signInWithGoogle` to:
- Parse specific error types (redirect_uri_mismatch, access_denied, etc.)
- Provide user-friendly error messages for each case
- Log detailed error info to console for debugging

```typescript
const signInWithGoogle = async () => {
  try {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
      const errorMsg = result.error.message || '';
      
      if (errorMsg.includes('redirect_uri_mismatch') || errorMsg.includes('redirect')) {
        console.error('OAuth redirect URI mismatch. Current origin:', window.location.origin);
        return { success: false, error: 'Sign-in configuration error. Please try again or contact support.' };
      }
      if (errorMsg.includes('access_denied')) {
        return { success: false, error: 'Sign-in was cancelled.' };
      }
      if (errorMsg.includes('popup_closed') || errorMsg.includes('closed')) {
        return { success: false, error: 'Sign-in window was closed. Please try again.' };
      }
      
      return { success: false, error: 'Google sign-in failed. Please try again.' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('OAuth error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};
```

### 2. Improve Error Display in GoogleSignInButton (`src/components/auth/GoogleSignInButton.tsx`)

Update to show more descriptive toast messages and handle edge cases:
- Show different toast styles for user-cancelled vs system errors
- Add a retry suggestion for transient failures

### 3. Add URL Parameter Error Detection in Login Page (`src/pages/Login.tsx`)

Check for OAuth error parameters in the URL on page load (some OAuth errors redirect back with `?error=` params):

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  const errorDescription = params.get('error_description');
  
  if (error) {
    const message = errorDescription || 'Sign-in failed. Please try again.';
    toast.error(message);
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  }
}, []);
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/contexts/AuthContext.tsx` | Add specific error type detection and messaging |
| `src/components/auth/GoogleSignInButton.tsx` | Improve toast error display |
| `src/pages/Login.tsx` | Add URL error parameter detection on load |

---

## Important Note

Since this project uses Lovable Cloud's managed OAuth, the redirect URLs are configured automatically. If you're seeing a specific "redirect_uri_mismatch" error, it would be a temporary infrastructure issue — the error handling improvements will ensure users see a clear message instead of a cryptic error.

