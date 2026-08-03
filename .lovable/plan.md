## Diagnosis (verified)

The backend OAuth redirect allow-list currently contains:

```text
https://ogura.in/**
https://admin.ogura.in/**
https://id-preview*--d4269340-...lovable.app/**
https://d4269340-...lovableproject.com/**
https://preview--coy-clone-studio.lovable.app/**
https://coy-clone-studio.lovable.app/**
```

`https://www.ogura.in/**` is **not** in that list. `src/contexts/AuthContext.tsx` sends `redirect_uri: window.location.origin`, so on `www.ogura.in` the broker receives `https://www.ogura.in` and rejects it: "redirect_uri is not allowed". Everything else is fine — Google client ID / secret are Lovable-managed (no Google Cloud Console action needed), Supabase Site URL and `.env` values are correct, and the same flow works on `ogura.in` and on the previews.

## Code change

`src/contexts/AuthContext.tsx` — canonicalize the OAuth origin instead of trusting `window.location.origin`:

- Add a small helper that returns the allow-listed origin for the current host: if the hostname starts with `www.`, strip it (`www.ogura.in` → `https://ogura.in`); otherwise return `window.location.origin` unchanged (previews, `admin.ogura.in`, `coy-clone-studio.lovable.app`, localhost all pass through).
- Save the intended in-app path (e.g. `sessionStorage`) before starting sign-in, and after the session hydrates navigate there — so a user who started on a deep link still lands where they expected.
- Pass the canonical origin as `redirect_uri` (a public origin, never a protected route).

Effect: signing in from `www.ogura.in` completes on `ogura.in`, which is the primary domain and already allow-listed. No other auth code changes.

## Recommended action on your side (optional but preferred)

Also add `www.ogura.in` as its own custom domain entry so the www host is allow-listed directly:

1. Project Settings → Domains → Connect Domain
2. Enter `www.ogura.in`
3. Confirm DNS: `A` record, name `www`, value `185.158.133.1`
4. Keep `ogura.in` as **Primary** so www redirects to it

Nothing needs to be added in Google Cloud Console — Lovable's managed Google credentials handle the Google-side redirect URI.

## Verification

After the change: sign in from `www.ogura.in`, from `ogura.in`, and from the Lovable preview; each should reach Google and return signed in with no `invalid_request` screen.
