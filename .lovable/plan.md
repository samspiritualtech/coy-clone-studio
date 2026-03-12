

# Fix Save Discount Button

## Problem
The `handleSave` function in `DashboardDiscounts.tsx` silently returns when `sellerId` is null (line 81: `if (!sellerId) return;`), giving no feedback to the user. This happens when the user isn't authenticated as an approved seller.

## Root Cause
The code logic is actually already fully implemented — database insert, loading states, error handling, list refresh all exist. The only gap is the silent early return when `sellerId` is null.

## Changes

### File: `src/components/seller-dashboard/pages/DashboardDiscounts.tsx`

**1. Add user feedback when sellerId is missing (line 81)**

Replace:
```typescript
if (!sellerId) return;
```
With:
```typescript
if (!sellerId) {
  toast({ title: "Not authenticated", description: "Please sign in as an approved seller to create discounts.", variant: "destructive" });
  return;
}
```

**2. Add validation feedback with descriptions (lines 82-83)**

Replace:
```typescript
if (!code.trim()) { toast({ title: "Code required", variant: "destructive" }); return; }
if (formType !== "free_shipping" && !value) { toast({ title: "Value required", variant: "destructive" }); return; }
```
With:
```typescript
if (!code.trim()) { toast({ title: "Code required", description: "Please enter a discount code.", variant: "destructive" }); return; }
if (formType !== "free_shipping" && !value) { toast({ title: "Value required", description: "Please enter a discount value.", variant: "destructive" }); return; }
```

**3. Fix fetchDiscounts dependency (line 68)**

The `useEffect` for fetching discounts uses `sellerId` but isn't properly declared as a dependency in the ESLint sense (it works but is fragile). Convert `fetchDiscounts` to be called explicitly:

Replace:
```typescript
useEffect(() => { fetchDiscounts(); }, [sellerId]);
```
With:
```typescript
useEffect(() => { if (sellerId) fetchDiscounts(); else setLoading(false); }, [sellerId]);
```

These are minor fixes — the core save, insert, list fetch, and toggle logic is already correctly implemented.

