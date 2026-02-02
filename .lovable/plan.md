
# Secure Google-Only Authentication System

## Overview

This plan implements a secure authentication system for Ogura using **Google Sign-In as the only authentication method**. The system will remove all email/password and OTP login options, add protected routes, and create dedicated pages for login, dashboard, onboarding, and profile management.

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Authentication Flow                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User visits protected route                                      │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────┐                                             │
│  │  ProtectedRoute │──── Not authenticated ────▶ /login          │
│  └─────────────────┘                                             │
│         │                                                         │
│         │ Authenticated                                           │
│         ▼                                                         │
│  ┌─────────────────┐                                             │
│  │  Check Profile  │                                             │
│  └─────────────────┘                                             │
│         │                                                         │
│    ┌────┴────┐                                                   │
│    │         │                                                   │
│  New User  Existing User                                         │
│    │         │                                                   │
│    ▼         ▼                                                   │
│ /onboarding  /dashboard                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Changes

### Update Profiles Table

Add `is_onboarded` column to track if user has completed onboarding:

```sql
ALTER TABLE profiles ADD COLUMN is_onboarded boolean DEFAULT false;
```

### Update Database Trigger

Modify the existing `handle_new_user` trigger to include Google OAuth metadata:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, phone, email, avatar_url, is_onboarded)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      'User'
    ),
    NEW.phone,
    NEW.email,
    NEW.raw_user_meta_data ->> 'avatar_url',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = now();
  RETURN NEW;
END;
$function$;
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Login.tsx` | Clean login page with Google Sign-In button only |
| `src/pages/Dashboard.tsx` | User dashboard for authenticated users |
| `src/pages/Onboarding.tsx` | Onboarding flow for new users |
| `src/pages/Profile.tsx` | User profile and settings page |
| `src/components/auth/ProtectedRoute.tsx` | Route guard component |
| `src/components/auth/GoogleSignInButton.tsx` | Reusable Google sign-in button |
| `src/components/auth/UserMenu.tsx` | Header dropdown for authenticated users |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/contexts/AuthContext.tsx` | Simplify to Google-only auth, add `isNewUser` tracking |
| `src/App.tsx` | Add new routes and protected route wrapper |
| `src/components/Header.tsx` | Add UserMenu for authenticated state |
| `src/components/LuxuryHeader.tsx` | Add UserMenu for authenticated state |

---

## Component Details

### 1. Login Page (`src/pages/Login.tsx`)

A clean, modern login page featuring:
- Ogura branding at top
- Single "Continue with Google" button
- Subtle fashion imagery background
- Loading state during OAuth redirect
- Error handling with toast notifications

```text
┌────────────────────────────────────────┐
│                                        │
│              ✦ OGURA                   │
│                                        │
│     ┌──────────────────────────────┐   │
│     │                              │   │
│     │   Welcome to Ogura           │   │
│     │                              │   │
│     │   India's premier fashion    │   │
│     │   marketplace                │   │
│     │                              │   │
│     │  ┌────────────────────────┐  │   │
│     │  │ 🟢 Continue with Google │  │   │
│     │  └────────────────────────┘  │   │
│     │                              │   │
│     │   By continuing, you agree   │   │
│     │   to our Terms & Privacy     │   │
│     │                              │   │
│     └──────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

### 2. ProtectedRoute Component

Guards private routes and handles redirects:
- Redirects unauthenticated users to `/login`
- Shows loading spinner during auth check
- Passes through for authenticated users

### 3. Dashboard Page

Main hub for authenticated users:
- Welcome message with user name
- Quick links to orders, wishlist, addresses
- Recent activity section
- Logout button

### 4. Onboarding Page

For new users after first Google sign-in:
- Collect additional preferences
- Set up notifications
- Mark profile as onboarded
- Redirect to dashboard on completion

### 5. UserMenu Component

Header dropdown for authenticated users:
- User avatar and name
- Links to Dashboard, Profile, Orders
- Logout option

---

## Authentication Context Updates

Simplify `AuthContext` to:
- Remove `signUp`, `signIn`, `sendOTP`, `signInWithOTP` methods
- Keep only `signInWithGoogle` and `logout`
- Add `isNewUser` state based on `is_onboarded` column
- Add `completeOnboarding` method

```typescript
interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;
  completeOnboarding: () => Promise<void>;
}
```

---

## Route Structure

```text
Public Routes:
  /                 - Home
  /collections      - Browse products
  /product/:id      - Product detail
  /brands           - Brands listing
  /designers        - Designers listing
  /occasions        - Occasions
  /stores           - Store locator
  /search           - Search
  /join             - Designer onboarding
  /login            - Login page

Protected Routes (require authentication):
  /dashboard        - User dashboard
  /profile          - Profile settings
  /onboarding       - New user onboarding
  /wishlist         - User wishlist
  /cart             - Shopping cart
```

---

## Google OAuth Configuration

The system will use Lovable Cloud's managed Google OAuth which requires calling the `supabase--configure-social-auth` tool to:
1. Generate the lovable module in `src/integrations/lovable`
2. Install the `@lovable.dev/cloud-auth-js` package

The sign-in will use:
```typescript
import { lovable } from "@/integrations/lovable/index";

const { error } = await lovable.auth.signInWithOAuth("google", {
  redirect_uri: window.location.origin,
});
```

---

## Security Considerations

1. **RLS Policies**: Existing profile RLS policies remain intact - users can only access their own data
2. **Session Management**: Supabase handles JWT tokens and refresh automatically
3. **Secure Redirects**: All OAuth redirects use `window.location.origin` to work on any domain including ogura.in
4. **Protected Routes**: Server-side data is still protected by RLS; client-side protection provides UX improvement

---

## Implementation Order

1. Configure Google OAuth using Lovable Cloud tool
2. Run database migration for `is_onboarded` column
3. Create ProtectedRoute component
4. Create Login page
5. Create Dashboard page
6. Create Onboarding page
7. Create Profile page
8. Update AuthContext for Google-only flow
9. Add UserMenu to headers
10. Update App.tsx with new routes

