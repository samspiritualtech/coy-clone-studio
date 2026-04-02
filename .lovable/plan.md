

# Fix 404 on `/seller/dashboard` After Form Submission

## Root Cause

`detectDomain()` in `src/App.tsx` is called **once at module level** as a constant:

```typescript
const domain = detectDomain(); // evaluated on initial page load
```

When the user lands on `/join`, the pathname doesn't start with `/seller`, so `domain` is set to `'customer'` and `CustomerApp` renders. When `navigate("/seller/dashboard")` is called after form submission, React Router updates the URL client-side, but the `domain` constant never re-evaluates — so `CustomerApp` stays mounted. Since `CustomerApp` has no `/seller/dashboard` route, the `*` catch-all renders `NotFound`.

## Fix

### 1. `src/App.tsx` — Make domain detection reactive to pathname

Move `detectDomain()` inside the component so it re-evaluates on every render when the URL changes:

```typescript
const AppRouter = () => {
  const domain = detectDomain(); // now reactive to current pathname
  switch (domain) { ... }
};
```

Remove the module-level `const domain = detectDomain();` line.

### 2. `src/pages/JoinUs.tsx` — Use hard navigation for cross-app redirect

As a safety measure, replace `navigate("/seller/dashboard")` calls with `window.location.href = "/seller/dashboard"` so the full page reloads and domain detection runs fresh. This applies to:
- The "Go to Dashboard" button in the success step (line 328)
- The `useEffect` auto-redirect for already-authenticated users

This dual approach ensures routing works both with client-side navigation (fix #1) and as a fallback via full page reload (fix #2).

## Files to Modify
- `src/App.tsx` — move `detectDomain()` inside `AppRouter`
- `src/pages/JoinUs.tsx` — use `window.location.href` for the `/seller/dashboard` redirect

