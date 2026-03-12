

# Functional Settings Page + Dev Mode Fallback

## Changes

### 1. Rewrite `DashboardSettings.tsx` — Make it functional
Convert from static markup to a stateful component that:
- Resolves seller ID from `useAuth()` with `DEV_SELLER_ID` fallback
- Fetches seller data from `sellers` table on mount
- Binds form fields to state (`brand_name`, description, city, instagram_handle`)
- On Save: calls `supabase.from("sellers").update(...)`, shows success/error toast, reloads data
- Shows loading spinner while fetching

The `sellers` table doesn't have `email` or `state` columns, so the form will use: brand_name, description, city, instagram_handle (matching existing schema).

### 2. No additional dev-mode changes needed
`DashboardProducts`, `DashboardAddProduct`, and `DashboardDiscounts` already use the `DEV_SELLER_ID` fallback pattern. The `DashboardSettings` rewrite will follow the same pattern. The dev-mode RLS policies are already in place for the `sellers` table (`dev_allow_anon_select_sellers`).

However, the `sellers` table is missing a dev-mode UPDATE policy for anon users — saving settings in dev mode will fail. Need a migration to add `dev_allow_anon_update_sellers`.

### 3. Database migration — Add dev-mode update policy for sellers
```sql
CREATE POLICY "dev_allow_anon_update_sellers"
ON public.sellers FOR UPDATE TO anon
USING (true) WITH CHECK (true);
```

### Files to modify
- `src/components/seller-dashboard/pages/DashboardSettings.tsx` — full rewrite

### Files unchanged
- No other files need changes

