

# Conditionally Render Dashboard on Join Page

## Change

**File: `src/pages/JoinUs.tsx`**

- Import `useAuth` from `@/contexts/AuthContext`
- Wrap the `<SellerDashboardShowcase />` section (lines 42-47) in `{user && (...)}`
- No UI, layout, or styling changes

```tsx
const { user } = useAuth();

// Lines 42-47 become:
{user && (
  <section className="pb-8 px-4 md:px-6">
    <div className="container mx-auto max-w-[1400px]">
      <SellerDashboardShowcase />
    </div>
  </section>
)}
```

One file modified, zero visual changes when authenticated.

