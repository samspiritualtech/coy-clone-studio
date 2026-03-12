

# Update Seller Dashboard Header with Auth Controls & Notifications

## Changes

### 1. Rewrite `DashboardHeader.tsx`
Replace the static header with an auth-aware component:

**Not logged in:** Search bar + disabled bell (no badge) + "Login" and "Signup" buttons linking to `/seller-login` and `/seller-signup`.

**Logged in:** Search bar + functional notification bell with dropdown + avatar with dropdown menu (Profile, Seller Dashboard, Logout).

### 2. Notification Bell Dropdown
- Use Popover component for the notification panel
- Show mock seller notifications: "New order received", "Product approved", "Product rejected", "Low inventory warning"
- Each notification has an icon, title, timestamp, and read/unread state
- Red badge counter on bell showing unread count
- Mark-all-as-read button in the panel header

### 3. Avatar Dropdown Menu
- Use DropdownMenu component
- Items: Profile (`/seller/settings`), Seller Dashboard (`/seller/dashboard`), separator, Logout
- Logout calls `supabase.auth.signOut()` then navigates to `/seller-login`

### 4. Update `SellerDashboardLayout.tsx`
Replace the inline auth UI in the layout header (lines 126-157) with the `<DashboardHeader />` component, passing through the mobile menu button.

### Files to modify
- `src/components/seller-dashboard/DashboardHeader.tsx` — full rewrite
- `src/layouts/SellerDashboardLayout.tsx` — integrate DashboardHeader into the top bar

